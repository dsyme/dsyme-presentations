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

For applicatives, F# code today  is often characterized by the operators `<!>` and `<*>`.
One RFC FS-1063 becomes widely available I'll admit I'd like to see the `<!>` and `<*>` patterns
eventually removed or minimized in common F# usage, though I understand it will take a while for this to happen.
If you like this post can be read as "apply considered harmful" - though not applicatives.

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
   The types involved are quite subtle.

2. The technique relies on defining a new function `myfunction` to build the overall result of processing the inputs.
   This is, by design, a curried tunction and the order of "combination" of `myfunction` really matters, so if for example you write `myfunction <!> resultValue1 <*> resultValue3 <*> resultValue2`
   by mistake you get the wrong result. The error is syntactically distant from the `a + b - c` code which helps
   us undertstand it as an error.

3. The technique relies on defining operators `<!>` and `<*>` which must either be globally or locally defined. If globally defined then
   type conflicts normally occur between different variations of these (or else people turn to the hyper-generic
   libraries like "FSharpPlus").  If locally defined then the code can easily tend towards the obscure.

4. The 'apply' operator is somewhat mind-bending to even experienced F# developers.

## Style B: Applicatives with `map2`, `map3`, ...

An alternative encoding of applicatives is sometimes used via `map2`, `map3` etc., e.g
```fsharp
let res0 =
    (resultValue1, resultValue2, resultValue3) |||> Result.map3 (fun v1 v2 v3 -> v1 + v2 - v3)

```
Here, the types are simpler and the code is not too hard to follow for any F# user familiar with `||>` and `|||>`.
Further there is no need to define the separate `myfunction` to process the results.  THere is nothing wrong with the code
above and it is very natural.


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

## Trialling FS-1063 today 

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

## Appendix: on performance with FS-1063

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
Through the addition of a `Bind3Return` method the computation can be reduced to
```fsharp
result.Bind3Return(resultValue1, resultValue2, resultValue3, fun a b c -> a + b - c)
```
and highly efficient code can be generated can normally be generated by marking this function `inline`.

