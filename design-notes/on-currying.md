
# On Currying - 10/02/2020

Over the weekend I was asked about the history/choices of the inclusion of currying and
partial application in the F# design. Am happy to discuss, here's a quick note.

First, from the historical perspective most of this comes in via F# <-- OCaml <-- Standard ML  <-- Edinburgh ML.
For raw core FP code (let, let let) the technical details are mostly the same as OCaml.
There are a lot of extra details about how the mechanism works w.r.t. object programming,
subsumption, quotations and the compiled form of curried functions but we can skip those for now.

At the time F# 1.x was designed (2002-2004) the strongly-typed starting points we had were
Java, C# 1.x, OCaml, Standard ML and Haskell.  There was no real integration of OO and FP
available – not even Scala – just prototypes like Pizza/GJ – and C# 1.x didn’t even have
viable function values.  As always an evolutionary approach was necessary, so I started
with C# 1.x (leading to C# 2.0 and generics), and OCaml (leading to F# 1.0).   Once OCaml
was a starting point currying and partial application are both “in”.

I do comprehend your desire to see currying and partial application lose their hallowed status
amongst FP aficionados. The basic criticism that it biases the last argument is valid.  There
is also a valid criticism that it creates instability and irregularity in basic coding patterns,
e.g. some team members using tupled arguments and some using curried arguments, even when basically
all code is first order.  You can see this play out in F# code in practice, and I find myself
flipping between these when there are many parameters involved.

One problem with the “it biases the last parameter” argument is that a similar criticism can be made
for OO programming (“it biases the first parameter”) and yet that proves perfectly effective in
practice. Further once you have syntactic mechanisms for the first and last parameters you’ve
covered most call-sites, and there’s a process of diminishing returns.  This helps explain why
currying is so persistently present in Haskell, OCaml, Elm,  PureScript and so on – like
OO notation it’s highly compact for a bunch of coding patterns and once it’s in your toolbox
you kind of get used to it.  And once things like this get entrenched the rights and wrongs
of the design principles don’t necessarily dominate – people just get used to particular notation.

That said, I think you could in theory remove currying from F# and replace it by a design like
the one you propose, characterised by something like
```
    x.map { _ + 1 }
```
or
```
    x |> List.map { _ + x }
```

A language like this would still look and feel much like modern F# code. That wouldn’t have
been true for F# 1.x, but over time F# coding has developed its own stable style very distinct
from OCaml etc. and the above would fit if it weren’t a breaking change.   So this is in theory
a reasonable, stable starting point for hybrid OO/FP languages and I wouldn’t be too surprised
if it gradually becomes quite standard amongst languages somehow.  

The technical problems with any mechanism like this are mostly with nesting and evaluation
order (like cut/cute proposal for Schema). People float suggestions like this for F# but nothing
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
> *	Use currying when partial application of the function is necessary to permit useful precomputation (see Chapter 8).  
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

Lots more could be said but that's the basics.  
