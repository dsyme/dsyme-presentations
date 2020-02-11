(Please submit PRs if you spot mistakes or would like to add a substantive comment, or [chitty-chat on the twitter thread](https://twitter.com/dsymetweets/status/1227211129522413580))

# On Currying in F# - 10/02/2020

Over the weekend I was asked by Andy Gocke about the history/choices of the inclusion of currying and
partial application in the F# design. Am happy to discuss, here's a quick note.

First, from the historical perspective most of this comes in via F# <-- OCaml <-- Standard ML  <-- Edinburgh ML.
For raw core FP code (let, let let) the technical details are mostly the same as OCaml.
There are a lot of extra details about how the mechanism works w.r.t. object programming,
subsumption and quotations but we can skip those for now.  I've added a note on and the compiled form of curried and
tupled functions values and declarations at the end of this note.

At the time F# 1.x was designed (2002-2004) the strongly-typed starting points we had were
Java, C# 1.x, OCaml, Standard ML and Haskell.  There was no real integration of OO and FP
available – not even Scala – just prototypes like Pizza/GJ – and C# 1.x didn’t even have
viable function values.  As always an evolutionary approach was necessary, so I started
with C# 1.x (leading to C# 2.0 and generics), and OCaml (leading to F# 1.0).   Once OCaml
was a starting point currying and partial application are both “in”.

I do comprehend Andy's desire to see currying and partial application lose their hallowed status
amongst FP aficionados. The basic criticism that it biases the last argument is valid.  There
is also a valid criticism that it creates instability and irregularity in basic coding patterns,
e.g. some team members using tupled arguments and some using curried arguments, even when basically
all code is first order.  You can see this play out in F# code in practice, and I find myself
flipping between these when there are many parameters involved.

One problem with the “it biases the last parameter” argument is that a similar criticism can be made
for object programming notation (“it biases the first parameter”) and yet that proves perfectly effective in
practice. Further once you have syntactic mechanisms for the first and last parameters you’ve
covered most call-sites, and there’s a process of diminishing returns.  This helps explain why
currying is so persistently present in Haskell, OCaml, Elm,  PureScript and so on – like
object programming notation it’s highly compact for a bunch of coding patterns and once it’s in your toolbox
you kind of get used to it.  And once things like this get entrenched the rights and wrongs
of the design principles don’t necessarily dominate – people just get used to particular notation.

That said, I think you could in theory remove currying and partial application from F# and replace it by a design which does
away with partial application altogether, characterised by something like
```
    x.map { _ + 1 }
```
or
```
    x |> List.map { _ + x }
```
Where all callsites are always saturated up and there is no partial application at all.

A language like this would still look and feel much like modern F# code. That wouldn’t have
been true for F# 0.x, but over time F# coding has developed its own stable style very distinct
from OCaml etc. and the above would fit too badly if it weren’t a breaking change.   So this is in theory
a reasonable, stable starting point for hybrid OO/FP languages and I wouldn’t be too surprised
if it gradually becomes quite standard amongst languages somehow.  

The technical problems with any mechanism like this are mostly with nesting and evaluation
order (like cut/cute proposal for Scheme). People float suggestions like this for F# but nothing
has quite stuck. I think if there were another pair of parentheses available to us in ASCII we’d burn them on this.

Anyway, in the F# component design guidelines [we recommend against the use of currying](https://docs.microsoft.com/en-us/dotnet/fsharp/style-guide/component-design-guidelines#avoid-the-use-of-currying-of-parameters) in any
object API design, trying to push it to be for implementation code only and a few functional
programming idioms.   We also remove functions like “curry” and “uncurry” from the standard library.
IIRC in [Expert F#](https://www.apress.com/gp/book/9781484207413) chapter 20 I also wrote a fair bit about this, suggesting that currying only be used
in limited circumstances when there is a bias amongst the arguments for which is likely to
be “known” (unvarying) at callsites.  The onus is on the author of the function to predict
this, but if it’s only being used in implementation code then that’s ok.

Here's what I wrote in Expert F# 4.0:

> ## Recommendation: Understand when currying is useful in functional programming APIs. 
>
> Currying is the name used when functions take arguments in the “iterated” form, that is, when the functions can be partially applied. For example, the following function is curried: 
>
>     let f x y z = x + y + z 
>
> This is not: 
>
>     let f (x,y,z) = x + y + z 
>
> Here are some of our guidelines for when to use currying and when not to use it: 
>
> *	Use currying freely for rapid prototyping and scripting. Saving keystrokes can be very useful in these situations. 
>
> *	Use currying when partial application of the function is highly likely to give a useful residual function (see Chapter 3). 
>
> *	Use currying when partial application of the function is necessary to permit useful precomputation (see Chapter 8).  [ NOTE: however, the partial-application-for-precomputation design pattern should rarely be used in F# coding, if ever ]
>
> *	Avoid using currying in vanilla .NET APIs or APIs to be used from other .NET languages. 
>
> When using currying, place arguments in order from the least varying to 
> the most varying. This will make partial application of the function more
> useful and lead to more compact code. For example, `List.map` is curried 
> with the function argument first because a typical program usually applies
> `List.map` to a handful of known function values but many different
> concrete list values. Likewise, you saw in Chapters 8 and 9 how
> recursive functions can be used to traverse tree structures. These
> traversals often carry an environment. The environment changes
> relatively rarely—only when you traverse the subtrees of
> structures that bind variables. For this reason, the environment is the first argument.  
>
> When using currying, consider the importance of the pipelining
> operator; for example, place function arguments first and object arguments last. 
> 
> F# also uses currying for let-bound binary operators and combinators: 
>
>     let divmod n m = ... 
>
>     let map f x = ... 
> 
>     let fold f z x = ... 
> 
> However, see Chapters 6 and 8 for how to define operators as static members in types, which are not curried. 

As an aside it's noticeable that both currying and implicit/pervasive laziness are the FP
techniques which are not moving from the Hindley-Milner into the Algol languages.

### Appendix: Function values, interop and the core "semantic" (de-sugared) forms of F# expressions

For the core semantic de-sugared F# representation of expressions, things are effectively “System F + interop to .NET + interop to F# module/OO declarations”.  You can see the details in both F# quotations and [the F# TAST expression form](https://github.com/dotnet/fsharp/blob/e690e922d3ed6991e26e712fea76129bec0eb399/src/fsharp/tast.fs#L4699). Some details:

#### Function values

* A **curried local** `f0: int -> int -> int` has type `FSharpFunc<int,FSharpFunc<int,int>>`.  

  * The arity of a local `f0` is not known statically (except perhaps in an optimization phase)
  * Expression `f0` becomes `load f0`
  * Expression `f0 e1` becomes `f0.Invoke(e1)`
  * Expression `f0 e1 e2` becomes `f0.InvokeFast(e1, e2)` (actually a static method `FSharpFunc::InvokeFast(f0,e1,e2)` but that's by the by)
  * NOTE: This follows OCaml in evaluating `e1` and `e2` before making the call.  Thus there is a distinction between `(f0 e1) e2` and `f0 e1 e2`.  THe former becomes `(f0.Invoke(e1)).Invoke(e2)` in the absence of any optimization information about `f0`.

  * NOTE: `f0.InvokeFast(e1,e2)` does  a hidden type test to check if it supports `OptimizedClosures.FSharpFunc<_,_,_>` (a two-curried-argument entry point), likewise 3, 4 etc.   At the closure-creation points when allocating `(fun x y -> ...)`, creating an instance of `OptimizedClosures.FSharpFunc<_,_,_>` for two-argument curried entry points `(fun x y -> …)` that have no side effect between the two arguments.  This means allocation-free calls to two-argument curried functions at the cost of a type test.   Looping code can make this explicit and lift out this check manually.

* A **tupled local** `f1: int * int -> int` has static compiled type `FSharpFunc<Tuple<int,int>,int>`.  

  * The arity of a local `f1` is not known statically (except perhaps in an optimization phase)
  * Expression `f1` becomes `load f1`
  * Expression `f1 e1` becomes `(load f1).Invoke(e1)`
  * Expression `f1 (e1, e2)` becomes `(load f1).Invoke(Tuple(e1, e2))`
  * There is no allocation-free call to such a function unless optimization learns something about `f1`

#### Function declarations in a module

* The compiled form of a **curried function declaration in a module**  `let f2 x y = x + y` is `public static int CompileNameOfF2(int x, int y) { .. }`

  * The arity of `f2` is known statically to be `[1;1]`
  * Expression `f2` becomes `fun v1 v2 -> CompileNameOfF2(v1,v2)`
  * Expression `f2 e1` becomes `let v1 = e1 in (fun v2 -> CompileNameOfF2(v1,v2)`
  * Expression `f2 e1 e2` becomes `CompileNameOfF2(e1,e2)`

* The compiled form of a **tupled function declaration in a module** `let f3 (x, y) = x + y` is also `public static int CompileNameOfF3(int x, int y) { .. }`

  * The arity of `f3` is known statically to be `[2]`
  * Expression `f3` becomes `fun v1 v2 -> CompileNameOfF3(v1,v2)`
  * Expression `f3 e1` becomes `let (v1, v2) = e1 in CompileNameOfF3(v1,v2)`
  * Expression `f3 (e1, e2)` becomes `CompileNameOfF3(e1,e2)`

I'll skip function declarations in classes but suffice to say they typically become instance methods.

#### .NET interop calls

* Assume .NET compiled form `static int C::StaticMethod(int x, int y)=`

  * The arity of `C.StaticMethod` is known at all callsites
  * Expression `C.StaticMethod` becomes `fun p -> let (v1, v2) = p in C::StaticMethod(v1,v2)`, i.e. first-class uses of .NET methods are considered to take a single tupled argument.
  * Expression `C.StaticMethod(e1)` is actually disallowed but if it were allowed it would become `let (v1,v2) = e1 in C::StaticMethod(v1, v2)`
  * Expression `C.StaticMethod(e1,e2)` becomes `C::StaticMethod(e1, e2)`
  
Overall the “module/OO/interop” parts of F# are about approximating the “illusion of uniformity” over the sea of non-uniform declaration-level constructs (classes, modules, functions, methods, properties, .NET interop, type providers, “void”, generics, …)  and lifting these into a uniform expression level. 

Lots more could be said but that's the basics.  

