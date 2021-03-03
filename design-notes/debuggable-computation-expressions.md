
# DRAFT: A Guide to creating more debuggable computation expressions

Computation expressions often transform a user declaration to a target internal representation involving closures.

```
let asyncResult = AsyncResultBuilder()
type AsyncResult<'a> = Async<Result<'a, exn>>
```

Relevant thread: https://github.com/dotnet/fsharp/issues/2741

#### Technique 1 - Inline your Delay, Bind, BindReturn, For, While, Combine methods and their implementations, down to a set of primitives.

This has the effect of associating the source range of the inlined closures with the ultimate point where those closures are used.

> Note, this may increase generated code size

```fsharp
type AsyncResultBuilder () =
    member __.Return value ...

    member inline _.Delay ...
    
    member inline _.Combine ...

    member inline _.Bind ...

    member inline _.TryWith ...

    member inline _.TryFinally ...

    member inline _.Using ...
    
    member inline _.While ...

    member inline _.For ...
```

  
#### Technique 2 - Disable tailcalling in ReturnFrom in DEBUG mode by using a formulation like this:

```fsharp
    member inline __.ReturnFrom (asyncResult : Async<Result<'T, 'Error>>) =
#if DEBUG
        async { let! res = asyncResult in return res }
#else
        asyncResult
#endif
```

Note this only applies to CEs defined in your own code - if shipping across asembly boundaries there is no way to tell if client code is also being compiled as debug.


#### Future Technique 3 - `FSharp.Debug.InlineDebuggerEnvironment();`



On discussion with @TIHan believe we should add a general feature for CEs authors where they can request that the debug environment be fully captured by within crucial closures that represent the execution stacks.  To give an example from the F# compiler:

```fsharp
    let inline bind f comp1 = 
       Cancellable (fun ct -> 
            FSharp.Core.CompilerServices.RuntimeHelpers.InlineDebbugerEnvironment();
            match run ct comp1 with 
            | ValueOrCancelled.Value v1 -> run ct (f v1) 
            | ValueOrCancelled.Cancelled err1 -> ValueOrCancelled.Cancelled err1)
```

This mechanism would inject fake bindings in debug mode to rebind the full captured environment at the point of final inlining. 




