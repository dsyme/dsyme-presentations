module Tasks

open System
open System.Collections.Generic
open System.Net.Http
open System.Threading.Tasks
open FSharp.Core.Fluent



module Demo = 
    let someFunction (x: int) =
        task {
           return (x+x)
        }


    let someFunction2 (x: int) =
        async {
           let! result1 = someFunction (x+x) |> Async.Awai
           return (result1+result1)
        }
        |> Async.StartAsTask




/// Get a list of web pages asynchronously and sum their size
let sumPageSizesAsync (uris: Uri list) = 
    async {
        use httpClient = new HttpClient()
        let! pages=
            uris 
            |> List.map (httpClient.GetStringAsync >> Async.AwaitTask)
            |> Async.Parallel
        let sum = pages.sumBy (fun page -> page.Length)
        return sum
    }
    |> Async.StartAsTask

/// Get a list of web pages asynchronously and sum their size
let sumPageSizesTask (uris: Uri list) = 
    task {
        use httpClient = new HttpClient()
        let! pages =
            uris 
            |> List.map httpClient.GetStringAsync
            |> Task.WhenAll
        let sum = pages.sumBy (fun page -> page.Length)
        return sum
    }

//   Async.RunSynchronously  -->   task.Result
//   Async.Parallel          -->   Task.WhenAll
//   Async.Choose            -->   Task.WhenAny
//   Async.StartAsTask       -->   not needed
//   Async.AwaitTask         -->   not needed

let urls = [ Uri "https://ubuntu.com"; Uri "https://www.linux.org"; ]

let testTasks () = 
    let size1 = 
       let task = sumPageSizesAsync urls
       task.Result

    let size2 =
        let task = sumPageSizesTask urls
        task.Result

    printfn $"pages size = {size1}, pages size = {size2}"


//-----------------------------------------------------
// Libraries like Giraffe can now use 'task' directly

open Giraffe
open Microsoft.AspNetCore.Http

let sayHelloNameHandler (name:string) =
    fun (next : HttpFunc) (ctx : HttpContext) ->
        task {
            let msg = sprintf "Hello, %s" name
            return! json msg next ctx
        }




