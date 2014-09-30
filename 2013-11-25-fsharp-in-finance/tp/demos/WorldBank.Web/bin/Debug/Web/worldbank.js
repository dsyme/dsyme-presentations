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

var list_1_Nil, list_1_Cons, i_WorldBankCountry__ctor, i_UnfoldEnumerator_2__ctor, i_CreateEnumerable_1__ctor, i_CancellationToken__ctor, i_AsyncParams_1__ctor, i_AsyncParamsAux__ctor, i_AsyncBuilder__ctor, WorldBankRuntime_GetIndicators, WorldBankRuntime_GetCountry, WorldBankRuntime_GetCountries, WorldBankRuntime_AsyncGetIndicator, Utils_getJSON, Utils_encodeURIComponent, String_Join, Seq_Unfold, Seq_TryPickIndexedAux, Seq_TryPickIndexed, Seq_TryFind, Seq_ToArray, Seq_OfList, Seq_OfArray, Seq_Map2, Seq_Map, Seq_Length, Seq_IterateIndexed, Seq_FromFactory, Seq_FoldIndexedAux, Seq_FoldIndexed, Seq_Fold, Seq_Enumerator, Seq_Delay, Seq_CompareWith, Seq_Choose, Runtime_worldBankUrl, Program_main, Program_jQuery, Program_get_data, Program_data, Program_countries, List_Tail, List_Reverse, List_OfArray, List_MapIndexed, List_Map, List_Head, List_FoldIndexedAux, List_FoldIndexed, List_Fold, List_Empty, List_CreateCons, LanguagePrimitives_UnboxGeneric, JsRuntime_TryGetValueByTypeTag, JsRuntime_TryGetArrayChildByTypeTag, JsRuntime_Parse, JsRuntime_Identity2, JsRuntime_Identity, JsRuntime_GetProperty, JsRuntime_GetCulture, JsRuntime_GetArrayChildrenByTypeTag, JsRuntime_GetArrayChildByTypeTag, JsRuntime_ConvertArray, JsHelpers_jstypeof, JsHelpers_isNull, JsHelpers_isArray, FunScriptExtensions_number, FunScriptExtensions_floor, FunScriptExtensions_clone, FunScriptExtensions_Array_push, FSharpString_Concat, Async_setTimeout, Async_protectedCont, Async_invokeCont, Async_get_async, Async_StartImmediate, Async_FromContinuations, Async_1_Cont, Array_ZeroCreate, Array_MapIndexed, Array_Map, Array_Length, Array_FoldBackIndexed, Array_FoldBack, Array_Choose, Array_BoxedLength;
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
  Array_FoldBack = (function (f, xs, seed)
  {
    return Array_FoldBackIndexed((function (_arg1)
    {
      return (function (x)
      {
        return (function (acc)
        {
          return f(x)(acc);
        });
      });
    }), xs, seed);
  });
  Array_FoldBackIndexed = (function (f, xs, seed)
  {
    var acc = seed;
    var size = Array_Length(xs);
    for (var i = 1.000000; i <= size; i++)
    {
      acc = f((i - 1.000000))(xs[(size - i)])(acc);
      null;
    };
    return acc;
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
    var _temp208;
    if ((cancellationToken.Tag == "Some")) 
    {
      var v = cancellationToken.Value;
      _temp208 = v;
    }
    else
    {
      _temp208 = (new i_CancellationToken__ctor({Tag: "None"}));
    };
    var token = _temp208;
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
  FunScriptExtensions_Array_push = (function (x, element)
  {
    return x.push(element);
  });
  FunScriptExtensions_clone = (function (obj, args)
  {
    return new obj(args);
  });
  FunScriptExtensions_floor = (function (n)
  {
    return Math.floor(n);
  });
  FunScriptExtensions_number = (function (a)
  {
    return a*1.0;
  });
  JsHelpers_isArray = (function (o)
  {
    return Array.isArray(o);
  });
  JsHelpers_isNull = (function (o)
  {
    return o==null;
  });
  JsHelpers_jstypeof = (function (o)
  {
    return typeof(o);
  });
  JsRuntime_ConvertArray = (function (value, packer, f)
  {
    return value;
  });
  JsRuntime_GetArrayChildByTypeTag = (function (value, tag)
  {
    var arr = JsRuntime_GetArrayChildrenByTypeTag(value, tag, (function (x)
    {
      return x;
    }), (function (x)
    {
      return x;
    }));
    if ((Array_BoxedLength(arr).CompareTo(1.000000) == 0.000000)) 
    {
      return arr[0.000000];
    }
    else
    {
      throw ("JSON mismatch: Expected single value, but found multiple.");
      return null;
    };
  });
  JsRuntime_GetArrayChildrenByTypeTag = (function (doc, tag, pack, f)
  {
    var matchTag = (function (value)
    {
      if (JsHelpers_isNull(value)) 
      {
        return {Tag: "None"};
      }
      else
      {
        if (((JsHelpers_jstypeof(value).CompareTo("boolean") == 0.000000) && (tag.CompareTo("Boolean") == 0.000000))) 
        {
          return {Tag: "Some", Value: value};
        }
        else
        {
          if (((JsHelpers_jstypeof(value).CompareTo("number") == 0.000000) && (tag.CompareTo("Number") == 0.000000))) 
          {
            return {Tag: "Some", Value: value};
          }
          else
          {
            if (((JsHelpers_jstypeof(value).CompareTo("string") == 0.000000) && (tag.CompareTo("Number") == 0.000000))) 
            {
              return {Tag: "Some", Value: (1.000000 * value)};
            }
            else
            {
              if (((JsHelpers_jstypeof(value).CompareTo("string") == 0.000000) && (tag.CompareTo("String") == 0.000000))) 
              {
                return {Tag: "Some", Value: value};
              }
              else
              {
                if ((JsHelpers_isArray(value) && (tag.CompareTo("Array") == 0.000000))) 
                {
                  return {Tag: "Some", Value: value};
                }
                else
                {
                  if (((JsHelpers_jstypeof(value).CompareTo("object") == 0.000000) && (tag.CompareTo("Record") == 0.000000))) 
                  {
                    return {Tag: "Some", Value: value};
                  }
                  else
                  {
                    return {Tag: "None"};
                  };
                };
              };
            };
          };
        };
      };
    });
    if (JsHelpers_isArray(doc)) 
    {
      var _temp87;
      var mapping = (function (x)
      {
        return f((function (_x)
        {
          return pack((function (value)
          {
            return value;
          })(_x));
        })(x));
      });
      _temp87 = (function (array)
      {
        return Array_Map(mapping, array);
      });
      var _temp89;
      var _temp90;
      var chooser = matchTag;
      _temp90 = (function (array)
      {
        return Array_Choose(chooser, array);
      });
      _temp89 = _temp90((function (value)
      {
        return value;
      })(doc));
      return _temp87(_temp89);
    }
    else
    {
      throw ("JSON mismatch: Expected Array node");
      return null;
    };
  });
  JsRuntime_GetCulture = (function (name)
  {
    return null;
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
  JsRuntime_TryGetArrayChildByTypeTag = (function (doc, tag, pack, f)
  {
    var arr = JsRuntime_GetArrayChildrenByTypeTag(doc, tag, pack, f);
    if ((Array_BoxedLength(arr).CompareTo(1.000000) == 0.000000)) 
    {
      return {Tag: "Some", Value: arr[0.000000]};
    }
    else
    {
      if ((Array_BoxedLength(arr).CompareTo(0.000000) == 0.000000)) 
      {
        return {Tag: "None"};
      }
      else
      {
        throw ("JSON mismatch: Expected Array with single or no elements.");
        return null;
      };
    };
  });
  JsRuntime_TryGetValueByTypeTag = (function (value, tag, pack, f)
  {
    var arrayValue = [value];
    return JsRuntime_TryGetArrayChildByTypeTag(arrayValue, tag, pack, f);
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
  List_Head = (function (_arg1)
  {
    if ((_arg1.Tag == "Cons")) 
    {
      var xs = _arg1.Item2;
      var x = _arg1.Item1;
      return x;
    }
    else
    {
      throw ("List was empty");
      return null;
    };
  });
  List_Map = (function (f, xs)
  {
    return (function (_xs)
    {
      return List_Reverse(_xs);
    })(List_Fold((function (acc)
    {
      return (function (x)
      {
        return (new list_1_Cons(f(x), acc));
      });
    }), (new list_1_Nil()), xs));
  });
  List_MapIndexed = (function (f, xs)
  {
    return (function (_xs)
    {
      return List_Reverse(_xs);
    })(List_FoldIndexed((function (i)
    {
      return (function (acc)
      {
        return (function (x)
        {
          return (new list_1_Cons(f(i)(x), acc));
        });
      });
    }), (new list_1_Nil()), xs));
  });
  List_OfArray = (function (xs)
  {
    return Array_FoldBack((function (x)
    {
      return (function (acc)
      {
        return (new list_1_Cons(x, acc));
      });
    }), xs, (new list_1_Nil()));
  });
  List_Reverse = (function (xs)
  {
    return List_Fold((function (acc)
    {
      return (function (x)
      {
        return (new list_1_Cons(x, acc));
      });
    }), (new list_1_Nil()), xs);
  });
  List_Tail = (function (_arg1)
  {
    if ((_arg1.Tag == "Cons")) 
    {
      var xs = _arg1.Item2;
      var x = _arg1.Item1;
      return xs;
    }
    else
    {
      throw ("List was empty");
      return null;
    };
  });
  Program_countries = (function (unitVar0)
  {
    var _temp2;
    var var0 = WorldBankRuntime_GetCountries(Program_data);
    _temp2 = WorldBankRuntime_GetCountry(var0, "ARB", "Arab World");
    var _temp3;
    var _var0 = WorldBankRuntime_GetCountries(Program_data);
    _temp3 = WorldBankRuntime_GetCountry(_var0, "EUU", "European Union");
    var _temp4;
    var __var0 = WorldBankRuntime_GetCountries(Program_data);
    _temp4 = WorldBankRuntime_GetCountry(__var0, "AUS", "Australia");
    var _temp5;
    var ___var0 = WorldBankRuntime_GetCountries(Program_data);
    _temp5 = WorldBankRuntime_GetCountry(___var0, "BRA", "Brazil");
    var _temp6;
    var ____var0 = WorldBankRuntime_GetCountries(Program_data);
    _temp6 = WorldBankRuntime_GetCountry(____var0, "CAN", "Canada");
    var _temp7;
    var _____var0 = WorldBankRuntime_GetCountries(Program_data);
    _temp7 = WorldBankRuntime_GetCountry(_____var0, "CHL", "Chile");
    var _temp8;
    var ______var0 = WorldBankRuntime_GetCountries(Program_data);
    _temp8 = WorldBankRuntime_GetCountry(______var0, "CZE", "Czech Republic");
    var _temp9;
    var _______var0 = WorldBankRuntime_GetCountries(Program_data);
    _temp9 = WorldBankRuntime_GetCountry(_______var0, "DNK", "Denmark");
    var _temp10;
    var ________var0 = WorldBankRuntime_GetCountries(Program_data);
    _temp10 = WorldBankRuntime_GetCountry(________var0, "FRA", "France");
    var _temp11;
    var _________var0 = WorldBankRuntime_GetCountries(Program_data);
    _temp11 = WorldBankRuntime_GetCountry(_________var0, "GRC", "Greece");
    var _temp12;
    var __________var0 = WorldBankRuntime_GetCountries(Program_data);
    _temp12 = WorldBankRuntime_GetCountry(__________var0, "LIC", "Low income");
    var _temp13;
    var ___________var0 = WorldBankRuntime_GetCountries(Program_data);
    _temp13 = WorldBankRuntime_GetCountry(___________var0, "HIC", "High income");
    var _temp14;
    var ____________var0 = WorldBankRuntime_GetCountries(Program_data);
    _temp14 = WorldBankRuntime_GetCountry(____________var0, "GBR", "United Kingdom");
    var _temp15;
    var _____________var0 = WorldBankRuntime_GetCountries(Program_data);
    _temp15 = WorldBankRuntime_GetCountry(_____________var0, "USA", "United States");
    return [_temp2, _temp3, _temp4, _temp5, _temp6, _temp7, _temp8, _temp9, _temp10, _temp11, _temp12, _temp13, _temp14, _temp15];
  });
  Program_get_data = (function ()
  {
    return {ServiceUrl: "http://api.worldbank.org", Source: "World Development Indicators"};
  });
  Program_jQuery = (function (command)
  {
    return jQuery(command);
  });
  Program_main = (function (unitVar0)
  {
    var _temp16;
    var _temp17;
    var mapping = (function (index)
    {
      return (function (country)
      {
        var input = Program_jQuery("\u003cinput\u003e");
        (function (value)
        {
          ;
        })(input.attr("type", "checkbox"));
        var label = Program_jQuery("\u003clabel\u003e");
        (function (value)
        {
          ;
        })(label.append([input]));
        (function (value)
        {
          ;
        })(label.append([country.Name]));
        var panel = (FunScriptExtensions_floor((index % 3.000000)) + 1.000000);
        (function (value)
        {
          ;
        })(label.appendTo(Program_jQuery(("#countryList" + panel.toString()))));
        return {CompareTo: (function (that)
        {
          var diff;
          return 0.000000;
        }), Item1: country, Item2: input};
      });
    });
    _temp17 = (function (list)
    {
      return List_MapIndexed(mapping, list);
    });
    _temp16 = _temp17((function (array)
    {
      return List_OfArray(array);
    })(Program_countries()));
    var infos = _temp16;
    var render = (function (_unitVar0)
    {
      return (function (builder_)
      {
        return builder_.Delay((function (unitVar)
        {
          var opts = {};
          var _temp18;
          var returnVal = {};
          returnVal.renderTo = "chart";
          null;
          returnVal.type = "line";
          null;
          _temp18 = returnVal;
          opts.chart = _temp18;
          null;
          var _temp19;
          var _returnVal = {};
          _returnVal.text = "School enrollment, tertiary (% gross)";
          null;
          _temp19 = _returnVal;
          opts.title = _temp19;
          null;
          opts.series = [];
          null;
          return builder_.Combine(builder_.For(Seq_OfList(infos), (function (_arg1)
          {
            var country = _arg1.Item1;
            var check = _arg1.Item2;
            if ((function (value)
            {
              return value;
            })(check.is(":checked"))) 
            {
              var _temp188;
              var var0 = WorldBankRuntime_GetIndicators(country);
              _temp188 = WorldBankRuntime_AsyncGetIndicator(var0, "SE.TER.ENRR");
              return builder_.Bind(_temp188, (function (_arg2)
              {
                var vals = _arg2;
                var _temp193;
                var _temp195;
                var _temp196;
                var _mapping = (function (tupledArg)
                {
                  var k = tupledArg.Item1;
                  var v = tupledArg.Item2;
                  return [FunScriptExtensions_number(k), FunScriptExtensions_number(v)];
                });
                _temp196 = (function (source)
                {
                  return Seq_Map(_mapping, source);
                });
                _temp195 = _temp196(vals);
                _temp193 = (function (source)
                {
                  return Seq_ToArray(source);
                })(_temp195);
                var data = _temp193;
                var _temp197;
                var __returnVal = {};
                __returnVal.data = data;
                null;
                __returnVal.name = country.Name;
                null;
                _temp197 = __returnVal;
                FunScriptExtensions_Array_push(opts.series, _temp197);
                return builder_.Zero();
              }));
            }
            else
            {
              return builder_.Zero();
            };
          })), builder_.Delay((function (_unitVar)
          {
            (function (value)
            {
              ;
            })(FunScriptExtensions_clone(Highcharts.Chart, opts));
            return builder_.Zero();
          })));
        }));
      })(Async_get_async());
    });
    var _temp210;
    var _temp211;
    _temp210 = render(_temp211);
    (function (arg00)
    {
      return Async_StartImmediate(arg00, {Tag: "None"});
    })(_temp210);
    var enumerator = Seq_OfList(infos).GetEnumerator();
    try
    {
      while (enumerator.MoveNext())
      {
        var forLoopVar = enumerator.get_Current();
        var check = forLoopVar.Item2;
        (function (value)
        {
          ;
        })(check.click((function (_arg1)
        {
          var _temp215;
          var _temp217;
          var _temp218;
          _temp217 = render(_temp218);
          _temp215 = (function (arg00)
          {
            return Async_StartImmediate(arg00, {Tag: "None"});
          })(_temp217);
          return (function (value)
          {
            return value;
          })(_temp215);
        })));
      };
    }
    finally{
      if (false) 
      {
        LanguagePrimitives_UnboxGeneric(enumerator).Dispose();
      }
      else
      {
        ;
      };
    };
  });
  Runtime_worldBankUrl = (function (wb, functions, props)
  {
    var _temp58;
    var _temp68;
    var _temp73;
    var _temp74;
    var sep = "";
    _temp74 = (function (strings)
    {
      return FSharpString_Concat(sep, Seq_OfList(strings));
    });
    var _temp76;
    var _temp77;
    var mapping = (function (m)
    {
      return ("/" + Utils_encodeURIComponent(m));
    });
    _temp77 = (function (list)
    {
      return List_Map(mapping, list);
    });
    _temp76 = _temp77(functions);
    _temp73 = _temp74(_temp76);
    _temp68 = ((wb.ServiceUrl + "/") + _temp73);
    _temp58 = (_temp68 + "?per_page=1000");
    var _temp82;
    var _temp83;
    var _sep = "";
    _temp83 = (function (strings)
    {
      return FSharpString_Concat(_sep, Seq_OfList(strings));
    });
    var _temp85;
    var _temp86;
    var _mapping = (function (tupledArg)
    {
      var key = tupledArg.Item1;
      var value = tupledArg.Item2;
      return ((("\u0026" + key) + "=") + Utils_encodeURIComponent(value));
    });
    _temp86 = (function (list)
    {
      return List_Map(_mapping, list);
    });
    _temp85 = _temp86(props);
    _temp82 = _temp83(_temp85);
    return (_temp58 + _temp82);
  });
  Seq_Choose = (function (f, xs)
  {
    var trySkipToNext;
    trySkipToNext = (function (_enum)
    {
      if (_enum.MoveNext()) 
      {
        var matchValue = f(_enum.get_Current());
        if ((matchValue.Tag == "Some")) 
        {
          var value = matchValue.Value;
          return {Tag: "Some", Value: {CompareTo: (function (that)
          {
            var diff;
            return 0.000000;
          }), Item1: value, Item2: _enum}};
        }
        else
        {
          return trySkipToNext(_enum);
        };
      }
      else
      {
        return {Tag: "None"};
      };
    });
    return (function (_f)
    {
      return Seq_Delay(_f);
    })((function (unitVar0)
    {
      var _temp114;
      var _f = trySkipToNext;
      _temp114 = (function (seed)
      {
        return Seq_Unfold(_f, seed);
      });
      return _temp114(Seq_Enumerator(xs));
    }));
  });
  Seq_CompareWith = (function (f, xs, ys)
  {
    var _temp33;
    var _temp34;
    var _f = (function (i)
    {
      return (i.CompareTo(0.000000) != 0.000000);
    });
    _temp34 = (function (_xs)
    {
      return Seq_TryFind(_f, _xs);
    });
    _temp33 = _temp34(Seq_Map2((function (x)
    {
      return (function (y)
      {
        return f(x)(y);
      });
    }), xs, ys));
    var nonZero = _temp33;
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
      var _temp23;
      var _temp24;
      _temp23 = f(_temp24);
      return Seq_Enumerator(_temp23);
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
    var _temp37;
    return Seq_FoldIndexed((function (i)
    {
      return (function (unitVar1)
      {
        return (function (x)
        {
          return f(i)(x);
        });
      });
    }), _temp37, xs);
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
  Seq_Map = (function (f, xs)
  {
    return (function (_f)
    {
      return Seq_Delay(_f);
    })((function (unitVar0)
    {
      var _temp189;
      var _f = (function (_enum)
      {
        if (_enum.MoveNext()) 
        {
          return {Tag: "Some", Value: {CompareTo: (function (that)
          {
            var diff;
            return 0.000000;
          }), Item1: f(_enum.get_Current()), Item2: _enum}};
        }
        else
        {
          return {Tag: "None"};
        };
      });
      _temp189 = (function (seed)
      {
        return Seq_Unfold(_f, seed);
      });
      return _temp189(Seq_Enumerator(xs));
    }));
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
      var _temp28;
      var _f = (function (_unitVar0)
      {
        if ((_xs.MoveNext() && _ys.MoveNext())) 
        {
          var _temp30;
          var _temp31;
          _temp30 = {CompareTo: (function (that)
          {
            var diff;
            return 0.000000;
          }), Item1: f(_xs.get_Current())(_ys.get_Current()), Item2: _temp31};
          return {Tag: "Some", Value: _temp30};
        }
        else
        {
          return {Tag: "None"};
        };
      });
      _temp28 = (function (seed)
      {
        return Seq_Unfold(_f, seed);
      });
      var _temp32;
      return _temp28(_temp32);
    }));
  });
  Seq_OfArray = (function (xs)
  {
    var _temp139;
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
    _temp139 = (function (seed)
    {
      return Seq_Unfold(f, seed);
    });
    return _temp139(0.000000);
  });
  Seq_OfList = (function (xs)
  {
    var _temp36;
    var f = (function (_arg1)
    {
      if ((_arg1.Tag == "Cons")) 
      {
        var _xs = List_Tail(_arg1);
        var x = List_Head(_arg1);
        return {Tag: "Some", Value: {CompareTo: (function (that)
        {
          var diff;
          return 0.000000;
        }), Item1: x, Item2: _xs}};
      }
      else
      {
        return {Tag: "None"};
      };
    });
    _temp36 = (function (seed)
    {
      return Seq_Unfold(f, seed);
    });
    return _temp36(xs);
  });
  Seq_ToArray = (function (xs)
  {
    var ys = Array_ZeroCreate(Seq_Length(xs));
    var _temp38;
    var f = (function (i)
    {
      return (function (x)
      {
        ys[i] = x;
        return null;
      });
    });
    _temp38 = (function (_xs)
    {
      return Seq_IterateIndexed(f, _xs);
    });
    _temp38(xs);
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
  String_Join = (function (separator, s)
  {
    return s.join(separator);
  });
  Utils_encodeURIComponent = (function (s)
  {
    return encodeURIComponent(s);
  });
  Utils_getJSON = (function (url, callback)
  {
    return $.getJSON(url, callback);
  });
  WorldBankRuntime_AsyncGetIndicator = (function (country, indicator)
  {
    return Async_FromContinuations((function (tupledArg)
    {
      var cont = tupledArg.Item1;
      var econt = tupledArg.Item2;
      var ccont = tupledArg.Item3;
      var wb = country.Context;
      var countryCode = country.Code;
      var url = Runtime_worldBankUrl(wb, List_CreateCons("countries", List_CreateCons(countryCode, List_CreateCons("indicators", List_CreateCons(indicator, List_Empty())))), List_CreateCons({CompareTo: (function (that)
      {
        var diff;
        return 0.000000;
      }), Item1: "date", Item2: "1900:2050"}, List_CreateCons({CompareTo: (function (that)
      {
        var diff;
        return 0.000000;
      }), Item1: "format", Item2: "jsonp"}, List_Empty())));
      return Utils_getJSON((url + "\u0026prefix=?"), (function (json)
      {
        var data = JsRuntime_Parse(json, null);
        var _temp140;
        var _temp164;
        var chooser = (function (v)
        {
          if (JsHelpers_isNull(JsRuntime_GetProperty(JsRuntime_Identity(v), "value"))) 
          {
            return {Tag: "None"};
          }
          else
          {
            var _temp176;
            var _temp182;
            var _temp185;
            var _temp187;
            var var0 = JsRuntime_GetProperty(JsRuntime_Identity(v), "value");
            _temp187 = JsRuntime_TryGetValueByTypeTag(JsRuntime_Identity(var0), "Number", (function (t)
            {
              return t;
            }), (function (t)
            {
              return JsRuntime_Identity2(JsRuntime_Identity(t), "");
            }));
            _temp185 = _temp187.Value;
            _temp182 = _temp185;
            _temp176 = {CompareTo: (function (that)
            {
              var diff;
              return 0.000000;
            }), Item1: JsRuntime_Identity2(JsRuntime_Identity(JsRuntime_GetProperty(JsRuntime_Identity(v), "date")), ""), Item2: _temp182};
            return {Tag: "Some", Value: _temp176};
          };
        });
        _temp164 = (function (source)
        {
          return Seq_Choose(chooser, source);
        });
        _temp140 = _temp164((function (source)
        {
          return Seq_OfArray(source);
        })(JsRuntime_ConvertArray(JsRuntime_Identity(JsRuntime_GetArrayChildByTypeTag(JsRuntime_Identity(data), "Array")), (function (t)
        {
          return t;
        }), (function (t)
        {
          return t;
        }))));
        var res = _temp140;
        return cont(res);
      }));
    }));
  });
  WorldBankRuntime_GetCountries = (function (data)
  {
    return data;
  });
  WorldBankRuntime_GetCountry = (function (countries, code, name)
  {
    return (new i_WorldBankCountry__ctor(countries, code, name));
  });
  WorldBankRuntime_GetIndicators = (function (country)
  {
    return country;
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
      var _temp199;
      var _temp200;
      _temp199 = f(_temp200);
      var patternInput = _temp199;
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
      var _temp201;
      return Async_invokeCont(k, _temp201);
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
      var _temp204;
      var _temp205;
      _temp204 = cond(_temp205);
      if (_temp204) 
      {
        return x.Bind(body, loop);
      }
      else
      {
        return x.Zero();
      };
    });
    var _temp202;
    return loop(_temp202);
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
    var _temp206;
    return loop(_temp206);
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
      var _temp207;
      var cell = matchValue.Value;
      _temp207 = cell.contents;
      if (_temp207) 
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
    var _temp35;
    return __.factory(_temp35);
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
    var _temp20;
    var currAcc = matchValue.Value;
    var _matchValue = __.unfold(currAcc);
    if ((_matchValue.Tag == "Some")) 
    {
      var value = _matchValue.Value.Item1;
      var nextAcc = _matchValue.Value.Item2;
      __.acc = {Tag: "Some", Value: nextAcc};
      __.current = value;
      _temp20 = true;
    }
    else
    {
      __.acc = {Tag: "None"};
      __.current = null;
      _temp20 = false;
    };
    return ((matchValue.Tag == "Some") && _temp20);
  });
  i_UnfoldEnumerator_2__ctor.prototype.Dispose = (function (unitVar1)
  {
    var __ = this;
  });
  i_WorldBankCountry__ctor = (function (Context, Code, Name)
  {
    this.Context = Context;
    this.Code = Code;
    this.Name = Name;
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
  Program_data = Program_get_data();
  return Program_main()
});