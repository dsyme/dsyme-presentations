// --------------------------------------------------------
// TUTORIAL - F#, tuples, conditionals and .NET APIs
// --------------------------------------------------------

open System.Net

let num = 42


let wc = new WebClient()
let html = wc.DownloadString("http://tomasp.net")
html.Length

let person = ("Tomas", 42)
let name, age = person


// Conditionals and simple logic
if age > 18 then 
  printfn "Adult"
else
  printfn "Young"

// If .. then is also an expression!
let trueName = 
  if age <> 42 then name
  else "Douglas"

//------------------------------------------------------------------------------

let incrementAge person = 
    let (name, age) = person
    (name, age + 1)

// Writing functions

// Takes a single parameter and decomposes
// it into name & age and adds 1 to the age
let addYear person = 
  let (name, age) = person
  (name, age + 1)

  
// Takes a single parameter, but the parameter
// is a tuple and is decomposed immediately!
let addYear2 (name, age) = 
  (name, age + 1)

// --------------------------------------------------------
// EXERCISES - Validating person
// --------------------------------------------------------

// Return true if the name contains the ' ' character
let nameContainsSpace (person:string * int) =
  false

// Returns true if the age is between 0 and 150
let ageInRange person = 
  false

// Interactively test that the code works
let test1 = ("Tomas Petricek", 42)
nameContainsSpace test1 = true
ageInRange test1 = true

let test2 = ("Yoda", 950)
nameContainsSpace test2 = false
ageInRange test2 = false

// --------------------------------------------------------
// DEMO - Pattern matching
// --------------------------------------------------------

open System

let tryParseFormula (s:string) =
  if s.StartsWith("=") then Some(s.Substring(1).Trim()) 
  else None

let tryParseNumber (s:string) = 
  match Int32.TryParse(s) with
  | true, num -> Some num
  | _ -> None

// TODO: Implement function that prints either
// "formula: %s" or "number: %d" depending on whether
// the input string is formula or number
let parser s = 
  printfn "nop"

parser "= 4 + 4"
parser "4"