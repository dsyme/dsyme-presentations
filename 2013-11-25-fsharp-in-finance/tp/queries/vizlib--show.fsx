

[<AutoOpen>]
module ShowWpf

#load "vizlib--load-wpf.fsx"

open System.Reflection
open System.ComponentModel
open System
open System.Windows
open System.Windows.Input
open System.Windows.Controls
open System.Windows.Data
open System.Windows.Media
open System.Windows.Media.Imaging
open System.Windows.Documents

let quotes = 
    [| "F# - The Language For Big, Big Data!"; 
       "Learn about F# at www.fsharp.net"; 
       "F# - Simple Code for Complex Problems" |]

let quote = quotes.[Random(DateTime.Now.Second).Next(quotes.Length)] 


let win = Window(Title="Data Grid", Content=quote, Topmost=true, Height=500.0, Width=500.0)
win.WindowStartupLocation <- WindowStartupLocation.Manual
win.Left <- 700.0
win.Top <- 50.0
win.Show()

win.FontSize <- 22.0
win.FontFamily <- FontFamily "Calibri"
win.FontWeight <- FontWeights.Bold
win.Foreground <- Brushes.DarkBlue

let mutable ct = new System.Threading.CancellationTokenSource()
let cancelPrevious() = ct.Cancel(); ct <- new System.Threading.CancellationTokenSource(); ct.Token

module Seq = 
    let toObservableCollection (ct: System.Threading.CancellationToken) (s:seq<'T>) = 
        let ctxt = System.Threading.SynchronizationContext.Current
        if ctxt = null then invalidOp "This function may only be called from a thread where SynchronizationContext.Current is not null"
        let oc = new System.Collections.ObjectModel.ObservableCollection<'T>()
        let work = async { for x in s do ctxt.Post((fun _ -> oc.Add x),null) } 
        Async.Start(work,ct)
        oc

let propsOfObj (sampleObj:obj) = 
    [ match sampleObj with 
      | :? string | :? int | :? double  | :? single -> 
         yield "", sampleObj.GetType(), id
      | _ -> 
      match sampleObj with 
      | :? System.ComponentModel.ICustomTypeDescriptor as t -> 
          for p in t.GetProperties()  do 
              yield p.Name, p.PropertyType, p.GetValue
      | _ -> ()
      for p in sampleObj.GetType().GetProperties() do 
          if p.GetIndexParameters().Length = 0 then 
              yield p.Name, p.PropertyType, (fun obj -> p.GetValue(obj,null)) ]

let convertPropertyOfObjToText (propValue:obj) = 
    match propValue with 
    | null -> ""
    | :? seq<string> as s -> s |> Seq.toList |> string
    | :? System.String as s -> s
    | :? System.Collections.IEnumerable as e -> "..."
(*
        let e = Seq.cast<obj> e |> Seq.toList
        match e with 
        | [] -> ""
        | _ -> sprintf "%60A" e
*)
    | _ -> 
        let text = sprintf "%60A" propValue
        // TODO: find out why this is coming through
        if text.Contains "{DataGrid.NewItem" then "" else
        text

let probeObj (obj:obj) = 
    propsOfObj obj |> List.iter (fun (_,_,getter) -> try getter obj |> convertPropertyOfObjToText |> ignore with _ -> ()) 
    obj

let showGrid (obj: obj) = 

    win.Content <- 
        match obj with 
        | :? string -> obj
        | :? System.Collections.IEnumerable as seq -> 
            let dg = System.Windows.Controls.DataGrid(AutoGenerateColumns=true,HorizontalScrollBarVisibility=ScrollBarVisibility.Auto,VerticalScrollBarVisibility=ScrollBarVisibility.Auto)
            begin 
                let e = seq.GetEnumerator()
                use _e = (e :?> System.IDisposable)
                if e.MoveNext() then 
                    let sampleObj = e.Current
                    match sampleObj with 
                    | null -> ()
                    |  _ -> 
                        let props = propsOfObj sampleObj
                        let props = 
                            props |> List.sortBy (fun (propName,propType,_propGetter) -> 
                                match propName with 
                                | "Name" -> (0,"") 
                                | "MainImage" -> (1,"") 
                                | _ -> (2,propName))

                        for propertyName,propType,_propGetter in props do 
                             match propertyName with 
                             | "MainImage" -> 
                                let img = FrameworkElementFactory(typeof<Image>)
                                img.SetValue(Image.MaxWidthProperty, 250.0)
                                img.SetValue(Image.MaxHeightProperty, 120.0)
                                img.SetValue(Image.StretchProperty, Stretch.Uniform)
                                img.SetBinding(Image.SourceProperty, Binding propertyName)
                                let cellTemplate = DataTemplate(VisualTree=img)
                           
                                let templateColumn = System.Windows.Controls.DataGridTemplateColumn(Header=propertyName,CellTemplate=cellTemplate,CanUserResize=true,CanUserReorder=true,CanUserSort=false)
                                dg.Columns.Add templateColumn
                             | _ -> 
                                 ()
                                 let canSort = typeof<System.IComparable>.IsAssignableFrom(propType)
                                 let b = Binding(propertyName)
                                 b.Converter <- 
                                     { new IValueConverter with 
                                          member x.Convert(obj,ty,param,culture) = convertPropertyOfObjToText obj |> box
                                          member x.ConvertBack(obj,ty,param,culture) = Binding.DoNothing } 
                                 let c = DataGridTextColumn(Header=propertyName,Binding=b,MaxWidth=200.0,CanUserResize=true,CanUserReorder=true,CanUserSort=canSort)
                                 dg.Columns.Add c

            end
            let ct = cancelPrevious()
            dg.ItemsSource <- seq |> Seq.cast |> Seq.truncate 50 |> Seq.map probeObj |> Seq.toObservableCollection ct
            box dg
        | _ -> 
            obj

let show x = 
    let viewer = ScrollViewer()
    let x = 
        match box x with 
        | :? System.Collections.IEnumerable as e -> e |> Seq.cast |> Seq.truncate 100 |> Seq.toList |> box
        | _ -> x
    let s = sprintf "%40A" x
    viewer.Content <- TextBlock(Text=s , Margin= Thickness(0.0,0.0,0.0,0.0) )
    win.Content <- viewer
    
let teeGrid x = showGrid x; x
