# Notes from Chatting About Learning F#

These are notes from a conversation I had today about learning F#.

## "Teaching Programming with F#"

There is a difference between "teaching programming with F#" and "teaching *functional* programming with F#".

- The first is likely more suitable for Python programmers
- The second is likely more suitable for existing Haskell, Scala programmers, some C#/Python programmers too

In the learning sequence for "teaching programming" F# we should likely put mutation earlier, e.g.

1. let, conditionals, mutation, for loops, printing, interpolated strings
2. data - lists, tuples, records, mutable records
3. More lists!  List.map, List.filter, list expressions
4. options, unions, pattern matching, active patterns
5. arrays, while
6. objects etc.

That is, the emphasis is first on highly familiar constructs, followed by a more usual sequence for the other topics.

## Drop "computed list expressions" in favour of just "list expressions" 

Instead of saying "list expressions" (e.g. `[1;2]`) and "computed list expressions" (e.g. `[for x in xs -> x, x*x]`) 
we should just say "list expressions" for all of these. We don't need the complicated terminology.

Likewise array/seq.

## From List.map/filter/collect to list expressions 

Uses of List/Array/Seq functions can often be replaced by list/array/seq expressions
For example:

```fsharp
let xs = [ 0..99 ]

xs |> List.collect f                 <--> [ for x in xs do yield! f x ]
xs |> List.map  f                    <--> [ for x in xs -> f x ]
xs |> List.map  f                    <--> [ for x in xs -> f x ]
xs |> List.filter  f                 <--> [ for x in xs do if f x then yield x ]
xs |> List.filter  f1 |> List.map f2 <--> [ for x in xs do if f1 x then yield f2 x ]
```

## Why we use fold a lot less than you might think

Fold is used a lot less than in other functional languages.  There are two reasons
1. List/array/seq expressions are very powerful in F# 
2. The functions `List.sum`, `List.max` etc. tend to replace many common uses of fold

Consider implementing this transformation:
```
peakPeak --> peak-peak
```

Pseudo-code:
```fsharp
open System

let toDashes (inp: string) =
    [| for c in inp do
         if Char.IsUpper(c) then
             yield '-'
             yield Char.ToLower(c) 
         else
             yield c |]
    |> String
```

Now consider the reverse:
```
peak-peak --> peakPeak
```
For this a simple solution is to use a mutable:
```fsharp
open System

let toCamel (inp: string) =
    [| let mutable prevIsDash = false
       for c in inp do
         if c = '-' then
             prevIsDash <- true
         elif prevIsDash then
             prevIsDash <- false
             yield Char.ToUpper(c) 
         else
             yield c |]
    |> String
```
This is **totally acceptable**.  There are more functional approaches but the above is fine as the mutation is highly localised and non-escaping. In many
ways it is clearer and just as declarative as a fold.  Also, if you find yourself repeating
common patterns abstract things out into extra `List` functions, see below.

Aside: you can also omit the `yield` keywords in the above, because of [implicit yields](https://github.com/fsharp/fslang-design/blob/main/FSharp-4.7/FS-1069-implicit-yields.md).

## Abstracting out expressions into functions

For example consider this:
```fsharp
[4;5;6] --> [1;4;1;5;1;6]
```
A solution is this:
```fsharp
    [ for x in xs do
        yield 1
        yield x ]
```

Now consider this:
```fsharp
[4;5;6] --> [4;1;5;1;6]
```
A perfectly acceptable solution is this sort of thing:
```fsharp
        [ let mutable first = true
          for x in xs do
              if first then
                  first <- false
              else
                  yield 1
              yield x ]
```
Now want to put that in a function:
```fsharp
[4;5;6] |> List.intersperse 1
```
So do this:
```fsharp
module List =
    let intersperse mid xs =
      [ let mutable first = true
        for x in xs do
            if first then
                first <- false
            else
                yield mid
            yield x ]
```
Note you can use small variations on the same code shapes for `Seq` and `Array` for example
```fsharp
module Seq =
    let intersperse mid xs =
      seq { 
        let mutable first = true
        for x in xs do
            if first then
                first <- false
            else
                yield mid
            yield x }

module Array =
    let intersperse mid xs =
      [| let mutable first = true
         for x in xs do
            if first then
                first <- false
            else
                yield mid
            yield x |]
```

## Active patterns - what happens when patterns get big and complex?

Pattern matching can get big and gnarly, and in particular record pattern matching, for example:

```fsharp
type R = { XS: int list; Y: int }

let f r = 
    match r with 
    | { XS = [x]; Y = y} -> x + y
    | _ -> 1
```
Whenever you do record pattern matching it's normally better to abstract out with active patterns and give it a name
```fsharp
// adhoc active pattern
let (|RWithOneX|_|) (r: R) =
    match r with
    | { XS = [x]; Y = y} -> Some (x,y)
    | _ -> None
```
Now you can do this:
```fsharp
let f r =
    match r with 
    | RWithOneX (x,y) -> x + y
    | _ -> 1
```
