
(*
#r "nuget: FSharp.Data, 4.2.4"
#r "nuget: FSharp.Core.Fluent, 3.0.1"
*)

module StringInterpolation =

    let x = 1
    let pi = 3.1414
    let text = "cats"

    let string = $"I say {x} is one and {pi} is pi"
    
    printfn $"I say again {x} is one and {pi} is pi"
    // output: I say again 1 is one and 3.14 is pi

    let s = $"I say {x} is one and %0.2f{pi} is pi and %10s{text} are dogs"
    //val s : string =  "I say 1 is one and 3.14 is pi and       cats are dogs"

    
    let log fmt = Printf.kprintf (fun s -> System.Console.Error.WriteLine("LOG: " + s)) fmt

    let result = 6 + 5
    log "hello!"
    log "the number is %d today" result

    log $"hello!" 
    log $"the number is %d{result} today" 
    
    log $"hello!" 
    log $"the number is {result} today" 


module OpenType =

    open type System.Math

    let one = Min(1.0, 2.0)
    let onef = Min(1.0f, 2.0f)
    let two = Max(1.0, 2.0)

module Applicatives1 =
    let res1 =
        result { 
            let! a = resultValue1 
            and! b = resultValue2
            and! c = resultValue3
            return a + b - c 
        }

    module Result = 
        let zip x1 x2 = 
            match x1,x2 with
            | Ok x1res, Ok x2res -> Ok (x1res, x2res)
            | Error e, _ -> Error e
            | _, Error e -> Error e

    type ResultBuilder() = 
        member _.MergeSources(t1: Result<'T,'U>, t2: Result<'T1,'U>) = Result.zip t1 t2
        member _.BindReturn(x: Result<'T,'U>, f) = Result.map f x

    let result = ResultBuilder()



module Applicatives2 =

    let mutable nodes = 0
    let mutable recalcs = 0

    [<AbstractClass>]
    type Node(dirty) = 
        do nodes <- nodes + 1

        let dependees = ResizeArray<System.WeakReference<Node>>()
        let mutable dirty = dirty

        member _.Dirty with get() = dirty and set v = dirty <- v

        member _.Dependees =
            dependees.ToArray() 
            |> Array.choose (fun c -> match c.TryGetTarget() with true, tg -> Some tg | _ -> None)

        member _.AddDependee(c) =
            dependees.Add(System.WeakReference<_>(c))

        member _.InputChanged() =
            for c in dependees do 
                match c.TryGetTarget() with 
                | true, tg -> tg.SetDirty()
                | _ -> ()

        member n.SetDirty() =
            if not dirty then 
                dirty <- true
                n.InputChanged()


    [<AbstractClass>]
    type Node<'T>(dirty) =
        inherit Node(dirty)
        abstract Value : 'T

    /// A node that recomputes if any if its inputs change
    type RecalcNode<'T>(dirty, initial, f: unit -> 'T) =
        inherit Node<'T>(dirty)

        let mutable cachedValue = initial 

        new (f) = new RecalcNode<'T>(true, Unchecked.defaultof<_>, f)

        new (initial, f) = new RecalcNode<'T>(false, initial, f)

        override n.Value = 
           if n.Dirty then 
               recalcs <- recalcs + 1
               cachedValue <- f()
               n.Dirty <- false
           cachedValue

        override _.ToString() = sprintf "(latest %A)" cachedValue

    /// A node that never recomputes 
    type ConstantNode<'T>(x: 'T) =
        inherit Node<'T>(false)

        override _.Value = x

        override _.ToString() = sprintf "(latest %A)" x

    type InputNode<'T>(v: 'T) =
        inherit Node<'T>(false)
        let mutable currentValue = v
        override _.Value = currentValue

        member node.SetValue v =
            currentValue <- v
            node.InputChanged()

    type NodeBuilder() =

        member _.Bind(x: Node<'T1>, f: 'T1 -> Node<'T2>) : Node<'T2> =
            let rec n = 
                RecalcNode<'T2>(fun () -> 
                    let n2 = f x.Value
                    n2.AddDependee(n)
                    n2.Value)
            x.AddDependee(n)
            n :> Node<_>

        member _.BindReturn(x: Node<'T1>, f: 'T1 -> 'T2) : Node<'T2> =
            let n = RecalcNode<'T2>(fun () -> f x.Value)
            x.AddDependee(n)
            n :> Node<_>

        member _.Bind2(x1: Node<'T1>, x2: Node<'T2>, f: 'T1 * 'T2 -> Node<'T3>) : Node<'T3> =
            let rec n = 
                RecalcNode<'T3>(fun () -> 
                    let n2 = f (x1.Value, x2.Value)
                    n2.AddDependee(n)
                    n2.Value)
            x1.AddDependee(n)
            x2.AddDependee(n)
            n :> Node<_>

        member _.Bind2Return(x1: Node<'T1>, x2: Node<'T2>, f: 'T1 * 'T2 -> 'T3) : Node<'T3> =
            let n = RecalcNode<'T3>(fun () -> f (x1.Value, x2.Value))
            x1.AddDependee(n)
            x2.AddDependee(n)
            n :> Node<_>

        member _.Bind3(x1: Node<'T1>, x2: Node<'T2>, x3: Node<'T3>, f: 'T1 * 'T2 * 'T3 -> Node<'T4>) : Node<'T4> =
            let rec n = 
                RecalcNode<'T4>(fun () -> 
                    let n2 = f (x1.Value, x2.Value, x3.Value)
                    n2.AddDependee(n)
                    n2.Value)
            x1.AddDependee(n)
            x2.AddDependee(n)
            x3.AddDependee(n)
            n :> Node<_>

        member _.Bind3Return(x1: Node<'T1>, x2: Node<'T2>, x3: Node<'T3>, f: 'T1 * 'T2 * 'T3 -> 'T4) : Node<'T4> =
            let n = RecalcNode<'T4>(fun () -> f (x1.Value, x2.Value, x3.Value))
            x1.AddDependee(n)
            x2.AddDependee(n)
            x3.AddDependee(n)
            n :> Node<_>

        member _.MergeSources(x1: Node<'T1>, x2: Node<'T2>) : Node<'T1 * 'T2> =
            let n = RecalcNode<_>(fun () -> (x1.Value, x2.Value))
            x1.AddDependee(n)
            x2.AddDependee(n)
            n :> Node<_>

        member _.Return(x: 'T) : Node<'T> =
            ConstantNode<'T>(x) :> Node<_>

    let node = NodeBuilder()
    let input v = InputNode(v)

    let inp1 = input 3
    let inp2 = input 7
    let inp3 = input 0

    let test1() = 
        node { 
            let! v1 = inp1
            and! v2 = inp2
            and! v3 = inp3
            return v1 + v2 + v3
        }
       //let n1 = node.Bind3Return(inp1.Node, inp2.Node, inp3.Node, (fun (v1, v2, v3) -> v1 + v2 + v3))

    let test2() = 
        node { 
            let! v1 = inp1
            let! v2 = inp2
            let! v3 = inp3
            return v1 + v2 + v3
        }

    let test msg f = 
        recalcs <- 0
        nodes <- 0

        let (n: Node<int>) = f()

        let v1 = n.Value  // now 10

        recalcs <- 0

        for i in 1 .. 1000 do
            inp1.SetValue  4 
            let v2 = n.Value  // now 11

            inp2.SetValue 10
            let v3 = n.Value // now 14
            ()

        printfn "inp1.Dependees.Length = %d" inp1.Dependees.Length
        printfn "inp2.Dependees.Length = %d" inp2.Dependees.Length
        printfn "total recalcs %s = %d" msg recalcs
        printfn "total nodes %s = %d" msg nodes
        printfn "----" 

    test "using and!" test1
    test "using let!" test2

module Tasks =
    let someFunction (x: int) =
        task {
           return (x+x)
        }


    let someFunction2 (x: int) =
        async {
           let! result1 = someFunction (x+x) |> Async.AwaitTask
           return (result1+result1)
        }
        |> Async.StartAsTask



module PipelineDebugging =


    open FSharp.Data
    open FSharp.Core.Fluent

    type DrWhoData = HtmlProvider<"https://en.wikipedia.org/wiki/List_of_Doctor_Who_episodes_(1963%E2%80%931989)">

    let doctorWho = DrWhoData.GetSample()


    type Episode =
        { Title: string
          Director: string
          Views: double }

    let extractEpisodes() =
        [ for row in doctorWho.Tables.``Season 1 (1963-1964) Edit``.Rows do
             { Title = row.``Serial title``
               Director = row.``Directed by``
               Views = row.``UK viewers (millions)`` }
          for row in doctorWho.Tables.``Season 2 (1964-1965) Edit``.Rows do
             { Title = row.``Serial title``
               Director = row.``Directed by``
               Views = row.``UK viewers (millions)`` }
          for row in doctorWho.Tables.``Season 3 (1965-1966) Edit``.Rows do
             { Title = row.``Serial title``
               Director = row.``Directed by``
               Views = row.``UK viewers (millions)`` }
          for row in doctorWho.Tables.``Season 4 (1966-1967) Edit``.Rows do
             { Title = row.``Serial title``
               Director = row.``Directed by``
               Views = row.``UK viewers (millions)`` }
          for row in doctorWho.Tables.``Season 5 (1967-1968) Edit``.Rows do
             { Title = row.``Serial title``
               Director = row.``Directed by``
               Views = row.``UK viewers (millions)``} 
          for row in doctorWho.Tables.``Season 6 (1968-1969) Edit``.Rows do
             { Title = row.``Serial title``
               Director = row.``Directed by``
               Views = row.``UK viewers (millions)``}  ]

    let episodes =
       extractEpisodes()
       |> List.filter (fun ep -> ep.Director <> "")




    // Get the average number of viewers for each doctor's series run
    let getAverageByDirector(episodes: Episode list) =
        episodes
        |> List.groupBy (fun ep -> ep.Director)
        |> List.map (fun (director, episodes) -> director, episodes.averageBy (fun ep -> ep.Views))
        |> List.sortBy (fun (_director, views) -> views)

    let getAverageByDalekness(episodes: Episode list) =
        episodes
        |> List.groupBy (fun ep -> ep.Title.Contains("Dalek"))
        |> List.map (fun (daleks, episodes) -> daleks, episodes.averageBy (fun ep -> ep.Views))
        |> List.sortBy (fun (_director, views) -> views)


    for ep in episodes do
        printfn $"{ep.Title} by director {ep.Director} had %.3f{ep.Views}m views"

    for ep in episodes do
        if ep.Title.Contains "Daleks" then 
            printfn $"{ep.Title} had Daleks!"

    let averages = getAverageByDirector(episodes)

    printfn "Got the averages!"

    for (director, views) in averages  do
        printfn $"Director {director} had an average of %.3f{views}m views"

    let averages2 = getAverageByDalekness(episodes)

    printfn "Got the averages by daleks!"

    for (daleks, views) in averages2  do
        printfn $"Daleks = {daleks} had an average of %.3f{views}m views"

    //Tasks.testTasks ()
    //printReport()

