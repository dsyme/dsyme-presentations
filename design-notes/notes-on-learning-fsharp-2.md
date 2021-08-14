## Notes in F# and pattern matching

[Twitter thread, please comment here](https://mobile.twitter.com/dsymetweets/status/1426674745517518848) 


### How to pattern match on properties and arbitrary objects

Many C# pattern matching examples focus on how to pattern match on classes (that is, objects). 

However **the vast majority of pattern matching in F# is not against arbitrary objects** - it is against F# unions, lists, options, tuples, arrays and so on.
In fact pattern matching on class objects is relatively rare (and where we do it it mostly involves writing active patterns, discussed below).

How does F# get away with this?  Well, first, if you want to match on the properties of a class, you would normally extract the data fields you want like this:

```fsharp
open System.Collections.Generic

let data = List<int>([0 .. 99])

match data.Count, data.Capacity with
| 10, 10 -> printfn "count and capacity are 10"
| 20, 20 -> printfn "count and capacity are 20"
| c, n -> printfn $"count is ${c} and capacity is {n}"
```
If the data is in nested position you usually use a `when` pattern:

```fsharp
let datas = [data]

match datas with
| [data] when data.Count = 10 && data.Capacity = 10 -> printfn "count and capacity are 10"
| [data] when data.Count = 20 && data.Capacity = 20 -> printfn "count and capacity are 20"
| _ -> printfn $"unknown"
```

That is, in F# we don't really extract properties in **patterns** - we extract properties in **expressions**. We believe this is
much, much more readable.

There is in fact [a proposal to add property patterns](https://github.com/fsharp/fslang-suggestions/issues/968) and we might eventually do
it, but on the whole we will always much prefer to put the property access in an expression not a pattern.  This is because
it has long been known that complex pattern matching can be hard to read.  So we want as much of the logic moved out of patterns as
possible.  There are a lot of examples of property pattern matching floating around in C# - often quite hard to understand - and this is
what we have always wanted to avoid with F# pattern matching.

If you really do need to match against an object property in nested position and continue with further matching, you can define an active pattern for that, e.g.

```fsharp
let (|Count|) (c: List<'T>) = c.Count

match datas with
| [Count 10] -> printfn "the collection has Count 10"
| [Count 20] -> printfn "the collection has Count 20"
| _ -> printfn $"unknown"
```

However this is rare - again, most pattern matching in F# is not against such objects. Further, if you're doing this
**your patterns are probably getting too complex** and you should almost certainly extract your pattern
logic to more semantically meaningful active patterns.

As a contrived example, here's a "more meaningful" (that is logically richer) active pattern that checks
two properties and only succeeds if they are equal:

```fsharp
// A more semantically meaningful active pattern that goes beyond what the object provides
let (|CountAndCapacityAre|_|) (c: List<'T>) =
    match c.Count, c.Capacity with
    | count, cap when count = cap -> Some(count)
    | _ -> None
```
and we use it like this:
```fsharp
let data = List<int>([0 .. 99])

match data with
| CountAndCapacityAre 10 -> printfn "count and capacity are both 10"
| CountAndCapacityAre 20 -> printfn "count and capacity are both 20"
| _ -> printfn $"count is ${data.Count} and capacity is {data.Capacity}"
```

It's a contrived example but you get the idea.

### Why does F# use `:?` for type test in patterns?

F# uses `:?` for type tests in patterns, e.g.

```fsharp
let f (x: obj) =
    match x with 
    | :? int as n -> printfn $"it's the integer {n}!"
    | :? string as s -> printfn $"it's the string {s}!"
    | _ -> printfn "I don't know what it is!"
```

Why?  Well, first, this would be ambiguous:

```fsharp
let f (x: obj) =
    match x with 
    | int -> printfn $"it's the integer {n}!"   // ambiguous - is `int` a type or a variable name?
    | string -> printfn $"it's the string {s}!" // ambiguous - is `string` a type or a variable name?
    | _ -> printfn "I don't know what it is!"
```

Second, F# has traditionally seen dynamic type tests as "not particularly normal". 
That is the majority of F# programming drops out without them. 

For example in the compiler solution there 10,000 `match`, each probably has 2-50 clauses (avg 5?), and only 900 type tests.
So maybe 1 in 50 match clauses are type tests. This is because discriminated unions, function closures and method dispatch
take up most of the slack where information is not fully known statically but static information is recoverable at runtime.

Because of this, F# doesn't mind making you pay a little tax to do a type test. Because you probably want to be explicit about it.
In that sense it's like `let mutable`.

### Biasing against type test --> Biasing against type hierarchies

Looking beyond type tests, F# kind of biases against type hierarchies all the time. 
See my talk [F# Code I Love](https://www.youtube.com/watch?v=1AZA1zoP-II).
F# is cool with non-hierarchical class types and classes implementing common interfaces (IEnumerable etc.). But it de-emphasises inheritance as a technique. 

For example, in the whole compiler there are about 50 inherit, in just two particular places, and almost no implementation inheritance. The same will be true in methodology books.

Is this intrinsic to F# programming (functional or otherwise), or is it part of F# "functional" programming?  I think it is intrinsic to F# programming.
This means inheritance will come late in a learning sequence and be generally de-emphasised, as will type tests.

However this leads to a problem where are teaching people who are "expecting" inheritance, that is, who have been trained to think and model in terms of inheritance -
that's about 99% of the computing universe.  Historically some of these people have had a hard time getting in to F# (while people coming "fresh"
without any idea of inheritance - or sick of it's failings -  find it easier). It's one of the things F# currently asks people to "unlearn".


