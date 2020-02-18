# Rethinking Applicatives in F#

([discuss on Twitter](https://twitter.com/dsymetweets/status/1229392285965656064)) 

At [the F# London meetup](https://www.meetup.com/FSharpLondon/events/268194013/) on Thursday [Nick Blair](https://twitter.com/NickBlair) from [TotallyMoney](https://www.totallymoney.com/) gave a fabulous talk on using the functional design pattern called "applicatives"
for data processing and validation in the context of AWS cloud programming ([content](https://github.com/blair55/fsharp-dynamo-db-slides)). As part of
a cooperative follow-up, I thought it would be cool if those of us in the London F# community use this
as a practical sample to proof a new technique that will become available in [F# 5.0](https://gist.github.com/cartermp/6b91c3561c6a5efca4288dca37c15edc). The aim is
to simplify this kind of code even further than before. 

Applicatives can be seen as a way of combining computation elements together "statically" - in the sense that
all combination can be done as a pre-phase, prior to using the resulting computation. Often many optimization steps can be applied
during this phase.  For example, in [RFC FS-1063](https://github.com/fsharp/fslang-design/blob/master/RFCs/FS-1063-support-letbang-andbang-for-applicative-functors.md)
there is an example of graph building that shows a 10000x speedup difference (really, `O(N)` to `O(1)`) when using applicatives
for defining computation graph nodes, rather than using monadic binding.

In this post I will explain why, once [RFC FS-1063](https://github.com/fsharp/fslang-design/blob/master/RFCs/FS-1063-support-letbang-andbang-for-applicative-functors.md)
is available and out of "preview", I would like to see it become a standard way of writing applicatives in F#.

For applicatives, F# code today  is often characterized by the operators `<!>` and `<*>`, called "Style A" below.
One RFC FS-1063 becomes widely available I'll admit I'd like to see the `<!>` and `<*>` patterns
eventually removed or minimized in common F# usage, though I understand it will take a while for this to happen.
If you like this post can be read as "apply considered harmful" - though not applicatives themselves.
That said, I can absolutely see why "Style A" is in common use in F# today, as for some use cases the positives
outweight the negatives.

As a running example, let's use these three `Result` values:
```fsharp
let resultValue1 = Ok 2
let resultValue2 = Ok 3 // or: Error "fail!"
let resultValue3 = Ok 4
```
Our job is to process these up to produce a new `Result` value `Ok (2  + 3 - 4)` = `Ok 1` (or `Error "fail"` if the commented out code is enabled).

## Style A: Applicatives with `apply`

Prior to F# 5.0 RFC FS-1063, a functional encoding of applicatives is generally used, e.g
```fsharp
let (<!>) f x = Result.map f x
let (<*>) f x = Result.apply f x

let myfunction (a:int) (b:int) (c:int) =
    a + b - c

let res0 =
    myfunction <!> resultValue1 <*> resultValue2 <*> resultValue3
```
The code the library defines is shown at the end of this post.
The negatives here are:

1. The technique relies on knowledge that `myfunction` is a curried function and `myfunction <!> resultValue1` is a partial application.

2. The technique relies on defining a new function `myfunction` to build the overall result of processing the inputs.
   This is, by design, a curried function and the order of "combination" of `myfunction` really matters, so if for example you write `myfunction <!> resultValue1 <*> resultValue3 <*> resultValue2`
   by mistake you get the wrong result. The error is syntactically distant from the `a + b - c` code which helps
   us undertstand it as an error.

3. The technique relies on defining operators `<!>` and `<*>` which must either be globally or locally defined. If globally defined then
   type conflicts normally occur between different variations of these (or else people turn to the hyper-generic
   libraries like "FSharpPlus").  If locally defined then the code can easily tend towards the obscure.

4. The user must understand the precedence of `<!>` and `<*>`.

5. The types involved are quite subtle. When hovering over `<!>` you'll see type parameters instantiated to long chains of curried parameter types.

6. The 'apply' operator can be somewhat mind-bending to even experienced F# developers.

Some positives are:

1. The style is visually quite declarative

2. It emphasises compositionality

3. It's available for use since F# 0.1

4. It doesn't suffer the negatives of Style B below

## Style B: Applicatives with `map2`, `map3`, ...

An alternative encoding of applicatives is sometimes used via `map2`, `map3` etc., e.g
```fsharp
let res0 =
    (resultValue1, resultValue2, resultValue3) |||> Result.map3 (fun v1 v2 v3 -> v1 + v2 - v3)

```
Here, the types are simpler and the code is not too hard to follow for any F# user familiar with `||>` and `|||>`.
Further there is no need to define the separate `myfunction` to process the results.  The main problems with
the above code are

1. You need more and more operators `||||||>` etc.

2. The associations `resultValue1` <-> `v1` etc. depend on argument position across a curried functional operator
   When there are 10 or 20 things involved that'sa problem, and potentially a source of subtle mistakes.

That said in many contexts Style B is quite natural.  For example I've found it natural and useful in dependency graph programming
with [FSharp.Data.Adaptive](https://github.com/fsprojects/FSharp.Data.Adaptive).

## Style C: Applicatives With FS-1063

With FS-1063, the new style for applicatives available is as follows:
```fsharp
let res1 =
    result { 
        let! a = resultValue1 
        and! b = resultValue2
        and! c = resultValue3
        return a + b - c 
    }
```
Here `let! ... and! ...` is understood as "merge the sources on the right and bind them simultaneously". The code
the library defines is shown at the end of this post.

The desugared code effectively uses `Result.zip` and `Result.map`.
An optimized version can just use `Result.map3`. See the note at the end for the de-sugaring and computation expression
builder definition.

Note that no `Result.apply` is defined at all, and in this case there is also no
`Result.bind`.  Only applicatives can be written with the above computation expression builder.

The cognitive basis for this technique is primarily a working knowledge
of F# computation expressions and awareness that the `let! .. and!...` syntax is available.

## A further example

The Amazon AWS DynamoDB reader code presented by Nick is an excellent guide to using F# with a cloud database.
The only possible improvement FS-1063 brings is in the use of applicatives at the end of the post. Consider this code:
```fsharp

let buildCustomer id email verified dob balance =
  { Id = id 
    Email = email
    IsVerified = verified 
    DateOfBirth = dob 
    Balance = balance }

let readCustomer() =
    buildCustomer
    <!> guidAttrReader    "id"
    <*> stringAttrReader  "email"
    <*> boolAttrReader    "verified"
    <*> dateAttrReader    "dob"
    <*> decimalAttrReader "balance"
```
With FS-1063, in Style C this becomes:
```fsharp
let readCustomer() =

  attrReader { 
      let! id       = guidAttrReader    "id"
      and! email    = stringAttrReader  "email"
      and! verified = boolAttrReader    "verified"
      and! dob      = dateAttrReader    "dob"
      and! balance  = decimalAttrReader "balance"
      return 
          { Id = id 
            Email = email
            IsVerified = verified 
            DateOfBirth = dob 
            Balance = balance } 
  }
```
Here, the advantages are the same as before - no artificial `buildCustomer` is needed, no currying or partial application is used.

## Recommendation

From where I sit, there are strong reasons to prefer styles B and C over style A. Indeed, in teams
I work on I would always remove style A in favour of the others, especially once RFC FS-1063 is available.

So, once FS-1063 is available I strongly prefer that the F# community orient towards offering both
Style B (if no computation expressions are used) and Style C (when computation expressions are used).  In particular
I'd like to see `apply` functions slowly disappear from the F# universe in favour of the other
techniques.

## Thank you

A big shout out to Tom Davies ([@TD5](https://github.com/TD5)), Nicholas Cowle and the major F# users [G-Research](https://twitter.com/GRESEARCHjobs) who did the first prototype of FS-1063 - a great community-initiated contribution to the F# language. 


## Appendix: Trialling FS-1063 today 

FS-1063 is only in preview.  If you are programming with applicatives I'd strongly encourage
you to try it out today. For example, we may be able to greatly improve the error messages to guide the
user towards the right solution, and it is possible we can improve aspects of the design as well.

To use the preview bits, at the time of posting I did the following:

1. I built [the "master" branch of the F# repository](http://github.com/dotnet/fsharp)

2. I added `/langversion:preview` to my command line arguments for both projects and `fsi.exe` invocations. For projects I used

       <PropertyGroup>
           <OtherFlags>--langversion:preview</OtherFlags>
       </PropertyGroup>

3. I wanted to use the Visual F# Tools, so I did `.\build -c Release -deployExtensions` and started Visual Studio with

        devenv /RootSuffix RoslynDev 

This will be simpler when the next preview release of Visual Studio comes out (please submit a PR if there is an easier way to use the preview bits)


## Appendix: Library Code for Style A

For Style A the library defines:
```fsharp
module Result = 
    let apply f x = 
        match f,x with
        | Ok fres, Ok xres -> Ok (fres xres)
        | Error e, _ -> Error e
        | _, Error e -> Error e

let (<!>) f x = Result.map f x
let (<*>) f x = Result.apply f x
```

## Appendix: Library Code for Style B

For Style B the library defines:
```fsharp
module Result = 
    let map2 f x1 x2 = 
        match x1,x2 with
        | Ok x1res, Ok x2res -> Ok (f x1res x2res)
        | Error e, _ -> Error e
        | _, Error e -> Error e

    let map3 f x1 x2 x3 = 
        match x1,x2,x3 with
        | Ok x1res, Ok x2res, Ok x3res -> Ok (f x1res x2res x3res)
        | Error e, _, _ -> Error e
        | _, Error  e, _ -> Error e
        | _, _, Error e -> Error e

```

## Appendix: Library Code for Style C

For Style C the library defines:
```fsharp
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
```

## Appendix: Should Applicative CEs also define 'Bind'?

One of the hardest decisions in designing an applicative CE (i.e. one that supports `MergeSources`, `BindReturn` and potentially other CE constructs) is whether the CE builder should also define a `Bind` method.

If the builder does define `Bind`, your users can very easily write code that has
low performance. RCF FS-1063 contains one example. As another example, if the user defines `Bind`
the following code will compile:

```fsharp
let readCustomer() =

  attrReader { 
      let! id       = guidAttrReader    "id"
      let! email    = stringAttrReader  "email"
      let! verified = boolAttrReader    "verified"
      let! dob      = dateAttrReader    "dob"
      let! balance  = decimalAttrReader "balance"
      return 
          { Id = id 
            Email = email
            IsVerified = verified 
            DateOfBirth = dob 
            Balance = balance } 
  }
```
will by its nature be of lower performance - perhaps drastically so - since the creation of the readers will be repeated
on each step every time the actual read is performed.  Further, no warning will
be given that `and!` can be used here (because the first five computations are independent).

The simplest solution to this is simply to not have a `Bind`.  Alternatively, you can define two CEs:

* `attrReader { ... }` without a `Bind`, for attribute readers whose compositions are effectively known statically (non data-dependent, non-parametric). 

* `attrReaderDynamic { ... } ` with a `Bind`, for attribute readers whose compositions are both data-dependent and non-parametric.

Alternatively, you can support a `Bind` and leave the user to decide.

Similar care must be taken when adding other semantics such as `TryFinally`, `TryWith`, `While`, `For` and so on.

## Appendix: On performance with FS-1063

In the above example, the computation
```fsharp
let res1 =
    result { 
        let! a = resultValue1 
        and! b = resultValue2
        and! c = resultValue3
        return a + b - c 
    }
```
is equivalent to
```fsharp
let res1 =
    result.BindReturn(result.MergeSources(resultValue1, resultValue2, resultValue3), fun (a,b,c) -> a + b - c)
```
Through the addition of a `Bind3Return` method (i.e. `Result.map3`) the computation can be reduced to
```fsharp
result.Bind3Return(resultValue1, resultValue2, resultValue3, fun a b c -> a + b - c)
```
and highly efficient code can be generated can normally be generated by marking this function `inline`.

