#r "System.Xml.Linq.dll"
#r "lib/FSharp.Data.dll"
#load "lib/FSharpChart.fsx"
#load "lib/GuiExtensions.fs"

open System
open FSharp.Net
open FSharp.Data
open FSharp.WebBrowser
open Samples.FSharp.Charting

// ------------------------------------------------------------------
// Using Http.Request to download data
// ------------------------------------------------------------------

// Downloading RSS feed
let rss = Http.Request("http://feeds.bbci.co.uk/news/rss.xml?edition=uk")

// Making REST request to The Movie Database
// See the documentation at: http://docs.themoviedb.apiary.io
// For example, to get second page, add ("page", 2) to query 
let key = "6ce0ef5b176501f8c07c634dfa933cff"
let data = 
  Http.Request
    ( "http://api.themoviedb.org/3/search/movie",
      query = [ ("query", "star wars"); ("api_key", key) ],
      headers = ["accept", "application/json"] )


// ------------------------------------------------------------------
// Parsing XML data 
// ------------------------------------------------------------------

// We use a simple utility for showing nice lists
showList
    [ "<strong>Hi</strong> We can show nice HTML here!"
      "<strong>Hello</strong> list of two strings" ]

// DEMO: Infer type from a local sample file, then load
// the same file and print information from the file
type Writers = XmlProvider<"data\\Writers.xml">
let writers = Writers.Load("data\\Writers.xml") 

// Print in F# interactive
showList [ for author in writers.GetAuthors() -> author.Name ]

// Display as a nice list
[ for author in writers.GetAuthors() do
    let born = defaultArg author.Born -1
    yield sprintf "<strong>%s</strong> (%A)" author.Name born ]
|> showList

// TODO: Try changing the content in the XML file and see how this
// affects the type inference (e.g. change values of primitive types,
// add nested elements etc.)
//
// Note, sometimes VS does not automatically update the type - you can
// close & reopen the FSX file to force the update

// TASK: Use the following URL as a schema for type inference:
//    http://feeds.bbci.co.uk/news/rss.xml?edition=uk
// And then load the RSS feed from the following URL and print the data:
//    http://feeds.bbci.co.uk/news/science_and_environment/rss.xml?edition=uk


// ------------------------------------------------------------------
// Parsing CSV data
// ------------------------------------------------------------------

// Loading CSV 
type Stocks = CsvProvider<"data/MSFT.csv">
let msft = Stocks.Load("http://ichart.finance.yahoo.com/table.csv?s=MSFT")

[ for value in msft.Data do
    if value.Date > DateTime.Now.AddDays(-60.0) then
      yield value.Date, value.Close ]
|> Chart.Line

// Loading moratlity information from the NY state
// You need to add the 'IgnoreErrors=true' parameter so 
// that the provider skips wrong lines at the end of file

// Load: data\\MortalityNY.tsv
// Add: IgnoreErrors=true

// TASK: What are the most common causes of death?
// (Seq.maxBy might be useful :-))

// TASK: Draw a pie chart with number of deaths per county?
// (Could be done using Seq.groupBy)


// ------------------------------------------------------------------
// Parsing JSON data from a REST response
// ------------------------------------------------------------------

// DEMO: Infer type & load data from a twitter stream
// (Use a list of tweets as an example)
type Tweet = JsonProvider<"data\TwitterStream.json", SampleList=true>

// Parse a single tweet and print information from it
let text = """ {"in_reply_to_status_id_str":null,"text":"\u5927\u91d1\u6255\u3063\u3066\u904a\u3070\u3057\u3066\u3082\u3089\u3046\u3002\u3082\u3046\u3053\u306e\u4e0a\u306a\u3044\u8d05\u6ca2\u3002\u3067\u3082\uff0c\u5b9f\u969b\u306b\u306f\u305d\u306e\u8d05\u6ca2\u306e\u672c\u8cea\u3092\u6e80\u55ab\u3067\u304d\u308b\u4eba\u306f\u9650\u3089\u308c\u3066\u308b\u3002\u305d\u3053\u306b\u76ee\u306b\u898b\u3048\u306a\u3044\u968e\u5c64\u304c\u3042\u308b\u3068\u304a\u3082\u3046\u3002","in_reply_to_user_id_str":null,"retweet_count":0,"geo":null,"source":"web","retweeted":false,"truncated":false,"id_str":"263290764686155776","entities":{"user_mentions":[],"hashtags":[],"urls":[]},"in_reply_to_user_id":null,"in_reply_to_status_id":null,"place":null,"coordinates":null,"in_reply_to_screen_name":null,"created_at":"Tue Oct 30 14:46:24 +0000 2012","user":{"notifications":null,"contributors_enabled":false,"time_zone":"Tokyo","profile_background_color":"FFFFFF","location":"Kodaira Tokyo Japan","profile_background_tile":false,"profile_image_url_https":"https:\/\/si0.twimg.com\/profile_images\/1172376796\/70768_100000537851636_3599485_q_normal.jpg","default_profile_image":false,"follow_request_sent":null,"profile_sidebar_fill_color":"17451B","description":"KS(Green62)\/WasedaUniv.(Schl Adv Sci\/Eng)\/SynBio\/ChronoBio\/iGEM2010-2012\/Travel\/Airplane\/ \u5bfa\u30fb\u5ead\u3081\u3050\u308a","favourites_count":17,"screen_name":"Merlin_wand","profile_sidebar_border_color":"000000","id_str":"94788486","verified":false,"lang":"ja","statuses_count":8641,"profile_use_background_image":true,"protected":false,"profile_image_url":"http:\/\/a0.twimg.com\/profile_images\/1172376796\/70768_100000537851636_3599485_q_normal.jpg","listed_count":31,"geo_enabled":true,"created_at":"Sat Dec 05 13:07:32 +0000 2009","profile_text_color":"000000","name":"Marin","profile_background_image_url":"http:\/\/a0.twimg.com\/profile_background_images\/612807391\/twitter_free1.br.jpg","friends_count":629,"url":null,"id":94788486,"is_translator":false,"default_profile":false,"following":null,"profile_background_image_url_https":"https:\/\/si0.twimg.com\/profile_background_images\/612807391\/twitter_free1.br.jpg","utc_offset":32400,"profile_link_color":"ADADAD","followers_count":426},"id":263290764686155776,"contributors":null,"favorited":false} """
let tweet = Tweet.Parse(text)
printfn "%s (retweeted %d times)\n:%s"
  tweet.User.Value.Name tweet.RetweetCount.Value tweet.Text.Value


// TASK: Use 'data\\moviesearch.json' as a template (this is not 
// a list of samples, so you won't need 'SampleList=true')
// And then use it to parse the data from MovieDatabase that we
// obtained earlier using Http.Request


// ------------------------------------------------------------------
// Accessing WorldBank data
// ------------------------------------------------------------------

let wb = WorldBankData.GetDataContext()

let countries =
  [ wb.Countries.``United Kingdom``
    wb.Countries.``United States`` ]

// DEMO: Compare central government debt for different countries
Chart.Combine
  [ for country in countries do
      let data = country.Indicators.``Central government debt, total (% of GDP)``
      yield Chart.Line(data, Name=country.Name) ]

// TASK: Compare life expectancy for males & females 
// in various countries around the world.


// ------------------------------------------------------------------
// Accessing Freebase data 
// ------------------------------------------------------------------

let fb = FreebaseData.GetDataContext()

// Here, we can use the new F# 3.0 query functionality (more later!)
// DEMO: Search for stars with known distance from earth

let astronomy = fb.``Science and Technology``.Astronomy

query { for e in astronomy.Stars do 
        where e.Distance.HasValue
        select (e.Name, e.Distance) } 
      |> Seq.toList
