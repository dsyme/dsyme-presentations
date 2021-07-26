# What F# operators does an F# programmer need to know?

In this article I will takes a brief look at what operators and symbols an F# programmer actually needs to know.

It’s a really good topic for simplification of docs and teaching in F#.  In practice you need to know very few of them.
Below I've categorised the various operators of F# into groups - for example, the ones I believe all F# programmers need to know.

 #### Assumed obvious
 
These operators are known from primary school math, no need to teach them explicitly:

    + - * /                    Arithmetic
    <  >  <=   >=              Comparison 
 
#### Teach early, need to know:
 
    ()                   Empty value (“unit”)
    =  <>                Comparison (needs teaching because different to other languages) 
    && ||                Boolean (needs teaching because not all students know programming)
 
    (e1, .. e2)          Tuples
    [ … ]                Lists
    [| … |]              Arrays
    { A=1; B=2 }         Records

    3 :: xs              Cons onto a list (note, you can use List.Cons(3, xs) instead. However :: is necessary when pattern matching on lists)
 
    | … ->               Rule in pattern matching
    _                    Wildcard in pattern matching
 
    'T                   Generic type parameter
 
    n..m                 Ranges (within a list or sequence or loop)

    expr |> f            Pipelining 

    thing <- expr        Mutation of local, field etc.

    ``abc def``          Long identifier


**And that's all**.  

------------------------------------------------

Below are some other operators you might need to know in specialized contexts


#### Teach in specialized sections:
 
These operators will occur along the way in teach specific sections, e.g. on
programming with functions, or using F# quotations.

    [< … >]                          Attributes

    f1 >> f2                         Function composition
    (expr1, expr2) ||> f             Two-argument pipelining 
    (expr1, expr2, expr3) |||> f     Three-argument pipelining 

    expr :? type                     Type test (the ? indicates possible test/failure) 
    expr :> type                     Cast up
    expr :?> type                    Cast down (may fail, the ? indicates possible test/failure)

    {| A=1; B=2 |}                   Anonymous records

    n..step..m                       Range with step (within a list or sequence or loop)

    let (|A|_|) arg = …              Defining active patterns
    let (|A|B|) arg = …              Defining active patterns

    <@ … @>                          Code quotation (expression tree)
    <@@ … @@>                        Code quotation (expression tree, untyped)

#### Used in practice but not essential to teach:

These operators are found in F# code but can normally be left off a teaching path since those who need them can find them
with a simple google search:

    %                                Modulus
    &&& ||| ^^^                      Bitwise (&& in C#)
    <<< >>>                          Bitwise shift (<< in C#)
    ~~~                              Bitwise negation (~ in C#)
 
### Ones to largely ignore

The following are all either never really used, or discouraged in beginner code, or things where there are generally
better alternatives when teaching.
 
    !cell                            Dereference a mutable reference cell.  Use cell.Value instead
    :=                               Assign a mutable reference cell.  Use "cell.Value <- expr" instead
    list1 @ list2                    Append one list to another.  Can normally use a computed list expression or List.append instead
    
    <<                               Backward function composition, discouraged in favour of forward composition
    
    <|                               Back-piping, discouraged in favour of forward piping 
    <||                              Back-piping, discouraged in favour of forward piping 
    <|||                             Back-piping, discouraged in favour of forward piping 
    
    *?, +? …                         Nullable operators (these are used exceptionally rarely in LINQ queries, ignore these)
 
