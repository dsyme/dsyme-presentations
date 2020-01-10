
# Why F# Computation Expressions unify and go beyond 'do' notation and list comprehensions

> Notes based on a discussion with Phillip Wadler, 10/01/2020. This document is a work in progress. Please
leave comments or send feedback. I may have made mistakes, please send a PR to correct.

F# computation expressions (CEs) are a syntactic de-sugaring of language elements like `for x in xs  ... ` to method calls like `For( ... )` on a builder object. They can be configured in many ways.  See also [this extensive introduction to F# computation expressions](https://fsharpforfunandprofit.com/posts/computation-expressions-intro/).

Many people coming to F# are familiar with Haskell, and in particular [list comprehension syntax](https://wiki.haskell.org/List_comprehension) and [do notation](https://en.wikibooks.org/wiki/Haskell/do_notation)
(monad syntax).  In Haskell these are two separate syntactic mechanisms, with limits to what they
can express (discussed that later).  

In contrast, F# CEs are one syntactic mechanism that can be configured in different ways, including ways that cover
the use cases of both list comprehensions and do notation, and in each case can express additional things without
"stepping outside the notation". There are also other applications for F# computation expressions.

Below I’ll explain how to configure F# computation expressions for comprehensions (also called "monoid syntax"), and monadic
syntax. There are some other possible configurations of F# computation expressions that are used in practice, briefly
summarized at the end. 

This note is particularly aimed at explaining:

-	why F# CEs are not just monad syntax;

-	why F# CEs are more (or differently) expressive than either Haskell `do` notation or Haskell list comprehensions

-	why F# CEs for comprehensions de-sugar the `mapConcat`/`bind` operation to the `for` notation rather than
the `let!` (this can confuse people approaching F# CEs from the Haskell/monad `do-notation` perspective)

For those coming from C#, F# CEs cover the use cases corresponding to four separate C# language features: [C# enumerator/iterator methods](https://www.javatpoint.com/csharp-iterators), [C# async methods](https://docs.microsoft.com/en-us/dotnet/csharp/programming-guide/concepts/async/), [C# LINQ expressions](https://docs.microsoft.com/en-us/dotnet/csharp/linq/) and [C# 8.0 async enumerator methods](https://dotnetcoretutorials.com/2019/01/09/iasyncenumerable-in-c-8/) (as well as many other use cases).
Comparing the expressivity of these is not covered in this doc.

## Overview of F# Computation Expressions

F# CEs are a syntactic mechanism for de-sugaring language elements inside blocks like `seq {  ...  }` or `async {  ...  }`.
The outer value such as `seq` or `async` is called the builder. The inner syntax elements available to de-sugared are the same as normal F#/OCaml control syntax, plus `let!`, `return`, `yield`, `return!` and `yield!`:

-	`let! x = y in z`

-	`for x in xs  ...  `

-	`while e do  ... `

-	`e1; e2`

-	`yield x`

-	`return x`

-	`yield! x`

-	`return! x`

-	`try e1 with exn -> e2`

-	`try e1 finally e2`

-	and some others 

There is no separate de-sugaring for `let a = b in  ... ` or `if/then/else` or `match ... with  ... `, as
these always stay as they are (with their bodies/branches de-sugared) and are always available for use.  

The exact de-sugaring is in the F# language spec which covers some additional topics like the insertion of delays.

The different syntax elements are enabled by arranging for the static type of the builder to support different
methods – these methods are the target de-sugaring. The names of the methods matter, because different method
names light up different source syntax. For example:

-	The presence of a `Bind` method permits de-sugaring of `let! x = xs in  ... `. 

-	The presence of a `Combine` method permits de-sugaring of `e1; e2`

-	The presence of a `For` method permits de-sugaring of `for x in xs do  ... `

-	The presence of a `While` method permits de-sugaring of `while g do  ... `

-	The presence of a `Yield` method permits de-sugaring of `yield e`

-	The presence of a `YieldFrom` method permits de-sugaring of `yield! e`

-	The presence of a `Return` method permits de-sugaring of `return e`

-	The presence of a `ReturnFrom` method permits de-sugaring of `return! e`

-	etc.

There are no interfaces to force particular types for the target methods (though their types are
limited by the nature of the de-sugaring and the rules of method overload resolution). A particular
builder can support any or all of them.


## Configuring F# Computation Expressions for Monadic Syntax

When F# computation expressions are configured to monadic syntax you minimally need the following:

```fsharp
Bind:  M<T> * (T -> M<U>) -> M<U>
Return: T -> M<T>
```

The presence of the `Bind` method means `let! x = xs in  ... .` Is allowed in the syntax. So your
CE uses `let! x = xs in  ... ` for the binding. 

For those familiar with Haskell, it is natural to think of this as offering a syntax for `Monad`
instances.  Here’s how the Haskell terminology maps across:

-	the Monad `bind` operation corresponds to the `let!` syntax mapping to the `Bind` method

-	the Monad `return` operation corresponds to `return x` syntax mapping to the `Return` method

This allows code like this:

```fsharp
async {
   let! x = xs 
   return x+x
}
```

For monad syntax, there are additional optional elements to enrich the syntax. You can optionally have:

- `try/with` (usual signature `TryWith: M<T> -> (exn -> M<T>) -> M<T>` in monad syntax)

- `try/finally`  (usual signature `TryFinally: M<T> * (unit -> M<unit>) -> M<T>` in monad syntax)

- `while` (usual signature `While: (unit -> bool) * (unit -> M<unit>) -> M<unit>` in monad syntax)

- `for` (usual signature `For: seq<T> * (T -> M<unit>) -> M<unit>` in monad syntax)

- `return!` (usual signature `ReturnFrom: M<T> -> M<T>` in monad syntax)

- `e1; e2` (usual signature `Combine: M<unit> * M<T> -> M<T>` in monad syntax), useful for one loop followed by another 

- Custom operators (see below)

Adding each of these enable further basic syntax de-sugaring to the available syntax in the monadic syntax.

## Configuring F# Computation Expressions for Comprehension ("Monoid") Syntax

When F# computation expressions are configured for what we call comprehension (or "monoid") syntax the operation signatures are typically this form:
```
For:  M<T> * (T -> M<U>) -> M<U>
Combine: M<T> * M<T> -> M<T>
Yield: T -> M<T>
Zero: M<T>
```

The minimum needed to warrant the name `comprehension` is `For` and `Yield`.  A `monoid` minimally needs `Yield`, `Combine` and `Zero`.

Note you have a `For` method.  The presence of the `For` method means `for x in xs  ... ` is allowed in the syntax.   So your CE uses `for x in xs ... ` for binding. It does not use `let!` for binding. This is not being treated as a monad (let!), it’s being treated as a comprehension (for). There is no `Bind` method, there is no `let!` syntax, the `For` method takes its place.  

For those familiar with Haskell, it is natural to think of this as offering a syntax for things that in Haskell logically correspond to [`MonadPlus`](https://wiki.haskell.org/MonadPlus) instances.  Here’s how the Haskell terminology maps across:

- In F#, the Haskell MonadPlus `bind` operation corresponds to the `for` syntax and is de-sugared to the `For` method

- The MonadPlus `mplus` operation corresponds to sequential composition `e1; e2` syntax (perhaps on two aligned lines with no semicolon), and is de-sugared to the `Combine` method

- The MonadPlus `return` operation corresponds to `yield` syntax and is de-sugared to the `Yield` method

- The MonadPlus `mzero` operation is inserted implicitly by the compiler (eg. on the empty else branch of an if/then) and is de-sugared to the `Zero` method

This allows source syntax like this to be de-sugared:

```fsharp
seq {
   yield "h"
   for x in xs do 
       yield "e"
       if x > 3 then 
           yield "llo" + string x
   yield "world"
}
```

This is what we call comprehension (or monoidal) syntax in F#. There are additional optional elements available to enrich the syntax for comprehension CEs. For example you can optionally have:

- `yield!` (YieldFrom : M<T> -> M<T>)

- `try/with` (TryWith: M<T> -> (exn -> M<T>) -> M<T>)

- `try/finally` (TryFinally: I’ll omit the signature)

- `while` 

- custom operators like `sortBy` and `groupBy` (see the F# language spec and [other guides for more on custom operators](http://blog.mavnn.co.uk/expanding-existing-computational-expressions/), not covered in detail in this note)

- some other things

## Why F# Computation Expressions are more expressive than List Comprehensions

For those familiar with Haskell list comprehensions, the F# equivalent of 

```fsharp
[ N | x <- L; y <- M ]  
```

is

```fsharp
seq { for x in L do 
        for y in M do 
          yield N }
```

There’s a short cut to write it on one line if you like:

```fsharp
seq { for x in L do for y in M -> N }
```

In either case it de-sugars to `seq.For(L, (fun x -> seq.For(M, (fun y -> seq.Yield(N)))))`

Expressivity of notation can be determined by comparing what functions can be implemented by, say, this in F#:

```fsharp
let f (xs: int list) = seq {  ...  }
```

and the Haskell equivalent using only a list comprehension:

```haskell
f xs = [  ...  |  ...  ]
```

where you can fill in the ` ... ` with whatever you like (except you aren’t allowed to call other list-generating constructs or library functions in there – not even [0 ... ] please).   

For example, it’s my understanding there is no Haskell definition of the above restricted form that generates
```
[ 3; (a1+1); ...  (an+1); 4; (a1+2); 5;  ... ; (an+2); 5 ]
```
from input list `[ a1 ... an ]` . In F# the comprehension function is this:

```fsharp
let f (xs: int list) =
    seq { yield 3
          for x in xs do 
              yield (x+1)
          yield 4 
          for x in xs do
              yield (x+2)
              yield 5 }

f [ ] |> Seq.toList
// val it : int list = [3; 4]

f [ 100 ] |> Seq.toList
// val it : int list = [3; 101; 4]

f [ 100; 101 ] |> Seq.toList
//val it : int list = [3; 101; 102; 4; 102; 5; 103; 5]
```

This is because in F# you can do additional things (like "append") in comprehension notation beyond map/yield/filter, things
which can’t be expressed using Haskell list comprehensions. 

In Haskell this would be:
```haskell
[ 3 ]  ++ [ x+1 | x <- xs ] ++ [ 4 ] ++ [ y | x <- xs, y <- [ x+2, 5 ]  ]
```
However this breaks the (reasonable) rule for determining expressivity of a notation – _the comparison must only use one instance of the notation and no other ways of generating lists_. We’re comparing the expressivity of notations, not of Haskell and F#. Using the “++” operator is stepping outside the notation (just as an explicit call to List.sortBy or List.groupBy would be). And using multiple nested instances of the notation reveals weaker expressivity.

Alternatively, consider a programming language where you _only_ had one instance of the notation and a few primitives like addition.  What functions can and can’t be written, and how many instances of the notation are needed?  That could be formulated as a precise technical question.

Here are some further examples. First, we can insert if/then anywhere we like in the logic:

```fsharp
let f1 (xs: int list) (ys: int list)=
    seq { for x in xs do 
             for y in ys do 
                 if x > y then 
                     yield x+y }
// de-sugars to:
// seq.For(xs, (fun x -> seq.For(xs, (fun y -> if x > y then seq.Yield(x+y) else seq.Empty))))
```

This one does have an equivalent in Haskell list comprehensions using guards:

```fsharp
f1 xs = [ (x+y) | x <- xs, y <- ys, x > y ]
```

However, in F# you can sequence (i.e. `append`) two comprehensions to yield one sequence then another:

```fsharp
let f3 (xs: int list) (ys: int list) =
    seq { for x in xs do 
             yield x+1 
          for y in ys do 
             yield y+2 }

// de-sugars to:
// seq.Combine(seq.For(xs, (fun x -> seq.Yield(x+1))), seq.For(ys, (fun y -> seq.Yield(y+2))))
```
In Haskell list comprehensions, this requires an explicit use of `++`.

Likewise, in F# you can use `if/then/else` and sequencing to alternately yield one or two elements:

```fsharp
let f4 (xs: int list) =
    seq { for x in xs do 
             for y in xs do 
                 if x > y then 
                     yield x+1 
                 else 
                     yield x 
                     yield 4 
    }

// de-sugars to:
// seq.For(xs, (fun x -> seq.For(xs, (fun y -> if x > y then seq.Yield(x+1) else seq.Combine(seq.Yield(x), seq.Yield(4)))))))
```

You can generate prefixes and suffixes (headers and footers) on either side of a loop:

```fsharp
let f5 (xs: int list) =
    seq { yield 4
          for x in xs do 
             yield x+1 
          yield 3 }

// de-sugars to:
// seq.Combine(seq.Yield 4, seq.Combine(seq.For(xs, (fun x -> seq.Yield(x+1))), seq.Yield(3)))
```


You can also use other looping constructs such as `while`:

```fsharp
// Yields an infinite sequence 1,2,1,2,1,2 ... 
let f6 () =
    seq { while true do 
             yield 1 
             yield 2 }

// de-sugars to:
// seq.While((fun () -> true), (fun () -> seq.Combine(seq.Yield(1), seq.Yield(2))))
```


You can also use `yield!` to yield a sub-comprehension. This can be used for infinite sequences:

```fsharp
// An example showing a recursive comprehension
let rec randomWalk n = 
    seq { yield n
          yield! randomwWalk (n+rand()-0.5) }

// de-sugars to:
// let rec randomWalk n = seq.Combine(seq.Yield n, seq.YieldFrom(randomWalk(n + rand() – 0.5)))
```

You can also use constructs such as try/finally to add to the dispose logic of the enumeration process:

```fsharp
seq { for db in ["Database1"; "Database2"] do
          let connection = Database(db)
          try 
              while connction.Read() do 
                 yield connection.State
          finally  
              connection.Close()
    }

// seq.For(["Database1"; "Database2"], (fun db -> 
//     let connection = Database() 
//     seq.TryFinally(seq.While((fun () -> connection.Read()), 
//                              (fun () -> seq.Yield(connection.State())))), 
//                    (fun () -> connection.Close())))
```

As you can see from the above examples, F# computation expressions are a rich form of comprehension.  It isn’t possible to write all the above examples using Haskell list comprehensions without `stepping outside` the comprehension notation, e.g. making use of explicit calls to filter, concatenate, fixpoint, other list literals or other library constructs to generate lists/sequences.  There are no such explicit calls in the F# examples above (except the last, which uses a second list for the names of the databases)

## Why F# Computation Expressions are more expressive than Haskell `do` notation

Likewise, when F# CEs are configured for monadic syntax, they are also more expressive than Haskell do-notation.   This is more subtle but some examples:

- loops, try/with and try/finally can be included in the syntax and mapped to corresponding operations

- conditionals and pattern matching can be placed within the control structure

- custom operators can be added, for example the `condition` operator can be added for the distribution monad (here's an example of [declaring](https://github.com/dotnet/fsharp/blob/FSharp.Core-4.2.2/tests/fsharp/core/queriesCustomQueryOps/test.fsx#L336) and [using](https://github.com/dotnet/fsharp/blob/FSharp.Core-4.2.2/tests/fsharp/core/queriesCustomQueryOps/test.fsx#L414) a custom operator).

TODO: give proper examples of these.

## Other possible configurations of CEs

So far we’ve looked at two configurations of F# CEs.  They can be configured in many other ways and this is done in practice, e.g. for [web programming DSLs](https://github.com/SaturnFramework/Saturn/blob/master/src/Saturn/Controller.fs#L60) or [F# asynchronous sequences](https://fsprojects.github.io/FSharp.Control.AsyncSeq/library/AsyncSeq.html).  For example,

- You can simply have a `Return` method and nothing else, so all you can write is `foo { return x }`.  Even this has some uses.   

- You can simply have a `Yield` and `Combine` method which only lets you write `foo { e1; e2; e23}` which is useful for some DSLs.  

- You can also have indexed-monad-like things where the types carry additional information. 

- You can have any other mix of the methods you like to de-sugar the various syntax elements

- You can start using method overloading to allow "multi-type" computations that bind on related types.  For example, the F# `task` monad allows you to bind against C# tasks, F# async or C# "task-like" values.

There are lots of possibilities, though they are may or may not be useful, it’s just a syntax de-sugaring. The approach of using a syntax mapping that can be reused in various ways comes from Haskell, LINQ and the LCF theorem provers, but the technical details differ extensively.

A final comment: I think unifying and extending Haskell list/do-notation with full control syntax (either OCaml-style or Algol-style) which can be de-sugared may make an interesting project.  Or, to put it another way, there seems to be potential for a pure language which more natively supports a richer, customizable de-sugaring of data-generating control constructs.  A starting point may be to strip some existing notations out of Haskell and rebuild assuming either OCaml-style or Algol-style control constructs.


