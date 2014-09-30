// --------------------------------------------------------
// TUTORIAL: Higher-order functions
// --------------------------------------------------------

let people = 
  [ ("Tomas", 42)
    ("Don", 16)
    ("Phil", 17) ]

let addYear (name, age) = (name, age + 1)
let isAdult (name, age) = age >= 18

// 'map' is like 'Select' in C# 
List.map addYear people
// 'filter' is like 'Where' in C# 
List.filter isAdult people
// F# types have 'structural comparison'
List.sort people


// Writing processing pipelines

// Uh, oh, this looks ugly!
List.filter isAdult (List.map addYear people)

// Pipelining operator passes the thing on the left hand side
// as an argument to the function on the right hand side
people
|> List.map addYear
|> List.filter isAdult


// Using the 'fun' keyword

people |> List.map (fun (name, age) -> (name, age+1)) 
people |> List.filter (fun (_, age) -> age >= 18)

// --------------------------------------------------------
// EXERCISES
// --------------------------------------------------------

// TASK #1: Sort 'people' by their age (using List.sortBy)
let sorted = 
  people

sorted = [ ("Don", 16); ("Phil", 17); ("Tomas", 42) ]
    

// TASK #2: Get list of people with name longer than 3
let longNamed = 
  people

longNamed = [ ("Tomas", 42); ("Phil", 17) ]

// TASK #3: Get a list with nicely formatted strings
let formatted = 
  []

formatted = [ "Tomas (42)"; "Don (16)"; "Phil (17)" ]

// --------------------------------------------------------
// TUTORIAL: Sequence expressions
// --------------------------------------------------------

// Load F# charting library in F# interactive
#load "lib\FSharpChart.fsx"
open Samples.FSharp.Charting

people
|> Chart.Pie

// Let's start exploring the data with F# interactive
for name, age in people do 
  printfn "%s (%d)" name age

// We can turn the snippet into list-builder expression
let formatted2 =
  [ for name, age in people do 
      yield sprintf "%s (%d)" name age ]

// We can include most of F# constructs inside [ .. ]
let formattedAdults =
  [ for name, age in people do 
      if age >= 18 then
        yield sprintf "%s (%d)" name age ]

// More compact forms of sequence expressions
// Generate list of X, Y values so that we can plot them

// Generate inputs from 0.0 to 100.0 with step 1.0
let numbers = [ 0.0 .. 1.0 .. 100.0 ]
let squaredUgly = [ for x in numbers do yield x, x * x ]
let squared = [ for x in numbers -> x, x * x ]

squared |> Chart.Line

// --------------------------------------------------------
// EXERCISES
// --------------------------------------------------------

// TASK #1: Get list of people with name longer than 3 
// (using sequence expressions
let longNamed2 = 
  people

longNamed2 = [ ("Tomas", 42); ("Phil", 17) ]

// TASK #2: Draw the following function
// Found it on the internet :-) !
let demo t = 
  let x = 16.0 * (pown (sin t) 3)
  let y = 13.0 * cos t - 5.0 * cos (2.0 * t) - 2.0 * cos (3.0 * t) - cos (4.0 * t)
  x, y

// Generate inputs from 0.0 to 10.0 with step 0.1