
(*
#r "nuget: FSharp.Data, 4.2.4"
#r "nuget: FSharp.Core.Fluent, 3.0.1"
*)



module StringInterpolation =

    let x = 1
    let pi = 3.1414
    let now = System.DateTime.Now
    let text = "cats"

    let string = $"I say {x+x+x} is one and {pi} is pi"

    
    printfn $"""I say again %d{x} is one and {text} is pi"""
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

    type C() =
        static member Something(x: int) = x + x
        static member P = 1 + 1
        
    open type System.Math
    open type C

    let v2 = P + P
    let vv = Something(3)
    
    let one = Min(1.0, 2.0)
    let onef = Min(1.0f, 2.0f)
    let two = Max(1.0, 2.0)

module Applicatives1 =

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

    let resultValue1 = Ok 1 
    let resultValue2 = Ok 1 
    let resultValue3 = Ok 1 

    let compute1() =
        result { 
            let! a = resultValue1 
            and! b = resultValue2
            and! c = resultValue3
            return a + b - c 
        }

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

    let nodeStatic = NodeBuilder()
    let nodeDynamic = NodeBuilder()
    let input v = InputNode(v)

    let inp1 = input 3
    let inp2 = input 7
    let inp3 = input 0

    let test1() = 
        nodeStatic { 
            let! v1 = inp1
            and! v2 = inp2
            and! v3 = inp3
            return v1 + v2 + v3
        }

    let test2() = 
        nodeDynamic { 
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
//       [ 1,2,3,4,5 ]
        // The function 'test' expects two arguments separated by spaces (i.e. 'curried'), but
        // is here given three or more. The argument beginning 'adskhahkwcewe...' was unexpected.
        // Consider removing an argument, or adding parentheses around
        // an argument, or changing the definition of 'test' to take an additional argument.

    test "using let!" test2


    type C() =
        static member M(x:int, y:int) = 1
        static member M (x:int) (y:string) = 1

//    C.M (3,4)

    type D =
       | D of int
       | E of int

   // D 1 2

    let f (x: int) (y: int option) = 1

  //  f 1 Some 0 // The function 'f' expects two arguments, but is given three.

module Matrix =

    let test0 () = ()
    let test1 (x: string) = ()
    let test2 (x: string, y: int) = ()
    let test11 (x: int) (y: int) = ()
    let test21 (x: string, y: int) (z:int) = ()
    let test12 (x: string) (y: int, z:int) = ()
    let test22 (x: string, y: int) (z: int, w:int) = ()

    let v0_1 = test0 "using and!"
        // The function 'test0' expects to be invoked as 'test0 ()'. The argument beginning '"using and..."'
        // is unexpected. Consider replacing the argument with '()' or
        // changing the definition of 'test0' to take an additional argument

    let v1_0 = test1 ()
        // The function 'test1' expects 1 argument of type 'string'. For example:
        //     test1 x
        // Consider replacing '()' with an argument of type 'string', or changing the definition
        // of 'test1' to remove the argument.

        // NOTE: the text "The function has a parameter...." is shown if not enough arguments
        // NOTE: the text "The argument beginning...." is shown if too many arguments

    let v1_2 = test1 ("a", 1)
        // The function 'test1' expects one argument of type 'string', but is here given
        // 2 as a tuple. Consider removing an argument, or changing the definition of 'test1'.

        // NOTE: the text 'or changing...' is only added if in the same assembly (file?)

    let v1_11 = test1 "a" 1
        // The function 'test1' expects one argument of type 'string', but
        // is here given 2. The argument '1' is unexpected. Consider removing an argument,
        // or changing the definition of 'test1'.

    let v2_0 = test2 ()
        // The function 'test2' expects 2 arguments of type 'string' and 'int' as a tuple. For example:
        //     test2 (x, y)
        // Consider replacing '()' with 2 arguments of type 'string' and 'int' as a tuple, or changing the definition of 'test2'.

    let v2_1 = test2 "a"
        // The function 'test2' expects 2 arguments of type 'string' and 'int' as a tuple and is here
        // given 1. For example:
        //     test2 (x, y)
        // Consider replacing '"a"' with 2 arguments of type 'string' and 'int' as a tuple.

    let v2_3 = test2 ("a", 1, 2)
        // The function 'test2' expects 2 arguments as a tuple and is here given 3. For example:
        //     test2 (x, y)
        // Consider removing an argument.

    let v2_11 = test2 "acasasca" 1
        // The function 'test2' expects 2 arguments as a tuple and is here given 2 arguments separated
        // by spaces (i.e. 'curried'). Consider grouping the arguments using a tuple:
        //    test2 ("acasasca", 1)
        
        // Note, if sample program text is too long then just don't show it, e.g. just this:
        //     Consider grouping the arguments using a tuple.


    let v11_111 = test11 "using and!" 3 5
        // The function 'test11' expects two arguments separated by spaces (i.e. 'curried'), but
        // is here given three or more. The argument beginning 'adskhahkwcewe...' is unexpected.
        // Consider removing an argument, or adding parentheses around
        // an argument, or changing the definition of 'test11'.

    let v11_2 = test11 ("using and!", 3)
        // The function 'test11' expects two arguments separated by spaces (i.e. 'curried'), but
        // is here given a single argument that is a tuple with two elements. 

module CEs =

    type M<'T, 'Vars> =
        { Name: string option
          Members: 'T list
          Variables: 'Vars }

    type M<'T> = M<'T, unit>

    type CE() =
            
        member _.Zero() : M<'T> =
            { Name = None
              Members = [] 
              Variables = () }

        member _.Combine (model1: M<'T>, model2: M<'T>) : M<'T> =
            let newName = 
                match model2.Name with
                | None -> model1.Name
                | res -> res
            { Name = newName
              Members = List.append model1.Members model2.Members 
              Variables = () }

        member _.Delay(f) : M<'T, 'Vars> = f()

        member _.Run(model: M<'T, 'Vars>) : M<'T> =
            { Name = model.Name
              Members = model.Members
              Variables = () }

        member this.For(methods, f) :M<'T> = 
            let methodList = Seq.toList methods
            match methodList with 
            | [] -> this.Zero()
            | [x] -> f(x)
            | head::tail ->
                let mutable headResult = f(head)
                for x in tail do 
                    headResult <- this.Combine(headResult, f(x))
                headResult

        member _.Yield (item: 'T) : M<'T> = 
            { Name = None
              Members = [ item ]
              Variables = () }

        // Only for packing/unpacking the implicit variable space
        member _.Bind (model1: M<'T, 'Vars>, f: ('Vars -> M<'T>)) : M<'T>  =
            let model2 = f model1.Variables
            let newName = 
                match model2.Name with
                | None -> model1.Name
                | res -> res
            { Name = newName
              Members = model1.Members @ model2.Members
              Variables = model2.Variables }

        // Only for packing/unpacking the implicit variable space
        member _.Return (varspace: 'Vars) : M<'T, 'Vars> = 
            { Name = None
              Members = [ ]
              Variables = varspace }

        [<CustomOperation("Name", MaintainsVariableSpaceUsingBind = true)>]
        member _.setName (model: M<'T, 'Vars>, [<ProjectionParameter>] name: ('Vars -> string)) : M<'T, 'Vars>  =
            { model with Name = Some (name model.Variables) }

        [<CustomOperation("Member", MaintainsVariableSpaceUsingBind = true)>]
        member _.addMember (model: M<'T, 'Vars>, [<ProjectionParameter>] item: ('Vars -> 'T))  : M<'T, 'Vars>  =
            { model with Members = List.append model.Members [ item model.Variables ] }

        // Note, using ParamArray doesn't work in conjunction with ProjectionParameter
        [<CustomOperation("Members", MaintainsVariableSpaceUsingBind = true)>]
        member _.addMembers (model: M<'T, 'Vars>, [<ProjectionParameter>] items: ('Vars -> 'T list)) : M<'T, 'Vars>  =
            { model with Members = List.append model.Members (items model.Variables) }

    let ce = CE()
    module Test =
        let x : M<double> =
            ce { Name "Fred" }

        let y = 
            ce { 42 }

        let z1 =
            ce { Member 42 }

        let z2 = 
            ce {
                Members [ 41; 42 ]
            }
        let z3 = 
            ce {
                Name "Fred"
                42
            }

        let z4 = 
            ce {
                Member 41
                Member 42
            }

        let z5 = 
            ce {
                Name "a"
                Name "b"
            }

        let z6 : M<double> = 
            ce {
                let x = 1
                Name "a"
                Member 4.0
            }

        let z6 : M<double> = 
            ce {
                let x = "a"
                Name (x + "b")
                Member 4.0
            }

        let z8 : M<double> = 
            ce {
                let x1 = 1.0
                let y2 = 2.0
                Member (x1 + 3.0)
                Member (y2 + 4.0)
            }

        let z9 =
            ce {
                let x = 1.0
                Members [
                    42.3 
                    43.1 + x
                ]
            }

        //let empty = 
        //    ce { }

    
module Sample =
    let f() =
        let mutable finished = false
        while finished do 
           printfn "hello"
           if System.DateTime.Now.DayOfWeek = System.DayOfWeek.Monday then
              finished <- true


/// <summary>
/// Get the average number of viewers for each doctor's series run
/// </sumary>
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


    let getAverageByDirector(episodes0: Episode list) =
        let episodes = 
           episodes0
            |> List.filter (fun ep -> ep.Director <> "")
        let episodes = 
           episodes
            |> List.filter (fun ep -> ep.Director <> "")
        episodes
        |> List.groupBy (fun ep -> ep.Director)
        |> List.map (fun (director, episodes) -> director, episodes.averageBy (fun ep -> ep.Views))
        |> List.sortBy (fun (_director, views) -> views)

    let getAverageByDalekness(episodes: Episode list) =
        episodes
        |> List.filter (fun ep -> ep.Director <> "")
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

