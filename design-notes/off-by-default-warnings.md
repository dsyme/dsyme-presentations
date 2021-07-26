# Off-by-default Warnings in F#

The F# compiler implements some "off-by-default" warnings.  Here they are (at the time of writing):


#### Warning 1182 - unused value

This gives a warning when a value is unused.  This is off by default as in most IDEs unused value detection is shown using a de-emphasis of the value. Indeed the unused code indications in IDEs are generally better and richer.

However it can be highly worthwhile turning this warning on, and we do it in the F# compiler for example.


#### Warning 3180 - implicit heap allocation for `let mutable`

This gives a warning when `let mutable v` is turned into a boxed value on the heap, because it is captured in a closure.

```
fsi --warnon:3180
```
then
```fsharp
let f () = 
    let mutable x = 1
    (fun () -> x)
```

![image](https://user-images.githubusercontent.com/7204669/127040286-0b35d800-a4cc-4110-832b-df65603217b2.png)


### Warning 3517 - `InlineIfLambda` didn't get inlined

This relates to a feature in [RFC FS-1098](https://github.com/fsharp/fslang-design/blob/main/preview/FS-1098-inline-if-lambda.md), in preview.

If inlining encounters a value attributed with InlineIfLambda which is not actually a lambda value it gives this warning.

It's not really a useful warning in practice but it may be useful for some testing or performance-critical purposes.

