// --------------------------------------------------------
// DEMO: Fancy REST type provider
// --------------------------------------------------------

#r "lib/FSharp.Data.Experimental.dll"
open FSharp.Data

// Generate type that represents the entire REST API
// (uses the documentation from: http://docs.themoviedb.apiary.io/)
type TheMovieDb = ApiaryProvider<"themoviedb">
let db = new TheMovieDb("http://api.themoviedb.org")

// Add user key, so that we can make call
db.AddQueryParam("api_key", "6ce0ef5b176501f8c07c634dfa933cff")

// Search for person
let res = db.Search.Person(query=["query","craig"])
for person in res.Results do
  printfn "%d %s" person.Id person.Name

let person = db.Person.GetPerson("8784")
for cast in person.Credits().Cast do
  printfn "%s (%s)" cast.Title.String.Value cast.Character

// TASK #1: Search for 'james bond' or 'star wars' movies!

// --------------------------------------------------------
// Accessing other APIs (http://fssnip.net)
// --------------------------------------------------------

type FsSnip = ApiaryProvider<"fssnip">
let fs = new FsSnip("http://api.fssnip.net/")

// TASK  #2: Explore the F# snippets web site API