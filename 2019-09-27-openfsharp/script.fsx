#r @"C:\GitHub\dsyme\FSharp.Data.Adaptive\bin\Release\netstandard2.0\FSharp.Data.Adaptive.dll"

open FSharp.Data.Adaptive

module CSet =
    let ofList xs =
       let t = new cset<_>()
       for x in xs do t.Add x |> ignore
       t

//-----------------------------------------------------------------

// Make a large data struture
let c7 = CSet.ofList [ 1 .. 10000 ]

// Transform the data structure
let s7a = c7 |> ASet.map (fun x -> printfn "map (1), x = %d" x; x * 10) 

// Transform again
let s7b = s7a |> ASet.map (fun x -> printfn "map (2), x = %d" x; x * 10) 

// Reduce the data structure
let s7 = ASet.sum s7b 

// Observe the reduced result
s7 |> AVal.force

// Transactionally modify the inputs
transact (fun () -> c7.Remove 5) 

// Re-observe
s7 |> AVal.force

// Transactionally modify the inputs
transact (fun () -> c7.Add 2000000) 

// Re-observe
s7 |> AVal.force


// Transactionally modify the inputs
transact (fun () -> c7.Clear()) 

// Re-observe
s7 |> AVal.force



