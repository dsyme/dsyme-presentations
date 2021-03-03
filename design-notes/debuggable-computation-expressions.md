
# DRAFT: A Guide to creating more debuggable computation expressions

Computation expressions often transform a user declaration to a target internal representation involving closures.

```
let asyncResult = AsyncResultBuilder()
type AsyncResult<'a> = Async<Result<'a, exn>>
```

### Technique 1 - Inline your Delay, Bind, BindReturn, For, While, Combine methods and their implementations, down to a set of primitives.

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

  
2. Technique 2 - Disable tailcalling in ReturnFrom in DEBUG mode by using a formulation like this:

    member inline __.ReturnFrom (asyncResult : Async<Result<'T, 'Error>>) =
#if DEBUG
        async { let! res = asyncResult in return res }
#else
        asyncResult
#endif

Note this only applies to CEs defined in your own code - if shipping across asembly boundaries there is no way to tell if client code is also being compiled as debug.


3. Future Technique 3 - `FSharp.Debug.InlineDebuggerEnvironment();`


TBD 



