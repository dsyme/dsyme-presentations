//-----------------------------------------------------------------------------
// A script utility which enables the use WPF within F# Interactive (fsi.exe)
//-----------------------------------------------------------------------------

#r "PresentationCore.dll"
#r "PresentationFramework.dll"
#r "WindowsBase.dll"
#r "System.Xaml.dll"

open System.Windows
open System.Windows.Threading

#if INTERACTIVE
fsi.EventLoop <-  
    let app  = 
        match Application.Current with 
        | null -> let app = new Application()  in new Window() |> ignore; app
        | app -> app

    app.DispatcherUnhandledException.Add(fun args -> 
        eprintfn ""
        eprintfn "Error in WPF Event Handler: %O" args.Exception
        eprintfn ""
        args.Handled <- true )

    { new Microsoft.FSharp.Compiler.Interactive.IEventLoop with
         member x.Run() = app.Run() |> ignore; false
         member x.Invoke f = 
             try app.Dispatcher.Invoke(DispatcherPriority.Send,System.Func<obj>(f >> box)) |> unbox
             with e -> eprintf "\n\n ERROR: %O\n" e; reraise()
         member x.ScheduleRestart() =   () }

#endif
