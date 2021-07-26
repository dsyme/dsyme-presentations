# Off-by-default Warnings in F#

The F# compiler implements some "off-by-default" warnings.  Here they are (at the time of writing, 26 July 2021):

#### Warning 52 - defensive copy

See https://docs.microsoft.com/en-us/dotnet/fsharp/language-reference/compiler-messages/fs0052 for information on this one.

#### Warning 1182 - unused value

This gives a warning when a value is unused.  This is off by default as in most IDEs unused value detection is shown using a de-emphasis of the value. Indeed the unused code indications in IDEs are generally better and richer.

However it can be highly worthwhile turning this warning on, and we do it in the F# compiler for example.


#### Warning 3180 - implicit heap allocation for `let mutable`

This gives a warning when `let mutable v` is turned into a boxed value on the heap, because it is captured in a closure.

```
dotnet fsi --warnon:3180
```
then
```fsharp
let f () = 
    let mutable x = 1
    (fun () -> x)
```

![image](https://user-images.githubusercontent.com/7204669/127040286-0b35d800-a4cc-4110-832b-df65603217b2.png)


### Warning 1178 - inference of NoEquality

When you define a union, record or struct type in F#, the compiler infers whether the type supports structural equality and ordering (called structural comparison).
For example, this type supports both equality and ordered comparison:
```fsharp
type D1 = { A: string; B: int }
```
while this type doesn't support structural ordered comparison (because `System.Type` doesn't):
```fsharp
type D2 = { A: string; B: System.Type }
```
and this type doesn't support structural equality (because `(int -> int)` doesn't - functions don't support equality as far as F#'s type logic is concerned):
```fsharp
type D3 = { A: string; B: (int -> int) }
```
These logical properties of types come into play when using `=`, `compare` and so on.

F# normally does this inference silently, however warning 1178 can be enabled to show more details of what's going on.
Unusually this gets enabled by turning the warning level to 5.  This is the only extra thing at this warning level.

```
dotnet fsi --warn:5
```

then 
```fsharp
type D2 = { A: string; B: System.Type }
```
gives:
```
> type D2 = { A: string; B: System.Type };;

  type D2 = { A: string; B: System.Type };;
  -----^^

stdin(1,6): warning FS1178: The struct, record or union type 'D2' is not structurally comparable because the type 'System.Type' does not satisfy the 'comparison' constraint. Consider adding the 'NoComparison' attribute to the type 'D2' to clarify that the type is not comparable
```

### Warning 3517 - `InlineIfLambda` didn't get inlined

This relates to a feature in [RFC FS-1098](https://github.com/fsharp/fslang-design/blob/main/preview/FS-1098-inline-if-lambda.md), in preview.

If inlining encounters a value attributed with InlineIfLambda which is not actually a lambda value it gives this warning.

It's not really a useful warning in practice but it may be useful for some testing or performance-critical purposes.

