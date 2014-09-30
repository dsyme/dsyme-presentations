$(document).ready(function () {


Boolean.prototype.CompareTo = function(that) {
   return this - that;
};

Number.prototype.CompareTo = function(that) {
   return this - that;
};

String.prototype.CompareTo = function(that) {
   return this > that
      ? 1
      : this < that
         ? -1
         : 0;
};

Array.prototype.CompareTo = function(that) {
   var i = 0;
   while(i < this.length && i < that.length) {
      var diff = this[i].CompareTo(that[i]);
      if(diff != 0) {
         return diff;
      }
      i = i + 1;
   };
   return this.length - that.length;
};

var list_1_Nil, list_1_Cons, i_UnfoldEnumerator_2__ctor, i_OperationArguments__ctor, i_CreateEnumerable_1__ctor, i_CancellationToken__ctor, i_AsyncParams_1__ctor, i_AsyncParamsAux__ctor, i_AsyncBuilder__ctor, i_ApiaryJsContext__ctor, Utils_newXMLHttpRequest, Utils_encodeURIComponent, Utils_emptyIfNull, String_splitSingle, String_replaceSingle, String_ToLowerCase, String_Split, String_Replace, String_Join, String_IsNullOrEmpty, String_IndexOf, Seq_Unfold, Seq_TryPickIndexedAux, Seq_TryPickIndexed, Seq_TryFind, Seq_ToArray, Seq_Take, Seq_OfArray, Seq_Map2, Seq_Length, Seq_IterateIndexed, Seq_FromFactory, Seq_FoldIndexedAux, Seq_FoldIndexed, Seq_Fold, Seq_Enumerator, Seq_Delay, Seq_CompareWith, Runtime_setContext, Runtime_getContext, Program_op_Dynamic, Program_main, Program_jQuery, Program_Object_asJQuery, List_ToArray, List_Length, List_IterateIndexed, List_FoldIndexedAux, List_FoldIndexed, List_Fold, List_Empty, List_CreateCons, LanguagePrimitives_UnboxGeneric, JsRuntime_Parse, JsRuntime_Identity2, JsRuntime_Identity, JsRuntime_GetProperty, JsRuntime_ConvertArray, FSharpString_Concat, Async_setTimeout, Async_protectedCont, Async_invokeCont, Async_get_async, Async_StartImmediate, Async_FromContinuations, Async_1_Cont, Array_ZeroCreate, Array_SortInPlaceWith, Array_SortInPlaceBy, Array_SortBy, Array_MapIndexed, Array_Map, Array_Length, Array_Iterate, Array_FoldIndexed, Array_Fold, Array_Copy, Array_ConcatImpl, Array_Concat, Array_Choose, Array_BoxedLength, Array_Append, ApiaryJsRuntime_ProcessParameters, ApiaryJsRuntime_ParseHeaders, ApiaryJsRuntime_AsyncMap, ApiaryJsRuntime_AsyncInvokeOperation, ApiaryJsRuntime_AddQueryParam;
  ApiaryJsRuntime_AddQueryParam = (function (x, key, value)
  {
    x.GlobalQuery = Array_Append(x.GlobalQuery, [{CompareTo: (function (that)
    {
      var diff;
      return 0.000000;
    }), Item1: key, Item2: value}]);
  });
  ApiaryJsRuntime_AsyncInvokeOperation = (function (x, _arg1)
  {
    var query = _arg1.Query;
    var path = _arg1.Path;
    var meth = _arg1.Method;
    var headers = _arg1.Headers;
    var args = _arg1.Arguments;
    return Async_FromContinuations((function (tupledArg)
    {
      var cont = tupledArg.Item1;
      var econt = tupledArg.Item2;
      var ccont = tupledArg.Item3;
      var allArguments = Array_Append(x.GlobalArguments, args);
      var _temp32;
      var _temp33;
      var folder = (function (_path)
      {
        return (function (_tupledArg)
        {
          var key = _tupledArg.Item1;
          var value = _tupledArg.Item2;
          return String_Replace(_path, key, value);
        });
      });
      _temp33 = (function (source)
      {
        return Seq_Fold(folder, path, Seq_OfArray(source));
      });
      _temp32 = _temp33(allArguments);
      var _path = _temp32;
      var allheaders = Array_Append(headers, x.GlobalHeaders);
      var allquery = Array_Append(query, x.GlobalQuery);
      if ((String_ToLowerCase(meth).CompareTo("get") == 0.000000)) 
      {
        var url = (x.Root + _path);
        var _temp38;
        var _temp39;
        var sep = "\u0026";
        _temp39 = (function (strings)
        {
          return FSharpString_Concat(sep, Seq_OfArray(strings));
        });
        var _temp41;
        var _temp42;
        var mapping = (function (_tupledArg)
        {
          var k = _tupledArg.Item1;
          var v = _tupledArg.Item2;
          return ((k + "=") + Utils_encodeURIComponent(v));
        });
        _temp42 = (function (array)
        {
          return Array_Map(mapping, array);
        });
        _temp41 = _temp42(allquery);
        _temp38 = _temp39(_temp41);
        var queryString = _temp38;
        var xhr = Utils_newXMLHttpRequest();
        xhr.open("GET", ((url + "?") + queryString));
        var _temp44;
        var action = (function (_tupledArg)
        {
          var header = _tupledArg.Item1;
          var value = _tupledArg.Item2;
          return xhr.setRequestHeader(header, value);
        });
        _temp44 = (function (array)
        {
          return Array_Iterate(action, array);
        });
        _temp44(allheaders);
        xhr.set_onreadystatechange((function (unitVar0)
        {
          if ((xhr.get_readyState().CompareTo(4.000000) == 0.000000)) 
          {
            var source = xhr.get_responseText();
            var doc = JsRuntime_Parse(source, {Tag: "None"});
            Runtime_setContext(doc, (new i_ApiaryJsContext__ctor(x.Root, x.GlobalQuery, x.GlobalHeaders, allArguments)));
            return cont(doc);
          }
          else
          {
            ;
          };
        }));
        return xhr.send("");
      }
      else
      {
        throw ("Only GET supported");
        return null;
      };
    }));
  });
  ApiaryJsRuntime_AsyncMap = (function (work, f)
  {
    return (function (builder_)
    {
      return builder_.Delay((function (unitVar)
      {
        return builder_.Bind(work, (function (_arg2)
        {
          var v = _arg2;
          return builder_.Return(f(v));
        }));
      }));
    })(Async_get_async());
  });
  ApiaryJsRuntime_ParseHeaders = (function (headers)
  {
    var _temp28;
    var chooser = (function (h)
    {
      if (String_IsNullOrEmpty(h)) 
      {
        return {Tag: "None"};
      }
      else
      {
        var arr = String_Split(h, [":"]);
        if ((Array_BoxedLength(arr).CompareTo(2.000000) == 0.000000)) 
        {
          return {Tag: "Some", Value: {CompareTo: (function (that)
          {
            var diff;
            return 0.000000;
          }), Item1: arr[0.000000], Item2: arr[1.000000]}};
        }
        else
        {
          throw ("Wrong headers");
          return null;
        };
      };
    });
    _temp28 = (function (array)
    {
      return Array_Choose(chooser, array);
    });
    return _temp28(String_Split(headers, ["\n"]));
  });
  ApiaryJsRuntime_ProcessParameters = (function (reqHeaders, headers, query)
  {
    var _headers = Array_Append(ApiaryJsRuntime_ParseHeaders(reqHeaders), List_ToArray(Utils_emptyIfNull(headers)));
    var _query = Utils_emptyIfNull(query);
    return {CompareTo: (function (that)
    {
      var diff;
      return 0.000000;
    }), Item1: _headers, Item2: List_ToArray(_query)};
  });
  Array_Append = (function (xs, ys)
  {
    return xs.concat(ys);
  });
  Array_BoxedLength = (function (xs)
  {
    return xs.length;
  });
  Array_Choose = (function (f, xs)
  {
    var ys = Array_ZeroCreate(0.000000);
    var j = 0.000000;
    for (var i = 0.000000; i <= (Array_Length(xs) - 1.000000); i++)
    {
      var matchValue = f(xs[i]);
      if ((matchValue.Tag == "None")) 
      {
        ;
      }
      else
      {
        var y = matchValue.Value;
        ys[j] = y;
        null;
        j = (j + 1.000000);
        null;
      };
    };
    return ys;
  });
  Array_Concat = (function (xs)
  {
    return (function (xss)
    {
      return Array_ConcatImpl(xss);
    })((function (source)
    {
      return Seq_ToArray(source);
    })(xs));
  });
  Array_ConcatImpl = (function (xss)
  {
    return [].concat.apply([], xss);
  });
  Array_Copy = (function (xs)
  {
    return xs.slice(0);
  });
  Array_Fold = (function (f, seed, xs)
  {
    return Array_FoldIndexed((function (_arg1)
    {
      return (function (acc)
      {
        return (function (x)
        {
          return f(acc)(x);
        });
      });
    }), seed, xs);
  });
  Array_FoldIndexed = (function (f, seed, xs)
  {
    var acc = seed;
    for (var i = 0.000000; i <= (Array_Length(xs) - 1.000000); i++)
    {
      acc = f(i)(acc)(xs[i]);
      null;
    };
    return acc;
  });
  Array_Iterate = (function (f, xs)
  {
    var _temp43;
    return Array_Fold((function (unitVar0)
    {
      return (function (x)
      {
        return f(x);
      });
    }), _temp43, xs);
  });
  Array_Length = (function (xs)
  {
    return xs.length;
  });
  Array_Map = (function (f, xs)
  {
    return Array_MapIndexed((function (_arg1)
    {
      return (function (x)
      {
        return f(x);
      });
    }), xs);
  });
  Array_MapIndexed = (function (f, xs)
  {
    var ys = Array_ZeroCreate(Array_Length(xs));
    for (var i = 0.000000; i <= (Array_Length(xs) - 1.000000); i++)
    {
      ys[i] = f(i)(xs[i]);
      null;
    };
    return ys;
  });
  Array_SortBy = (function (f, xs)
  {
    var ys = Array_Copy(xs);
    Array_SortInPlaceBy(f, ys);
    return ys;
  });
  Array_SortInPlaceBy = (function (f, xs)
  {
    return Array_SortInPlaceWith((function (x)
    {
      return (function (y)
      {
        var _x = f(x);
        var _y = f(y);
        var __x = LanguagePrimitives_UnboxGeneric(_x);
        return __x.CompareTo(_y);
      });
    }), xs);
  });
  Array_SortInPlaceWith = (function (f, xs)
  {
    xs.sort(function(a,b) { return f(a)(b); });
  });
  Array_ZeroCreate = (function (size)
  {
    return new Array(size);
  });
  Async_1_Cont = (function (Item)
  {
    this.Tag = "Cont";
    this.Item = Item;
  });
  Async_FromContinuations = (function (f)
  {
    return (function (_f)
    {
      return Async_protectedCont(_f);
    })((function (k)
    {
      return f({CompareTo: (function (that)
      {
        var diff;
        return 0.000000;
      }), Item1: k.Cont, Item2: k.Aux.ExceptionCont, Item3: k.Aux.CancelledCont});
    }));
  });
  Async_StartImmediate = (function (workflow, cancellationToken)
  {
    var _temp83;
    if ((cancellationToken.Tag == "Some")) 
    {
      var v = cancellationToken.Value;
      _temp83 = v;
    }
    else
    {
      _temp83 = (new i_CancellationToken__ctor({Tag: "None"}));
    };
    var token = _temp83;
    var f = workflow.Item;
    var aux = (new i_AsyncParamsAux__ctor({contents: 0.000000}, (function (value)
    {
      ;
    }), (function (value)
    {
      ;
    }), token));
    return f((new i_AsyncParams_1__ctor((function (value)
    {
      ;
    }), aux)));
  });
  Async_get_async = (function ()
  {
    return (new i_AsyncBuilder__ctor());
  });
  Async_invokeCont = (function (k, value)
  {
    return k.Cont(value);
  });
  Async_protectedCont = (function (f)
  {
    return (new Async_1_Cont((function (args)
    {
      args.Aux.CancellationToken.ThrowIfCancellationRequested();
      args.Aux.StackCounter.contents = (args.Aux.StackCounter.contents + 1.000000);
      null;
      if ((args.Aux.StackCounter.contents.CompareTo(1000.000000) > 0.000000)) 
      {
        args.Aux.StackCounter.contents = 0.000000;
        null;
        return Async_setTimeout((function (unitVar0)
        {
          return f(args);
        }), 1.000000);
      }
      else
      {
        return f(args);
      };
    })));
  });
  Async_setTimeout = (function (handler, milliseconds)
  {
    return setTimeout(handler, milliseconds);
  });
  FSharpString_Concat = (function (sep, strings)
  {
    return String_Join(sep, Seq_ToArray(strings));
  });
  JsRuntime_ConvertArray = (function (value, packer, f)
  {
    return value;
  });
  JsRuntime_GetProperty = (function (json, name)
  {
    return json[name];
  });
  JsRuntime_Identity = (function (arg)
  {
    return arg;
  });
  JsRuntime_Identity2 = (function (arg, culture)
  {
    return arg;
  });
  JsRuntime_Parse = (function (source, culture)
  {
    var it = source; return (typeof(it)=="string") ? eval("(function(a){return a;})(" + it + ")") : it;
  });
  LanguagePrimitives_UnboxGeneric = (function (x)
  {
    return x;
  });
  List_CreateCons = (function (x, xs)
  {
    return (new list_1_Cons(x, xs));
  });
  List_Empty = (function ()
  {
    return (new list_1_Nil());
  });
  List_Fold = (function (f, seed, xs)
  {
    return List_FoldIndexed((function (_arg1)
    {
      return (function (acc)
      {
        return (function (x)
        {
          return f(acc)(x);
        });
      });
    }), seed, xs);
  });
  List_FoldIndexed = (function (f, seed, xs)
  {
    return List_FoldIndexedAux(f, 0.000000, seed, xs);
  });
  List_FoldIndexedAux = (function (f, i, acc, _arg1)
  {
    if ((_arg1.Tag == "Cons")) 
    {
      var xs = _arg1.Item2;
      var x = _arg1.Item1;
      return List_FoldIndexedAux(f, (i + 1.000000), f(i)(acc)(x), xs);
    }
    else
    {
      return acc;
    };
  });
  List_IterateIndexed = (function (f, xs)
  {
    var _temp29;
    return List_FoldIndexed((function (i)
    {
      return (function (unitVar1)
      {
        return (function (x)
        {
          return f(i)(x);
        });
      });
    }), _temp29, xs);
  });
  List_Length = (function (xs)
  {
    return List_Fold((function (acc)
    {
      return (function (_arg1)
      {
        return (acc + 1.000000);
      });
    }), 0.000000, xs);
  });
  List_ToArray = (function (xs)
  {
    var size = List_Length(xs);
    var ys = Array_ZeroCreate(size);
    List_IterateIndexed((function (i)
    {
      return (function (x)
      {
        ys[i] = x;
        return null;
      });
    }), xs);
    return ys;
  });
  Program_Object_asJQuery = (function (x)
  {
    var _temp81;
    var unitVar1 = _temp81;
    return x;
  });
  Program_jQuery = (function (command)
  {
    return jQuery(command);
  });
  Program_main = (function (unitVar0)
  {
    var _temp1;
    var var0 = "http://api.themoviedb.org";
    _temp1 = {Root: var0, GlobalQuery: [], GlobalHeaders: [], GlobalArguments: []};
    var db = _temp1;
    ApiaryJsRuntime_AddQueryParam(db, "api_key", "6ce0ef5b176501f8c07c634dfa933cff");
    var root = "http://cf2.imgobject.com/t/p/w92/";
    var showDetails = (function (id)
    {
      return (function (builder_)
      {
        return builder_.Delay((function (unitVar)
        {
          var _temp56;
          var _var0 = db;
          var var1 = id.toString();
          var var2 = null;
          var var3 = null;
          var _temp58;
          var _temp59;
          var patternInput = ApiaryJsRuntime_ProcessParameters("Accept:application/json", var3, var2);
          var query = patternInput.Item2;
          var headers = patternInput.Item1;
          _temp59 = {CompareTo: (function (that)
          {
            var diff;
            return 0.000000;
          }), Item1: _var0, Item2: (new i_OperationArguments__ctor("GET", "/3/movie/{id}", [{CompareTo: (function (that)
          {
            var diff;
            return 0.000000;
          }), Item1: "{id}", Item2: var1}], headers, query))};
          var _patternInput = _temp59;
          var args = _patternInput.Item2;
          var apiCtx = _patternInput.Item1;
          _temp58 = ApiaryJsRuntime_AsyncInvokeOperation(apiCtx, args);
          _temp56 = ApiaryJsRuntime_AsyncMap(_temp58, (function (doc)
          {
            return doc;
          }));
          return builder_.Bind(_temp56, (function (_arg1)
          {
            var movie = _arg1;
            var dlg = Program_op_Dynamic((function (command)
            {
              return Program_jQuery(command);
            }), "dialogOverview");
            (function (value)
            {
              ;
            })(dlg.text(JsRuntime_Identity(JsRuntime_Identity(JsRuntime_GetProperty(JsRuntime_Identity(movie), "overview")))));
            (function (value)
            {
              ;
            })(Program_op_Dynamic((function (command)
            {
              return Program_jQuery(command);
            }), "dialogTitle").text(JsRuntime_Identity(JsRuntime_Identity(JsRuntime_GetProperty(JsRuntime_Identity(movie), "title")))));
            (function (value)
            {
              ;
            })(Program_op_Dynamic((function (command)
            {
              return Program_jQuery(command);
            }), "dialogImage").attr("src", (root + JsRuntime_Identity(JsRuntime_Identity(JsRuntime_GetProperty(JsRuntime_Identity(movie), "poster_path"))))));
            var _temp63;
            var _var1 = null;
            var _var2 = null;
            var _temp65;
            var _temp66;
            var __patternInput = ApiaryJsRuntime_ProcessParameters("Accept:application/json", _var2, _var1);
            var _query = __patternInput.Item2;
            var _headers = __patternInput.Item1;
            var _apiCtx = Runtime_getContext(movie);
            _temp66 = {CompareTo: (function (that)
            {
              var diff;
              return 0.000000;
            }), Item1: _apiCtx, Item2: (new i_OperationArguments__ctor("GET", "/3/movie/{id}/casts", [], _headers, _query))};
            var ___patternInput = _temp66;
            var _args = ___patternInput.Item2;
            var __apiCtx = ___patternInput.Item1;
            _temp65 = ApiaryJsRuntime_AsyncInvokeOperation(__apiCtx, _args);
            _temp63 = ApiaryJsRuntime_AsyncMap(_temp65, (function (doc)
            {
              return doc;
            }));
            return builder_.Bind(_temp63, (function (_arg2)
            {
              var casts = _arg2;
              var _temp68;
              var _temp69;
              var projection = (function (c)
              {
                return JsRuntime_Identity2(JsRuntime_Identity(JsRuntime_GetProperty(JsRuntime_Identity(c), "order")), "");
              });
              _temp69 = (function (array)
              {
                return Array_SortBy(projection, array);
              });
              _temp68 = _temp69(JsRuntime_ConvertArray(JsRuntime_Identity(JsRuntime_GetProperty(JsRuntime_Identity(casts), "cast")), (function (t)
              {
                return t;
              }), (function (t)
              {
                return t;
              })));
              var sorted = _temp68;
              var _temp72;
              if ((Array_BoxedLength(sorted).CompareTo(10.000000) <= 0.000000)) 
              {
                _temp72 = (function (source)
                {
                  return Seq_OfArray(source);
                })(sorted);
              }
              else
              {
                var _temp73;
                var count = 10.000000;
                _temp73 = (function (source)
                {
                  return Seq_Take(count, source);
                });
                _temp72 = _temp73((function (source)
                {
                  return Seq_OfArray(source);
                })(sorted));
              };
              var _sorted = _temp72;
              (function (value)
              {
                ;
              })(Program_op_Dynamic((function (command)
              {
                return Program_jQuery(command);
              }), "dialogCast").html(""));
              return builder_.For(Seq_OfArray(JsRuntime_ConvertArray(JsRuntime_Identity(JsRuntime_GetProperty(JsRuntime_Identity(casts), "cast")), (function (t)
              {
                return t;
              }), (function (t)
              {
                return t;
              }))), (function (_arg3)
              {
                var cast = _arg3;
                var html = (((("\u003cstrong\u003e" + JsRuntime_Identity(JsRuntime_Identity(JsRuntime_GetProperty(JsRuntime_Identity(cast), "name")))) + "\u003c/strong\u003e (") + JsRuntime_Identity(JsRuntime_Identity(JsRuntime_GetProperty(JsRuntime_Identity(cast), "character")))) + ")");
                var li = Program_jQuery("\u003cli\u003e");
                (function (value)
                {
                  ;
                })(li.html(html));
                (function (value)
                {
                  ;
                })(li.appendTo(Program_op_Dynamic((function (command)
                {
                  return Program_jQuery(command);
                }), "dialogCast")));
                return builder_.Zero();
              }));
            }));
          }));
        }));
      })(Async_get_async());
    });
    var search = (function (term)
    {
      return (function (builder_)
      {
        return builder_.Delay((function (unitVar)
        {
          var _temp77;
          var _var0 = db;
          var var1 = List_CreateCons({CompareTo: (function (that)
          {
            var diff;
            return 0.000000;
          }), Item1: "query", Item2: term}, List_Empty());
          var var2 = null;
          var _temp79;
          var _temp80;
          var patternInput = ApiaryJsRuntime_ProcessParameters("Accept:application/json", var2, var1);
          var query = patternInput.Item2;
          var headers = patternInput.Item1;
          _temp80 = {CompareTo: (function (that)
          {
            var diff;
            return 0.000000;
          }), Item1: _var0, Item2: (new i_OperationArguments__ctor("GET", "/3/search/movie", [], headers, query))};
          var _patternInput = _temp80;
          var args = _patternInput.Item2;
          var apiCtx = _patternInput.Item1;
          _temp79 = ApiaryJsRuntime_AsyncInvokeOperation(apiCtx, args);
          _temp77 = ApiaryJsRuntime_AsyncMap(_temp79, (function (doc)
          {
            return doc;
          }));
          return builder_.Bind(_temp77, (function (_arg4)
          {
            var res = _arg4;
            var results = Program_op_Dynamic((function (command)
            {
              return Program_jQuery(command);
            }), "results");
            (function (value)
            {
              ;
            })(results.html(""));
            return builder_.For(Seq_OfArray(JsRuntime_ConvertArray(JsRuntime_Identity(JsRuntime_GetProperty(JsRuntime_Identity(res), "results")), (function (t)
            {
              return t;
            }), (function (t)
            {
              return t;
            }))), (function (_arg5)
            {
              var item = _arg5;
              var link = Program_Object_asJQuery(Program_Object_asJQuery(Program_Object_asJQuery(Program_Object_asJQuery(Program_jQuery("\u003ca\u003e").attr("data-toggle", "modal")).attr("href", "#detailsDialog")).text(JsRuntime_Identity(JsRuntime_Identity(JsRuntime_GetProperty(JsRuntime_Identity(item), "title"))))).click((function (_arg1)
              {
                return (function (arg00)
                {
                  return Async_StartImmediate(arg00, {Tag: "None"});
                })(showDetails(JsRuntime_Identity2(JsRuntime_Identity(JsRuntime_GetProperty(JsRuntime_Identity(item), "id")), "")));
              })));
              var details = Program_jQuery("\u003cul\u003e");
              (function (value)
              {
                ;
              })(Program_Object_asJQuery(Program_jQuery("\u003cli\u003e").html(("\u003cstrong\u003eReleased:\u003c/strong\u003e " + JsRuntime_GetProperty(JsRuntime_Identity(item), "release_date").toString()))).appendTo(details));
              var _temp99;
              var _temp107;
              var _temp111;
              var _temp113;
              var _temp114;
              var copyOfStruct = JsRuntime_Identity2(JsRuntime_Identity(JsRuntime_GetProperty(JsRuntime_Identity(item), "vote_average")), "");
              _temp114 = copyOfStruct.toString();
              _temp113 = ("\u003cstrong\u003eAverage vote:\u003c/strong\u003e " + _temp114);
              _temp111 = Program_jQuery("\u003cli\u003e").html(_temp113);
              _temp107 = Program_Object_asJQuery(_temp111);
              _temp99 = _temp107.appendTo(details);
              (function (value)
              {
                ;
              })(_temp99);
              var _temp130;
              var _temp138;
              var _temp142;
              var _temp144;
              var _temp145;
              var _copyOfStruct = JsRuntime_Identity2(JsRuntime_Identity(JsRuntime_GetProperty(JsRuntime_Identity(item), "popularity")), "");
              _temp145 = _copyOfStruct.toString();
              _temp144 = ("\u003cstrong\u003ePopularity:\u003c/strong\u003e " + _temp145);
              _temp142 = Program_jQuery("\u003cli\u003e").html(_temp144);
              _temp138 = Program_Object_asJQuery(_temp142);
              _temp130 = _temp138.appendTo(details);
              (function (value)
              {
                ;
              })(_temp130);
              var body = Program_Object_asJQuery(Program_jQuery("\u003cdiv\u003e").addClass("searchResult"));
              (function (value)
              {
                ;
              })(Program_Object_asJQuery(Program_jQuery("\u003ch3\u003e").append([link])).appendTo(body));
              (function (value)
              {
                ;
              })(Program_Object_asJQuery(Program_jQuery("\u003cimg\u003e").attr("src", (root + JsRuntime_Identity(JsRuntime_Identity(JsRuntime_GetProperty(JsRuntime_Identity(item), "poster_path")))))).appendTo(body));
              (function (value)
              {
                ;
              })(details.appendTo(body));
              (function (value)
              {
                ;
              })(Program_Object_asJQuery(Program_jQuery("\u003cdiv\u003e").addClass("clearer")).appendTo(body));
              (function (value)
              {
                ;
              })(body.appendTo(Program_op_Dynamic((function (command)
              {
                return Program_jQuery(command);
              }), "results")));
              return builder_.Zero();
            }));
          }));
        }));
      })(Async_get_async());
    });
    return Program_op_Dynamic((function (command)
    {
      return Program_jQuery(command);
    }), "searchButton").click((function (_unitVar0)
    {
      var id = LanguagePrimitives_UnboxGeneric(Program_op_Dynamic((function (command)
      {
        return Program_jQuery(command);
      }), "searchInput").val());
      return (function (arg00)
      {
        return Async_StartImmediate(arg00, {Tag: "None"});
      })(search(id));
    }));
  });
  Program_op_Dynamic = (function (jq, name)
  {
    return Program_jQuery(("#" + name));
  });
  Runtime_getContext = (function (o)
  {
    return o.get_Context();
  });
  Runtime_setContext = (function (o, ctx)
  {
    o.get_Context = function() { return ctx; };
  });
  Seq_CompareWith = (function (f, xs, ys)
  {
    var _temp15;
    var _temp16;
    var _f = (function (i)
    {
      return (i.CompareTo(0.000000) != 0.000000);
    });
    _temp16 = (function (_xs)
    {
      return Seq_TryFind(_f, _xs);
    });
    _temp15 = _temp16(Seq_Map2((function (x)
    {
      return (function (y)
      {
        return f(x)(y);
      });
    }), xs, ys));
    var nonZero = _temp15;
    if ((nonZero.Tag == "None")) 
    {
      return (Seq_Length(xs) - Seq_Length(ys));
    }
    else
    {
      var diff = nonZero.Value;
      return diff;
    };
  });
  Seq_Delay = (function (f)
  {
    return Seq_FromFactory((function (unitVar0)
    {
      var _temp5;
      var _temp6;
      _temp5 = f(_temp6);
      return Seq_Enumerator(_temp5);
    }));
  });
  Seq_Enumerator = (function (xs)
  {
    return xs.GetEnumerator();
  });
  Seq_Fold = (function (f, seed, xs)
  {
    return Seq_FoldIndexed((function (_arg1)
    {
      return (function (acc)
      {
        return (function (x)
        {
          return f(acc)(x);
        });
      });
    }), seed, xs);
  });
  Seq_FoldIndexed = (function (f, seed, xs)
  {
    return Seq_FoldIndexedAux(f, 0.000000, seed, Seq_Enumerator(xs));
  });
  Seq_FoldIndexedAux = (function (f, i, acc, xs)
  {
    if (xs.MoveNext()) 
    {
      return Seq_FoldIndexedAux(f, (i + 1.000000), f(i)(acc)(xs.get_Current()), xs);
    }
    else
    {
      return acc;
    };
  });
  Seq_FromFactory = (function (f)
  {
    return (new i_CreateEnumerable_1__ctor(f));
  });
  Seq_IterateIndexed = (function (f, xs)
  {
    var _temp19;
    return Seq_FoldIndexed((function (i)
    {
      return (function (unitVar1)
      {
        return (function (x)
        {
          return f(i)(x);
        });
      });
    }), _temp19, xs);
  });
  Seq_Length = (function (xs)
  {
    return Seq_Fold((function (count)
    {
      return (function (_arg1)
      {
        return (count + 1.000000);
      });
    }), 0.000000, xs);
  });
  Seq_Map2 = (function (f, xs, ys)
  {
    return (function (_f)
    {
      return Seq_Delay(_f);
    })((function (unitVar0)
    {
      var _xs = Seq_Enumerator(xs);
      var _ys = Seq_Enumerator(ys);
      var _temp10;
      var _f = (function (_unitVar0)
      {
        if ((_xs.MoveNext() && _ys.MoveNext())) 
        {
          var _temp12;
          var _temp13;
          _temp12 = {CompareTo: (function (that)
          {
            var diff;
            return 0.000000;
          }), Item1: f(_xs.get_Current())(_ys.get_Current()), Item2: _temp13};
          return {Tag: "Some", Value: _temp12};
        }
        else
        {
          return {Tag: "None"};
        };
      });
      _temp10 = (function (seed)
      {
        return Seq_Unfold(_f, seed);
      });
      var _temp14;
      return _temp10(_temp14);
    }));
  });
  Seq_OfArray = (function (xs)
  {
    var _temp18;
    var f = (function (i)
    {
      if ((i.CompareTo(Array_BoxedLength(xs)) < 0.000000)) 
      {
        return {Tag: "Some", Value: {CompareTo: (function (that)
        {
          var diff;
          return 0.000000;
        }), Item1: xs[i], Item2: (i + 1.000000)}};
      }
      else
      {
        return {Tag: "None"};
      };
    });
    _temp18 = (function (seed)
    {
      return Seq_Unfold(f, seed);
    });
    return _temp18(0.000000);
  });
  Seq_Take = (function (n, xs)
  {
    return (function (f)
    {
      return Seq_Delay(f);
    })((function (unitVar0)
    {
      var _xs = Seq_Enumerator(xs);
      var _temp70;
      var f = (function (i)
      {
        if (((i.CompareTo(n) < 0.000000) && _xs.MoveNext())) 
        {
          return {Tag: "Some", Value: {CompareTo: (function (that)
          {
            var diff;
            return 0.000000;
          }), Item1: _xs.get_Current(), Item2: (i + 1.000000)}};
        }
        else
        {
          return {Tag: "None"};
        };
      });
      _temp70 = (function (seed)
      {
        return Seq_Unfold(f, seed);
      });
      return _temp70(0.000000);
    }));
  });
  Seq_ToArray = (function (xs)
  {
    var ys = Array_ZeroCreate(Seq_Length(xs));
    var _temp20;
    var f = (function (i)
    {
      return (function (x)
      {
        ys[i] = x;
        return null;
      });
    });
    _temp20 = (function (_xs)
    {
      return Seq_IterateIndexed(f, _xs);
    });
    _temp20(xs);
    return ys;
  });
  Seq_TryFind = (function (f, xs)
  {
    return Seq_TryPickIndexed((function (_arg1)
    {
      return (function (x)
      {
        if (f(x)) 
        {
          return {Tag: "Some", Value: x};
        }
        else
        {
          return {Tag: "None"};
        };
      });
    }), xs);
  });
  Seq_TryPickIndexed = (function (f, xs)
  {
    return Seq_TryPickIndexedAux(f, 0.000000, Seq_Enumerator(xs));
  });
  Seq_TryPickIndexedAux = (function (f, i, xs)
  {
    if (xs.MoveNext()) 
    {
      var result = f(i)(xs.get_Current());
      if ((result.Tag == "None")) 
      {
        return Seq_TryPickIndexedAux(f, (i + 1.000000), xs);
      }
      else
      {
        return result;
      };
    }
    else
    {
      return {Tag: "None"};
    };
  });
  Seq_Unfold = (function (f, seed)
  {
    return Seq_FromFactory((function (unitVar0)
    {
      return (new i_UnfoldEnumerator_2__ctor(seed, f));
    }));
  });
  String_IndexOf = (function (s, search)
  {
    return s.indexOf(search);
  });
  String_IsNullOrEmpty = (function (s)
  {
    return (s==null)||(s=="");
  });
  String_Join = (function (separator, s)
  {
    return s.join(separator);
  });
  String_Replace = (function (s, search, replace)
  {
    var res = s;
    while ((String_IndexOf(res, search).CompareTo(-1.000000) > 0.000000))
    {
      res = String_replaceSingle(res, search, replace);
      null;
    };
    return res;
  });
  String_Split = (function (s, delimiters)
  {
    var _temp24;
    var folder = (function (inputs)
    {
      return (function (delimiter)
      {
        var _temp26;
        var _temp27;
        var mapping = (function (inp)
        {
          return String_splitSingle(inp, delimiter);
        });
        _temp27 = (function (array)
        {
          return Array_Map(mapping, array);
        });
        _temp26 = _temp27(inputs);
        return (function (arrays)
        {
          return Array_Concat(Seq_OfArray(arrays));
        })(_temp26);
      });
    });
    var state = [s];
    _temp24 = (function (array)
    {
      return Array_Fold(folder, state, array);
    });
    return _temp24(delimiters);
  });
  String_ToLowerCase = (function (s)
  {
    return s.toLowerCase();
  });
  String_replaceSingle = (function (s, search, replace)
  {
    return s.replace(search, replace);
  });
  String_splitSingle = (function (s, delimiter)
  {
    return s.split(delimiter);
  });
  Utils_emptyIfNull = (function (list)
  {
    return list==null?List_Empty():list;
  });
  Utils_encodeURIComponent = (function (s)
  {
    return encodeURIComponent(s);
  });
  Utils_newXMLHttpRequest = (function (unitVar0)
  {
    
    var res;
    if (window.XDomainRequest) {
      res = new XDomainRequest();
      res.setRequestHeader = function (header, value) { };
      res.onload = function () {
        res.readyState = 4;
        res.status = 200;
        res.onreadystatechange();
      };
    }
    else if (window.XMLHttpRequest)
      res = new XMLHttpRequest();
    else
      res = new ActiveXObject("Microsoft.XMLHTTP");
    res.get_onreadystatechange = function() { return res.onreadystatechange; }
    res.set_onreadystatechange = function(a) { res.onreadystatechange = a; }
    res.get_readyState = function() { return res.readyState; }
    res.get_responseText = function() { return res.responseText; }
    return res;
  });
  i_ApiaryJsContext__ctor = (function (Root, GlobalQuery, GlobalHeaders, GlobalArguments)
  {
    this.Root = Root;
    this.GlobalQuery = GlobalQuery;
    this.GlobalHeaders = GlobalHeaders;
    this.GlobalArguments = GlobalArguments;
  });
  i_AsyncBuilder__ctor = (function (unitVar0)
  {
    ;
  });
  i_AsyncBuilder__ctor.prototype.Bind = (function (_arg1, f)
  {
    var x = this;
    var v = _arg1.Item;
    return (function (_f)
    {
      return Async_protectedCont(_f);
    })((function (k)
    {
      var cont = (function (a)
      {
        var patternInput = f(a);
        var r = patternInput.Item;
        return r(k);
      });
      return v((new i_AsyncParams_1__ctor(cont, k.Aux)));
    }));
  });
  i_AsyncBuilder__ctor.prototype.Delay = (function (f)
  {
    var x = this;
    return (function (_f)
    {
      return Async_protectedCont(_f);
    })((function (k)
    {
      var _temp48;
      var _temp49;
      _temp48 = f(_temp49);
      var patternInput = _temp48;
      var r = patternInput.Item;
      return r(k);
    }));
  });
  i_AsyncBuilder__ctor.prototype.Zero = (function (unitVar1)
  {
    var x = this;
    return (function (f)
    {
      return Async_protectedCont(f);
    })((function (k)
    {
      var _temp50;
      return Async_invokeCont(k, _temp50);
    }));
  });
  i_AsyncBuilder__ctor.prototype.ReturnFrom = (function (w)
  {
    var x = this;
    return w;
  });
  i_AsyncBuilder__ctor.prototype.Return = (function (v)
  {
    var x = this;
    return (function (f)
    {
      return Async_protectedCont(f);
    })((function (k)
    {
      return Async_invokeCont(k, v);
    }));
  });
  i_AsyncBuilder__ctor.prototype.While = (function (cond, body)
  {
    var __ = this;
    var x = __;
    var loop;
    loop = (function (unitVar0)
    {
      var _temp53;
      var _temp54;
      _temp53 = cond(_temp54);
      if (_temp53) 
      {
        return x.Bind(body, loop);
      }
      else
      {
        return x.Zero();
      };
    });
    var _temp51;
    return loop(_temp51);
  });
  i_AsyncBuilder__ctor.prototype.Combine = (function (work1, work2)
  {
    var __ = this;
    return __.Bind(work1, (function (unitVar0)
    {
      return work2;
    }));
  });
  i_AsyncBuilder__ctor.prototype.For = (function (seq, body)
  {
    var __ = this;
    var en = seq.GetEnumerator();
    var x = __;
    var loop;
    loop = (function (unitVar0)
    {
      if (en.MoveNext()) 
      {
        return x.Bind(body(en.get_Current()), loop);
      }
      else
      {
        return x.Zero();
      };
    });
    var _temp55;
    return loop(_temp55);
  });
  i_AsyncParamsAux__ctor = (function (StackCounter, ExceptionCont, CancelledCont, CancellationToken)
  {
    this.StackCounter = StackCounter;
    this.ExceptionCont = ExceptionCont;
    this.CancelledCont = CancelledCont;
    this.CancellationToken = CancellationToken;
  });
  i_AsyncParams_1__ctor = (function (Cont, Aux)
  {
    this.Cont = Cont;
    this.Aux = Aux;
  });
  i_CancellationToken__ctor = (function (Cell)
  {
    this.Cell = Cell;
  });
  i_CancellationToken__ctor.prototype.ThrowIfCancellationRequested = (function (unitVar1)
  {
    var x = this;
    var matchValue = x.Cell;
    if ((matchValue.Tag == "Some")) 
    {
      var _temp82;
      var cell = matchValue.Value;
      _temp82 = cell.contents;
      if (_temp82) 
      {
        var _cell = matchValue.Value;
        throw ("OperationCancelledException");
        return null;
      }
      else
      {
        ;
      };
    }
    else
    {
      ;
    };
  });
  i_CreateEnumerable_1__ctor = (function (factory)
  {
    this.factory = factory;
  });
  i_CreateEnumerable_1__ctor.prototype.CompareTo = (function (ys)
  {
    var __ = this;
    var xs = __;
    return Seq_CompareWith((function (x)
    {
      return (function (y)
      {
        return LanguagePrimitives_UnboxGeneric(x).CompareTo(y);
      });
    }), xs, ys);
  });
  i_CreateEnumerable_1__ctor.prototype.GetEnumerator = (function (unitVar1)
  {
    var __ = this;
    var _temp17;
    return __.factory(_temp17);
  });
  i_OperationArguments__ctor = (function (Method, Path, Arguments, Headers, Query)
  {
    this.Method = Method;
    this.Path = Path;
    this.Arguments = Arguments;
    this.Headers = Headers;
    this.Query = Query;
  });
  i_OperationArguments__ctor.prototype.CompareTo = (function (that)
  {
    var diff;
    diff = this.Method.CompareTo(that.Method);
    if ((diff != 0.000000)) 
    {
      return diff;
    }
    else
    {
      diff = this.Path.CompareTo(that.Path);
      if ((diff != 0.000000)) 
      {
        return diff;
      }
      else
      {
        diff = this.Arguments.CompareTo(that.Arguments);
        if ((diff != 0.000000)) 
        {
          return diff;
        }
        else
        {
          diff = this.Headers.CompareTo(that.Headers);
          if ((diff != 0.000000)) 
          {
            return diff;
          }
          else
          {
            diff = this.Query.CompareTo(that.Query);
            if ((diff != 0.000000)) 
            {
              return diff;
            }
            else
            {
              return 0.000000;
            };
          };
        };
      };
    };
  });
  i_UnfoldEnumerator_2__ctor = (function (seed, unfold)
  {
    this.seed = seed;
    this.unfold = unfold;
    this.acc = {Tag: "Some", Value: this.seed};
    this.current = null;
  });
  i_UnfoldEnumerator_2__ctor.prototype.Reset = (function (unitVar1)
  {
    var __ = this;
    __.acc = {Tag: "Some", Value: __.seed};
    __.current = null;
  });
  i_UnfoldEnumerator_2__ctor.prototype.get_Current = (function (unitVar1)
  {
    var __ = this;
    return __.current;
  });
  i_UnfoldEnumerator_2__ctor.prototype.MoveNext = (function (unitVar1)
  {
    var __ = this;
    var matchValue = __.acc;
    var _temp2;
    var currAcc = matchValue.Value;
    var _matchValue = __.unfold(currAcc);
    if ((_matchValue.Tag == "Some")) 
    {
      var value = _matchValue.Value.Item1;
      var nextAcc = _matchValue.Value.Item2;
      __.acc = {Tag: "Some", Value: nextAcc};
      __.current = value;
      _temp2 = true;
    }
    else
    {
      __.acc = {Tag: "None"};
      __.current = null;
      _temp2 = false;
    };
    return ((matchValue.Tag == "Some") && _temp2);
  });
  i_UnfoldEnumerator_2__ctor.prototype.Dispose = (function (unitVar1)
  {
    var __ = this;
  });
  list_1_Cons = (function (Item1, Item2)
  {
    this.Tag = "Cons";
    this.Item1 = Item1;
    this.Item2 = Item2;
  });
  list_1_Cons.prototype.CompareTo = (function (that)
  {
    var diff;
    return 0.000000;
  });
  list_1_Nil = (function ()
  {
    this.Tag = "Nil";
  });
  list_1_Nil.prototype.CompareTo = (function (that)
  {
    var diff;
    return 0.000000;
  });
  return Program_main()
});