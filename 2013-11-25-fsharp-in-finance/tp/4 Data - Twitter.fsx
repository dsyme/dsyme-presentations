#r "lib/FSharp.Data.dll"
#r "lib/Twitter.API.dll"
#load "lib/GuiExtensions.fs"

open System
open System.Threading
open System.Windows.Forms
open System.Collections.Generic

open FSharp.Data
open FSharp.Control
open FSharp.WebBrowser
open FSharp.TwitterAPI

// ----------------------------------------------------------------------------
// Create user interface and connect to Twitter
// ----------------------------------------------------------------------------

let web = WebBrowser.Create()
let key = "CoqmPIJ553Tuwe2eQgfKA"
let secret = "dhaad3d7DreAFBPawEIbzesS1F232FnDsuWWwRTUg"
let connector = Twitter.Authenticate(key, secret, web.Navigate)

// NOTE: Run all code up to this point. A window should appear. You can then
// login to twitter and you'll get a pin code that you need to copy and
// paste as an argument to the 'Connect' method below:
let twitter = connector.Connect("3652559")

//----------------------------------------------------------------------------
// Requesting RAW data - Use JSON provider to wrap these nicely!
// ----------------------------------------------------------------------------

//
// Suggested users
//  * https://dev.twitter.com/docs/api/1.1/get/users/suggestions
//
let suggestionsRawJson = Twitter.RequestRawData(twitter, "https://api.twitter.com/1.1/users/suggestions.json")

//
// TODO:
//
//  * Get a sample response using the above script
//  * Use a type provider to generate type:
//      type MyType = JsonProvider<"filename.json">
//  * Use the generated type to parse & read the data
//      MyType.Parse can parse the downloaded result string
//


type MyType = JsonProvider<"""[{"size":127,"slug":"nba","name":"NBA"},{"size":201,"slug":"television","name":"Television"},{"size":47,"slug":"travel","name":"Travel"},{"size":63,"slug":"fashion","name":"Fashion"},{"size":62,"slug":"nhl","name":"NHL"},{"size":19,"slug":"billboard-music-awards","name":"Billboard Music Awards"},{"size":48,"slug":"health","name":"Health"},{"size":107,"slug":"music","name":"Music"},{"size":51,"slug":"science","name":"Science"},{"size":59,"slug":"us-election-2012","name":"US Election 2012"},{"size":20,"slug":"cmt-awards","name":"CMT Awards"},{"size":94,"slug":"staff-picks","name":"Staff Picks"},{"size":71,"slug":"art-design","name":"Art & Design"},{"size":63,"slug":"books","name":"Books"},{"size":59,"slug":"charity","name":"Charity"},{"size":98,"slug":"nascar","name":"NASCAR"},{"size":75,"slug":"faith-and-religion","name":"Faith and Religion"},{"size":39,"slug":"family","name":"Family"},{"size":67,"slug":"food-drink","name":"Food & Drink"},{"size":64,"slug":"funny","name":"Funny"},{"size":100,"slug":"mlb","name":"MLB"},{"size":78,"slug":"sports","name":"Sports"},{"size":56,"slug":"technology","name":"Technology"},{"size":49,"slug":"business","name":"Business"},{"size":79,"slug":"entertainment","name":"Entertainment"},{"size":19,"slug":"mtv-movie-awards","name":"MTV Movie Awards"},{"size":127,"slug":"pga","name":"PGA"},{"size":51,"slug":"twitter","name":"Twitter"},{"size":32,"slug":"government","name":"Government"},{"size":56,"slug":"news","name":"News"}]""">



let suggestions = MyType.Parse(suggestionsRawJson)

for x in suggestions do 
  x.

// 
// Trends for a given place
//  * https://dev.twitter.com/docs/api/1.1/get/trends/place
//
let trendsRawData = Twitter.RequestRawData(twitter, "https://api.twitter.com/1.1/trends/place.json", ["id", "1"])

type Trends = JsonProvider<"""[{"trends":[{"name":"#thingsihatemost","url":"http://twitter.com/search?q=%23thingsihatemost","promoted_content":null,"query":"%23thingsihatemost","events":null},{"name":"#ert","url":"http://twitter.com/search?q=%23ert","promoted_content":null,"query":"%23ert","events":null},{"name":"#masterchef10","url":"http://twitter.com/search?q=%23masterchef10","promoted_content":null,"query":"%23masterchef10","events":null},{"name":"#BieberComeBackToVenezuela","url":"http://twitter.com/search?q=%23BieberComeBackToVenezuela","promoted_content":null,"query":"%23BieberComeBackToVenezuela","events":null},{"name":"#DEMIWentPlatinumInBrazil","url":"http://twitter.com/search?q=%23DEMIWentPlatinumInBrazil","promoted_content":null,"query":"%23DEMIWentPlatinumInBrazil","events":null},{"name":"Colombia 2-0 Per\u00fa","url":"http://twitter.com/search?q=%22Colombia+2-0+Per%C3%BA%22","promoted_content":null,"query":"%22Colombia+2-0+Per%C3%BA%22","events":null},{"name":"MilletTekY\u00fcrek PolisininYan\u0131nda","url":"http://twitter.com/search?q=%22MilletTekY%C3%BCrek+PolisininYan%C4%B1nda%22","promoted_content":null,"query":"%22MilletTekY%C3%BCrek+PolisininYan%C4%B1nda%22","events":null},{"name":"Ivy Queen","url":"http://twitter.com/search?q=%22Ivy+Queen%22","promoted_content":null,"query":"%22Ivy+Queen%22","events":null},{"name":"Pocholo","url":"http://twitter.com/search?q=Pocholo","promoted_content":null,"query":"Pocholo","events":null},{"name":"\u0395\u03a1\u03a4","url":"http://twitter.com/search?q=%CE%95%CE%A1%CE%A4","promoted_content":null,"query":"%CE%95%CE%A1%CE%A4","events":null}],"as_of":"2013-06-11T21:47:13Z","created_at":"2013-06-11T21:41:58Z","locations":[{"name":"Worldwide","woeid":1}]}]""">

let trends = Trends.Parse trendsRawData

web.Output.StartList()

for item in trends do
  for trend in item.Trends do
     web.Output.AddItem "<strong>%s</strong>: %s" trend.Name trend.Url




// ----------------------------------------------------------------------------
// Using Twitter APIs (Using nice wrappers created with JSON type provider)
// ----------------------------------------------------------------------------

// Download the current home timeline
web.Output.StartList()

let home = Twitter.Timelines.HomeTimeline(twitter)
for item in home do
  web.Output.AddItem "<strong>%s</strong>: %s" item.User.Name item.Text
 

// Display stream with live data
web.Output.StartList()

let sample = Twitter.Streaming.SampleTweets(twitter)
sample.TweetReceived |> Observable.guiSubscribe (fun status ->
    match status.Text, status.User with
    | Some text, Some user ->
        web.Output.AddItem "<strong>%s</strong>: %s" user.Name text
    | _ -> ()  )
sample.Start()
sample.Stop()

// Display live search data 
web.Output.StartList()

let search = Twitter.Streaming.FilterTweets(twitter, ["boston"])
search.TweetReceived |> Observable.guiSubscribe (fun status ->
    match status.Text, status.User with
    | Some text, Some user ->
        web.Output.AddItem "<strong>%s</strong>: %s" user.Name text
    | _ -> ()  )
search.Start()
search.Stop()

// Get a list of friends (followed people) and followers
let friends = Twitter.Followers.FriendsIds(twitter)
let followers = Twitter.Followers.FollowerIds(twitter)
friends.Ids |> Seq.length
followers.Ids |> Seq.length

// Get details about firends (up to 100)
let friendInfos = Twitter.Users.Lookup(twitter, friends.Ids |> Seq.take 100)
for friend in friendInfos do
  printfn "%s (@%s)\t\t%d" friend.Name friend.ScreenName friend.Id

// Get friends list for a specified user (@dsyme)
let friends2 = Twitter.Followers.FriendsIds(twitter, userId=25663453L)
friends2.Ids |> Seq.length

// Get information about connections between @dsyme and @tomaspetricek
let fs = Twitter.Friendships.Show(twitter, 25663453L, 18388966L)
fs.Relationship.Source.ScreenName
fs.Relationship.Target.ScreenName

// Search recent tweets with the #fsharp tag
let fsharp = Twitter.Search.Tweets(twitter, "fsharp", count=100)
for status in fsharp.Statuses do
  printfn "@%s: %s" status.User.ScreenName status.Text

