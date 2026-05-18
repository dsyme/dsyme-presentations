// ----------------------------------------------------------------------------
// Extensions for GUI (observable & web browser control)
// ----------------------------------------------------------------------------

namespace FSharp.Control 
  [<AutoOpen>]
  module Utils =
    open System

    let synchronize f = 
        let ctx = System.Threading.SynchronizationContext.Current 
        f (fun g arg ->
            let nctx = System.Threading.SynchronizationContext.Current 
            if ctx <> null && ctx <> nctx then ctx.Post((fun _ -> g(arg)), null)
            else g(arg) )

    type Microsoft.FSharp.Control.Async with 
        static member AwaitObservable(ev1:IObservable<'a>) =
            synchronize (fun f ->
                Async.FromContinuations((fun (cont,econt,ccont) -> 
                    let rec callback = (fun value ->
                        remover.Dispose()
                        f cont value )
                    and remover : IDisposable  = ev1.Subscribe(callback) 
                    () )))
  
        static member AwaitObservable(ev1:IObservable<'a>, ev2:IObservable<'b>) = 
            synchronize (fun f ->
                Async.FromContinuations((fun (cont,econt,ccont) -> 
                    let rec callback1 = (fun value ->
                        remover1.Dispose()
                        remover2.Dispose()
                        f cont (Choice1Of2(value)) )
                    and callback2 = (fun value ->
                        remover1.Dispose()
                        remover2.Dispose()
                        f cont (Choice2Of2(value)) )
                    and remover1 : IDisposable  = ev1.Subscribe(callback1) 
                    and remover2 : IDisposable  = ev2.Subscribe(callback2) 
                    () )))

  module Observable = 
    let guiSubscribe f obs = 
      let ctx = System.Threading.SynchronizationContext.Current
      if ctx = null then obs |> Observable.subscribe f
      else obs |> Observable.subscribe (fun v -> ctx.Post((fun _ -> f v), null))

namespace FSharp.WebBrowser 
  open System.Windows.Forms

  type WebBrowserOutput(web:System.Windows.Forms.WebBrowser) = 
    member x.StartList() = 
      web.Navigate("about:blank")
      while web.ReadyState <> WebBrowserReadyState.Complete do
        Application.DoEvents()
      web.Document.Write(@"
        <html>
        <head><style type=""text/css"">
          * { padding:0px; margin:0px; }
          body { background:#c0d6e3; font-family:cambria; padding:10px; }
      	  li { list-style-type:none; background:white; padding:10px; margin:10px; }
        </style></head>
        <body>
          <ul></ul>
        </body></html>")
      while web.ReadyState <> WebBrowserReadyState.Interactive do
        Application.DoEvents()


    member x.StartList f = 
      Printf.kprintf (fun s ->
        web.Navigate("about:blank")
        while web.ReadyState <> WebBrowserReadyState.Complete do
          Application.DoEvents() 
        web.Document.Write(@"
          <html>
          <head><style type=""text/css"">
            * { padding:0px; margin:0px; }
            body { background:#c0d6e3; font-family:cambria; padding:10px; }
      	    li { list-style-type:none; background:white; padding:10px; margin:10px; }
          </style></head>
          <body>
            <h3>" + s + @"</h3>
            <ul></ul>
          </body></html>")
        while web.ReadyState <> WebBrowserReadyState.Interactive do
          Application.DoEvents() ) f

    member x.AddItem f = 
      Printf.kprintf (fun s ->
        let els = web.Document.Body.GetElementsByTagName("UL")
        if els.Count > 0 then
          let el = els.[0]
          Application.DoEvents()
          el.InnerHtml <- "<li>" + s + "</li>" + el.InnerHtml
          Application.DoEvents() ) f

  [<AutoOpen>]
  module WebBrowserExtensions =
    type System.Windows.Forms.WebBrowser with
      member x.Output = WebBrowserOutput(x)