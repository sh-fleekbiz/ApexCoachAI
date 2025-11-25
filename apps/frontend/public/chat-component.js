var To = Object.defineProperty;
var Mr = (i) => {
  throw TypeError(i);
};
var xo = (i, t, e) => t in i ? To(i, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : i[t] = e;
var v = (i, t, e) => xo(i, typeof t != "symbol" ? t + "" : t, e), _i = (i, t, e) => t.has(i) || Mr("Cannot " + e);
var V = (i, t, e) => (_i(i, t, "read from private field"), e ? e.call(i) : t.get(i)), Lt = (i, t, e) => t.has(i) ? Mr("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(i) : t.set(i, e), Ht = (i, t, e, n) => (_i(i, t, "write to private field"), n ? n.call(i, e) : t.set(i, e), e), Ln = (i, t, e) => (_i(i, t, "access private method"), e);
var Dr = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {}, Nr = {};
/*! *****************************************************************************
Copyright (C) Microsoft. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
var Pr;
function Ao() {
  if (Pr) return Nr;
  Pr = 1;
  var i;
  return (function(t) {
    (function(e) {
      var n = typeof globalThis == "object" ? globalThis : typeof Dr == "object" ? Dr : typeof self == "object" ? self : typeof this == "object" ? this : a(), r = s(t);
      typeof n.Reflect < "u" && (r = s(n.Reflect, r)), e(r, n), typeof n.Reflect > "u" && (n.Reflect = t);
      function s(u, p) {
        return function(g, m) {
          Object.defineProperty(u, g, { configurable: !0, writable: !0, value: m }), p && p(g, m);
        };
      }
      function o() {
        try {
          return Function("return this;")();
        } catch {
        }
      }
      function l() {
        try {
          return (0, eval)("(function() { return this; })()");
        } catch {
        }
      }
      function a() {
        return o() || l();
      }
    })(function(e, n) {
      var r = Object.prototype.hasOwnProperty, s = typeof Symbol == "function", o = s && typeof Symbol.toPrimitive < "u" ? Symbol.toPrimitive : "@@toPrimitive", l = s && typeof Symbol.iterator < "u" ? Symbol.iterator : "@@iterator", a = typeof Object.create == "function", u = { __proto__: [] } instanceof Array, p = !a && !u, g = {
        // create an object in dictionary mode (a.k.a. "slow" mode in v8)
        create: a ? function() {
          return me(/* @__PURE__ */ Object.create(null));
        } : u ? function() {
          return me({ __proto__: null });
        } : function() {
          return me({});
        },
        has: p ? function(h, d) {
          return r.call(h, d);
        } : function(h, d) {
          return d in h;
        },
        get: p ? function(h, d) {
          return r.call(h, d) ? h[d] : void 0;
        } : function(h, d) {
          return h[d];
        }
      }, m = Object.getPrototypeOf(Function), w = typeof Map == "function" && typeof Map.prototype.entries == "function" ? Map : On(), N = typeof Set == "function" && typeof Set.prototype.entries == "function" ? Set : Mn(), O = typeof WeakMap == "function" ? WeakMap : Dn(), L = s ? Symbol.for("@reflect-metadata:registry") : void 0, ct = tn(), mt = ge(ct);
      function K(h, d, f, y) {
        if (k(f)) {
          if (!Ke(h))
            throw new TypeError();
          if (!ue(d))
            throw new TypeError();
          return Fe(h, d);
        } else {
          if (!Ke(h))
            throw new TypeError();
          if (!X(d))
            throw new TypeError();
          if (!X(y) && !k(y) && !Vt(y))
            throw new TypeError();
          return Vt(y) && (y = void 0), f = kt(f), qe(h, d, f, y);
        }
      }
      e("decorate", K);
      function Z(h, d) {
        function f(y, $) {
          if (!X(y))
            throw new TypeError();
          if (!k($) && !Gt($))
            throw new TypeError();
          Rn(h, d, y, $);
        }
        return f;
      }
      e("metadata", Z);
      function et(h, d, f, y) {
        if (!X(f))
          throw new TypeError();
        return k(y) || (y = kt(y)), Rn(h, d, f, y);
      }
      e("defineMetadata", et);
      function F(h, d, f) {
        if (!X(d))
          throw new TypeError();
        return k(f) || (f = kt(f)), $n(h, d, f);
      }
      e("hasMetadata", F);
      function qt(h, d, f) {
        if (!X(d))
          throw new TypeError();
        return k(f) || (f = kt(f)), Ve(h, d, f);
      }
      e("hasOwnMetadata", qt);
      function Rt(h, d, f) {
        if (!X(d))
          throw new TypeError();
        return k(f) || (f = kt(f)), In(h, d, f);
      }
      e("getMetadata", Rt);
      function En(h, d, f) {
        if (!X(d))
          throw new TypeError();
        return k(f) || (f = kt(f)), Ge(h, d, f);
      }
      e("getOwnMetadata", En);
      function je(h, d) {
        if (!X(h))
          throw new TypeError();
        return k(d) || (d = kt(d)), We(h, d);
      }
      e("getMetadataKeys", je);
      function ut(h, d) {
        if (!X(h))
          throw new TypeError();
        return k(d) || (d = kt(d)), it(h, d);
      }
      e("getOwnMetadataKeys", ut);
      function ze(h, d, f) {
        if (!X(d))
          throw new TypeError();
        if (k(f) || (f = kt(f)), !X(d))
          throw new TypeError();
        k(f) || (f = kt(f));
        var y = Et(
          d,
          f,
          /*Create*/
          !1
        );
        return k(y) ? !1 : y.OrdinaryDeleteMetadata(h, d, f);
      }
      e("deleteMetadata", ze);
      function Fe(h, d) {
        for (var f = h.length - 1; f >= 0; --f) {
          var y = h[f], $ = y(d);
          if (!k($) && !Vt($)) {
            if (!ue($))
              throw new TypeError();
            d = $;
          }
        }
        return d;
      }
      function qe(h, d, f, y) {
        for (var $ = h.length - 1; $ >= 0; --$) {
          var Y = h[$], tt = Y(d, f, y);
          if (!k(tt) && !Vt(tt)) {
            if (!X(tt))
              throw new TypeError();
            y = tt;
          }
        }
        return y;
      }
      function $n(h, d, f) {
        var y = Ve(h, d, f);
        if (y)
          return !0;
        var $ = $e(d);
        return Vt($) ? !1 : $n(h, $, f);
      }
      function Ve(h, d, f) {
        var y = Et(
          d,
          f,
          /*Create*/
          !1
        );
        return k(y) ? !1 : Ye(y.OrdinaryHasOwnMetadata(h, d, f));
      }
      function In(h, d, f) {
        var y = Ve(h, d, f);
        if (y)
          return Ge(h, d, f);
        var $ = $e(d);
        if (!Vt($))
          return In(h, $, f);
      }
      function Ge(h, d, f) {
        var y = Et(
          d,
          f,
          /*Create*/
          !1
        );
        if (!k(y))
          return y.OrdinaryGetOwnMetadata(h, d, f);
      }
      function Rn(h, d, f, y) {
        var $ = Et(
          f,
          y,
          /*Create*/
          !0
        );
        $.OrdinaryDefineOwnMetadata(h, d, f, y);
      }
      function We(h, d) {
        var f = it(h, d), y = $e(h);
        if (y === null)
          return f;
        var $ = We(y, d);
        if ($.length <= 0)
          return f;
        if (f.length <= 0)
          return $;
        for (var Y = new N(), tt = [], P = 0, b = f; P < b.length; P++) {
          var T = b[P], A = Y.has(T);
          A || (Y.add(T), tt.push(T));
        }
        for (var x = 0, H = $; x < H.length; x++) {
          var T = H[x], A = Y.has(T);
          A || (Y.add(T), tt.push(T));
        }
        return tt;
      }
      function it(h, d) {
        var f = Et(
          h,
          d,
          /*create*/
          !1
        );
        return f ? f.OrdinaryOwnMetadataKeys(h, d) : [];
      }
      function Ze(h) {
        if (h === null)
          return 1;
        switch (typeof h) {
          case "undefined":
            return 0;
          case "boolean":
            return 2;
          case "string":
            return 3;
          case "symbol":
            return 4;
          case "number":
            return 5;
          case "object":
            return h === null ? 1 : 6;
          default:
            return 6;
        }
      }
      function k(h) {
        return h === void 0;
      }
      function Vt(h) {
        return h === null;
      }
      function J(h) {
        return typeof h == "symbol";
      }
      function X(h) {
        return typeof h == "object" ? h !== null : typeof h == "function";
      }
      function Xe(h, d) {
        switch (Ze(h)) {
          case 0:
            return h;
          case 1:
            return h;
          case 2:
            return h;
          case 3:
            return h;
          case 4:
            return h;
          case 5:
            return h;
        }
        var f = "string", y = Ee(h, o);
        if (y !== void 0) {
          var $ = y.call(h, f);
          if (X($))
            throw new TypeError();
          return $;
        }
        return re(h);
      }
      function re(h, d) {
        var f, y, $;
        {
          var Y = h.toString;
          if (Ot(Y)) {
            var y = Y.call(h);
            if (!X(y))
              return y;
          }
          var f = h.valueOf;
          if (Ot(f)) {
            var y = f.call(h);
            if (!X(y))
              return y;
          }
        }
        throw new TypeError();
      }
      function Ye(h) {
        return !!h;
      }
      function Qe(h) {
        return "" + h;
      }
      function kt(h) {
        var d = Xe(h);
        return J(d) ? d : Qe(d);
      }
      function Ke(h) {
        return Array.isArray ? Array.isArray(h) : h instanceof Object ? h instanceof Array : Object.prototype.toString.call(h) === "[object Array]";
      }
      function Ot(h) {
        return typeof h == "function";
      }
      function ue(h) {
        return typeof h == "function";
      }
      function Gt(h) {
        switch (Ze(h)) {
          case 3:
            return !0;
          case 4:
            return !0;
          default:
            return !1;
        }
      }
      function de(h, d) {
        return h === d || h !== h && d !== d;
      }
      function Ee(h, d) {
        var f = h[d];
        if (f != null) {
          if (!Ot(f))
            throw new TypeError();
          return f;
        }
      }
      function Wt(h) {
        var d = Ee(h, l);
        if (!Ot(d))
          throw new TypeError();
        var f = d.call(h);
        if (!X(f))
          throw new TypeError();
        return f;
      }
      function pe(h) {
        return h.value;
      }
      function fe(h) {
        var d = h.next();
        return d.done ? !1 : d;
      }
      function Je(h) {
        var d = h.return;
        d && d.call(h);
      }
      function $e(h) {
        var d = Object.getPrototypeOf(h);
        if (typeof h != "function" || h === m || d !== m)
          return d;
        var f = h.prototype, y = f && Object.getPrototypeOf(f);
        if (y == null || y === Object.prototype)
          return d;
        var $ = y.constructor;
        return typeof $ != "function" || $ === h ? d : $;
      }
      function fi() {
        var h;
        !k(L) && typeof n.Reflect < "u" && !(L in n.Reflect) && typeof n.Reflect.defineMetadata == "function" && (h = se(n.Reflect));
        var d, f, y, $ = new O(), Y = {
          registerProvider: tt,
          getProvider: b,
          setProvider: A
        };
        return Y;
        function tt(x) {
          if (!Object.isExtensible(Y))
            throw new Error("Cannot add provider to a frozen registry.");
          switch (!0) {
            case h === x:
              break;
            case k(d):
              d = x;
              break;
            case d === x:
              break;
            case k(f):
              f = x;
              break;
            case f === x:
              break;
            default:
              y === void 0 && (y = new N()), y.add(x);
              break;
          }
        }
        function P(x, H) {
          if (!k(d)) {
            if (d.isProviderFor(x, H))
              return d;
            if (!k(f)) {
              if (f.isProviderFor(x, H))
                return d;
              if (!k(y))
                for (var q = Wt(y); ; ) {
                  var M = fe(q);
                  if (!M)
                    return;
                  var ht = pe(M);
                  if (ht.isProviderFor(x, H))
                    return Je(q), ht;
                }
            }
          }
          if (!k(h) && h.isProviderFor(x, H))
            return h;
        }
        function b(x, H) {
          var q = $.get(x), M;
          return k(q) || (M = q.get(H)), k(M) && (M = P(x, H), k(M) || (k(q) && (q = new w(), $.set(x, q)), q.set(H, M))), M;
        }
        function T(x) {
          if (k(x))
            throw new TypeError();
          return d === x || f === x || !k(y) && y.has(x);
        }
        function A(x, H, q) {
          if (!T(q))
            throw new Error("Metadata provider not registered.");
          var M = b(x, H);
          if (M !== q) {
            if (!k(M))
              return !1;
            var ht = $.get(x);
            k(ht) && (ht = new w(), $.set(x, ht)), ht.set(H, q);
          }
          return !0;
        }
      }
      function tn() {
        var h;
        return !k(L) && X(n.Reflect) && Object.isExtensible(n.Reflect) && (h = n.Reflect[L]), k(h) && (h = fi()), !k(L) && X(n.Reflect) && Object.isExtensible(n.Reflect) && Object.defineProperty(n.Reflect, L, {
          enumerable: !1,
          configurable: !1,
          writable: !1,
          value: h
        }), h;
      }
      function ge(h) {
        var d = new O(), f = {
          isProviderFor: function(T, A) {
            var x = d.get(T);
            return k(x) ? !1 : x.has(A);
          },
          OrdinaryDefineOwnMetadata: tt,
          OrdinaryHasOwnMetadata: $,
          OrdinaryGetOwnMetadata: Y,
          OrdinaryOwnMetadataKeys: P,
          OrdinaryDeleteMetadata: b
        };
        return ct.registerProvider(f), f;
        function y(T, A, x) {
          var H = d.get(T), q = !1;
          if (k(H)) {
            if (!x)
              return;
            H = new w(), d.set(T, H), q = !0;
          }
          var M = H.get(A);
          if (k(M)) {
            if (!x)
              return;
            if (M = new w(), H.set(A, M), !h.setProvider(T, A, f))
              throw H.delete(A), q && d.delete(T), new Error("Wrong provider for target.");
          }
          return M;
        }
        function $(T, A, x) {
          var H = y(
            A,
            x,
            /*Create*/
            !1
          );
          return k(H) ? !1 : Ye(H.has(T));
        }
        function Y(T, A, x) {
          var H = y(
            A,
            x,
            /*Create*/
            !1
          );
          if (!k(H))
            return H.get(T);
        }
        function tt(T, A, x, H) {
          var q = y(
            x,
            H,
            /*Create*/
            !0
          );
          q.set(T, A);
        }
        function P(T, A) {
          var x = [], H = y(
            T,
            A,
            /*Create*/
            !1
          );
          if (k(H))
            return x;
          for (var q = H.keys(), M = Wt(q), ht = 0; ; ) {
            var Nn = fe(M);
            if (!Nn)
              return x.length = ht, x;
            var Pn = pe(Nn);
            try {
              x[ht] = Pn;
            } catch (en) {
              try {
                Je(M);
              } finally {
                throw en;
              }
            }
            ht++;
          }
        }
        function b(T, A, x) {
          var H = y(
            A,
            x,
            /*Create*/
            !1
          );
          if (k(H) || !H.delete(T))
            return !1;
          if (H.size === 0) {
            var q = d.get(A);
            k(q) || (q.delete(x), q.size === 0 && d.delete(q));
          }
          return !0;
        }
      }
      function se(h) {
        var d = h.defineMetadata, f = h.hasOwnMetadata, y = h.getOwnMetadata, $ = h.getOwnMetadataKeys, Y = h.deleteMetadata, tt = new O(), P = {
          isProviderFor: function(b, T) {
            var A = tt.get(b);
            return !k(A) && A.has(T) ? !0 : $(b, T).length ? (k(A) && (A = new N(), tt.set(b, A)), A.add(T), !0) : !1;
          },
          OrdinaryDefineOwnMetadata: d,
          OrdinaryHasOwnMetadata: f,
          OrdinaryGetOwnMetadata: y,
          OrdinaryOwnMetadataKeys: $,
          OrdinaryDeleteMetadata: Y
        };
        return P;
      }
      function Et(h, d, f) {
        var y = ct.getProvider(h, d);
        if (!k(y))
          return y;
        if (f) {
          if (ct.setProvider(h, d, mt))
            return mt;
          throw new Error("Illegal state.");
        }
      }
      function On() {
        var h = {}, d = [], f = (
          /** @class */
          (function() {
            function P(b, T, A) {
              this._index = 0, this._keys = b, this._values = T, this._selector = A;
            }
            return P.prototype["@@iterator"] = function() {
              return this;
            }, P.prototype[l] = function() {
              return this;
            }, P.prototype.next = function() {
              var b = this._index;
              if (b >= 0 && b < this._keys.length) {
                var T = this._selector(this._keys[b], this._values[b]);
                return b + 1 >= this._keys.length ? (this._index = -1, this._keys = d, this._values = d) : this._index++, { value: T, done: !1 };
              }
              return { value: void 0, done: !0 };
            }, P.prototype.throw = function(b) {
              throw this._index >= 0 && (this._index = -1, this._keys = d, this._values = d), b;
            }, P.prototype.return = function(b) {
              return this._index >= 0 && (this._index = -1, this._keys = d, this._values = d), { value: b, done: !0 };
            }, P;
          })()
        ), y = (
          /** @class */
          (function() {
            function P() {
              this._keys = [], this._values = [], this._cacheKey = h, this._cacheIndex = -2;
            }
            return Object.defineProperty(P.prototype, "size", {
              get: function() {
                return this._keys.length;
              },
              enumerable: !0,
              configurable: !0
            }), P.prototype.has = function(b) {
              return this._find(
                b,
                /*insert*/
                !1
              ) >= 0;
            }, P.prototype.get = function(b) {
              var T = this._find(
                b,
                /*insert*/
                !1
              );
              return T >= 0 ? this._values[T] : void 0;
            }, P.prototype.set = function(b, T) {
              var A = this._find(
                b,
                /*insert*/
                !0
              );
              return this._values[A] = T, this;
            }, P.prototype.delete = function(b) {
              var T = this._find(
                b,
                /*insert*/
                !1
              );
              if (T >= 0) {
                for (var A = this._keys.length, x = T + 1; x < A; x++)
                  this._keys[x - 1] = this._keys[x], this._values[x - 1] = this._values[x];
                return this._keys.length--, this._values.length--, de(b, this._cacheKey) && (this._cacheKey = h, this._cacheIndex = -2), !0;
              }
              return !1;
            }, P.prototype.clear = function() {
              this._keys.length = 0, this._values.length = 0, this._cacheKey = h, this._cacheIndex = -2;
            }, P.prototype.keys = function() {
              return new f(this._keys, this._values, $);
            }, P.prototype.values = function() {
              return new f(this._keys, this._values, Y);
            }, P.prototype.entries = function() {
              return new f(this._keys, this._values, tt);
            }, P.prototype["@@iterator"] = function() {
              return this.entries();
            }, P.prototype[l] = function() {
              return this.entries();
            }, P.prototype._find = function(b, T) {
              if (!de(this._cacheKey, b)) {
                this._cacheIndex = -1;
                for (var A = 0; A < this._keys.length; A++)
                  if (de(this._keys[A], b)) {
                    this._cacheIndex = A;
                    break;
                  }
              }
              return this._cacheIndex < 0 && T && (this._cacheIndex = this._keys.length, this._keys.push(b), this._values.push(void 0)), this._cacheIndex;
            }, P;
          })()
        );
        return y;
        function $(P, b) {
          return P;
        }
        function Y(P, b) {
          return b;
        }
        function tt(P, b) {
          return [P, b];
        }
      }
      function Mn() {
        var h = (
          /** @class */
          (function() {
            function d() {
              this._map = new w();
            }
            return Object.defineProperty(d.prototype, "size", {
              get: function() {
                return this._map.size;
              },
              enumerable: !0,
              configurable: !0
            }), d.prototype.has = function(f) {
              return this._map.has(f);
            }, d.prototype.add = function(f) {
              return this._map.set(f, f), this;
            }, d.prototype.delete = function(f) {
              return this._map.delete(f);
            }, d.prototype.clear = function() {
              this._map.clear();
            }, d.prototype.keys = function() {
              return this._map.keys();
            }, d.prototype.values = function() {
              return this._map.keys();
            }, d.prototype.entries = function() {
              return this._map.entries();
            }, d.prototype["@@iterator"] = function() {
              return this.keys();
            }, d.prototype[l] = function() {
              return this.keys();
            }, d;
          })()
        );
        return h;
      }
      function Dn() {
        var h = 16, d = g.create(), f = y();
        return (
          /** @class */
          (function() {
            function b() {
              this._key = y();
            }
            return b.prototype.has = function(T) {
              var A = $(
                T,
                /*create*/
                !1
              );
              return A !== void 0 ? g.has(A, this._key) : !1;
            }, b.prototype.get = function(T) {
              var A = $(
                T,
                /*create*/
                !1
              );
              return A !== void 0 ? g.get(A, this._key) : void 0;
            }, b.prototype.set = function(T, A) {
              var x = $(
                T,
                /*create*/
                !0
              );
              return x[this._key] = A, this;
            }, b.prototype.delete = function(T) {
              var A = $(
                T,
                /*create*/
                !1
              );
              return A !== void 0 ? delete A[this._key] : !1;
            }, b.prototype.clear = function() {
              this._key = y();
            }, b;
          })()
        );
        function y() {
          var b;
          do
            b = "@@WeakMap@@" + P();
          while (g.has(d, b));
          return d[b] = !0, b;
        }
        function $(b, T) {
          if (!r.call(b, f)) {
            if (!T)
              return;
            Object.defineProperty(b, f, { value: g.create() });
          }
          return b[f];
        }
        function Y(b, T) {
          for (var A = 0; A < T; ++A)
            b[A] = Math.random() * 255 | 0;
          return b;
        }
        function tt(b) {
          if (typeof Uint8Array == "function") {
            var T = new Uint8Array(b);
            return typeof crypto < "u" ? crypto.getRandomValues(T) : typeof msCrypto < "u" ? msCrypto.getRandomValues(T) : Y(T, b), T;
          }
          return Y(new Array(b), b);
        }
        function P() {
          var b = tt(h);
          b[6] = b[6] & 79 | 64, b[8] = b[8] & 191 | 128;
          for (var T = "", A = 0; A < h; ++A) {
            var x = b[A];
            (A === 4 || A === 6 || A === 8) && (T += "-"), x < 16 && (T += "0"), T += x.toString(16).toLowerCase();
          }
          return T;
        }
      }
      function me(h) {
        return h.__ = void 0, delete h.__, h;
      }
    });
  })(i || (i = {})), Nr;
}
Ao();
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Fn = window, ar = Fn.ShadowRoot && (Fn.ShadyCSS === void 0 || Fn.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, lr = Symbol(), Lr = /* @__PURE__ */ new WeakMap();
let Is = class {
  constructor(t, e, n) {
    if (this._$cssResult$ = !0, n !== lr) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = e;
  }
  get styleSheet() {
    let t = this.o;
    const e = this.t;
    if (ar && t === void 0) {
      const n = e !== void 0 && e.length === 1;
      n && (t = Lr.get(e)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), n && Lr.set(e, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const ko = (i) => new Is(typeof i == "string" ? i : i + "", void 0, lr), zt = (i, ...t) => {
  const e = i.length === 1 ? i[0] : t.reduce(((n, r, s) => n + ((o) => {
    if (o._$cssResult$ === !0) return o.cssText;
    if (typeof o == "number") return o;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + o + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(r) + i[s + 1]), i[0]);
  return new Is(e, i, lr);
}, So = (i, t) => {
  ar ? i.adoptedStyleSheets = t.map(((e) => e instanceof CSSStyleSheet ? e : e.styleSheet)) : t.forEach(((e) => {
    const n = document.createElement("style"), r = Fn.litNonce;
    r !== void 0 && n.setAttribute("nonce", r), n.textContent = e.cssText, i.appendChild(n);
  }));
}, Hr = ar ? (i) => i : (i) => i instanceof CSSStyleSheet ? ((t) => {
  let e = "";
  for (const n of t.cssRules) e += n.cssText;
  return ko(e);
})(i) : i;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var yi;
const Gn = window, Ur = Gn.trustedTypes, Eo = Ur ? Ur.emptyScript : "", Br = Gn.reactiveElementPolyfillSupport, Pi = { toAttribute(i, t) {
  switch (t) {
    case Boolean:
      i = i ? Eo : null;
      break;
    case Object:
    case Array:
      i = i == null ? i : JSON.stringify(i);
  }
  return i;
}, fromAttribute(i, t) {
  let e = i;
  switch (t) {
    case Boolean:
      e = i !== null;
      break;
    case Number:
      e = i === null ? null : Number(i);
      break;
    case Object:
    case Array:
      try {
        e = JSON.parse(i);
      } catch {
        e = null;
      }
  }
  return e;
} }, Rs = (i, t) => t !== i && (t == t || i == i), vi = { attribute: !0, type: String, converter: Pi, reflect: !1, hasChanged: Rs }, Li = "finalized";
let Re = class extends HTMLElement {
  constructor() {
    super(), this._$Ei = /* @__PURE__ */ new Map(), this.isUpdatePending = !1, this.hasUpdated = !1, this._$El = null, this._$Eu();
  }
  static addInitializer(t) {
    var e;
    this.finalize(), ((e = this.h) !== null && e !== void 0 ? e : this.h = []).push(t);
  }
  static get observedAttributes() {
    this.finalize();
    const t = [];
    return this.elementProperties.forEach(((e, n) => {
      const r = this._$Ep(n, e);
      r !== void 0 && (this._$Ev.set(r, n), t.push(r));
    })), t;
  }
  static createProperty(t, e = vi) {
    if (e.state && (e.attribute = !1), this.finalize(), this.elementProperties.set(t, e), !e.noAccessor && !this.prototype.hasOwnProperty(t)) {
      const n = typeof t == "symbol" ? Symbol() : "__" + t, r = this.getPropertyDescriptor(t, n, e);
      r !== void 0 && Object.defineProperty(this.prototype, t, r);
    }
  }
  static getPropertyDescriptor(t, e, n) {
    return { get() {
      return this[e];
    }, set(r) {
      const s = this[t];
      this[e] = r, this.requestUpdate(t, s, n);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) || vi;
  }
  static finalize() {
    if (this.hasOwnProperty(Li)) return !1;
    this[Li] = !0;
    const t = Object.getPrototypeOf(this);
    if (t.finalize(), t.h !== void 0 && (this.h = [...t.h]), this.elementProperties = new Map(t.elementProperties), this._$Ev = /* @__PURE__ */ new Map(), this.hasOwnProperty("properties")) {
      const e = this.properties, n = [...Object.getOwnPropertyNames(e), ...Object.getOwnPropertySymbols(e)];
      for (const r of n) this.createProperty(r, e[r]);
    }
    return this.elementStyles = this.finalizeStyles(this.styles), !0;
  }
  static finalizeStyles(t) {
    const e = [];
    if (Array.isArray(t)) {
      const n = new Set(t.flat(1 / 0).reverse());
      for (const r of n) e.unshift(Hr(r));
    } else t !== void 0 && e.push(Hr(t));
    return e;
  }
  static _$Ep(t, e) {
    const n = e.attribute;
    return n === !1 ? void 0 : typeof n == "string" ? n : typeof t == "string" ? t.toLowerCase() : void 0;
  }
  _$Eu() {
    var t;
    this._$E_ = new Promise(((e) => this.enableUpdating = e)), this._$AL = /* @__PURE__ */ new Map(), this._$Eg(), this.requestUpdate(), (t = this.constructor.h) === null || t === void 0 || t.forEach(((e) => e(this)));
  }
  addController(t) {
    var e, n;
    ((e = this._$ES) !== null && e !== void 0 ? e : this._$ES = []).push(t), this.renderRoot !== void 0 && this.isConnected && ((n = t.hostConnected) === null || n === void 0 || n.call(t));
  }
  removeController(t) {
    var e;
    (e = this._$ES) === null || e === void 0 || e.splice(this._$ES.indexOf(t) >>> 0, 1);
  }
  _$Eg() {
    this.constructor.elementProperties.forEach(((t, e) => {
      this.hasOwnProperty(e) && (this._$Ei.set(e, this[e]), delete this[e]);
    }));
  }
  createRenderRoot() {
    var t;
    const e = (t = this.shadowRoot) !== null && t !== void 0 ? t : this.attachShadow(this.constructor.shadowRootOptions);
    return So(e, this.constructor.elementStyles), e;
  }
  connectedCallback() {
    var t;
    this.renderRoot === void 0 && (this.renderRoot = this.createRenderRoot()), this.enableUpdating(!0), (t = this._$ES) === null || t === void 0 || t.forEach(((e) => {
      var n;
      return (n = e.hostConnected) === null || n === void 0 ? void 0 : n.call(e);
    }));
  }
  enableUpdating(t) {
  }
  disconnectedCallback() {
    var t;
    (t = this._$ES) === null || t === void 0 || t.forEach(((e) => {
      var n;
      return (n = e.hostDisconnected) === null || n === void 0 ? void 0 : n.call(e);
    }));
  }
  attributeChangedCallback(t, e, n) {
    this._$AK(t, n);
  }
  _$EO(t, e, n = vi) {
    var r;
    const s = this.constructor._$Ep(t, n);
    if (s !== void 0 && n.reflect === !0) {
      const o = (((r = n.converter) === null || r === void 0 ? void 0 : r.toAttribute) !== void 0 ? n.converter : Pi).toAttribute(e, n.type);
      this._$El = t, o == null ? this.removeAttribute(s) : this.setAttribute(s, o), this._$El = null;
    }
  }
  _$AK(t, e) {
    var n;
    const r = this.constructor, s = r._$Ev.get(t);
    if (s !== void 0 && this._$El !== s) {
      const o = r.getPropertyOptions(s), l = typeof o.converter == "function" ? { fromAttribute: o.converter } : ((n = o.converter) === null || n === void 0 ? void 0 : n.fromAttribute) !== void 0 ? o.converter : Pi;
      this._$El = s, this[s] = l.fromAttribute(e, o.type), this._$El = null;
    }
  }
  requestUpdate(t, e, n) {
    let r = !0;
    t !== void 0 && (((n = n || this.constructor.getPropertyOptions(t)).hasChanged || Rs)(this[t], e) ? (this._$AL.has(t) || this._$AL.set(t, e), n.reflect === !0 && this._$El !== t && (this._$EC === void 0 && (this._$EC = /* @__PURE__ */ new Map()), this._$EC.set(t, n))) : r = !1), !this.isUpdatePending && r && (this._$E_ = this._$Ej());
  }
  async _$Ej() {
    this.isUpdatePending = !0;
    try {
      await this._$E_;
    } catch (e) {
      Promise.reject(e);
    }
    const t = this.scheduleUpdate();
    return t != null && await t, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    var t;
    if (!this.isUpdatePending) return;
    this.hasUpdated, this._$Ei && (this._$Ei.forEach(((r, s) => this[s] = r)), this._$Ei = void 0);
    let e = !1;
    const n = this._$AL;
    try {
      e = this.shouldUpdate(n), e ? (this.willUpdate(n), (t = this._$ES) === null || t === void 0 || t.forEach(((r) => {
        var s;
        return (s = r.hostUpdate) === null || s === void 0 ? void 0 : s.call(r);
      })), this.update(n)) : this._$Ek();
    } catch (r) {
      throw e = !1, this._$Ek(), r;
    }
    e && this._$AE(n);
  }
  willUpdate(t) {
  }
  _$AE(t) {
    var e;
    (e = this._$ES) === null || e === void 0 || e.forEach(((n) => {
      var r;
      return (r = n.hostUpdated) === null || r === void 0 ? void 0 : r.call(n);
    })), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(t)), this.updated(t);
  }
  _$Ek() {
    this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = !1;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$E_;
  }
  shouldUpdate(t) {
    return !0;
  }
  update(t) {
    this._$EC !== void 0 && (this._$EC.forEach(((e, n) => this._$EO(n, this[n], e))), this._$EC = void 0), this._$Ek();
  }
  updated(t) {
  }
  firstUpdated(t) {
  }
};
Re[Li] = !0, Re.elementProperties = /* @__PURE__ */ new Map(), Re.elementStyles = [], Re.shadowRootOptions = { mode: "open" }, Br == null || Br({ ReactiveElement: Re }), ((yi = Gn.reactiveElementVersions) !== null && yi !== void 0 ? yi : Gn.reactiveElementVersions = []).push("1.6.3");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var bi;
const Wn = window, Me = Wn.trustedTypes, jr = Me ? Me.createPolicy("lit-html", { createHTML: (i) => i }) : void 0, Hi = "$lit$", oe = `lit$${(Math.random() + "").slice(9)}$`, Os = "?" + oe, $o = `<${Os}>`, we = document, gn = () => we.createComment(""), mn = (i) => i === null || typeof i != "object" && typeof i != "function", Ms = Array.isArray, Io = (i) => Ms(i) || typeof (i == null ? void 0 : i[Symbol.iterator]) == "function", wi = `[ 	
\f\r]`, nn = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, zr = /-->/g, Fr = />/g, ye = RegExp(`>|${wi}(?:([^\\s"'>=/]+)(${wi}*=${wi}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), qr = /'/g, Vr = /"/g, Ds = /^(?:script|style|textarea|title)$/i, Ro = (i) => (t, ...e) => ({ _$litType$: i, strings: t, values: e }), E = Ro(1), Ce = Symbol.for("lit-noChange"), ot = Symbol.for("lit-nothing"), Gr = /* @__PURE__ */ new WeakMap(), ve = we.createTreeWalker(we, 129, null, !1);
function Ns(i, t) {
  if (!Array.isArray(i) || !i.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return jr !== void 0 ? jr.createHTML(t) : t;
}
const Oo = (i, t) => {
  const e = i.length - 1, n = [];
  let r, s = t === 2 ? "<svg>" : "", o = nn;
  for (let l = 0; l < e; l++) {
    const a = i[l];
    let u, p, g = -1, m = 0;
    for (; m < a.length && (o.lastIndex = m, p = o.exec(a), p !== null); ) m = o.lastIndex, o === nn ? p[1] === "!--" ? o = zr : p[1] !== void 0 ? o = Fr : p[2] !== void 0 ? (Ds.test(p[2]) && (r = RegExp("</" + p[2], "g")), o = ye) : p[3] !== void 0 && (o = ye) : o === ye ? p[0] === ">" ? (o = r ?? nn, g = -1) : p[1] === void 0 ? g = -2 : (g = o.lastIndex - p[2].length, u = p[1], o = p[3] === void 0 ? ye : p[3] === '"' ? Vr : qr) : o === Vr || o === qr ? o = ye : o === zr || o === Fr ? o = nn : (o = ye, r = void 0);
    const w = o === ye && i[l + 1].startsWith("/>") ? " " : "";
    s += o === nn ? a + $o : g >= 0 ? (n.push(u), a.slice(0, g) + Hi + a.slice(g) + oe + w) : a + oe + (g === -2 ? (n.push(void 0), l) : w);
  }
  return [Ns(i, s + (i[e] || "<?>") + (t === 2 ? "</svg>" : "")), n];
};
let Ui = class Ps {
  constructor({ strings: t, _$litType$: e }, n) {
    let r;
    this.parts = [];
    let s = 0, o = 0;
    const l = t.length - 1, a = this.parts, [u, p] = Oo(t, e);
    if (this.el = Ps.createElement(u, n), ve.currentNode = this.el.content, e === 2) {
      const g = this.el.content, m = g.firstChild;
      m.remove(), g.append(...m.childNodes);
    }
    for (; (r = ve.nextNode()) !== null && a.length < l; ) {
      if (r.nodeType === 1) {
        if (r.hasAttributes()) {
          const g = [];
          for (const m of r.getAttributeNames()) if (m.endsWith(Hi) || m.startsWith(oe)) {
            const w = p[o++];
            if (g.push(m), w !== void 0) {
              const N = r.getAttribute(w.toLowerCase() + Hi).split(oe), O = /([.?@])?(.*)/.exec(w);
              a.push({ type: 1, index: s, name: O[2], strings: N, ctor: O[1] === "." ? Do : O[1] === "?" ? Po : O[1] === "@" ? Lo : si });
            } else a.push({ type: 6, index: s });
          }
          for (const m of g) r.removeAttribute(m);
        }
        if (Ds.test(r.tagName)) {
          const g = r.textContent.split(oe), m = g.length - 1;
          if (m > 0) {
            r.textContent = Me ? Me.emptyScript : "";
            for (let w = 0; w < m; w++) r.append(g[w], gn()), ve.nextNode(), a.push({ type: 2, index: ++s });
            r.append(g[m], gn());
          }
        }
      } else if (r.nodeType === 8) if (r.data === Os) a.push({ type: 2, index: s });
      else {
        let g = -1;
        for (; (g = r.data.indexOf(oe, g + 1)) !== -1; ) a.push({ type: 7, index: s }), g += oe.length - 1;
      }
      s++;
    }
  }
  static createElement(t, e) {
    const n = we.createElement("template");
    return n.innerHTML = t, n;
  }
};
function De(i, t, e = i, n) {
  var r, s, o, l;
  if (t === Ce) return t;
  let a = n !== void 0 ? (r = e._$Co) === null || r === void 0 ? void 0 : r[n] : e._$Cl;
  const u = mn(t) ? void 0 : t._$litDirective$;
  return (a == null ? void 0 : a.constructor) !== u && ((s = a == null ? void 0 : a._$AO) === null || s === void 0 || s.call(a, !1), u === void 0 ? a = void 0 : (a = new u(i), a._$AT(i, e, n)), n !== void 0 ? ((o = (l = e)._$Co) !== null && o !== void 0 ? o : l._$Co = [])[n] = a : e._$Cl = a), a !== void 0 && (t = De(i, a._$AS(i, t.values), a, n)), t;
}
let Mo = class {
  constructor(t, e) {
    this._$AV = [], this._$AN = void 0, this._$AD = t, this._$AM = e;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(t) {
    var e;
    const { el: { content: n }, parts: r } = this._$AD, s = ((e = t == null ? void 0 : t.creationScope) !== null && e !== void 0 ? e : we).importNode(n, !0);
    ve.currentNode = s;
    let o = ve.nextNode(), l = 0, a = 0, u = r[0];
    for (; u !== void 0; ) {
      if (l === u.index) {
        let p;
        u.type === 2 ? p = new An(o, o.nextSibling, this, t) : u.type === 1 ? p = new u.ctor(o, u.name, u.strings, this, t) : u.type === 6 && (p = new Ho(o, this, t)), this._$AV.push(p), u = r[++a];
      }
      l !== (u == null ? void 0 : u.index) && (o = ve.nextNode(), l++);
    }
    return ve.currentNode = we, s;
  }
  v(t) {
    let e = 0;
    for (const n of this._$AV) n !== void 0 && (n.strings !== void 0 ? (n._$AI(t, n, e), e += n.strings.length - 2) : n._$AI(t[e])), e++;
  }
};
class An {
  constructor(t, e, n, r) {
    var s;
    this.type = 2, this._$AH = ot, this._$AN = void 0, this._$AA = t, this._$AB = e, this._$AM = n, this.options = r, this._$Cp = (s = r == null ? void 0 : r.isConnected) === null || s === void 0 || s;
  }
  get _$AU() {
    var t, e;
    return (e = (t = this._$AM) === null || t === void 0 ? void 0 : t._$AU) !== null && e !== void 0 ? e : this._$Cp;
  }
  get parentNode() {
    let t = this._$AA.parentNode;
    const e = this._$AM;
    return e !== void 0 && (t == null ? void 0 : t.nodeType) === 11 && (t = e.parentNode), t;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t, e = this) {
    t = De(this, t, e), mn(t) ? t === ot || t == null || t === "" ? (this._$AH !== ot && this._$AR(), this._$AH = ot) : t !== this._$AH && t !== Ce && this._(t) : t._$litType$ !== void 0 ? this.g(t) : t.nodeType !== void 0 ? this.$(t) : Io(t) ? this.T(t) : this._(t);
  }
  k(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  $(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.k(t));
  }
  _(t) {
    this._$AH !== ot && mn(this._$AH) ? this._$AA.nextSibling.data = t : this.$(we.createTextNode(t)), this._$AH = t;
  }
  g(t) {
    var e;
    const { values: n, _$litType$: r } = t, s = typeof r == "number" ? this._$AC(t) : (r.el === void 0 && (r.el = Ui.createElement(Ns(r.h, r.h[0]), this.options)), r);
    if (((e = this._$AH) === null || e === void 0 ? void 0 : e._$AD) === s) this._$AH.v(n);
    else {
      const o = new Mo(s, this), l = o.u(this.options);
      o.v(n), this.$(l), this._$AH = o;
    }
  }
  _$AC(t) {
    let e = Gr.get(t.strings);
    return e === void 0 && Gr.set(t.strings, e = new Ui(t)), e;
  }
  T(t) {
    Ms(this._$AH) || (this._$AH = [], this._$AR());
    const e = this._$AH;
    let n, r = 0;
    for (const s of t) r === e.length ? e.push(n = new An(this.k(gn()), this.k(gn()), this, this.options)) : n = e[r], n._$AI(s), r++;
    r < e.length && (this._$AR(n && n._$AB.nextSibling, r), e.length = r);
  }
  _$AR(t = this._$AA.nextSibling, e) {
    var n;
    for ((n = this._$AP) === null || n === void 0 || n.call(this, !1, !0, e); t && t !== this._$AB; ) {
      const r = t.nextSibling;
      t.remove(), t = r;
    }
  }
  setConnected(t) {
    var e;
    this._$AM === void 0 && (this._$Cp = t, (e = this._$AP) === null || e === void 0 || e.call(this, t));
  }
}
let si = class {
  constructor(t, e, n, r, s) {
    this.type = 1, this._$AH = ot, this._$AN = void 0, this.element = t, this.name = e, this._$AM = r, this.options = s, n.length > 2 || n[0] !== "" || n[1] !== "" ? (this._$AH = Array(n.length - 1).fill(new String()), this.strings = n) : this._$AH = ot;
  }
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t, e = this, n, r) {
    const s = this.strings;
    let o = !1;
    if (s === void 0) t = De(this, t, e, 0), o = !mn(t) || t !== this._$AH && t !== Ce, o && (this._$AH = t);
    else {
      const l = t;
      let a, u;
      for (t = s[0], a = 0; a < s.length - 1; a++) u = De(this, l[n + a], e, a), u === Ce && (u = this._$AH[a]), o || (o = !mn(u) || u !== this._$AH[a]), u === ot ? t = ot : t !== ot && (t += (u ?? "") + s[a + 1]), this._$AH[a] = u;
    }
    o && !r && this.j(t);
  }
  j(t) {
    t === ot ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}, Do = class extends si {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === ot ? void 0 : t;
  }
};
const No = Me ? Me.emptyScript : "";
let Po = class extends si {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    t && t !== ot ? this.element.setAttribute(this.name, No) : this.element.removeAttribute(this.name);
  }
}, Lo = class extends si {
  constructor(t, e, n, r, s) {
    super(t, e, n, r, s), this.type = 5;
  }
  _$AI(t, e = this) {
    var n;
    if ((t = (n = De(this, t, e, 0)) !== null && n !== void 0 ? n : ot) === Ce) return;
    const r = this._$AH, s = t === ot && r !== ot || t.capture !== r.capture || t.once !== r.once || t.passive !== r.passive, o = t !== ot && (r === ot || s);
    s && this.element.removeEventListener(this.name, this, r), o && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    var e, n;
    typeof this._$AH == "function" ? this._$AH.call((n = (e = this.options) === null || e === void 0 ? void 0 : e.host) !== null && n !== void 0 ? n : this.element, t) : this._$AH.handleEvent(t);
  }
}, Ho = class {
  constructor(t, e, n) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = e, this.options = n;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    De(this, t);
  }
};
const Wr = Wn.litHtmlPolyfillSupport;
Wr == null || Wr(Ui, An), ((bi = Wn.litHtmlVersions) !== null && bi !== void 0 ? bi : Wn.litHtmlVersions = []).push("2.8.0");
const Uo = (i, t, e) => {
  var n, r;
  const s = (n = e == null ? void 0 : e.renderBefore) !== null && n !== void 0 ? n : t;
  let o = s._$litPart$;
  if (o === void 0) {
    const l = (r = e == null ? void 0 : e.renderBefore) !== null && r !== void 0 ? r : null;
    s._$litPart$ = o = new An(t.insertBefore(gn(), l), l, void 0, e ?? {});
  }
  return o._$AI(i), o;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var Ci, Ti;
let yt = class extends Re {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    var t, e;
    const n = super.createRenderRoot();
    return (t = (e = this.renderOptions).renderBefore) !== null && t !== void 0 || (e.renderBefore = n.firstChild), n;
  }
  update(t) {
    const e = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = Uo(e, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    var t;
    super.connectedCallback(), (t = this._$Do) === null || t === void 0 || t.setConnected(!0);
  }
  disconnectedCallback() {
    var t;
    super.disconnectedCallback(), (t = this._$Do) === null || t === void 0 || t.setConnected(!1);
  }
  render() {
    return Ce;
  }
};
yt.finalized = !0, yt._$litElement$ = !0, (Ci = globalThis.litElementHydrateSupport) === null || Ci === void 0 || Ci.call(globalThis, { LitElement: yt });
const Zr = globalThis.litElementPolyfillSupport;
Zr == null || Zr({ LitElement: yt });
((Ti = globalThis.litElementVersions) !== null && Ti !== void 0 ? Ti : globalThis.litElementVersions = []).push("3.3.3");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Nt = (i) => (t) => typeof t == "function" ? ((e, n) => (customElements.define(e, n), n))(i, t) : ((e, n) => {
  const { kind: r, elements: s } = n;
  return { kind: r, elements: s, finisher(o) {
    customElements.define(e, o);
  } };
})(i, t);
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Bo = (i, t) => t.kind === "method" && t.descriptor && !("value" in t.descriptor) ? { ...t, finisher(e) {
  e.createProperty(t.key, i);
} } : { kind: "field", key: Symbol(), placement: "own", descriptor: {}, originalKey: t.key, initializer() {
  typeof t.initializer == "function" && (this[t.key] = t.initializer.call(this));
}, finisher(e) {
  e.createProperty(t.key, i);
} }, jo = (i, t, e) => {
  t.constructor.createProperty(e, i);
};
function D(i) {
  return (t, e) => e !== void 0 ? jo(i, t, e) : Bo(i, t);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function ke(i) {
  return D({ ...i, state: !0 });
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const zo = ({ finisher: i, descriptor: t }) => (e, n) => {
  var r;
  if (n === void 0) {
    const s = (r = e.originalKey) !== null && r !== void 0 ? r : e.key, o = t != null ? { kind: "method", placement: "prototype", key: s, descriptor: t(e.key) } : { ...e, key: s };
    return i != null && (o.finisher = function(l) {
      i(l, s);
    }), o;
  }
  {
    const s = e.constructor;
    t !== void 0 && Object.defineProperty(e, n, t(n)), i == null || i(s, n);
  }
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function Ls(i, t) {
  return zo({ descriptor: (e) => ({ get() {
    var r, s;
    return (s = (r = this.renderRoot) === null || r === void 0 ? void 0 : r.querySelector(i)) !== null && s !== void 0 ? s : null;
  }, enumerable: !0, configurable: !0 }) });
}
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var xi;
((xi = window.HTMLSlotElement) === null || xi === void 0 ? void 0 : xi.prototype.assignedElements) != null;
const Fo = zt`
  a svg {
    width: calc(var(--width-base) - var(--d-small));
    height: calc(var(--width-base) - var(--d-small));
    position: relative;
    z-index: 1;
  }
  a {
    flex-shrink: 0;
    border-radius: calc(var(--radius-large) * 3);
    border: var(--border-thicker) solid transparent;
    background-origin: border-box;
    background-clip: content-box, border-box;
    background-size: cover;
    background-image: linear-gradient(to right, var(--c-accent-light), var(--c-accent-high));
    width: calc(var(--d-xlarge) * 2);
    height: calc(var(--d-xlarge) * 2);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: var(--d-large);
    overflow: hidden;
    padding: var(--d-small);
    position: relative;
  }
  a::after {
    content: '';
    border-radius: calc(var(--radius-large) * 3);
    width: calc(var(--width-base) - var(--d-small));
    height: calc(var(--width-base) - var(--d-small));
    position: absolute;
    background-color: var(--c-secondary);
  }
`;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const qo = { CHILD: 2 }, Hs = (i) => (...t) => ({ _$litDirective$: i, values: t });
let Vo = class {
  constructor(t) {
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AT(t, e, n) {
    this._$Ct = t, this._$AM = e, this._$Ci = n;
  }
  _$AS(t, e) {
    return this.update(t, e);
  }
  update(t, e) {
    return this.render(...e);
  }
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
let Zn = class extends Vo {
  constructor(t) {
    if (super(t), this.et = ot, t.type !== qo.CHILD) throw Error(this.constructor.directiveName + "() can only be used in child bindings");
  }
  render(t) {
    if (t === ot || t == null) return this.ft = void 0, this.et = t;
    if (t === Ce) return t;
    if (typeof t != "string") throw Error(this.constructor.directiveName + "() called with a non-string value");
    if (t === this.et) return this.ft;
    this.et = t;
    const e = [t];
    return e.raw = e, this.ft = { _$litType$: this.constructor.resultType, strings: e, values: [] };
  }
};
Zn.directiveName = "unsafeHTML", Zn.resultType = 1;
const Xn = Hs(Zn);
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
let Bi = class extends Zn {
};
Bi.directiveName = "unsafeSVG", Bi.resultType = 2;
const jt = Hs(Bi);
var Go = Object.defineProperty, Wo = Object.getOwnPropertyDescriptor, oi = (i, t, e, n) => {
  for (var r = n > 1 ? void 0 : n ? Wo(t, e) : t, s = i.length - 1, o; s >= 0; s--)
    (o = i[s]) && (r = (n ? o(t, e, r) : o(r)) || r);
  return n && r && Go(t, e, r), r;
};
let Ne = class extends yt {
  constructor() {
    super(...arguments), this.label = "", this.svgIcon = "", this.url = "";
  }
  render() {
    return E`
      <a title="${this.label}" href="${this.url}" target="_blank" rel="noopener noreferrer">
        ${jt(this.svgIcon)}
      </a>
    `;
  }
};
Ne.styles = [Fo];
oi([
  D({ type: String })
], Ne.prototype, "label", 2);
oi([
  D({ type: String })
], Ne.prototype, "svgIcon", 2);
oi([
  D({ type: String })
], Ne.prototype, "url", 2);
Ne = oi([
  Nt("link-icon")
], Ne);
const Zo = zt`
  .chat-stage__header {
    display: flex;
    width: var(--width-base);
    margin: 0 auto var(--d-large);
    justify-content: center;
    align-items: center;

    @media (min-width: 1024px) {
      width: var(--width-narrow);
    }
  }
  .chat-stage__link svg {
    width: calc(var(--width-base) - var(--d-small));
    height: calc(var(--width-base) - var(--d-small));
    position: relative;
    z-index: 1;
  }
  .chat-stage__link {
    flex-shrink: 0;
    border-radius: calc(var(--radius-large) * 3);
    border: var(--border-thicker) solid transparent;
    background-origin: border-box;
    background-clip: content-box, border-box;
    background-size: cover;
    background-image: linear-gradient(to right, var(--c-accent-light), var(--c-accent-high));
    width: calc(var(--d-xlarge) * 2);
    height: calc(var(--d-xlarge) * 2);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: var(--d-large);
    overflow: hidden;
    padding: var(--d-small);
    position: relative;
  }
  .chat-stage__link::after {
    content: '';
    border-radius: calc(var(--radius-large) * 3);
    width: calc(var(--width-base) - var(--d-small));
    height: calc(var(--width-base) - var(--d-small));
    position: absolute;
    background-color: var(--c-secondary);
  }
`;
var Xo = Object.defineProperty, Yo = Object.getOwnPropertyDescriptor, ai = (i, t, e, n) => {
  for (var r = n > 1 ? void 0 : n ? Yo(t, e) : t, s = i.length - 1, o; s >= 0; s--)
    (o = i[s]) && (r = (n ? o(t, e, r) : o(r)) || r);
  return n && r && Xo(t, e, r), r;
};
let Pe = class extends yt {
  constructor() {
    super(...arguments), this.pagetitle = "", this.url = "", this.svgIcon = "";
  }
  render() {
    return E`
      <header class="chat-stage__header" data-testid="chat-branding">
        <link-icon url="${this.url}" svgIcon="${this.svgIcon}"></link-icon>
        <h1 class="chat-stage__hl">${this.pagetitle}</h1>
      </header>
    `;
  }
};
Pe.styles = [Zo];
ai([
  D({ type: String })
], Pe.prototype, "pagetitle", 2);
ai([
  D({ type: String })
], Pe.prototype, "url", 2);
ai([
  D({ type: String })
], Pe.prototype, "svgIcon", 2);
Pe = ai([
  Nt("chat-stage")
], Pe);
const Qo = zt`
  @keyframes spinneranimation {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
  p {
    display: flex;
    align-items: center;
  }
  svg {
    width: var(--d-large);
    height: 30px;
    fill: var(--c-accent-light);
    animation: spinneranimation 1s linear infinite;
    margin-right: 10px;
  }
`, Ko = `<svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">\r
  <path d="M10 3.5C6.41015 3.5 3.5 6.41015 3.5 10C3.5 10.4142 3.16421 10.75 2.75 10.75C2.33579 10.75 2 10.4142 2 10C2 5.58172 5.58172 2 10 2C14.4183 2 18 5.58172 18 10C18 14.4183 14.4183 18 10 18C9.58579 18 9.25 17.6642 9.25 17.25C9.25 16.8358 9.58579 16.5 10 16.5C13.5899 16.5 16.5 13.5899 16.5 10C16.5 6.41015 13.5899 3.5 10 3.5Z" />\r
</svg>`;
var Jo = Object.defineProperty, ta = Object.getOwnPropertyDescriptor, Us = (i, t, e, n) => {
  for (var r = n > 1 ? void 0 : n ? ta(t, e) : t, s = i.length - 1, o; s >= 0; s--)
    (o = i[s]) && (r = (n ? o(t, e, r) : o(r)) || r);
  return n && r && Jo(t, e, r), r;
};
let Yn = class extends yt {
  constructor() {
    super(...arguments), this.label = "";
  }
  render() {
    return E`
      <p data-testid="loading-indicator" aria-label="${this.label}">
        <span>${jt(Ko)}</span>
        <span>${this.label}</span>
      </p>
    `;
  }
};
Yn.styles = [Qo];
Us([
  D({ type: String })
], Yn.prototype, "label", 2);
Yn = Us([
  Nt("loading-indicator")
], Yn);
const ea = zt`
  .subheadline--small {
    font-size: 12px;
    display: inline-block;
  }
  .items__list {
    border-top: none;
    padding: 0 var(--d-base);
    margin: var(--d-small) 0;
    display: block;
  }
  .items__listItem {
    display: inline-block;
    background-color: var(--c-accent-light);
    border-radius: var(--radius-small);
    text-decoration: none;
    padding: var(--d-xsmall);
    margin-top: 5px;
    font-size: var(--font-small);
  }
  .items__listItem.active {
    background-color: var(--c-accent-high);
  }
  .items__listItem:not(first-child) {
    margin-left: 5px;
  }
  .items__link {
    text-decoration: none;
    color: var(--text-color);
  }
  .items__listItem.active .items__link {
    color: var(--c-white);
  }
`;
var na = Object.defineProperty, ia = Object.getOwnPropertyDescriptor, li = (i, t, e, n) => {
  for (var r = n > 1 ? void 0 : n ? ia(t, e) : t, s = i.length - 1, o; s >= 0; s--)
    (o = i[s]) && (r = (n ? o(t, e, r) : o(r)) || r);
  return n && r && na(t, e, r), r;
};
let Le = class extends yt {
  constructor() {
    super(...arguments), this.label = void 0, this.citations = void 0, this.selectedCitation = void 0;
  }
  handleCitationClick(i, t) {
    t.preventDefault(), this.selectedCitation = i;
    const e = new CustomEvent("on-citation-click", {
      detail: {
        citation: i
      },
      bubbles: !0,
      composed: !0
    });
    this.dispatchEvent(e);
  }
  compareCitation(i, t) {
    return !!(i && t && i.text === t.text);
  }
  renderCitation(i) {
    return i && i.length > 0 ? E`
        <ol class="items__list">
          ${this.label ? E`<h3 class="subheadline--small">${this.label}</h3>` : ""}
          ${i.map(
      (t) => E`
              <li class="items__listItem ${this.compareCitation(t, this.selectedCitation) ? "active" : ""}">
                <a
                  class="items__link"
                  href="#"
                  data-testid="citation"
                  @click="${(e) => this.handleCitationClick(t, e)}"
                  >${t.ref}. ${t.text}</a
                >
              </li>
            `
    )}
        </ol>
      ` : "";
  }
  render() {
    return this.renderCitation(this.citations);
  }
};
Le.styles = [ea];
li([
  D({ type: String })
], Le.prototype, "label", 2);
li([
  D({ type: Array })
], Le.prototype, "citations", 2);
li([
  D({ type: Object })
], Le.prototype, "selectedCitation", 2);
Le = li([
  Nt("citation-list")
], Le);
const ra = zt`
  ul {
    margin-block-start: 0;
    margin-block-end: 0;
  }
  @keyframes chatmessageanimation {
    0% {
      opacity: 0.5;
      top: 150px;
    }
    100% {
      opacity: 1;
      top: 0;
    }
  }
  .chat__header--button {
    display: flex;
    align-items: center;
  }
  .chat__header {
    display: flex;
    align-items: top;
    justify-content: flex-end;
    padding: var(--d-base);
  }
  .chat__header--button {
    margin-right: var(--d-base);
  }
  .chat__list {
    color: var(--text-color);
    display: flex;
    flex-direction: column;
    list-style-position: inside;
    padding-inline-start: 0;
  }
  .chat__footer {
    width: 100%;
    height: calc(var(--d-large) + var(--d-base));
  }
  .chat__listItem {
    max-width: var(--width-wide);
    min-width: var(--width-base);
    display: flex;
    flex-direction: column;
    height: auto;

    @media (min-width: 768px) {
      max-width: 55%;
      min-width: var(--width-narrow);
    }
  }
  .chat__txt {
    animation: chatmessageanimation 0.5s ease-in-out;
    background-color: var(--c-secondary);
    color: var(--text-color);
    border-radius: var(--radius-base);
    margin-top: 8px;
    word-wrap: break-word;
    margin-block-end: 0;
    position: relative;
    box-shadow: var(--shadow);
    border: var(--border-thin) solid var(--c-light-gray);
  }
  .chat__txt.error {
    border: var(--border-base) solid var(--error-color);
    color: var(--error-color);
    padding: var(--d-base);
    background: var(--c-error-background);
  }
  .chat__txt.user-message {
    background: linear-gradient(to left, var(--c-accent-dark), var(--c-accent-high));
    color: var(--c-white);
    border: var(--border-thin) solid var(--c-accent-light);
  }
  .chat__listItem.user-message {
    align-self: flex-end;
  }
  .chat__txt--entry {
    padding: 0 var(--d-base);
  }
  .chat__txt--info {
    font-size: smaller;
    font-style: italic;
    margin: 0;
    margin-top: var(--border-thin);
  }
  .user-message .chat__txt--info {
    text-align: right;
  }
  .items__listWrapper {
    border-top: var(--border-thin) solid var(--c-light-gray);
    display: grid;
    padding: 0 var(--d-base);
    grid-template-columns: 1fr 18fr;
  }
  .items__listWrapper svg {
    fill: var(--c-accent-high);
    width: var(--d-large);
    margin: var(--d-large) auto;
  }
  svg {
    height: auto;
    fill: var(--text-color);
  }
  .items__list.followup {
    display: flex;
    flex-direction: row;
    padding: var(--d-base);
    list-style-type: none;
    flex-wrap: wrap;
  }
  .items__list.steps {
    padding: 0 var(--d-base) 0 var(--d-xlarge);
    list-style-type: disc;
  }
  .chat__citations {
    border-top: var(--border-thin) solid var(--c-light-gray);
  }
  .items__list {
    margin: var(--d-small) 0;
    display: block;
    padding: 0 var(--d-base);
  }
  .items__listItem--followup {
    cursor: pointer;
    padding: 0 var(--d-xsmall);
    border-radius: var(--radius-base);
    border: var(--border-thin) solid var(--c-accent-high);
    margin: var(--d-xsmall);
    transition: background-color 0.3s ease-in-out;
  }
  .items__listItem--followup:hover,
  .items__listItem--followup:focus {
    background-color: var(--c-accent-light);
    cursor: pointer;
  }
  .items__link {
    text-decoration: none;
    color: var(--text-color);
  }
  .steps .items__listItem--step {
    padding: var(--d-xsmall) 0;
    font-size: var(--font-base);
    line-height: 1;
  }
  .followup .items__link {
    color: var(--c-accent-high);
    display: block;
    padding: var(--d-xsmall) 0;
    border-bottom: var(--border-thin) solid var(--c-light-gray);
    font-size: var(--font-small);
  }
  .citation {
    background-color: var(--c-accent-light);
    border-radius: 3px;
    padding: calc(var(--d-small) / 5);
    margin-left: 3px;
  }
`, B = {
  BOT_TYPING_EFFECT_INTERVAL: 50,
  // in ms
  // Default prompts to display in the chat
  DISPLAY_DEFAULT_PROMPTS_BUTTON: "Not sure what to ask? Try our suggestions!",
  // This are the labels for the chat button and input
  CHAT_BUTTON_LABEL_TEXT: "Ask Coach",
  CHAT_CANCEL_BUTTON_LABEL_TEXT: "Cancel Generation",
  CHAT_VOICE_BUTTON_LABEL_TEXT: "Voice input",
  CHAT_VOICE_REC_BUTTON_LABEL_TEXT: "Listening to voice input",
  CHAT_INPUT_PLACEHOLDER: "Share what's on your mind...",
  USER_IS_BOT: "Apex Coach",
  RESET_BUTTON_LABEL_TEXT: "X",
  RESET_BUTTON_TITLE_TEXT: "Reset current question",
  RESET_CHAT_BUTTON_TITLE: "Start new conversation",
  // Copy response to clipboard
  COPY_RESPONSE_BUTTON_LABEL_TEXT: "Copy Response",
  COPIED_SUCCESSFULLY_MESSAGE: "Response copied!",
  SHOW_THOUGH_PROCESS_BUTTON_LABEL_TEXT: "Show thought process",
  HIDE_THOUGH_PROCESS_BUTTON_LABEL_TEXT: "Hide thought process",
  LOADING_INDICATOR_TEXT: "Thinking and preparing your personalized guidance...",
  LOADING_TEXT: "Loading...",
  // API ERROR HANDLING IN UI
  API_ERROR_MESSAGE: "Sorry, we encountered an issue. Please try again.",
  INVALID_REQUEST_ERROR: "Unable to generate a response for this. Please try rephrasing your question.",
  // Config pertaining the response format
  THOUGHT_PROCESS_LABEL: "Thought Process",
  SUPPORT_CONTEXT_LABEL: "Coaching Context",
  CITATIONS_LABEL: "Learn More:",
  CITATIONS_TAB_LABEL: "Citations",
  // Custom Branding
  IS_CUSTOM_BRANDING: !0,
  // Custom Branding details
  // All these should come from persistence config
  BRANDING_URL: "#",
  BRANDING_HEADLINE: "Welcome to Your Personal Coaching Assistant",
  SHOW_CHAT_HISTORY_LABEL: "Show Chat History",
  HIDE_CHAT_HISTORY_LABEL: "Hide Chat History",
  CHAT_MAX_COUNT_TAG: "{MAX_CHAT_HISTORY}",
  CHAT_HISTORY_FOOTER_TEXT: "Showing past {MAX_CHAT_HISTORY} conversations"
}, Hn = {
  TEASER_CTA_LABEL: "Start a conversation",
  HEADING_CHAT: "Talk with your coach",
  HEADING_ASK: "What would you like to explore?",
  DEFAULT_PROMPTS: [
    {
      description: "Help me work through a challenge I'm facing"
    },
    {
      description: "I want to improve my communication skills"
    },
    {
      description: "Guide me through the Inside Out Method"
    }
  ]
}, Ai = {
  approach: "rrr",
  overrides: {
    retrieval_mode: "hybrid",
    semantic_ranker: !0,
    semantic_captions: !1,
    suggest_followup_questions: !0
  }
}, ji = {
  // API URL for development purposes
  url: "http://localhost:3000",
  method: "POST",
  stream: !0
}, Xr = 5, ki = Symbol.for("@inversifyjs/common/islazyServiceIdentifier");
var As, bn, ks;
let sa = (As = ki, ks = class {
  constructor(t) {
    v(this, As);
    Lt(this, bn);
    Ht(this, bn, t), this[ki] = !0;
  }
  static is(t) {
    return typeof t == "object" && t !== null && t[ki] === !0;
  }
  unwrap() {
    return V(this, bn).call(this);
  }
}, bn = new WeakMap(), ks);
function ee(i, t) {
  return Reflect.getMetadata(t, i);
}
function Yr(i, t, e, n) {
  const r = n(ee(i, t) ?? e);
  Reflect.defineMetadata(t, r, i);
}
const ci = "named", cr = "name", hr = "unmanaged", ur = "optional", dr = "inject", pr = "multi_inject", Bs = "post_construct", js = "pre_destroy", oa = [dr, pr, cr, hr, ci, ur], Si = Symbol.for("@inversifyjs/core/InversifyCoreError");
var Ss, Es;
let Te = class zs extends (Es = Error, Ss = Si, Es) {
  constructor(e, n, r) {
    super(n, r);
    v(this, Ss);
    v(this, "kind");
    this[Si] = !0, this.kind = e;
  }
  static is(e) {
    return typeof e == "object" && e !== null && e[Si] === !0;
  }
  static isErrorOfKind(e, n) {
    return zs.is(e) && e.kind === n;
  }
};
var ne, xt;
function Fs(i, t) {
  const e = [];
  for (let n = 0; n < t.length; ++n)
    t[n] === void 0 && e.push(n);
  if (e.length > 0) throw new Te(ne.missingInjectionDecorator, `Found unexpected missing metadata on type "${i.name}" at constructor indexes "${e.join('", "')}".

Are you using @inject, @multiInject or @unmanaged decorators at those indexes?

If you're using typescript and want to rely on auto injection, set "emitDecoratorMetadata" compiler option to true`);
}
function qs(i) {
  return { kind: xt.singleInjection, name: void 0, optional: !1, tags: /* @__PURE__ */ new Map(), targetName: void 0, value: i };
}
function hi(i) {
  const t = i.find(((o) => o.key === dr)), e = i.find(((o) => o.key === pr));
  if (i.find(((o) => o.key === hr)) !== void 0) return (function(o, l) {
    if (l !== void 0 || o !== void 0) throw new Te(ne.missingInjectionDecorator, "Expected a single @inject, @multiInject or @unmanaged metadata");
    return { kind: xt.unmanaged };
  })(t, e);
  if (e === void 0 && t === void 0) throw new Te(ne.missingInjectionDecorator, "Expected @inject, @multiInject or @unmanaged metadata");
  const n = i.find(((o) => o.key === ci)), r = i.find(((o) => o.key === ur)), s = i.find(((o) => o.key === cr));
  return { kind: t === void 0 ? xt.multipleInjection : xt.singleInjection, name: n == null ? void 0 : n.value, optional: r !== void 0, tags: new Map(i.filter(((o) => oa.every(((l) => o.key !== l)))).map(((o) => [o.key, o.value]))), targetName: s == null ? void 0 : s.value, value: t === void 0 ? e == null ? void 0 : e.value : t.value };
}
function Vs(i, t, e) {
  try {
    return hi(e);
  } catch (n) {
    throw Te.isErrorOfKind(n, ne.missingInjectionDecorator) ? new Te(ne.missingInjectionDecorator, `Expected a single @inject, @multiInject or @unmanaged decorator at type "${i.name}" at constructor arguments at index "${t.toString()}"`, { cause: n }) : n;
  }
}
function aa(i) {
  const t = ee(i, "design:paramtypes"), e = ee(i, "inversify:tagged"), n = [];
  if (e !== void 0) for (const [r, s] of Object.entries(e)) {
    const o = parseInt(r);
    n[o] = Vs(i, o, s);
  }
  if (t !== void 0) {
    for (let r = 0; r < t.length; ++r) if (n[r] === void 0) {
      const s = t[r];
      n[r] = qs(s);
    }
  }
  return Fs(i, n), n;
}
function Gs(i, t, e) {
  try {
    return hi(e);
  } catch (n) {
    throw Te.isErrorOfKind(n, ne.missingInjectionDecorator) ? new Te(ne.missingInjectionDecorator, `Expected a single @inject, @multiInject or @unmanaged decorator at type "${i.name}" at property "${t.toString()}"`, { cause: n }) : n;
  }
}
function Ws(i) {
  const t = ee(i, "inversify:tagged_props"), e = /* @__PURE__ */ new Map();
  if (t !== void 0) for (const n of Reflect.ownKeys(t)) {
    const r = t[n];
    e.set(n, Gs(i, n, r));
  }
  return e;
}
function la(i) {
  const t = ee(i, Bs), e = ee(i, js);
  return { constructorArguments: aa(i), lifecycle: { postConstructMethodName: t == null ? void 0 : t.value, preDestroyMethodName: e == null ? void 0 : e.value }, properties: Ws(i) };
}
function ca(i, t) {
  const e = t.getConstructorMetadata(i), n = [];
  for (const [r, s] of Object.entries(e.userGeneratedMetadata)) {
    const o = parseInt(r);
    n[o] = Vs(i, o, s);
  }
  if (e.compilerGeneratedMetadata !== void 0) {
    for (let r = 0; r < e.compilerGeneratedMetadata.length; ++r) if (n[r] === void 0) {
      const s = e.compilerGeneratedMetadata[r];
      n[r] = qs(s);
    }
  }
  return Fs(i, n), n;
}
function Zs(i, t) {
  const e = t.getPropertiesMetadata(i), n = /* @__PURE__ */ new Map();
  for (const r of Reflect.ownKeys(e)) {
    const s = e[r];
    n.set(r, Gs(i, r, s));
  }
  return n;
}
function ha(i, t) {
  const e = ee(i, Bs), n = ee(i, js);
  return { constructorArguments: ca(i, t), lifecycle: { postConstructMethodName: e == null ? void 0 : e.value, preDestroyMethodName: n == null ? void 0 : n.value }, properties: Zs(i, t) };
}
function Qr(i) {
  const t = Object.getPrototypeOf(i.prototype);
  return t == null ? void 0 : t.constructor;
}
function ua(i) {
  return i.kind === xt.unmanaged ? [{ key: hr, value: !0 }] : (function(t) {
    const e = [da(t)];
    t.name !== void 0 && e.push({ key: ci, value: t.name }), t.optional && e.push({ key: ur, value: !0 });
    for (const [n, r] of t.tags) e.push({ key: n, value: r });
    return t.targetName !== void 0 && e.push({ key: cr, value: t.targetName }), e;
  })(i);
}
function da(i) {
  let t;
  switch (i.kind) {
    case xt.multipleInjection:
      t = { key: pr, value: i.value };
      break;
    case xt.singleInjection:
      t = { key: dr, value: i.value };
  }
  return t;
}
(function(i) {
  i[i.injectionDecoratorConflict = 0] = "injectionDecoratorConflict", i[i.missingInjectionDecorator = 1] = "missingInjectionDecorator", i[i.planning = 2] = "planning", i[i.unknown = 3] = "unknown";
})(ne || (ne = {})), (function(i) {
  i[i.multipleInjection = 0] = "multipleInjection", i[i.singleInjection = 1] = "singleInjection", i[i.unmanaged = 2] = "unmanaged";
})(xt || (xt = {}));
var Jt, $s;
let pa = ($s = class {
  constructor(t) {
    Lt(this, Jt);
    Ht(this, Jt, t);
  }
  startsWith(t) {
    return V(this, Jt).startsWith(t);
  }
  endsWith(t) {
    return V(this, Jt).endsWith(t);
  }
  contains(t) {
    return V(this, Jt).includes(t);
  }
  equals(t) {
    return V(this, Jt) === t;
  }
  value() {
    return V(this, Jt);
  }
}, Jt = new WeakMap(), $s);
const Ei = "@inversifyjs/core/targetId";
var ft, wn, Cn, be, Tn, xn;
class Qn {
  constructor(t, e, n) {
    Lt(this, ft);
    Lt(this, wn);
    Lt(this, Cn);
    Lt(this, be);
    Lt(this, Tn);
    Lt(this, xn);
    Ht(this, wn, (function() {
      const r = ee(Object, Ei) ?? 0;
      return r === Number.MAX_SAFE_INTEGER ? Yr(Object, Ei, r, (() => Number.MIN_SAFE_INTEGER)) : Yr(Object, Ei, r, ((s) => s + 1)), r;
    })()), Ht(this, Cn, t), Ht(this, be, void 0), Ht(this, ft, e), Ht(this, Tn, new pa(typeof t == "string" ? t : t.toString().slice(7, -1))), Ht(this, xn, n);
  }
  get id() {
    return V(this, wn);
  }
  get identifier() {
    return V(this, Cn);
  }
  get metadata() {
    return V(this, be) === void 0 && Ht(this, be, ua(V(this, ft))), V(this, be);
  }
  get name() {
    return V(this, Tn);
  }
  get type() {
    return V(this, xn);
  }
  get serviceIdentifier() {
    return sa.is(V(this, ft).value) ? V(this, ft).value.unwrap() : V(this, ft).value;
  }
  getCustomTags() {
    return [...V(this, ft).tags.entries()].map((([t, e]) => ({ key: t, value: e })));
  }
  getNamedTag() {
    return V(this, ft).name === void 0 ? null : { key: ci, value: V(this, ft).name };
  }
  hasTag(t) {
    return this.metadata.some(((e) => e.key === t));
  }
  isArray() {
    return V(this, ft).kind === xt.multipleInjection;
  }
  isNamed() {
    return V(this, ft).name !== void 0;
  }
  isOptional() {
    return V(this, ft).optional;
  }
  isTagged() {
    return V(this, ft).tags.size > 0;
  }
  matchesArray(t) {
    return this.isArray() && V(this, ft).value === t;
  }
  matchesNamedTag(t) {
    return V(this, ft).name === t;
  }
  matchesTag(t) {
    return (e) => this.metadata.some(((n) => n.key === t && n.value === e));
  }
}
ft = new WeakMap(), wn = new WeakMap(), Cn = new WeakMap(), be = new WeakMap(), Tn = new WeakMap(), xn = new WeakMap();
const Xs = (i) => /* @__PURE__ */ (function(t, e) {
  return function(n) {
    const r = t(n);
    let s = Qr(n);
    for (; s !== void 0 && s !== Object; ) {
      const l = e(s);
      for (const [a, u] of l) r.properties.has(a) || r.properties.set(a, u);
      s = Qr(s);
    }
    const o = [];
    for (const l of r.constructorArguments) if (l.kind !== xt.unmanaged) {
      const a = l.targetName ?? "";
      o.push(new Qn(a, l, "ConstructorArgument"));
    }
    for (const [l, a] of r.properties) if (a.kind !== xt.unmanaged) {
      const u = a.targetName ?? l;
      o.push(new Qn(u, a, "ClassProperty"));
    }
    return o;
  };
})(i === void 0 ? la : (t) => ha(t, i), i === void 0 ? Ws : (t) => Zs(t, i)), Mt = "named", fa = "unmanaged", ga = "optional", ma = "inject", _a = "multi_inject", ya = "inversify:tagged", va = "inversify:tagged_props", Kr = "inversify:paramtypes", Ys = "design:paramtypes", Jr = "post_construct", zi = "pre_destroy", rt = { Request: "Request", Singleton: "Singleton", Transient: "Transient" }, G = { ConstantValue: "ConstantValue", Constructor: "Constructor", DynamicValue: "DynamicValue", Factory: "Factory", Function: "Function", Instance: "Instance", Invalid: "Invalid", Provider: "Provider" }, Qs = { ConstructorArgument: "ConstructorArgument", Variable: "Variable" };
let ba = 0;
function ui() {
  return ba++;
}
class fr {
  constructor(t, e) {
    v(this, "id");
    v(this, "moduleId");
    v(this, "activated");
    v(this, "serviceIdentifier");
    v(this, "implementationType");
    v(this, "cache");
    v(this, "dynamicValue");
    v(this, "scope");
    v(this, "type");
    v(this, "factory");
    v(this, "provider");
    v(this, "constraint");
    v(this, "onActivation");
    v(this, "onDeactivation");
    this.id = ui(), this.activated = !1, this.serviceIdentifier = t, this.scope = e, this.type = G.Invalid, this.constraint = (n) => !0, this.implementationType = null, this.cache = null, this.factory = null, this.provider = null, this.onActivation = null, this.onDeactivation = null, this.dynamicValue = null;
  }
  clone() {
    const t = new fr(this.serviceIdentifier, this.scope);
    return t.activated = t.scope === rt.Singleton && this.activated, t.implementationType = this.implementationType, t.dynamicValue = this.dynamicValue, t.scope = this.scope, t.type = this.type, t.factory = this.factory, t.provider = this.provider, t.constraint = this.constraint, t.onActivation = this.onActivation, t.onDeactivation = this.onDeactivation, t.cache = this.cache, t;
  }
}
const ts = "NULL argument", es = "Key Not Found", wa = "Ambiguous match found for serviceIdentifier:", Ca = "No matching bindings found for serviceIdentifier:", Fi = (i, t) => `onDeactivation() error in class ${i}: ${t}`;
class Ta {
  getConstructorMetadata(t) {
    return { compilerGeneratedMetadata: Reflect.getMetadata(Ys, t) ?? [], userGeneratedMetadata: Reflect.getMetadata(ya, t) ?? {} };
  }
  getPropertiesMetadata(t) {
    return Reflect.getMetadata(va, t) ?? {};
  }
}
var Oe;
function Ks(i) {
  return i instanceof RangeError || i.message === "Maximum call stack size exceeded";
}
(function(i) {
  i[i.MultipleBindingsAvailable = 2] = "MultipleBindingsAvailable", i[i.NoBindingsAvailable = 0] = "NoBindingsAvailable", i[i.OnlyOneBindingAvailable = 1] = "OnlyOneBindingAvailable";
})(Oe || (Oe = {}));
function ae(i) {
  return typeof i == "function" ? i.name : typeof i == "symbol" ? i.toString() : i;
}
function ns(i, t, e) {
  let n = "";
  const r = e(i, t);
  return r.length !== 0 && (n = `
Registered bindings:`, r.forEach(((s) => {
    let o = "Object";
    s.implementationType !== null && (o = eo(s.implementationType)), n = `${n}
 ${o}`, s.constraint.metaData && (n = `${n} - ${s.constraint.metaData}`);
  }))), n;
}
function Js(i, t) {
  return i.parentRequest !== null && (i.parentRequest.serviceIdentifier === t || Js(i.parentRequest, t));
}
function to(i) {
  i.childRequests.forEach(((t) => {
    if (Js(i, t.serviceIdentifier)) {
      const e = (function(n) {
        return (function s(o, l = []) {
          const a = ae(o.serviceIdentifier);
          return l.push(a), o.parentRequest !== null ? s(o.parentRequest, l) : l;
        })(n).reverse().join(" --> ");
      })(t);
      throw new Error(`Circular dependency found: ${e}`);
    }
    to(t);
  }));
}
function eo(i) {
  if (i.name != null && i.name !== "") return i.name;
  {
    const t = i.toString(), e = t.match(/^function\s*([^\s(]+)/);
    return e === null ? `Anonymous function: ${t}` : e[1];
  }
}
function is(i) {
  return `{"key":"${i.key.toString()}","value":"${i.value.toString()}"}`;
}
class no {
  constructor(t) {
    v(this, "id");
    v(this, "container");
    v(this, "plan");
    v(this, "currentRequest");
    this.id = ui(), this.container = t;
  }
  addPlan(t) {
    this.plan = t;
  }
  setCurrentRequest(t) {
    this.currentRequest = t;
  }
}
class qn {
  constructor(t, e) {
    v(this, "key");
    v(this, "value");
    this.key = t, this.value = e;
  }
  toString() {
    return this.key === Mt ? `named: ${String(this.value).toString()} ` : `tagged: { key:${this.key.toString()}, value: ${String(this.value)} }`;
  }
}
class xa {
  constructor(t, e) {
    v(this, "parentContext");
    v(this, "rootRequest");
    this.parentContext = t, this.rootRequest = e;
  }
}
function io(i, t) {
  const e = (function(l) {
    const a = Object.getPrototypeOf(l.prototype);
    return a == null ? void 0 : a.constructor;
  })(t);
  if (e === void 0 || e === Object) return 0;
  const n = Xs(i)(e), r = n.map(((l) => l.metadata.filter(((a) => a.key === fa)))), s = [].concat.apply([], r).length, o = n.length - s;
  return o > 0 ? o : io(i, e);
}
class kn {
  constructor(t, e, n, r, s) {
    v(this, "id");
    v(this, "serviceIdentifier");
    v(this, "parentContext");
    v(this, "parentRequest");
    v(this, "bindings");
    v(this, "childRequests");
    v(this, "target");
    v(this, "requestScope");
    this.id = ui(), this.serviceIdentifier = t, this.parentContext = e, this.parentRequest = n, this.target = s, this.childRequests = [], this.bindings = Array.isArray(r) ? r : [r], this.requestScope = n === null ? /* @__PURE__ */ new Map() : null;
  }
  addChildRequest(t, e, n) {
    const r = new kn(t, this.parentContext, this, e, n);
    return this.childRequests.push(r), r;
  }
}
function Kn(i) {
  return i._bindingDictionary;
}
function rs(i, t, e, n, r) {
  let s = hn(e.container, r.serviceIdentifier), o = [];
  return s.length === Oe.NoBindingsAvailable && e.container.options.autoBindInjectable === !0 && typeof r.serviceIdentifier == "function" && i.getConstructorMetadata(r.serviceIdentifier).compilerGeneratedMetadata && (e.container.bind(r.serviceIdentifier).toSelf(), s = hn(e.container, r.serviceIdentifier)), o = t ? s : s.filter(((l) => {
    const a = new kn(l.serviceIdentifier, e, n, l, r);
    return l.constraint(a);
  })), (function(l, a, u, p, g) {
    switch (a.length) {
      case Oe.NoBindingsAvailable:
        if (p.isOptional()) return a;
        {
          const m = ae(l);
          let w = Ca;
          throw w += (function(N, O) {
            if (O.isTagged() || O.isNamed()) {
              let L = "";
              const ct = O.getNamedTag(), mt = O.getCustomTags();
              return ct !== null && (L += is(ct) + `
`), mt !== null && mt.forEach(((K) => {
                L += is(K) + `
`;
              })), ` ${N}
 ${N} - ${L}`;
            }
            return ` ${N}`;
          })(m, p), w += ns(g, m, hn), u !== null && (w += `
Trying to resolve bindings for "${ae(u.serviceIdentifier)}"`), new Error(w);
        }
      case Oe.OnlyOneBindingAvailable:
        return a;
      case Oe.MultipleBindingsAvailable:
      default:
        if (p.isArray()) return a;
        {
          const m = ae(l);
          let w = `${wa} ${m}`;
          throw w += ns(g, m, hn), new Error(w);
        }
    }
  })(r.serviceIdentifier, o, n, r, e.container), o;
}
function ro(i, t) {
  const e = t.isMultiInject ? _a : ma, n = [new qn(e, i)];
  return t.customTag !== void 0 && n.push(new qn(t.customTag.key, t.customTag.value)), t.isOptional === !0 && n.push(new qn(ga, !0)), n;
}
function so(i, t, e, n, r, s) {
  let o, l;
  if (r === null) {
    o = rs(i, t, n, null, s), l = new kn(e, n, null, o, s);
    const a = new xa(n, l);
    n.addPlan(a);
  } else o = rs(i, t, n, r, s), l = r.addChildRequest(s.serviceIdentifier, o, s);
  o.forEach(((a) => {
    let u = null;
    if (s.isArray()) u = l.addChildRequest(a.serviceIdentifier, a, s);
    else {
      if (a.cache !== null) return;
      u = l;
    }
    if (a.type === G.Instance && a.implementationType !== null) {
      const p = (function(g, m) {
        return Xs(g)(m);
      })(i, a.implementationType);
      if (n.container.options.skipBaseClassChecks !== !0) {
        const g = io(i, a.implementationType);
        if (p.length < g) {
          const m = `The number of constructor arguments in the derived class ${eo(a.implementationType)} must be >= than the number of constructor arguments of its base class.`;
          throw new Error(m);
        }
      }
      p.forEach(((g) => {
        so(i, !1, g.serviceIdentifier, n, u, g);
      }));
    }
  }));
}
function hn(i, t) {
  let e = [];
  const n = Kn(i);
  return n.hasKey(t) ? e = n.get(t) : i.parent !== null && (e = hn(i.parent, t)), e;
}
function Aa(i, t, e, n, r, s = !1) {
  const o = new no(t), l = (function(a, u, p) {
    const g = ro(u, p), m = hi(g);
    if (m.kind === xt.unmanaged) throw new Error("Unexpected metadata when creating target");
    return new Qn("", m, a);
  })(e, n, r);
  try {
    return so(i, s, n, o, null, l), o;
  } catch (a) {
    throw Ks(a) && to(o.plan.rootRequest), a;
  }
}
function Tt(i) {
  return (typeof i == "object" && i !== null || typeof i == "function") && typeof i.then == "function";
}
function oo(i) {
  return !!Tt(i) || Array.isArray(i) && i.some(Tt);
}
const ka = (i, t, e) => {
  i.has(t.id) || i.set(t.id, e);
}, Sa = (i, t) => {
  i.cache = t, i.activated = !0, Tt(t) && Ea(i, t);
}, Ea = async (i, t) => {
  try {
    const e = await t;
    i.cache = e;
  } catch (e) {
    throw i.cache = null, i.activated = !1, e;
  }
};
var dn;
(function(i) {
  i.DynamicValue = "toDynamicValue", i.Factory = "toFactory", i.Provider = "toProvider";
})(dn || (dn = {}));
function $a(i, t, e) {
  let n;
  if (t.length > 0) {
    const r = (function(o, l) {
      return o.reduce(((a, u) => {
        const p = l(u);
        return u.target.type === Qs.ConstructorArgument ? a.constructorInjections.push(p) : (a.propertyRequests.push(u), a.propertyInjections.push(p)), a.isAsync || (a.isAsync = oo(p)), a;
      }), { constructorInjections: [], isAsync: !1, propertyInjections: [], propertyRequests: [] });
    })(t, e), s = { ...r, constr: i };
    n = r.isAsync ? (async function(o) {
      const l = await os(o.constructorInjections), a = await os(o.propertyInjections);
      return ss({ ...o, constructorInjections: l, propertyInjections: a });
    })(s) : ss(s);
  } else n = new i();
  return n;
}
function ss(i) {
  const t = new i.constr(...i.constructorInjections);
  return i.propertyRequests.forEach(((e, n) => {
    const r = e.target.identifier, s = i.propertyInjections[n];
    e.target.isOptional() && s === void 0 || (t[r] = s);
  })), t;
}
async function os(i) {
  const t = [];
  for (const e of i) Array.isArray(e) ? t.push(Promise.all(e)) : t.push(e);
  return Promise.all(t);
}
function as(i, t) {
  const e = (function(n, r) {
    var l;
    if (Reflect.hasMetadata(Jr, n)) {
      const a = Reflect.getMetadata(Jr, n);
      try {
        return (l = r[a.value]) == null ? void 0 : l.call(r);
      } catch (u) {
        if (u instanceof Error) throw new Error((s = n.name, o = u.message, `@postConstruct error in class ${s}: ${o}`));
      }
    }
    var s, o;
  })(i, t);
  return Tt(e) ? e.then((() => t)) : t;
}
function Ia(i, t) {
  i.scope !== rt.Singleton && (function(e, n) {
    const r = `Class cannot be instantiated in ${e.scope === rt.Request ? "request" : "transient"} scope.`;
    if (typeof e.onDeactivation == "function") throw new Error(Fi(n.name, r));
    if (Reflect.hasMetadata(zi, n)) throw new Error(`@preDestroy error in class ${n.name}: ${r}`);
  })(i, t);
}
const gr = (i) => (t) => {
  t.parentContext.setCurrentRequest(t);
  const e = t.bindings, n = t.childRequests, r = t.target && t.target.isArray(), s = !(t.parentRequest && t.parentRequest.target && t.target && t.parentRequest.target.matchesArray(t.target.serviceIdentifier));
  if (r && s) return n.map(((o) => gr(i)(o)));
  {
    if (t.target.isOptional() && e.length === 0) return;
    const o = e[0];
    return Da(i, t, o);
  }
}, Ra = (i, t) => {
  const e = ((n) => {
    switch (n.type) {
      case G.Factory:
        return { factory: n.factory, factoryType: dn.Factory };
      case G.Provider:
        return { factory: n.provider, factoryType: dn.Provider };
      case G.DynamicValue:
        return { factory: n.dynamicValue, factoryType: dn.DynamicValue };
      default:
        throw new Error(`Unexpected factory type ${n.type}`);
    }
  })(i);
  return ((n, r) => {
    try {
      return n();
    } catch (s) {
      throw Ks(s) ? r() : s;
    }
  })((() => e.factory.bind(i)(t)), (() => {
    return new Error((n = e.factoryType, r = t.currentRequest.serviceIdentifier.toString(), `It looks like there is a circular dependency in one of the '${n}' bindings. Please investigate bindings with service identifier '${r}'.`));
    var n, r;
  }));
}, Oa = (i, t, e) => {
  let n;
  const r = t.childRequests;
  switch (((s) => {
    let o = null;
    switch (s.type) {
      case G.ConstantValue:
      case G.Function:
        o = s.cache;
        break;
      case G.Constructor:
      case G.Instance:
        o = s.implementationType;
        break;
      case G.DynamicValue:
        o = s.dynamicValue;
        break;
      case G.Provider:
        o = s.provider;
        break;
      case G.Factory:
        o = s.factory;
    }
    if (o === null) {
      const l = ae(s.serviceIdentifier);
      throw new Error(`Invalid binding type: ${l}`);
    }
  })(e), e.type) {
    case G.ConstantValue:
    case G.Function:
      n = e.cache;
      break;
    case G.Constructor:
      n = e.implementationType;
      break;
    case G.Instance:
      n = (function(s, o, l, a) {
        Ia(s, o);
        const u = $a(o, l, a);
        return Tt(u) ? u.then(((p) => as(o, p))) : as(o, u);
      })(e, e.implementationType, r, gr(i));
      break;
    default:
      n = Ra(e, t.parentContext);
  }
  return n;
}, Ma = (i, t, e) => {
  let n = ((r, s) => s.scope === rt.Singleton && s.activated ? s.cache : s.scope === rt.Request && r.has(s.id) ? r.get(s.id) : null)(i, t);
  return n !== null || (n = e(), ((r, s, o) => {
    s.scope === rt.Singleton && Sa(s, o), s.scope === rt.Request && ka(r, s, o);
  })(i, t, n)), n;
}, Da = (i, t, e) => Ma(i, e, (() => {
  let n = Oa(i, t, e);
  return n = Tt(n) ? n.then(((r) => ls(t, e, r))) : ls(t, e, n), n;
}));
function ls(i, t, e) {
  let n = Na(i.parentContext, t, e);
  const r = Ha(i.parentContext.container);
  let s, o = r.next();
  do {
    s = o.value;
    const l = i.parentContext, a = i.serviceIdentifier, u = La(s, a);
    n = Tt(n) ? ao(u, l, n) : Pa(u, l, n), o = r.next();
  } while (o.done !== !0 && !Kn(s).hasKey(i.serviceIdentifier));
  return n;
}
const Na = (i, t, e) => {
  let n;
  return n = typeof t.onActivation == "function" ? t.onActivation(i, e) : e, n;
}, Pa = (i, t, e) => {
  let n = i.next();
  for (; n.done !== !0; ) {
    if (Tt(e = n.value(t, e))) return ao(i, t, e);
    n = i.next();
  }
  return e;
}, ao = async (i, t, e) => {
  let n = await e, r = i.next();
  for (; r.done !== !0; ) n = await r.value(t, n), r = i.next();
  return n;
}, La = (i, t) => {
  const e = i._activations;
  return e.hasKey(t) ? e.get(t).values() : [].values();
}, Ha = (i) => {
  const t = [i];
  let e = i.parent;
  for (; e !== null; ) t.push(e), e = e.parent;
  return { next: () => {
    const n = t.pop();
    return n !== void 0 ? { done: !1, value: n } : { done: !0, value: void 0 };
  } };
}, Yt = (i, t) => {
  const e = i.parentRequest;
  return e !== null && (!!t(e) || Yt(e, t));
}, un = (i) => (t) => {
  const e = (n) => n !== null && n.target !== null && n.target.matchesTag(i)(t);
  return e.metaData = new qn(i, t), e;
}, Un = un(Mt), $i = (i) => (t) => {
  let e = null;
  if (t !== null) {
    if (e = t.bindings[0], typeof i == "string") return e.serviceIdentifier === i;
    {
      const n = t.bindings[0].implementationType;
      return i === n;
    }
  }
  return !1;
};
class Jn {
  constructor(t) {
    v(this, "_binding");
    this._binding = t;
  }
  when(t) {
    return this._binding.constraint = t, new pt(this._binding);
  }
  whenTargetNamed(t) {
    return this._binding.constraint = Un(t), new pt(this._binding);
  }
  whenTargetIsDefault() {
    return this._binding.constraint = (t) => t === null ? !1 : t.target !== null && !t.target.isNamed() && !t.target.isTagged(), new pt(this._binding);
  }
  whenTargetTagged(t, e) {
    return this._binding.constraint = un(t)(e), new pt(this._binding);
  }
  whenInjectedInto(t) {
    return this._binding.constraint = (e) => e !== null && $i(t)(e.parentRequest), new pt(this._binding);
  }
  whenParentNamed(t) {
    return this._binding.constraint = (e) => e !== null && Un(t)(e.parentRequest), new pt(this._binding);
  }
  whenParentTagged(t, e) {
    return this._binding.constraint = (n) => n !== null && un(t)(e)(n.parentRequest), new pt(this._binding);
  }
  whenAnyAncestorIs(t) {
    return this._binding.constraint = (e) => e !== null && Yt(e, $i(t)), new pt(this._binding);
  }
  whenNoAncestorIs(t) {
    return this._binding.constraint = (e) => e !== null && !Yt(e, $i(t)), new pt(this._binding);
  }
  whenAnyAncestorNamed(t) {
    return this._binding.constraint = (e) => e !== null && Yt(e, Un(t)), new pt(this._binding);
  }
  whenNoAncestorNamed(t) {
    return this._binding.constraint = (e) => e !== null && !Yt(e, Un(t)), new pt(this._binding);
  }
  whenAnyAncestorTagged(t, e) {
    return this._binding.constraint = (n) => n !== null && Yt(n, un(t)(e)), new pt(this._binding);
  }
  whenNoAncestorTagged(t, e) {
    return this._binding.constraint = (n) => n !== null && !Yt(n, un(t)(e)), new pt(this._binding);
  }
  whenAnyAncestorMatches(t) {
    return this._binding.constraint = (e) => e !== null && Yt(e, t), new pt(this._binding);
  }
  whenNoAncestorMatches(t) {
    return this._binding.constraint = (e) => e !== null && !Yt(e, t), new pt(this._binding);
  }
}
class pt {
  constructor(t) {
    v(this, "_binding");
    this._binding = t;
  }
  onActivation(t) {
    return this._binding.onActivation = t, new Jn(this._binding);
  }
  onDeactivation(t) {
    return this._binding.onDeactivation = t, new Jn(this._binding);
  }
}
class Kt {
  constructor(t) {
    v(this, "_bindingWhenSyntax");
    v(this, "_bindingOnSyntax");
    v(this, "_binding");
    this._binding = t, this._bindingWhenSyntax = new Jn(this._binding), this._bindingOnSyntax = new pt(this._binding);
  }
  when(t) {
    return this._bindingWhenSyntax.when(t);
  }
  whenTargetNamed(t) {
    return this._bindingWhenSyntax.whenTargetNamed(t);
  }
  whenTargetIsDefault() {
    return this._bindingWhenSyntax.whenTargetIsDefault();
  }
  whenTargetTagged(t, e) {
    return this._bindingWhenSyntax.whenTargetTagged(t, e);
  }
  whenInjectedInto(t) {
    return this._bindingWhenSyntax.whenInjectedInto(t);
  }
  whenParentNamed(t) {
    return this._bindingWhenSyntax.whenParentNamed(t);
  }
  whenParentTagged(t, e) {
    return this._bindingWhenSyntax.whenParentTagged(t, e);
  }
  whenAnyAncestorIs(t) {
    return this._bindingWhenSyntax.whenAnyAncestorIs(t);
  }
  whenNoAncestorIs(t) {
    return this._bindingWhenSyntax.whenNoAncestorIs(t);
  }
  whenAnyAncestorNamed(t) {
    return this._bindingWhenSyntax.whenAnyAncestorNamed(t);
  }
  whenAnyAncestorTagged(t, e) {
    return this._bindingWhenSyntax.whenAnyAncestorTagged(t, e);
  }
  whenNoAncestorNamed(t) {
    return this._bindingWhenSyntax.whenNoAncestorNamed(t);
  }
  whenNoAncestorTagged(t, e) {
    return this._bindingWhenSyntax.whenNoAncestorTagged(t, e);
  }
  whenAnyAncestorMatches(t) {
    return this._bindingWhenSyntax.whenAnyAncestorMatches(t);
  }
  whenNoAncestorMatches(t) {
    return this._bindingWhenSyntax.whenNoAncestorMatches(t);
  }
  onActivation(t) {
    return this._bindingOnSyntax.onActivation(t);
  }
  onDeactivation(t) {
    return this._bindingOnSyntax.onDeactivation(t);
  }
}
class Ua {
  constructor(t) {
    v(this, "_binding");
    this._binding = t;
  }
  inRequestScope() {
    return this._binding.scope = rt.Request, new Kt(this._binding);
  }
  inSingletonScope() {
    return this._binding.scope = rt.Singleton, new Kt(this._binding);
  }
  inTransientScope() {
    return this._binding.scope = rt.Transient, new Kt(this._binding);
  }
}
class cs {
  constructor(t) {
    v(this, "_bindingInSyntax");
    v(this, "_bindingWhenSyntax");
    v(this, "_bindingOnSyntax");
    v(this, "_binding");
    this._binding = t, this._bindingWhenSyntax = new Jn(this._binding), this._bindingOnSyntax = new pt(this._binding), this._bindingInSyntax = new Ua(t);
  }
  inRequestScope() {
    return this._bindingInSyntax.inRequestScope();
  }
  inSingletonScope() {
    return this._bindingInSyntax.inSingletonScope();
  }
  inTransientScope() {
    return this._bindingInSyntax.inTransientScope();
  }
  when(t) {
    return this._bindingWhenSyntax.when(t);
  }
  whenTargetNamed(t) {
    return this._bindingWhenSyntax.whenTargetNamed(t);
  }
  whenTargetIsDefault() {
    return this._bindingWhenSyntax.whenTargetIsDefault();
  }
  whenTargetTagged(t, e) {
    return this._bindingWhenSyntax.whenTargetTagged(t, e);
  }
  whenInjectedInto(t) {
    return this._bindingWhenSyntax.whenInjectedInto(t);
  }
  whenParentNamed(t) {
    return this._bindingWhenSyntax.whenParentNamed(t);
  }
  whenParentTagged(t, e) {
    return this._bindingWhenSyntax.whenParentTagged(t, e);
  }
  whenAnyAncestorIs(t) {
    return this._bindingWhenSyntax.whenAnyAncestorIs(t);
  }
  whenNoAncestorIs(t) {
    return this._bindingWhenSyntax.whenNoAncestorIs(t);
  }
  whenAnyAncestorNamed(t) {
    return this._bindingWhenSyntax.whenAnyAncestorNamed(t);
  }
  whenAnyAncestorTagged(t, e) {
    return this._bindingWhenSyntax.whenAnyAncestorTagged(t, e);
  }
  whenNoAncestorNamed(t) {
    return this._bindingWhenSyntax.whenNoAncestorNamed(t);
  }
  whenNoAncestorTagged(t, e) {
    return this._bindingWhenSyntax.whenNoAncestorTagged(t, e);
  }
  whenAnyAncestorMatches(t) {
    return this._bindingWhenSyntax.whenAnyAncestorMatches(t);
  }
  whenNoAncestorMatches(t) {
    return this._bindingWhenSyntax.whenNoAncestorMatches(t);
  }
  onActivation(t) {
    return this._bindingOnSyntax.onActivation(t);
  }
  onDeactivation(t) {
    return this._bindingOnSyntax.onDeactivation(t);
  }
}
class Ba {
  constructor(t) {
    v(this, "_binding");
    this._binding = t;
  }
  to(t) {
    return this._binding.type = G.Instance, this._binding.implementationType = t, new cs(this._binding);
  }
  toSelf() {
    if (typeof this._binding.serviceIdentifier != "function") throw new Error("The toSelf function can only be applied when a constructor is used as service identifier");
    const t = this._binding.serviceIdentifier;
    return this.to(t);
  }
  toConstantValue(t) {
    return this._binding.type = G.ConstantValue, this._binding.cache = t, this._binding.dynamicValue = null, this._binding.implementationType = null, this._binding.scope = rt.Singleton, new Kt(this._binding);
  }
  toDynamicValue(t) {
    return this._binding.type = G.DynamicValue, this._binding.cache = null, this._binding.dynamicValue = t, this._binding.implementationType = null, new cs(this._binding);
  }
  toConstructor(t) {
    return this._binding.type = G.Constructor, this._binding.implementationType = t, this._binding.scope = rt.Singleton, new Kt(this._binding);
  }
  toFactory(t) {
    return this._binding.type = G.Factory, this._binding.factory = t, this._binding.scope = rt.Singleton, new Kt(this._binding);
  }
  toFunction(t) {
    if (typeof t != "function") throw new Error("Value provided to function binding must be a function!");
    const e = this.toConstantValue(t);
    return this._binding.type = G.Function, this._binding.scope = rt.Singleton, e;
  }
  toAutoFactory(t) {
    return this._binding.type = G.Factory, this._binding.factory = (e) => () => e.container.get(t), this._binding.scope = rt.Singleton, new Kt(this._binding);
  }
  toAutoNamedFactory(t) {
    return this._binding.type = G.Factory, this._binding.factory = (e) => (n) => e.container.getNamed(t, n), new Kt(this._binding);
  }
  toProvider(t) {
    return this._binding.type = G.Provider, this._binding.provider = t, this._binding.scope = rt.Singleton, new Kt(this._binding);
  }
  toService(t) {
    this._binding.type = G.DynamicValue, Object.defineProperty(this._binding, "cache", { configurable: !0, enumerable: !0, get: () => null, set(e) {
    } }), this._binding.dynamicValue = (e) => {
      try {
        return e.container.get(t);
      } catch {
        return e.container.getAsync(t);
      }
    }, this._binding.implementationType = null;
  }
}
class mr {
  constructor() {
    v(this, "bindings");
    v(this, "activations");
    v(this, "deactivations");
    v(this, "middleware");
    v(this, "moduleActivationStore");
  }
  static of(t, e, n, r, s) {
    const o = new mr();
    return o.bindings = t, o.middleware = e, o.deactivations = r, o.activations = n, o.moduleActivationStore = s, o;
  }
}
class te {
  constructor() {
    v(this, "_map");
    this._map = /* @__PURE__ */ new Map();
  }
  getMap() {
    return this._map;
  }
  add(t, e) {
    if (this._checkNonNulish(t), e == null) throw new Error(ts);
    const n = this._map.get(t);
    n !== void 0 ? n.push(e) : this._map.set(t, [e]);
  }
  get(t) {
    this._checkNonNulish(t);
    const e = this._map.get(t);
    if (e !== void 0) return e;
    throw new Error(es);
  }
  remove(t) {
    if (this._checkNonNulish(t), !this._map.delete(t)) throw new Error(es);
  }
  removeIntersection(t) {
    this.traverse(((e, n) => {
      const r = t.hasKey(e) ? t.get(e) : void 0;
      if (r !== void 0) {
        const s = n.filter(((o) => !r.some(((l) => o === l))));
        this._setValue(e, s);
      }
    }));
  }
  removeByCondition(t) {
    const e = [];
    return this._map.forEach(((n, r) => {
      const s = [];
      for (const o of n)
        t(o) ? e.push(o) : s.push(o);
      this._setValue(r, s);
    })), e;
  }
  hasKey(t) {
    return this._checkNonNulish(t), this._map.has(t);
  }
  clone() {
    const t = new te();
    return this._map.forEach(((e, n) => {
      e.forEach(((r) => {
        var s;
        t.add(n, typeof (s = r) == "object" && s !== null && "clone" in s && typeof s.clone == "function" ? r.clone() : r);
      }));
    })), t;
  }
  traverse(t) {
    this._map.forEach(((e, n) => {
      t(n, e);
    }));
  }
  _checkNonNulish(t) {
    if (t == null) throw new Error(ts);
  }
  _setValue(t, e) {
    e.length > 0 ? this._map.set(t, e) : this._map.delete(t);
  }
}
class _r {
  constructor() {
    v(this, "_map", /* @__PURE__ */ new Map());
  }
  remove(t) {
    const e = this._map.get(t);
    return e === void 0 ? this._getEmptyHandlersStore() : (this._map.delete(t), e);
  }
  addDeactivation(t, e, n) {
    this._getModuleActivationHandlers(t).onDeactivations.add(e, n);
  }
  addActivation(t, e, n) {
    this._getModuleActivationHandlers(t).onActivations.add(e, n);
  }
  clone() {
    const t = new _r();
    return this._map.forEach(((e, n) => {
      t._map.set(n, { onActivations: e.onActivations.clone(), onDeactivations: e.onDeactivations.clone() });
    })), t;
  }
  _getModuleActivationHandlers(t) {
    let e = this._map.get(t);
    return e === void 0 && (e = this._getEmptyHandlersStore(), this._map.set(t, e)), e;
  }
  _getEmptyHandlersStore() {
    return { onActivations: new te(), onDeactivations: new te() };
  }
}
class ti {
  constructor(t) {
    v(this, "id");
    v(this, "parent");
    v(this, "options");
    v(this, "_middleware");
    v(this, "_bindingDictionary");
    v(this, "_activations");
    v(this, "_deactivations");
    v(this, "_snapshots");
    v(this, "_metadataReader");
    v(this, "_moduleActivationStore");
    const e = t || {};
    if (typeof e != "object") throw new Error("Invalid Container constructor argument. Container options must be an object.");
    if (e.defaultScope === void 0) e.defaultScope = rt.Transient;
    else if (e.defaultScope !== rt.Singleton && e.defaultScope !== rt.Transient && e.defaultScope !== rt.Request) throw new Error('Invalid Container option. Default scope must be a string ("singleton" or "transient").');
    if (e.autoBindInjectable === void 0) e.autoBindInjectable = !1;
    else if (typeof e.autoBindInjectable != "boolean") throw new Error("Invalid Container option. Auto bind injectable must be a boolean");
    if (e.skipBaseClassChecks === void 0) e.skipBaseClassChecks = !1;
    else if (typeof e.skipBaseClassChecks != "boolean") throw new Error("Invalid Container option. Skip base check must be a boolean");
    this.options = { autoBindInjectable: e.autoBindInjectable, defaultScope: e.defaultScope, skipBaseClassChecks: e.skipBaseClassChecks }, this.id = ui(), this._bindingDictionary = new te(), this._snapshots = [], this._middleware = null, this._activations = new te(), this._deactivations = new te(), this.parent = null, this._metadataReader = new Ta(), this._moduleActivationStore = new _r();
  }
  static merge(t, e, ...n) {
    const r = new ti(), s = [t, e, ...n].map(((l) => Kn(l))), o = Kn(r);
    return s.forEach(((l) => {
      var a;
      a = o, l.traverse(((u, p) => {
        p.forEach(((g) => {
          a.add(g.serviceIdentifier, g.clone());
        }));
      }));
    })), r;
  }
  load(...t) {
    const e = this._getContainerModuleHelpersFactory();
    for (const n of t) {
      const r = e(n.id);
      n.registry(r.bindFunction, r.unbindFunction, r.isboundFunction, r.rebindFunction, r.unbindAsyncFunction, r.onActivationFunction, r.onDeactivationFunction);
    }
  }
  async loadAsync(...t) {
    const e = this._getContainerModuleHelpersFactory();
    for (const n of t) {
      const r = e(n.id);
      await n.registry(r.bindFunction, r.unbindFunction, r.isboundFunction, r.rebindFunction, r.unbindAsyncFunction, r.onActivationFunction, r.onDeactivationFunction);
    }
  }
  unload(...t) {
    t.forEach(((e) => {
      const n = this._removeModuleBindings(e.id);
      this._deactivateSingletons(n), this._removeModuleHandlers(e.id);
    }));
  }
  async unloadAsync(...t) {
    for (const e of t) {
      const n = this._removeModuleBindings(e.id);
      await this._deactivateSingletonsAsync(n), this._removeModuleHandlers(e.id);
    }
  }
  bind(t) {
    return this._bind(this._buildBinding(t));
  }
  rebind(t) {
    return this.unbind(t), this.bind(t);
  }
  async rebindAsync(t) {
    return await this.unbindAsync(t), this.bind(t);
  }
  unbind(t) {
    if (this._bindingDictionary.hasKey(t)) {
      const e = this._bindingDictionary.get(t);
      this._deactivateSingletons(e);
    }
    this._removeServiceFromDictionary(t);
  }
  async unbindAsync(t) {
    if (this._bindingDictionary.hasKey(t)) {
      const e = this._bindingDictionary.get(t);
      await this._deactivateSingletonsAsync(e);
    }
    this._removeServiceFromDictionary(t);
  }
  unbindAll() {
    this._bindingDictionary.traverse(((t, e) => {
      this._deactivateSingletons(e);
    })), this._bindingDictionary = new te();
  }
  async unbindAllAsync() {
    const t = [];
    this._bindingDictionary.traverse(((e, n) => {
      t.push(this._deactivateSingletonsAsync(n));
    })), await Promise.all(t), this._bindingDictionary = new te();
  }
  onActivation(t, e) {
    this._activations.add(t, e);
  }
  onDeactivation(t, e) {
    this._deactivations.add(t, e);
  }
  isBound(t) {
    let e = this._bindingDictionary.hasKey(t);
    return !e && this.parent && (e = this.parent.isBound(t)), e;
  }
  isCurrentBound(t) {
    return this._bindingDictionary.hasKey(t);
  }
  isBoundNamed(t, e) {
    return this.isBoundTagged(t, Mt, e);
  }
  isBoundTagged(t, e, n) {
    let r = !1;
    if (this._bindingDictionary.hasKey(t)) {
      const s = this._bindingDictionary.get(t), o = (function(l, a, u) {
        const p = ro(a, u), g = hi(p);
        if (g.kind === xt.unmanaged) throw new Error("Unexpected metadata when creating target");
        const m = new Qn("", g, "Variable"), w = new no(l);
        return new kn(a, w, null, [], m);
      })(this, t, { customTag: { key: e, value: n }, isMultiInject: !1 });
      r = s.some(((l) => l.constraint(o)));
    }
    return !r && this.parent && (r = this.parent.isBoundTagged(t, e, n)), r;
  }
  snapshot() {
    this._snapshots.push(mr.of(this._bindingDictionary.clone(), this._middleware, this._activations.clone(), this._deactivations.clone(), this._moduleActivationStore.clone()));
  }
  restore() {
    const t = this._snapshots.pop();
    if (t === void 0) throw new Error("No snapshot available to restore.");
    this._bindingDictionary = t.bindings, this._activations = t.activations, this._deactivations = t.deactivations, this._middleware = t.middleware, this._moduleActivationStore = t.moduleActivationStore;
  }
  createChild(t) {
    const e = new ti(t || this.options);
    return e.parent = this, e;
  }
  applyMiddleware(...t) {
    const e = this._middleware ? this._middleware : this._planAndResolve();
    this._middleware = t.reduce(((n, r) => r(n)), e);
  }
  applyCustomMetadataReader(t) {
    this._metadataReader = t;
  }
  get(t) {
    const e = this._getNotAllArgs(t, !1, !1);
    return this._getButThrowIfAsync(e);
  }
  async getAsync(t) {
    const e = this._getNotAllArgs(t, !1, !1);
    return this._get(e);
  }
  getTagged(t, e, n) {
    const r = this._getNotAllArgs(t, !1, !1, e, n);
    return this._getButThrowIfAsync(r);
  }
  async getTaggedAsync(t, e, n) {
    const r = this._getNotAllArgs(t, !1, !1, e, n);
    return this._get(r);
  }
  getNamed(t, e) {
    return this.getTagged(t, Mt, e);
  }
  async getNamedAsync(t, e) {
    return this.getTaggedAsync(t, Mt, e);
  }
  getAll(t, e) {
    const n = this._getAllArgs(t, e, !1);
    return this._getButThrowIfAsync(n);
  }
  async getAllAsync(t, e) {
    const n = this._getAllArgs(t, e, !1);
    return this._getAll(n);
  }
  getAllTagged(t, e, n) {
    const r = this._getNotAllArgs(t, !0, !1, e, n);
    return this._getButThrowIfAsync(r);
  }
  async getAllTaggedAsync(t, e, n) {
    const r = this._getNotAllArgs(t, !0, !1, e, n);
    return this._getAll(r);
  }
  getAllNamed(t, e) {
    return this.getAllTagged(t, Mt, e);
  }
  async getAllNamedAsync(t, e) {
    return this.getAllTaggedAsync(t, Mt, e);
  }
  resolve(t) {
    const e = this.isBound(t);
    e || this.bind(t).toSelf();
    const n = this.get(t);
    return e || this.unbind(t), n;
  }
  tryGet(t) {
    const e = this._getNotAllArgs(t, !1, !0);
    return this._getButThrowIfAsync(e);
  }
  async tryGetAsync(t) {
    const e = this._getNotAllArgs(t, !1, !0);
    return this._get(e);
  }
  tryGetTagged(t, e, n) {
    const r = this._getNotAllArgs(t, !1, !0, e, n);
    return this._getButThrowIfAsync(r);
  }
  async tryGetTaggedAsync(t, e, n) {
    const r = this._getNotAllArgs(t, !1, !0, e, n);
    return this._get(r);
  }
  tryGetNamed(t, e) {
    return this.tryGetTagged(t, Mt, e);
  }
  async tryGetNamedAsync(t, e) {
    return this.tryGetTaggedAsync(t, Mt, e);
  }
  tryGetAll(t, e) {
    const n = this._getAllArgs(t, e, !0);
    return this._getButThrowIfAsync(n);
  }
  async tryGetAllAsync(t, e) {
    const n = this._getAllArgs(t, e, !0);
    return this._getAll(n);
  }
  tryGetAllTagged(t, e, n) {
    const r = this._getNotAllArgs(t, !0, !0, e, n);
    return this._getButThrowIfAsync(r);
  }
  async tryGetAllTaggedAsync(t, e, n) {
    const r = this._getNotAllArgs(t, !0, !0, e, n);
    return this._getAll(r);
  }
  tryGetAllNamed(t, e) {
    return this.tryGetAllTagged(t, Mt, e);
  }
  async tryGetAllNamedAsync(t, e) {
    return this.tryGetAllTaggedAsync(t, Mt, e);
  }
  _preDestroy(t, e) {
    var n;
    if (t !== void 0 && Reflect.hasMetadata(zi, t)) {
      const r = Reflect.getMetadata(zi, t);
      return (n = e[r.value]) == null ? void 0 : n.call(e);
    }
  }
  _removeModuleHandlers(t) {
    const e = this._moduleActivationStore.remove(t);
    this._activations.removeIntersection(e.onActivations), this._deactivations.removeIntersection(e.onDeactivations);
  }
  _removeModuleBindings(t) {
    return this._bindingDictionary.removeByCondition(((e) => e.moduleId === t));
  }
  _deactivate(t, e) {
    const n = e == null ? void 0 : Object.getPrototypeOf(e).constructor;
    try {
      if (this._deactivations.hasKey(t.serviceIdentifier)) {
        const s = this._deactivateContainer(e, this._deactivations.get(t.serviceIdentifier).values());
        if (Tt(s)) return this._handleDeactivationError(s.then((async () => this._propagateContainerDeactivationThenBindingAndPreDestroyAsync(t, e, n))), t.serviceIdentifier);
      }
      const r = this._propagateContainerDeactivationThenBindingAndPreDestroy(t, e, n);
      if (Tt(r)) return this._handleDeactivationError(r, t.serviceIdentifier);
    } catch (r) {
      if (r instanceof Error) throw new Error(Fi(ae(t.serviceIdentifier), r.message));
    }
  }
  async _handleDeactivationError(t, e) {
    try {
      await t;
    } catch (n) {
      if (n instanceof Error) throw new Error(Fi(ae(e), n.message));
    }
  }
  _deactivateContainer(t, e) {
    let n = e.next();
    for (; typeof n.value == "function"; ) {
      const r = n.value(t);
      if (Tt(r)) return r.then((async () => this._deactivateContainerAsync(t, e)));
      n = e.next();
    }
  }
  async _deactivateContainerAsync(t, e) {
    let n = e.next();
    for (; typeof n.value == "function"; ) await n.value(t), n = e.next();
  }
  _getContainerModuleHelpersFactory() {
    const t = (a) => (u) => {
      const p = this._buildBinding(u);
      return p.moduleId = a, this._bind(p);
    }, e = () => (a) => {
      this.unbind(a);
    }, n = () => async (a) => this.unbindAsync(a), r = () => (a) => this.isBound(a), s = (a) => {
      const u = t(a);
      return (p) => (this.unbind(p), u(p));
    }, o = (a) => (u, p) => {
      this._moduleActivationStore.addActivation(a, u, p), this.onActivation(u, p);
    }, l = (a) => (u, p) => {
      this._moduleActivationStore.addDeactivation(a, u, p), this.onDeactivation(u, p);
    };
    return (a) => ({ bindFunction: t(a), isboundFunction: r(), onActivationFunction: o(a), onDeactivationFunction: l(a), rebindFunction: s(a), unbindAsyncFunction: n(), unbindFunction: e() });
  }
  _bind(t) {
    return this._bindingDictionary.add(t.serviceIdentifier, t), new Ba(t);
  }
  _buildBinding(t) {
    const e = this.options.defaultScope || rt.Transient;
    return new fr(t, e);
  }
  async _getAll(t) {
    return Promise.all(this._get(t));
  }
  _get(t) {
    const e = { ...t, contextInterceptor: (n) => n, targetType: Qs.Variable };
    if (this._middleware) {
      const n = this._middleware(e);
      if (n == null) throw new Error("Invalid return type in middleware. Middleware must return!");
      return n;
    }
    return this._planAndResolve()(e);
  }
  _getButThrowIfAsync(t) {
    const e = this._get(t);
    if (oo(e)) throw new Error(`You are attempting to construct ${(function(n) {
      return typeof n == "function" ? `[function/class ${n.name || "<anonymous>"}]` : typeof n == "symbol" ? n.toString() : `'${n}'`;
    })(t.serviceIdentifier)} in a synchronous way but it has asynchronous dependencies.`);
    return e;
  }
  _getAllArgs(t, e, n) {
    return { avoidConstraints: !(e != null && e.enforceBindingConstraints), isMultiInject: !0, isOptional: n, serviceIdentifier: t };
  }
  _getNotAllArgs(t, e, n, r, s) {
    return { avoidConstraints: !1, isMultiInject: e, isOptional: n, key: r, serviceIdentifier: t, value: s };
  }
  _getPlanMetadataFromNextArgs(t) {
    const e = { isMultiInject: t.isMultiInject };
    return t.key !== void 0 && (e.customTag = { key: t.key, value: t.value }), t.isOptional === !0 && (e.isOptional = !0), e;
  }
  _planAndResolve() {
    return (t) => {
      let e = Aa(this._metadataReader, this, t.targetType, t.serviceIdentifier, this._getPlanMetadataFromNextArgs(t), t.avoidConstraints);
      return e = t.contextInterceptor(e), (function(r) {
        return gr(r.plan.rootRequest.requestScope)(r.plan.rootRequest);
      })(e);
    };
  }
  _deactivateIfSingleton(t) {
    if (t.activated) return Tt(t.cache) ? t.cache.then(((e) => this._deactivate(t, e))) : this._deactivate(t, t.cache);
  }
  _deactivateSingletons(t) {
    for (const e of t)
      if (Tt(this._deactivateIfSingleton(e))) throw new Error("Attempting to unbind dependency with asynchronous destruction (@preDestroy or onDeactivation)");
  }
  async _deactivateSingletonsAsync(t) {
    await Promise.all(t.map((async (e) => this._deactivateIfSingleton(e))));
  }
  _propagateContainerDeactivationThenBindingAndPreDestroy(t, e, n) {
    return this.parent ? this._deactivate.bind(this.parent)(t, e) : this._bindingDeactivationAndPreDestroy(t, e, n);
  }
  async _propagateContainerDeactivationThenBindingAndPreDestroyAsync(t, e, n) {
    this.parent ? await this._deactivate.bind(this.parent)(t, e) : await this._bindingDeactivationAndPreDestroyAsync(t, e, n);
  }
  _removeServiceFromDictionary(t) {
    try {
      this._bindingDictionary.remove(t);
    } catch {
      throw new Error(`Could not unbind serviceIdentifier: ${ae(t)}`);
    }
  }
  _bindingDeactivationAndPreDestroy(t, e, n) {
    if (typeof t.onDeactivation == "function") {
      const r = t.onDeactivation(e);
      if (Tt(r)) return r.then((() => this._preDestroy(n, e)));
    }
    return this._preDestroy(n, e);
  }
  async _bindingDeactivationAndPreDestroyAsync(t, e, n) {
    typeof t.onDeactivation == "function" && await t.onDeactivation(e), await this._preDestroy(n, e);
  }
}
function wt() {
  return function(i) {
    if (Reflect.hasOwnMetadata(Kr, i)) throw new Error("Cannot apply @injectable decorator multiple times.");
    const t = Reflect.getMetadata(Ys, i) || [];
    return Reflect.defineMetadata(Kr, t, i), i;
  };
}
var rn = Symbol.for("INJECTION");
function di(i, t, e, n) {
  function r() {
    return n && !Reflect.hasMetadata(rn, this, t) && Reflect.defineMetadata(rn, e(), this, t), Reflect.hasMetadata(rn, this, t) ? Reflect.getMetadata(rn, this, t) : e();
  }
  function s(o) {
    Reflect.defineMetadata(rn, o, this, t);
  }
  Object.defineProperty(i, t, {
    configurable: !0,
    enumerable: !0,
    get: r,
    set: s
  });
}
function ja(i, t) {
  return function(e) {
    return function(n, r) {
      var s = function() {
        return i.get(e);
      };
      di(n, r, s, t);
    };
  };
}
function za(i, t) {
  return function(e, n) {
    return function(r, s) {
      var o = function() {
        return i.getNamed(e, n);
      };
      di(r, s, o, t);
    };
  };
}
function Fa(i, t) {
  return function(e, n, r) {
    return function(s, o) {
      var l = function() {
        return i.getTagged(e, n, r);
      };
      di(s, o, l, t);
    };
  };
}
function qa(i, t) {
  return function(e) {
    return function(n, r) {
      var s = function() {
        return i.getAll(e);
      };
      di(n, r, s, t);
    };
  };
}
function Va(i, t) {
  t === void 0 && (t = !0);
  var e = ja(i, t), n = za(i, t), r = Fa(i, t), s = qa(i, t);
  return {
    lazyInject: e,
    lazyInjectNamed: n,
    lazyInjectTagged: r,
    lazyMultiInject: s
  };
}
var Ga = Object.getOwnPropertyDescriptor, Sn = (i, t, e, n) => {
  for (var r = n > 1 ? void 0 : n ? Ga(t, e) : t, s = i.length - 1, o; s >= 0; s--)
    (o = i[s]) && (r = o(r) || r);
  return r;
};
const lt = new ti(), { lazyMultiInject: he } = Va(lt), W = {
  ChatInput: Symbol.for("ChatInputController"),
  ChatInputFooter: Symbol.for("ChatInputFooterController"),
  ChatSection: Symbol.for("ChatSectionController"),
  ChatEntryAction: Symbol.for("ChatEntryActionController"),
  Citation: Symbol.for("CitationController"),
  ChatEntryInlineInput: Symbol.for("ChatEntryInlineInputController"),
  ChatAction: Symbol.for("ChatActionController"),
  ChatThread: Symbol.for("ChatThreadController")
};
let At = class {
  attach(i, t) {
    (this.host = i).addController(this), this.context = t;
  }
  hostConnected() {
  }
  hostDisconnected() {
  }
};
At = Sn([
  wt()
], At);
let ie = class extends At {
  render() {
    return E``;
  }
};
ie = Sn([
  wt()
], ie);
let qi = class extends ie {
  constructor() {
    super(...arguments), this.position = "left";
  }
};
qi = Sn([
  wt()
], qi);
let Vi = class extends ie {
  constructor() {
    super(...arguments), this.isEnabled = !1;
  }
  close() {
  }
};
Vi = Sn([
  wt()
], Vi);
let Gi = class extends At {
  save() {
  }
  reset() {
  }
  merge(i) {
    return i;
  }
  render() {
    return E``;
  }
};
Gi = Sn([
  wt()
], Gi);
lt.bind(W.ChatInput).to(qi);
lt.bind(W.ChatInputFooter).to(ie);
lt.bind(W.ChatSection).to(Vi);
lt.bind(W.ChatEntryAction).to(ie);
lt.bind(W.Citation).to(ie);
lt.bind(W.ChatEntryInlineInput).to(ie);
lt.bind(W.ChatAction).to(ie);
lt.bind(W.ChatThread).to(Gi);
var Wa = Object.defineProperty, Za = Object.getOwnPropertyDescriptor, Ft = (i, t, e, n) => {
  for (var r = n > 1 ? void 0 : n ? Za(t, e) : t, s = i.length - 1, o; s >= 0; s--)
    (o = i[s]) && (r = (n ? o(t, e, r) : o(r)) || r);
  return n && r && Wa(t, e, r), r;
};
let $t = class extends yt {
  constructor() {
    super(), this.chatThread = [], this.isDisabled = !1, this.isProcessingResponse = !1, this.isResponseCopied = !1, this.selectedCitation = void 0, this.context = void 0, this.handleInput = this.handleInput.bind(this);
  }
  connectedCallback() {
    if (super.connectedCallback(), this.actionCompontents)
      for (const i of this.actionCompontents)
        i.attach(this, this.context);
    if (this.inlineInputComponents)
      for (const i of this.inlineInputComponents)
        i.attach(this, this.context);
  }
  actionButtonClicked(i, t, e) {
    e.preventDefault();
    const n = new CustomEvent("on-action-button-click", {
      detail: {
        id: i.id,
        chatThreadEntry: t
      },
      bubbles: !0,
      composed: !0
    });
    this.dispatchEvent(n);
  }
  // debounce dispatching must-scroll event
  debounceScrollIntoView() {
    let i = 0;
    clearTimeout(i), i = setTimeout(() => {
      this.chatFooter && this.chatFooter.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 500);
  }
  handleInput(i) {
    const t = new CustomEvent("on-input", {
      detail: {
        value: i
      },
      bubbles: !0,
      composed: !0
    });
    this.dispatchEvent(t);
  }
  handleCitationClick(i, t, e) {
    e.preventDefault(), this.selectedCitation = i;
    const n = new CustomEvent("on-citation-click", {
      detail: {
        citation: i,
        chatThreadEntry: t
      },
      bubbles: !0,
      composed: !0
    });
    this.dispatchEvent(n);
  }
  renderResponseActions(i) {
    var t;
    return E`
      <header class="chat__header">
        <div class="chat__header--button">
          ${(t = this.actionCompontents) == null ? void 0 : t.map((e) => e.render(i, this.isDisabled))}
        </div>
      </header>
    `;
  }
  renderTextEntry(i) {
    const t = [E`<p class="chat__txt--entry">${Xn(i.value)}</p>`];
    return i.followingSteps && i.followingSteps.length > 0 && t.push(E`
        <ol class="items__list steps">
          ${i.followingSteps.map(
      (e) => E` <li class="items__listItem--step">${Xn(e)}</li> `
    )}
        </ol>
      `), this.isProcessingResponse && this.debounceScrollIntoView(), E`<div class="chat_txt--entry-container">${t}</div>`;
  }
  renderCitation(i) {
    const t = i.citations;
    return t && t.length > 0 ? E`
        <div class="chat__citations">
          <citation-list
            .citations="${t}"
            .label="${B.CITATIONS_LABEL}"
            .selectedCitation=${this.selectedCitation}
            @on-citation-click="${(e) => this.handleCitationClick(e.detail.citation, i, e)}"
          ></citation-list>
        </div>
      ` : "";
  }
  renderError(i) {
    return E`<p class="chat__txt error">${i.message}</p>`;
  }
  render() {
    return E`
      <ul class="chat__list" aria-live="assertive">
        ${this.chatThread.map(
      (i) => {
        var t;
        return E`
            <li class="chat__listItem ${i.isUserMessage ? "user-message" : ""}">
              <div class="chat__txt ${i.isUserMessage ? "user-message" : ""}">
                ${i.isUserMessage ? "" : this.renderResponseActions(i)}
                ${i.text.map((e) => this.renderTextEntry(e))} ${this.renderCitation(i)}
                ${(t = this.inlineInputComponents) == null ? void 0 : t.map((e) => e.render(i, this.handleInput))}
                ${i.error ? this.renderError(i.error) : ""}
              </div>
              <p class="chat__txt--info">
                <span class="timestamp">${i.timestamp}</span>,
                <span class="user">${i.isUserMessage ? "You" : B.USER_IS_BOT}</span>
              </p>
            </li>
          `;
      }
    )}
      </ul>
      <div class="chat__footer" id="chat-list-footer">
        <!-- Do not delete this element. It is used for auto-scrolling -->
      </div>
    `;
  }
};
$t.styles = [ra];
Ft([
  D({ type: Array })
], $t.prototype, "chatThread", 2);
Ft([
  D({ type: Boolean })
], $t.prototype, "isDisabled", 2);
Ft([
  D({ type: Boolean })
], $t.prototype, "isProcessingResponse", 2);
Ft([
  ke()
], $t.prototype, "isResponseCopied", 2);
Ft([
  Ls("#chat-list-footer")
], $t.prototype, "chatFooter", 2);
Ft([
  D({ type: Object })
], $t.prototype, "selectedCitation", 2);
Ft([
  D({ type: Object })
], $t.prototype, "context", 2);
Ft([
  he(W.ChatEntryAction)
], $t.prototype, "actionCompontents", 2);
Ft([
  he(W.ChatEntryInlineInput)
], $t.prototype, "inlineInputComponents", 2);
$t = Ft([
  Nt("chat-thread-component")
], $t);
const Xa = zt`
  button {
    color: var(--text-color);
    text-decoration: underline;
    border: var(--border-thin) solid var(--c-accent-dark);
    text-decoration: none;
    border-radius: var(--radius-small);
    background: var(--c-white);
    display: flex;
    align-items: center;
    margin-left: 5px;
    opacity: 1;
    padding: var(--d-xsmall);
    transition: all 0.3s ease-in-out;
    position: relative;
    cursor: pointer;
  }
  button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  span {
    font-size: smaller;
    transition: all 0.3s ease-out 0s;
    position: absolute;
    text-align: right;
    top: -80%;
    background: var(--c-accent-dark);
    color: var(--c-white);
    opacity: 0;
    right: 0;
    padding: var(--d-xsmall) var(--d-small);
    border-radius: var(--radius-small);
    font-weight: bold;
    word-wrap: nowrap;
  }
  span::after {
    content: '';
    position: absolute;
    width: 0;
    height: 0;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-top: var(--border-thick) solid var(--c-accent-dark);
    bottom: -8px;
    right: 5px;
  }
  svg {
    fill: currentColor;
    padding: var(--d-xsmall);
    width: var(--d-base);
    height: var(--d-base);
  }
  button:hover > span,
  button:focus > span {
    display: inline-block;
    opacity: 1;
  }
  button:hover,
  button:focus,
  button:hover > svg,
  button:focus > svg {
    background-color: var(--c-light-gray);
    border-radius: var(--radius-small);
    transition: background 0.3s ease-in-out;
  }
`;
var Ya = Object.defineProperty, Qa = Object.getOwnPropertyDescriptor, Ue = (i, t, e, n) => {
  for (var r = n > 1 ? void 0 : n ? Qa(t, e) : t, s = i.length - 1, o; s >= 0; s--)
    (o = i[s]) && (r = (n ? o(t, e, r) : o(r)) || r);
  return n && r && Ya(t, e, r), r;
};
let le = class extends yt {
  constructor() {
    super(...arguments), this.label = "", this.svgIcon = "", this.isDisabled = !1, this.actionId = "", this.tooltip = void 0;
  }
  render() {
    return E`
      <button title="${this.label}" data-testid="${this.actionId}" ?disabled="${this.isDisabled}">
        <span>${this.tooltip ?? this.label}</span>
        ${jt(this.svgIcon)}
      </button>
    `;
  }
};
le.styles = [Xa];
Ue([
  D({ type: String })
], le.prototype, "label", 2);
Ue([
  D({ type: String })
], le.prototype, "svgIcon", 2);
Ue([
  D({ type: Boolean })
], le.prototype, "isDisabled", 2);
Ue([
  D({ type: String })
], le.prototype, "actionId", 2);
Ue([
  D({ type: String })
], le.prototype, "tooltip", 2);
le = Ue([
  Nt("chat-action-button")
], le);
class Ka {
  constructor(t) {
    this._state = {}, this._selectedChatEntry = void 0, this._apiUrl = ji.url, this._interactionModel = "chat", this._isChatStarted = !1, this._selectedCitation = void 0, (this.host = t).addController(this);
  }
  hostConnected() {
  }
  hostDisconnected() {
  }
  set selectedCitation(t) {
    this._selectedCitation = t, this.host.requestUpdate();
  }
  get selectedCitation() {
    return this._selectedCitation;
  }
  set isChatStarted(t) {
    this._isChatStarted = t, this.host.requestUpdate();
  }
  get isChatStarted() {
    return this._isChatStarted;
  }
  setState(t, e) {
    this._state[t] = e, this.host.requestUpdate();
  }
  getState(t) {
    return this._state[t];
  }
  set selectedChatEntry(t) {
    this._selectedChatEntry = t, this.host.requestUpdate();
  }
  get selectedChatEntry() {
    return this._selectedChatEntry;
  }
  set apiUrl(t) {
    this._apiUrl = t, this.host.requestUpdate();
  }
  get apiUrl() {
    return this._apiUrl;
  }
  set interactionModel(t) {
    this._interactionModel = t, this.host.requestUpdate();
  }
  get interactionModel() {
    return this._interactionModel;
  }
}
const Ja = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2048 2048">\r
  <path d="M2048 290l-734 734 734 734-290 290-734-734-734 734L0 1758l734-734L0 290 290 0l734 734L1758 0l290 290z" />\r
</svg>`;
var tl = Object.defineProperty, el = Object.getOwnPropertyDescriptor, lo = (i, t, e, n) => {
  for (var r = n > 1 ? void 0 : n ? el(t, e) : t, s = i.length - 1, o; s >= 0; s--)
    (o = i[s]) && (r = (n ? o(t, e, r) : o(r)) || r);
  return n && r && tl(t, e, r), r;
};
let ei = class extends At {
  constructor() {
    super(), this.close = this.close.bind(this);
  }
  hostConnected() {
    if (this.citationControllers)
      for (const i of this.citationControllers)
        i.attach(this.host, this.context);
  }
  handleCitationClick(i) {
    var t;
    i == null || i.preventDefault(), this.context.selectedCitation = (t = i == null ? void 0 : i.detail) == null ? void 0 : t.citation, this.context.setState("showCitations", !0);
  }
  renderChatEntryTabContent(i) {
    var t;
    return E`
      <tab-component
        .tabs="${[
      {
        id: "tab-thought-process",
        label: B.THOUGHT_PROCESS_LABEL
      },
      {
        id: "tab-support-context",
        label: B.SUPPORT_CONTEXT_LABEL
      },
      {
        id: "tab-citations",
        label: B.CITATIONS_TAB_LABEL
      }
    ]}"
        .selectedTabId="${this.selectedAsideTab}"
      >
        <div slot="tab-thought-process" class="tab-component__content">
          ${i && i.thoughts ? E` <p class="tab-component__paragraph">${Xn(i.thoughts)}</p> ` : ""}
        </div>
        <div slot="tab-support-context" class="tab-component__content">
          ${i && i.dataPoints ? E`
                <teaser-list-component
                  .alwaysRow="${!0}"
                  .teasers="${i.dataPoints.map((e) => ({ description: e }))}"
                ></teaser-list-component>
              ` : ""}
        </div>
        ${i && i.citations ? E`
              <div slot="tab-citations" class="tab-component__content">
                <citation-list
                  .citations="${i.citations}"
                  .label="${B.CITATIONS_LABEL}"
                  .selectedCitation="${this.context.selectedCitation}"
                  @on-citation-click="${this.handleCitationClick}"
                ></citation-list>
                ${this.context.selectedCitation ? (t = this.citationControllers) == null ? void 0 : t.map(
      (e) => e.render(
        this.context.selectedCitation,
        `${this.context.apiUrl}/content/${this.context.selectedCitation.text}`
      )
    ) : ""}
              </div>
            ` : ""}
      </tab-component>
    `;
  }
  get isEnabled() {
    return this.isShowingThoughtProcess;
  }
  close() {
    this.isShowingThoughtProcess = !1, this.context.setState("showCitations", !1), this.context.selectedChatEntry = void 0;
  }
  get isShowingThoughtProcess() {
    return this.context.getState("showThoughtProcess") || this.context.getState("showCitations");
  }
  set isShowingThoughtProcess(i) {
    this.context.setState("showThoughtProcess", i);
  }
  get selectedAsideTab() {
    return this.context.getState("showCitations") ? "tab-citations" : "tab-thought-process";
  }
  render() {
    return E`
      <aside class="aside" data-testid="aside-thought-process">
        <div class="aside__header">
          <chat-action-button
            .label="${B.HIDE_THOUGH_PROCESS_BUTTON_LABEL_TEXT}"
            actionId="chat-hide-thought-process"
            @click="${this.close}"
            .svgIcon="${Ja}"
          >
          </chat-action-button>
        </div>
        ${this.renderChatEntryTabContent(this.context.selectedChatEntry)}
      </aside>
    `;
  }
};
lo([
  he(W.Citation)
], ei.prototype, "citationControllers", 2);
ei = lo([
  wt()
], ei);
lt.bind(W.ChatSection).to(ei);
const nl = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2048 2048">\r
  <path d="M960 0q97 0 187 25t168 71 143 110 110 142 71 169 25 187q0 145-55 269t-157 225q-83 82-127 183t-45 219v256q0 40-15 75t-41 61-61 41-75 15H832q-40 0-75-15t-61-41-41-61-15-75v-256q0-118-44-219t-128-183q-102-101-157-225t-55-269q0-97 25-187t71-168 110-143T604 96t169-71T960 0zm128 1920q26 0 45-19t19-45v-192H768v192q0 26 19 45t45 19h256zm67-384q12-128 65-233t144-197q83-83 127-183t45-219q0-119-45-224t-124-183-183-123-224-46q-119 0-224 45T553 297 430 480t-46 224q0 118 44 218t128 184q90 91 143 196t66 234h131v-512q0-26 19-45t45-19q26 0 45 19t19 45v512h131zM640 576q26 0 45 19l128 128q19 19 19 45t-19 45-45 19q-26 0-45-19L595 685q-19-19-19-45t19-45 45-19zm448 192q0-26 19-45l128-128q19-19 45-19t45 19 19 45q0 26-19 45l-128 128q-19 19-45 19t-45-19-19-45zM960 384q26 0 45 19t19 45v192q0 26-19 45t-45 19q-26 0-45-19t-19-45V448q0-26 19-45t45-19z" />\r
</svg>`;
var il = Object.getOwnPropertyDescriptor, rl = (i, t, e, n) => {
  for (var r = n > 1 ? void 0 : n ? il(t, e) : t, s = i.length - 1, o; s >= 0; s--)
    (o = i[s]) && (r = o(r) || r);
  return r;
};
let Wi = class extends At {
  handleClick(i, t) {
    i.preventDefault(), this.context.setState("showThoughtProcess", !0), this.context.selectedChatEntry = t;
  }
  render(i, t) {
    const e = this.context.getState("showThoughtProcess");
    return E`
      <chat-action-button
        .label="${B.SHOW_THOUGH_PROCESS_BUTTON_LABEL_TEXT}"
        .svgIcon="${nl}"
        actionId="chat-show-thought-process"
        .isDisabled="${t || e}"
        @click="${(n) => this.handleClick(n, i)}"
      ></chat-action-button>
    `;
  }
};
Wi = rl([
  wt()
], Wi);
lt.bind(W.ChatEntryAction).to(Wi);
const sl = zt`
  .tab-component__list {
    list-style-type: none;
    display: flex;
    box-shadow: var(--shadow);
    border-radius: var(--radius-base);
    padding: var(--d-xsmall);
    width: 450px;
    margin: 0 auto;
    justify-content: space-evenly;
  }
  .tab-component__listItem {
    width: 33%;
    text-align: center;
  }
  .tab-component__link.active {
    background: linear-gradient(to left, var(--c-accent-light), var(--c-accent-high));
    color: var(--c-white);
  }
  .tab-component__link:not(.active):hover {
    background: var(--c-light-gray);
    cursor: pointer;
  }
  .tab-component__link {
    border-bottom: 4px solid transparent;
    border-radius: var(--radius-small);
    text-decoration: none;
    color: var(--text-color);
    font-weight: bold;
    font-size: var(--font-small);
    cursor: pointer;
    display: block;
    padding: var(--d-small);
  }
  .tab-component__content {
    position: relative;
  }
  .tab-component__tab {
    position: absolute;
    top: 0;
    left: 30px;
    display: none;
    width: 100%;
    @media (max-width: 1024px) {
      position: relative;
      left: 0;
    }
  }
  .tab-component__tab.active {
    display: block;
  }
`;
var ol = Object.defineProperty, al = Object.getOwnPropertyDescriptor, yr = (i, t, e, n) => {
  for (var r = n > 1 ? void 0 : n ? al(t, e) : t, s = i.length - 1, o; s >= 0; s--)
    (o = i[s]) && (r = (n ? o(t, e, r) : o(r)) || r);
  return n && r && ol(t, e, r), r;
};
let _n = class extends yt {
  constructor() {
    super(...arguments), this.tabs = [], this.selectedTabId = void 0;
  }
  activateTab(i) {
    i.preventDefault();
    const t = i.target.id;
    this.selectedTabId = t;
  }
  renderTabListItem(i, t) {
    return E`
      <li class="tab-component__listItem">
        <a
          id="${i.id}"
          class="tab-component__link ${t ? "active" : ""}"
          role="tab"
          href="#"
          aria-selected="${t}"
          aria-hidden="${!t}"
          aria-controls="tabpanel-${i.id}"
          @click="${(e) => this.activateTab(e)}"
          title="${i.label}"
        >
          ${i.label}
        </a>
      </li>
    `;
  }
  renderTabContent(i, t) {
    return E`
      <div
        id="tabpanel-${i.id}"
        class="tab-component__tab ${t ? "active" : ""}"
        role="tabpanel"
        tabindex="${t ? "0" : "-1"}"
        aria-labelledby="${i.id}"
      >
        <slot name="${i.id}"></slot>
      </div>
    `;
  }
  render() {
    return E`
      <div class="tab-component">
        <nav>
          <ul class="tab-component__list" role="tablist">
            ${this.tabs.map((i) => this.renderTabListItem(i, i.id === this.selectedTabId))}
          </ul>
        </nav>
        <div class="tab-component__content">
          ${this.tabs.map((i) => this.renderTabContent(i, i.id === this.selectedTabId))}
        </div>
      </div>
    `;
  }
};
_n.styles = [sl];
yr([
  D({ type: Array })
], _n.prototype, "tabs", 2);
yr([
  D({ type: String })
], _n.prototype, "selectedTabId", 2);
_n = yr([
  Nt("tab-component")
], _n);
var ll = Object.getOwnPropertyDescriptor, cl = (i, t, e, n) => {
  for (var r = n > 1 ? void 0 : n ? ll(t, e) : t, s = i.length - 1, o; s >= 0; s--)
    (o = i[s]) && (r = o(r) || r);
  return r;
};
let Zi = class extends At {
  constructor() {
    super(...arguments), this.position = "right";
  }
  render(i) {
    return E`<voice-input-button @on-voice-input="${(t) => {
      var e;
      return i((e = t == null ? void 0 : t.detail) == null ? void 0 : e.value);
    }}" />`;
  }
};
Zi = cl([
  wt()
], Zi);
lt.bind(W.ChatInput).to(Zi);
const hl = zt`
  button {
    color: var(--text-color);
    font-weight: bold;
    margin-left: 8px;
    background: transparent;
    transition: background 0.3s ease-in-out;
    box-shadow: none;
    border: none;
    cursor: pointer;
    width: var(--d-xlarge);
    height: 100%;
  }
  button:hover,
  button:focus {
    background: var(--c-secondary);
  }
  button:hover svg,
  button:focus svg {
    opacity: 0.8;
  }
  .not-recording svg {
    fill: var(--c-black);
  }
  .recording svg {
    fill: var(--red);
  }
`, ul = `<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">\r
  <path d="M18.25 11C18.6297 11 18.9435 11.2822 18.9932 11.6482L19 11.75V12.25C19 15.8094 16.245 18.7254 12.751 18.9817L12.75 21.25C12.75 21.6642 12.4142 22 12 22C11.6203 22 11.3065 21.7178 11.2568 21.3518L11.25 21.25L11.25 18.9818C7.83323 18.7316 5.12283 15.938 5.00406 12.4863L5 12.25V11.75C5 11.3358 5.33579 11 5.75 11C6.1297 11 6.44349 11.2822 6.49315 11.6482L6.5 11.75V12.25C6.5 15.077 8.73445 17.3821 11.5336 17.4956L11.75 17.5H12.25C15.077 17.5 17.3821 15.2656 17.4956 12.4664L17.5 12.25V11.75C17.5 11.3358 17.8358 11 18.25 11ZM12 2C14.2091 2 16 3.79086 16 6V12C16 14.2091 14.2091 16 12 16C9.79086 16 8 14.2091 8 12V6C8 3.79086 9.79086 2 12 2Z"  />\r
</svg>`, dl = `<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">\r
  <path d="M11 17.5C11 18.596 11.2713 19.6287 11.7503 20.5345L11.75 21.25C11.75 21.6642 11.4142 22 11 22C10.6203 22 10.3065 21.7178 10.2568 21.3518L10.25 21.25L10.25 18.9818C6.83323 18.7316 4.12283 15.938 4.00406 12.4863L4 12.25V11.75C4 11.3358 4.33579 11 4.75 11C5.1297 11 5.44349 11.2822 5.49315 11.6482L5.5 11.75V12.25C5.5 15.077 7.73445 17.3821 10.5336 17.4956L10.75 17.5H11ZM11.1748 15.9962C11.6577 13.9575 13.1007 12.2902 15 11.4982V6C15 3.79086 13.2091 2 11 2C8.79086 2 7 3.79086 7 6V12C7 14.2091 8.79086 16 11 16C11.0586 16 11.1169 15.9987 11.1748 15.9962ZM20 17.5C20 18.8807 18.8807 20 17.5 20C16.1193 20 15 18.8807 15 17.5C15 16.1193 16.1193 15 17.5 15C18.8807 15 20 16.1193 20 17.5ZM23 17.5C23 20.5376 20.5376 23 17.5 23C14.4624 23 12 20.5376 12 17.5C12 14.4624 14.4624 12 17.5 12C20.5376 12 23 14.4624 23 17.5ZM13.5 17.5C13.5 19.7091 15.2909 21.5 17.5 21.5C19.7091 21.5 21.5 19.7091 21.5 17.5C21.5 15.2909 19.7091 13.5 17.5 13.5C15.2909 13.5 13.5 15.2909 13.5 17.5Z" />\r
</svg>`;
var pl = Object.defineProperty, fl = Object.getOwnPropertyDescriptor, vr = (i, t, e, n) => {
  for (var r = n > 1 ? void 0 : n ? fl(t, e) : t, s = i.length - 1, o; s >= 0; s--)
    (o = i[s]) && (r = (n ? o(t, e, r) : o(r)) || r);
  return n && r && pl(t, e, r), r;
};
let yn = class extends yt {
  constructor() {
    super(...arguments), this.recognitionSvc = window.SpeechRecognition || window.webkitSpeechRecognition, this.showVoiceInput = this.recognitionSvc !== void 0, this.enableVoiceListening = !1, this.speechRecognition = void 0;
  }
  initializeSpeechRecognition() {
    if (this.showVoiceInput && this.recognitionSvc) {
      if (this.speechRecognition = new this.recognitionSvc(), !this.speechRecognition)
        return;
      this.speechRecognition.continuous = !0, this.speechRecognition.lang = "en-US", this.speechRecognition.onresult = (i) => {
        let t = "";
        for (const n of i.results)
          t += `${n[0].transcript}`;
        const e = new CustomEvent("on-voice-input", {
          detail: {
            value: t
          },
          bubbles: !0,
          composed: !0
        });
        this.dispatchEvent(e);
      }, this.speechRecognition.addEventListener("error", (i) => {
        this.speechRecognition && (this.speechRecognition.stop(), console.log(`Speech recognition error detected: ${i.error} - ${i.message}`));
      });
    }
  }
  handleVoiceInput(i) {
    i.preventDefault(), this.speechRecognition || this.initializeSpeechRecognition(), this.speechRecognition && (this.enableVoiceListening = !this.enableVoiceListening, this.enableVoiceListening ? this.speechRecognition.start() : this.speechRecognition.stop());
  }
  renderVoiceButton() {
    return E`
      <button
        title="${this.enableVoiceListening ? B.CHAT_VOICE_REC_BUTTON_LABEL_TEXT : B.CHAT_VOICE_BUTTON_LABEL_TEXT}"
        class="${this.enableVoiceListening ? "recording" : "not-recording"}"
        @click="${this.handleVoiceInput}"
      >
        ${this.enableVoiceListening ? jt(dl) : jt(ul)}
      </button>
    `;
  }
  render() {
    return this.showVoiceInput ? this.renderVoiceButton() : E``;
  }
};
yn.styles = [hl];
vr([
  ke()
], yn.prototype, "showVoiceInput", 2);
vr([
  ke()
], yn.prototype, "enableVoiceListening", 2);
yn = vr([
  Nt("voice-input-button")
], yn);
var gl = Object.getOwnPropertyDescriptor, co = (i, t, e, n) => {
  for (var r = n > 1 ? void 0 : n ? gl(t, e) : t, s = i.length - 1, o; s >= 0; s--)
    (o = i[s]) && (r = o(r) || r);
  return r;
};
let Xi = class extends At {
  constructor() {
    super(...arguments), this.position = "top";
  }
  render(i) {
    return E`
      <teaser-list-component
        .heading="${this.context.interactionModel === "chat" ? Hn.HEADING_CHAT : Hn.HEADING_ASK}"
        .clickable="${!0}"
        .actionLabel="${Hn.TEASER_CTA_LABEL}"
        @teaser-click="${(t) => {
      var e;
      return i((e = t == null ? void 0 : t.detail) == null ? void 0 : e.value);
    }}"
        .teasers="${Hn.DEFAULT_PROMPTS}"
      ></teaser-list-component>
    `, "";
  }
};
Xi = co([
  wt()
], Xi);
let Yi = class extends At {
  render(i) {
    return E`
      <div class="chat__containerFooter">
        <button
          type="button"
          @click="${i}"
          class="defaults__span button"
        >
          ${B.DISPLAY_DEFAULT_PROMPTS_BUTTON}
        </button>
      </div>
    `, "";
  }
};
Yi = co([
  wt()
], Yi);
lt.bind(W.ChatInput).to(Xi);
lt.bind(W.ChatInputFooter).to(Yi);
const ml = zt`
  .headline {
    color: var(--text-color);
    font-size: var(--font-r-large);
    padding: 0;
    margin: var(--d-small) 0 var(--d-large);

    @media (min-width: 1024px) {
      font-size: var(--font-r-base);
      text-align: center;
    }
  }
  [role='button'] {
    text-decoration: none;
    color: var(--text-color);
    display: block;
    font-size: var(--font-rel-base);
  }
  .teaser-list {
    list-style-type: none;
    padding: 0;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .teaser-list.always-row {
    text-align: left;
  }
  .teaser-list:not(.always-row) {
    @media (min-width: 1024px) {
      flex-direction: row;
    }
  }
  .teaser-list-item {
    padding: var(--d-small);
    border-radius: var(--radius-base);
    background: var(--c-white);
    margin: var(--d-xsmall);
    color: var(--text-color);
    justify-content: space-evenly;
    box-shadow: var(--shadow);
    border: var(--border-base) solid transparent;

    @media (min-width: 768px) {
      min-height: 100px;
    }
  }
  .teaser-list-item:hover,
  .teaser-list-item:focus {
    color: var(--c-accent-dark);
    background: var(--c-secondary);
    transition: all 0.3s ease-in-out;
    border-color: var(--c-accent-high);
  }
  .teaser-list-item .teaser-click-label {
    color: var(--c-accent-high);
    font-weight: bold;
    display: block;
    margin-top: 20px;
    text-decoration: underline;
  }
`;
var _l = Object.defineProperty, yl = Object.getOwnPropertyDescriptor, Be = (i, t, e, n) => {
  for (var r = n > 1 ? void 0 : n ? yl(t, e) : t, s = i.length - 1, o; s >= 0; s--)
    (o = i[s]) && (r = (n ? o(t, e, r) : o(r)) || r);
  return n && r && _l(t, e, r), r;
};
let ce = class extends yt {
  constructor() {
    super(...arguments), this.teasers = [], this.heading = void 0, this.actionLabel = void 0, this.alwaysRow = !1, this.clickable = !1;
  }
  // Handle the click on a default prompt
  handleTeaserClick(i, t) {
    t == null || t.preventDefault();
    const e = new CustomEvent("teaser-click", {
      detail: {
        value: i.description
      },
      bubbles: !0,
      composed: !0
    });
    this.dispatchEvent(e);
  }
  renderClickableTeaser(i) {
    return E`
      <a
        role="button"
        href="#"
        data-testid="default-question"
        @click="${(t) => this.handleTeaserClick(i, t)}"
      >
        ${i.description}
        <span class="teaser-click-label">${this.actionLabel}</span>
      </a>
    `;
  }
  render() {
    return E`
      <div class="teaser-list-container">
        ${this.heading ? E`<h1 class="headline">${this.heading}</h1>` : ""}
        <ul class="teaser-list ${this.alwaysRow ? "always-row" : ""}">
          ${this.teasers.map(
      (i) => E`
              <li class="teaser-list-item">
                ${this.clickable ? this.renderClickableTeaser(i) : i.description}
              </li>
            `
    )}
        </ul>
      </div>
    `;
  }
};
ce.styles = [ml];
Be([
  D({ type: Array })
], ce.prototype, "teasers", 2);
Be([
  D({ type: String })
], ce.prototype, "heading", 2);
Be([
  D({ type: String })
], ce.prototype, "actionLabel", 2);
Be([
  D({ type: Boolean })
], ce.prototype, "alwaysRow", 2);
Be([
  D({ type: Boolean })
], ce.prototype, "clickable", 2);
ce = Be([
  Nt("teaser-list-component")
], ce);
function br() {
  return {
    async: !1,
    breaks: !1,
    extensions: null,
    gfm: !0,
    hooks: null,
    pedantic: !1,
    renderer: null,
    silent: !1,
    tokenizer: null,
    walkTokens: null
  };
}
let Se = br();
function ho(i) {
  Se = i;
}
const uo = /[&<>"']/, vl = new RegExp(uo.source, "g"), po = /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/, bl = new RegExp(po.source, "g"), wl = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;"
}, hs = (i) => wl[i];
function St(i, t) {
  if (t) {
    if (uo.test(i))
      return i.replace(vl, hs);
  } else if (po.test(i))
    return i.replace(bl, hs);
  return i;
}
const Cl = /&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/ig;
function Tl(i) {
  return i.replace(Cl, (t, e) => (e = e.toLowerCase(), e === "colon" ? ":" : e.charAt(0) === "#" ? e.charAt(1) === "x" ? String.fromCharCode(parseInt(e.substring(2), 16)) : String.fromCharCode(+e.substring(1)) : ""));
}
const xl = /(^|[^\[])\^/g;
function j(i, t) {
  i = typeof i == "string" ? i : i.source, t = t || "";
  const e = {
    replace: (n, r) => (r = typeof r == "object" && "source" in r ? r.source : r, r = r.replace(xl, "$1"), i = i.replace(n, r), e),
    getRegex: () => new RegExp(i, t)
  };
  return e;
}
function us(i) {
  try {
    i = encodeURI(i).replace(/%25/g, "%");
  } catch {
    return null;
  }
  return i;
}
const ni = { exec: () => null };
function ds(i, t) {
  const e = i.replace(/\|/g, (s, o, l) => {
    let a = !1, u = o;
    for (; --u >= 0 && l[u] === "\\"; )
      a = !a;
    return a ? "|" : " |";
  }), n = e.split(/ \|/);
  let r = 0;
  if (n[0].trim() || n.shift(), n.length > 0 && !n[n.length - 1].trim() && n.pop(), t)
    if (n.length > t)
      n.splice(t);
    else
      for (; n.length < t; )
        n.push("");
  for (; r < n.length; r++)
    n[r] = n[r].trim().replace(/\\\|/g, "|");
  return n;
}
function Bn(i, t, e) {
  const n = i.length;
  if (n === 0)
    return "";
  let r = 0;
  for (; r < n && i.charAt(n - r - 1) === t; )
    r++;
  return i.slice(0, n - r);
}
function Al(i, t) {
  if (i.indexOf(t[1]) === -1)
    return -1;
  let e = 0;
  for (let n = 0; n < i.length; n++)
    if (i[n] === "\\")
      n++;
    else if (i[n] === t[0])
      e++;
    else if (i[n] === t[1] && (e--, e < 0))
      return n;
  return -1;
}
function ps(i, t, e, n) {
  const r = t.href, s = t.title ? St(t.title) : null, o = i[1].replace(/\\([\[\]])/g, "$1");
  if (i[0].charAt(0) !== "!") {
    n.state.inLink = !0;
    const l = {
      type: "link",
      raw: e,
      href: r,
      title: s,
      text: o,
      tokens: n.inlineTokens(o)
    };
    return n.state.inLink = !1, l;
  }
  return {
    type: "image",
    raw: e,
    href: r,
    title: s,
    text: St(o)
  };
}
function kl(i, t) {
  const e = i.match(/^(\s+)(?:```)/);
  if (e === null)
    return t;
  const n = e[1];
  return t.split(`
`).map((r) => {
    const s = r.match(/^\s+/);
    if (s === null)
      return r;
    const [o] = s;
    return o.length >= n.length ? r.slice(n.length) : r;
  }).join(`
`);
}
class ii {
  constructor(t) {
    v(this, "options");
    // TODO: Fix this rules type
    v(this, "rules");
    v(this, "lexer");
    this.options = t || Se;
  }
  space(t) {
    const e = this.rules.block.newline.exec(t);
    if (e && e[0].length > 0)
      return {
        type: "space",
        raw: e[0]
      };
  }
  code(t) {
    const e = this.rules.block.code.exec(t);
    if (e) {
      const n = e[0].replace(/^ {1,4}/gm, "");
      return {
        type: "code",
        raw: e[0],
        codeBlockStyle: "indented",
        text: this.options.pedantic ? n : Bn(n, `
`)
      };
    }
  }
  fences(t) {
    const e = this.rules.block.fences.exec(t);
    if (e) {
      const n = e[0], r = kl(n, e[3] || "");
      return {
        type: "code",
        raw: n,
        lang: e[2] ? e[2].trim().replace(this.rules.inline._escapes, "$1") : e[2],
        text: r
      };
    }
  }
  heading(t) {
    const e = this.rules.block.heading.exec(t);
    if (e) {
      let n = e[2].trim();
      if (/#$/.test(n)) {
        const r = Bn(n, "#");
        (this.options.pedantic || !r || / $/.test(r)) && (n = r.trim());
      }
      return {
        type: "heading",
        raw: e[0],
        depth: e[1].length,
        text: n,
        tokens: this.lexer.inline(n)
      };
    }
  }
  hr(t) {
    const e = this.rules.block.hr.exec(t);
    if (e)
      return {
        type: "hr",
        raw: e[0]
      };
  }
  blockquote(t) {
    const e = this.rules.block.blockquote.exec(t);
    if (e) {
      const n = Bn(e[0].replace(/^ *>[ \t]?/gm, ""), `
`), r = this.lexer.state.top;
      this.lexer.state.top = !0;
      const s = this.lexer.blockTokens(n);
      return this.lexer.state.top = r, {
        type: "blockquote",
        raw: e[0],
        tokens: s,
        text: n
      };
    }
  }
  list(t) {
    let e = this.rules.block.list.exec(t);
    if (e) {
      let n = e[1].trim();
      const r = n.length > 1, s = {
        type: "list",
        raw: "",
        ordered: r,
        start: r ? +n.slice(0, -1) : "",
        loose: !1,
        items: []
      };
      n = r ? `\\d{1,9}\\${n.slice(-1)}` : `\\${n}`, this.options.pedantic && (n = r ? n : "[*+-]");
      const o = new RegExp(`^( {0,3}${n})((?:[	 ][^\\n]*)?(?:\\n|$))`);
      let l = "", a = "", u = !1;
      for (; t; ) {
        let p = !1;
        if (!(e = o.exec(t)) || this.rules.block.hr.test(t))
          break;
        l = e[0], t = t.substring(l.length);
        let g = e[2].split(`
`, 1)[0].replace(/^\t+/, (ct) => " ".repeat(3 * ct.length)), m = t.split(`
`, 1)[0], w = 0;
        this.options.pedantic ? (w = 2, a = g.trimStart()) : (w = e[2].search(/[^ ]/), w = w > 4 ? 1 : w, a = g.slice(w), w += e[1].length);
        let N = !1;
        if (!g && /^ *$/.test(m) && (l += m + `
`, t = t.substring(m.length + 1), p = !0), !p) {
          const ct = new RegExp(`^ {0,${Math.min(3, w - 1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`), mt = new RegExp(`^ {0,${Math.min(3, w - 1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`), K = new RegExp(`^ {0,${Math.min(3, w - 1)}}(?:\`\`\`|~~~)`), Z = new RegExp(`^ {0,${Math.min(3, w - 1)}}#`);
          for (; t; ) {
            const et = t.split(`
`, 1)[0];
            if (m = et, this.options.pedantic && (m = m.replace(/^ {1,4}(?=( {4})*[^ ])/g, "  ")), K.test(m) || Z.test(m) || ct.test(m) || mt.test(t))
              break;
            if (m.search(/[^ ]/) >= w || !m.trim())
              a += `
` + m.slice(w);
            else {
              if (N || g.search(/[^ ]/) >= 4 || K.test(g) || Z.test(g) || mt.test(g))
                break;
              a += `
` + m;
            }
            !N && !m.trim() && (N = !0), l += et + `
`, t = t.substring(et.length + 1), g = m.slice(w);
          }
        }
        s.loose || (u ? s.loose = !0 : /\n *\n *$/.test(l) && (u = !0));
        let O = null, L;
        this.options.gfm && (O = /^\[[ xX]\] /.exec(a), O && (L = O[0] !== "[ ] ", a = a.replace(/^\[[ xX]\] +/, ""))), s.items.push({
          type: "list_item",
          raw: l,
          task: !!O,
          checked: L,
          loose: !1,
          text: a,
          tokens: []
        }), s.raw += l;
      }
      s.items[s.items.length - 1].raw = l.trimEnd(), s.items[s.items.length - 1].text = a.trimEnd(), s.raw = s.raw.trimEnd();
      for (let p = 0; p < s.items.length; p++)
        if (this.lexer.state.top = !1, s.items[p].tokens = this.lexer.blockTokens(s.items[p].text, []), !s.loose) {
          const g = s.items[p].tokens.filter((w) => w.type === "space"), m = g.length > 0 && g.some((w) => /\n.*\n/.test(w.raw));
          s.loose = m;
        }
      if (s.loose)
        for (let p = 0; p < s.items.length; p++)
          s.items[p].loose = !0;
      return s;
    }
  }
  html(t) {
    const e = this.rules.block.html.exec(t);
    if (e)
      return {
        type: "html",
        block: !0,
        raw: e[0],
        pre: e[1] === "pre" || e[1] === "script" || e[1] === "style",
        text: e[0]
      };
  }
  def(t) {
    const e = this.rules.block.def.exec(t);
    if (e) {
      const n = e[1].toLowerCase().replace(/\s+/g, " "), r = e[2] ? e[2].replace(/^<(.*)>$/, "$1").replace(this.rules.inline._escapes, "$1") : "", s = e[3] ? e[3].substring(1, e[3].length - 1).replace(this.rules.inline._escapes, "$1") : e[3];
      return {
        type: "def",
        tag: n,
        raw: e[0],
        href: r,
        title: s
      };
    }
  }
  table(t) {
    const e = this.rules.block.table.exec(t);
    if (e) {
      if (!/[:|]/.test(e[2]))
        return;
      const n = {
        type: "table",
        raw: e[0],
        header: ds(e[1]).map((r) => ({ text: r, tokens: [] })),
        align: e[2].replace(/^\||\| *$/g, "").split("|"),
        rows: e[3] && e[3].trim() ? e[3].replace(/\n[ \t]*$/, "").split(`
`) : []
      };
      if (n.header.length === n.align.length) {
        let r = n.align.length, s, o, l, a;
        for (s = 0; s < r; s++) {
          const u = n.align[s];
          u && (/^ *-+: *$/.test(u) ? n.align[s] = "right" : /^ *:-+: *$/.test(u) ? n.align[s] = "center" : /^ *:-+ *$/.test(u) ? n.align[s] = "left" : n.align[s] = null);
        }
        for (r = n.rows.length, s = 0; s < r; s++)
          n.rows[s] = ds(n.rows[s], n.header.length).map((u) => ({ text: u, tokens: [] }));
        for (r = n.header.length, o = 0; o < r; o++)
          n.header[o].tokens = this.lexer.inline(n.header[o].text);
        for (r = n.rows.length, o = 0; o < r; o++)
          for (a = n.rows[o], l = 0; l < a.length; l++)
            a[l].tokens = this.lexer.inline(a[l].text);
        return n;
      }
    }
  }
  lheading(t) {
    const e = this.rules.block.lheading.exec(t);
    if (e)
      return {
        type: "heading",
        raw: e[0],
        depth: e[2].charAt(0) === "=" ? 1 : 2,
        text: e[1],
        tokens: this.lexer.inline(e[1])
      };
  }
  paragraph(t) {
    const e = this.rules.block.paragraph.exec(t);
    if (e) {
      const n = e[1].charAt(e[1].length - 1) === `
` ? e[1].slice(0, -1) : e[1];
      return {
        type: "paragraph",
        raw: e[0],
        text: n,
        tokens: this.lexer.inline(n)
      };
    }
  }
  text(t) {
    const e = this.rules.block.text.exec(t);
    if (e)
      return {
        type: "text",
        raw: e[0],
        text: e[0],
        tokens: this.lexer.inline(e[0])
      };
  }
  escape(t) {
    const e = this.rules.inline.escape.exec(t);
    if (e)
      return {
        type: "escape",
        raw: e[0],
        text: St(e[1])
      };
  }
  tag(t) {
    const e = this.rules.inline.tag.exec(t);
    if (e)
      return !this.lexer.state.inLink && /^<a /i.test(e[0]) ? this.lexer.state.inLink = !0 : this.lexer.state.inLink && /^<\/a>/i.test(e[0]) && (this.lexer.state.inLink = !1), !this.lexer.state.inRawBlock && /^<(pre|code|kbd|script)(\s|>)/i.test(e[0]) ? this.lexer.state.inRawBlock = !0 : this.lexer.state.inRawBlock && /^<\/(pre|code|kbd|script)(\s|>)/i.test(e[0]) && (this.lexer.state.inRawBlock = !1), {
        type: "html",
        raw: e[0],
        inLink: this.lexer.state.inLink,
        inRawBlock: this.lexer.state.inRawBlock,
        block: !1,
        text: e[0]
      };
  }
  link(t) {
    const e = this.rules.inline.link.exec(t);
    if (e) {
      const n = e[2].trim();
      if (!this.options.pedantic && /^</.test(n)) {
        if (!/>$/.test(n))
          return;
        const o = Bn(n.slice(0, -1), "\\");
        if ((n.length - o.length) % 2 === 0)
          return;
      } else {
        const o = Al(e[2], "()");
        if (o > -1) {
          const a = (e[0].indexOf("!") === 0 ? 5 : 4) + e[1].length + o;
          e[2] = e[2].substring(0, o), e[0] = e[0].substring(0, a).trim(), e[3] = "";
        }
      }
      let r = e[2], s = "";
      if (this.options.pedantic) {
        const o = /^([^'"]*[^\s])\s+(['"])(.*)\2/.exec(r);
        o && (r = o[1], s = o[3]);
      } else
        s = e[3] ? e[3].slice(1, -1) : "";
      return r = r.trim(), /^</.test(r) && (this.options.pedantic && !/>$/.test(n) ? r = r.slice(1) : r = r.slice(1, -1)), ps(e, {
        href: r && r.replace(this.rules.inline._escapes, "$1"),
        title: s && s.replace(this.rules.inline._escapes, "$1")
      }, e[0], this.lexer);
    }
  }
  reflink(t, e) {
    let n;
    if ((n = this.rules.inline.reflink.exec(t)) || (n = this.rules.inline.nolink.exec(t))) {
      let r = (n[2] || n[1]).replace(/\s+/g, " ");
      if (r = e[r.toLowerCase()], !r) {
        const s = n[0].charAt(0);
        return {
          type: "text",
          raw: s,
          text: s
        };
      }
      return ps(n, r, n[0], this.lexer);
    }
  }
  emStrong(t, e, n = "") {
    let r = this.rules.inline.emStrong.lDelim.exec(t);
    if (!r || r[3] && n.match(/[\p{L}\p{N}]/u))
      return;
    if (!(r[1] || r[2] || "") || !n || this.rules.inline.punctuation.exec(n)) {
      const o = [...r[0]].length - 1;
      let l, a, u = o, p = 0;
      const g = r[0][0] === "*" ? this.rules.inline.emStrong.rDelimAst : this.rules.inline.emStrong.rDelimUnd;
      for (g.lastIndex = 0, e = e.slice(-1 * t.length + o); (r = g.exec(e)) != null; ) {
        if (l = r[1] || r[2] || r[3] || r[4] || r[5] || r[6], !l)
          continue;
        if (a = [...l].length, r[3] || r[4]) {
          u += a;
          continue;
        } else if ((r[5] || r[6]) && o % 3 && !((o + a) % 3)) {
          p += a;
          continue;
        }
        if (u -= a, u > 0)
          continue;
        a = Math.min(a, a + u + p);
        const m = [...r[0]][0].length, w = t.slice(0, o + r.index + m + a);
        if (Math.min(o, a) % 2) {
          const O = w.slice(1, -1);
          return {
            type: "em",
            raw: w,
            text: O,
            tokens: this.lexer.inlineTokens(O)
          };
        }
        const N = w.slice(2, -2);
        return {
          type: "strong",
          raw: w,
          text: N,
          tokens: this.lexer.inlineTokens(N)
        };
      }
    }
  }
  codespan(t) {
    const e = this.rules.inline.code.exec(t);
    if (e) {
      let n = e[2].replace(/\n/g, " ");
      const r = /[^ ]/.test(n), s = /^ /.test(n) && / $/.test(n);
      return r && s && (n = n.substring(1, n.length - 1)), n = St(n, !0), {
        type: "codespan",
        raw: e[0],
        text: n
      };
    }
  }
  br(t) {
    const e = this.rules.inline.br.exec(t);
    if (e)
      return {
        type: "br",
        raw: e[0]
      };
  }
  del(t) {
    const e = this.rules.inline.del.exec(t);
    if (e)
      return {
        type: "del",
        raw: e[0],
        text: e[2],
        tokens: this.lexer.inlineTokens(e[2])
      };
  }
  autolink(t) {
    const e = this.rules.inline.autolink.exec(t);
    if (e) {
      let n, r;
      return e[2] === "@" ? (n = St(e[1]), r = "mailto:" + n) : (n = St(e[1]), r = n), {
        type: "link",
        raw: e[0],
        text: n,
        href: r,
        tokens: [
          {
            type: "text",
            raw: n,
            text: n
          }
        ]
      };
    }
  }
  url(t) {
    let e;
    if (e = this.rules.inline.url.exec(t)) {
      let n, r;
      if (e[2] === "@")
        n = St(e[0]), r = "mailto:" + n;
      else {
        let s;
        do
          s = e[0], e[0] = this.rules.inline._backpedal.exec(e[0])[0];
        while (s !== e[0]);
        n = St(e[0]), e[1] === "www." ? r = "http://" + e[0] : r = e[0];
      }
      return {
        type: "link",
        raw: e[0],
        text: n,
        href: r,
        tokens: [
          {
            type: "text",
            raw: n,
            text: n
          }
        ]
      };
    }
  }
  inlineText(t) {
    const e = this.rules.inline.text.exec(t);
    if (e) {
      let n;
      return this.lexer.state.inRawBlock ? n = e[0] : n = St(e[0]), {
        type: "text",
        raw: e[0],
        text: n
      };
    }
  }
}
const R = {
  newline: /^(?: *(?:\n|$))+/,
  code: /^( {4}[^\n]+(?:\n(?: *(?:\n|$))*)?)+/,
  fences: /^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/,
  hr: /^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/,
  heading: /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/,
  blockquote: /^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/,
  list: /^( {0,3}bull)([ \t][^\n]+?)?(?:\n|$)/,
  html: "^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n *)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n *)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n *)+\\n|$))",
  def: /^ {0,3}\[(label)\]: *(?:\n *)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n *)?| *\n *)(title))? *(?:\n+|$)/,
  table: ni,
  lheading: /^(?!bull )((?:.|\n(?!\s*?\n|bull ))+?)\n {0,3}(=+|-+) *(?:\n+|$)/,
  // regex template, placeholders will be replaced according to different paragraph
  // interruption rules of commonmark and the original markdown spec:
  _paragraph: /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/,
  text: /^[^\n]+/
};
R._label = /(?!\s*\])(?:\\.|[^\[\]\\])+/;
R._title = /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/;
R.def = j(R.def).replace("label", R._label).replace("title", R._title).getRegex();
R.bullet = /(?:[*+-]|\d{1,9}[.)])/;
R.listItemStart = j(/^( *)(bull) */).replace("bull", R.bullet).getRegex();
R.list = j(R.list).replace(/bull/g, R.bullet).replace("hr", "\\n+(?=\\1?(?:(?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$))").replace("def", "\\n+(?=" + R.def.source + ")").getRegex();
R._tag = "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|section|source|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul";
R._comment = /<!--(?!-?>)[\s\S]*?(?:-->|$)/;
R.html = j(R.html, "i").replace("comment", R._comment).replace("tag", R._tag).replace("attribute", / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex();
R.lheading = j(R.lheading).replace(/bull/g, R.bullet).getRegex();
R.paragraph = j(R._paragraph).replace("hr", R.hr).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("|table", "").replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", R._tag).getRegex();
R.blockquote = j(R.blockquote).replace("paragraph", R.paragraph).getRegex();
R.normal = { ...R };
R.gfm = {
  ...R.normal,
  table: "^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)"
  // Cells
};
R.gfm.table = j(R.gfm.table).replace("hr", R.hr).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("blockquote", " {0,3}>").replace("code", " {4}[^\\n]").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", R._tag).getRegex();
R.gfm.paragraph = j(R._paragraph).replace("hr", R.hr).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("table", R.gfm.table).replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", R._tag).getRegex();
R.pedantic = {
  ...R.normal,
  html: j(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment", R._comment).replace(/tag/g, "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),
  def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,
  heading: /^(#{1,6})(.*)(?:\n+|$)/,
  fences: ni,
  lheading: /^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,
  paragraph: j(R.normal._paragraph).replace("hr", R.hr).replace("heading", ` *#{1,6} *[^
]`).replace("lheading", R.lheading).replace("blockquote", " {0,3}>").replace("|fences", "").replace("|list", "").replace("|html", "").getRegex()
};
const C = {
  escape: /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/,
  autolink: /^<(scheme:[^\s\x00-\x1f<>]*|email)>/,
  url: ni,
  tag: "^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>",
  link: /^!?\[(label)\]\(\s*(href)(?:\s+(title))?\s*\)/,
  reflink: /^!?\[(label)\]\[(ref)\]/,
  nolink: /^!?\[(ref)\](?:\[\])?/,
  reflinkSearch: "reflink|nolink(?!\\()",
  emStrong: {
    lDelim: /^(?:\*+(?:((?!\*)[punct])|[^\s*]))|^_+(?:((?!_)[punct])|([^\s_]))/,
    //         (1) and (2) can only be a Right Delimiter. (3) and (4) can only be Left.  (5) and (6) can be either Left or Right.
    //         | Skip orphan inside strong      | Consume to delim | (1) #***              | (2) a***#, a***                    | (3) #***a, ***a                  | (4) ***#                 | (5) #***#                         | (6) a***a
    rDelimAst: /^[^_*]*?__[^_*]*?\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\*)[punct](\*+)(?=[\s]|$)|[^punct\s](\*+)(?!\*)(?=[punct\s]|$)|(?!\*)[punct\s](\*+)(?=[^punct\s])|[\s](\*+)(?!\*)(?=[punct])|(?!\*)[punct](\*+)(?!\*)(?=[punct])|[^punct\s](\*+)(?=[^punct\s])/,
    rDelimUnd: /^[^_*]*?\*\*[^_*]*?_[^_*]*?(?=\*\*)|[^_]+(?=[^_])|(?!_)[punct](_+)(?=[\s]|$)|[^punct\s](_+)(?!_)(?=[punct\s]|$)|(?!_)[punct\s](_+)(?=[^punct\s])|[\s](_+)(?!_)(?=[punct])|(?!_)[punct](_+)(?!_)(?=[punct])/
    // ^- Not allowed for _
  },
  code: /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/,
  br: /^( {2,}|\\)\n(?!\s*$)/,
  del: ni,
  text: /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/,
  punctuation: /^((?![*_])[\spunctuation])/
};
C._punctuation = "\\p{P}$+<=>`^|~";
C.punctuation = j(C.punctuation, "u").replace(/punctuation/g, C._punctuation).getRegex();
C.blockSkip = /\[[^[\]]*?\]\([^\(\)]*?\)|`[^`]*?`|<[^<>]*?>/g;
C.anyPunctuation = /\\[punct]/g;
C._escapes = /\\([punct])/g;
C._comment = j(R._comment).replace("(?:-->|$)", "-->").getRegex();
C.emStrong.lDelim = j(C.emStrong.lDelim, "u").replace(/punct/g, C._punctuation).getRegex();
C.emStrong.rDelimAst = j(C.emStrong.rDelimAst, "gu").replace(/punct/g, C._punctuation).getRegex();
C.emStrong.rDelimUnd = j(C.emStrong.rDelimUnd, "gu").replace(/punct/g, C._punctuation).getRegex();
C.anyPunctuation = j(C.anyPunctuation, "gu").replace(/punct/g, C._punctuation).getRegex();
C._escapes = j(C._escapes, "gu").replace(/punct/g, C._punctuation).getRegex();
C._scheme = /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/;
C._email = /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/;
C.autolink = j(C.autolink).replace("scheme", C._scheme).replace("email", C._email).getRegex();
C._attribute = /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/;
C.tag = j(C.tag).replace("comment", C._comment).replace("attribute", C._attribute).getRegex();
C._label = /(?:\[(?:\\.|[^\[\]\\])*\]|\\.|`[^`]*`|[^\[\]\\`])*?/;
C._href = /<(?:\\.|[^\n<>\\])+>|[^\s\x00-\x1f]*/;
C._title = /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/;
C.link = j(C.link).replace("label", C._label).replace("href", C._href).replace("title", C._title).getRegex();
C.reflink = j(C.reflink).replace("label", C._label).replace("ref", R._label).getRegex();
C.nolink = j(C.nolink).replace("ref", R._label).getRegex();
C.reflinkSearch = j(C.reflinkSearch, "g").replace("reflink", C.reflink).replace("nolink", C.nolink).getRegex();
C.normal = { ...C };
C.pedantic = {
  ...C.normal,
  strong: {
    start: /^__|\*\*/,
    middle: /^__(?=\S)([\s\S]*?\S)__(?!_)|^\*\*(?=\S)([\s\S]*?\S)\*\*(?!\*)/,
    endAst: /\*\*(?!\*)/g,
    endUnd: /__(?!_)/g
  },
  em: {
    start: /^_|\*/,
    middle: /^()\*(?=\S)([\s\S]*?\S)\*(?!\*)|^_(?=\S)([\s\S]*?\S)_(?!_)/,
    endAst: /\*(?!\*)/g,
    endUnd: /_(?!_)/g
  },
  link: j(/^!?\[(label)\]\((.*?)\)/).replace("label", C._label).getRegex(),
  reflink: j(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label", C._label).getRegex()
};
C.gfm = {
  ...C.normal,
  escape: j(C.escape).replace("])", "~|])").getRegex(),
  _extended_email: /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/,
  url: /^((?:ftp|https?):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/,
  _backpedal: /(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,
  del: /^(~~?)(?=[^\s~])([\s\S]*?[^\s~])\1(?=[^~]|$)/,
  text: /^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|https?:\/\/|ftp:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/
};
C.gfm.url = j(C.gfm.url, "i").replace("email", C.gfm._extended_email).getRegex();
C.breaks = {
  ...C.gfm,
  br: j(C.br).replace("{2,}", "*").getRegex(),
  text: j(C.gfm.text).replace("\\b_", "\\b_| {2,}\\n").replace(/\{2,\}/g, "*").getRegex()
};
class Ut {
  constructor(t) {
    v(this, "tokens");
    v(this, "options");
    v(this, "state");
    v(this, "tokenizer");
    v(this, "inlineQueue");
    this.tokens = [], this.tokens.links = /* @__PURE__ */ Object.create(null), this.options = t || Se, this.options.tokenizer = this.options.tokenizer || new ii(), this.tokenizer = this.options.tokenizer, this.tokenizer.options = this.options, this.tokenizer.lexer = this, this.inlineQueue = [], this.state = {
      inLink: !1,
      inRawBlock: !1,
      top: !0
    };
    const e = {
      block: R.normal,
      inline: C.normal
    };
    this.options.pedantic ? (e.block = R.pedantic, e.inline = C.pedantic) : this.options.gfm && (e.block = R.gfm, this.options.breaks ? e.inline = C.breaks : e.inline = C.gfm), this.tokenizer.rules = e;
  }
  /**
   * Expose Rules
   */
  static get rules() {
    return {
      block: R,
      inline: C
    };
  }
  /**
   * Static Lex Method
   */
  static lex(t, e) {
    return new Ut(e).lex(t);
  }
  /**
   * Static Lex Inline Method
   */
  static lexInline(t, e) {
    return new Ut(e).inlineTokens(t);
  }
  /**
   * Preprocessing
   */
  lex(t) {
    t = t.replace(/\r\n|\r/g, `
`), this.blockTokens(t, this.tokens);
    let e;
    for (; e = this.inlineQueue.shift(); )
      this.inlineTokens(e.src, e.tokens);
    return this.tokens;
  }
  blockTokens(t, e = []) {
    this.options.pedantic ? t = t.replace(/\t/g, "    ").replace(/^ +$/gm, "") : t = t.replace(/^( *)(\t+)/gm, (l, a, u) => a + "    ".repeat(u.length));
    let n, r, s, o;
    for (; t; )
      if (!(this.options.extensions && this.options.extensions.block && this.options.extensions.block.some((l) => (n = l.call({ lexer: this }, t, e)) ? (t = t.substring(n.raw.length), e.push(n), !0) : !1))) {
        if (n = this.tokenizer.space(t)) {
          t = t.substring(n.raw.length), n.raw.length === 1 && e.length > 0 ? e[e.length - 1].raw += `
` : e.push(n);
          continue;
        }
        if (n = this.tokenizer.code(t)) {
          t = t.substring(n.raw.length), r = e[e.length - 1], r && (r.type === "paragraph" || r.type === "text") ? (r.raw += `
` + n.raw, r.text += `
` + n.text, this.inlineQueue[this.inlineQueue.length - 1].src = r.text) : e.push(n);
          continue;
        }
        if (n = this.tokenizer.fences(t)) {
          t = t.substring(n.raw.length), e.push(n);
          continue;
        }
        if (n = this.tokenizer.heading(t)) {
          t = t.substring(n.raw.length), e.push(n);
          continue;
        }
        if (n = this.tokenizer.hr(t)) {
          t = t.substring(n.raw.length), e.push(n);
          continue;
        }
        if (n = this.tokenizer.blockquote(t)) {
          t = t.substring(n.raw.length), e.push(n);
          continue;
        }
        if (n = this.tokenizer.list(t)) {
          t = t.substring(n.raw.length), e.push(n);
          continue;
        }
        if (n = this.tokenizer.html(t)) {
          t = t.substring(n.raw.length), e.push(n);
          continue;
        }
        if (n = this.tokenizer.def(t)) {
          t = t.substring(n.raw.length), r = e[e.length - 1], r && (r.type === "paragraph" || r.type === "text") ? (r.raw += `
` + n.raw, r.text += `
` + n.raw, this.inlineQueue[this.inlineQueue.length - 1].src = r.text) : this.tokens.links[n.tag] || (this.tokens.links[n.tag] = {
            href: n.href,
            title: n.title
          });
          continue;
        }
        if (n = this.tokenizer.table(t)) {
          t = t.substring(n.raw.length), e.push(n);
          continue;
        }
        if (n = this.tokenizer.lheading(t)) {
          t = t.substring(n.raw.length), e.push(n);
          continue;
        }
        if (s = t, this.options.extensions && this.options.extensions.startBlock) {
          let l = 1 / 0;
          const a = t.slice(1);
          let u;
          this.options.extensions.startBlock.forEach((p) => {
            u = p.call({ lexer: this }, a), typeof u == "number" && u >= 0 && (l = Math.min(l, u));
          }), l < 1 / 0 && l >= 0 && (s = t.substring(0, l + 1));
        }
        if (this.state.top && (n = this.tokenizer.paragraph(s))) {
          r = e[e.length - 1], o && r.type === "paragraph" ? (r.raw += `
` + n.raw, r.text += `
` + n.text, this.inlineQueue.pop(), this.inlineQueue[this.inlineQueue.length - 1].src = r.text) : e.push(n), o = s.length !== t.length, t = t.substring(n.raw.length);
          continue;
        }
        if (n = this.tokenizer.text(t)) {
          t = t.substring(n.raw.length), r = e[e.length - 1], r && r.type === "text" ? (r.raw += `
` + n.raw, r.text += `
` + n.text, this.inlineQueue.pop(), this.inlineQueue[this.inlineQueue.length - 1].src = r.text) : e.push(n);
          continue;
        }
        if (t) {
          const l = "Infinite loop on byte: " + t.charCodeAt(0);
          if (this.options.silent) {
            console.error(l);
            break;
          } else
            throw new Error(l);
        }
      }
    return this.state.top = !0, e;
  }
  inline(t, e = []) {
    return this.inlineQueue.push({ src: t, tokens: e }), e;
  }
  /**
   * Lexing/Compiling
   */
  inlineTokens(t, e = []) {
    let n, r, s, o = t, l, a, u;
    if (this.tokens.links) {
      const p = Object.keys(this.tokens.links);
      if (p.length > 0)
        for (; (l = this.tokenizer.rules.inline.reflinkSearch.exec(o)) != null; )
          p.includes(l[0].slice(l[0].lastIndexOf("[") + 1, -1)) && (o = o.slice(0, l.index) + "[" + "a".repeat(l[0].length - 2) + "]" + o.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex));
    }
    for (; (l = this.tokenizer.rules.inline.blockSkip.exec(o)) != null; )
      o = o.slice(0, l.index) + "[" + "a".repeat(l[0].length - 2) + "]" + o.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);
    for (; (l = this.tokenizer.rules.inline.anyPunctuation.exec(o)) != null; )
      o = o.slice(0, l.index) + "++" + o.slice(this.tokenizer.rules.inline.anyPunctuation.lastIndex);
    for (; t; )
      if (a || (u = ""), a = !1, !(this.options.extensions && this.options.extensions.inline && this.options.extensions.inline.some((p) => (n = p.call({ lexer: this }, t, e)) ? (t = t.substring(n.raw.length), e.push(n), !0) : !1))) {
        if (n = this.tokenizer.escape(t)) {
          t = t.substring(n.raw.length), e.push(n);
          continue;
        }
        if (n = this.tokenizer.tag(t)) {
          t = t.substring(n.raw.length), r = e[e.length - 1], r && n.type === "text" && r.type === "text" ? (r.raw += n.raw, r.text += n.text) : e.push(n);
          continue;
        }
        if (n = this.tokenizer.link(t)) {
          t = t.substring(n.raw.length), e.push(n);
          continue;
        }
        if (n = this.tokenizer.reflink(t, this.tokens.links)) {
          t = t.substring(n.raw.length), r = e[e.length - 1], r && n.type === "text" && r.type === "text" ? (r.raw += n.raw, r.text += n.text) : e.push(n);
          continue;
        }
        if (n = this.tokenizer.emStrong(t, o, u)) {
          t = t.substring(n.raw.length), e.push(n);
          continue;
        }
        if (n = this.tokenizer.codespan(t)) {
          t = t.substring(n.raw.length), e.push(n);
          continue;
        }
        if (n = this.tokenizer.br(t)) {
          t = t.substring(n.raw.length), e.push(n);
          continue;
        }
        if (n = this.tokenizer.del(t)) {
          t = t.substring(n.raw.length), e.push(n);
          continue;
        }
        if (n = this.tokenizer.autolink(t)) {
          t = t.substring(n.raw.length), e.push(n);
          continue;
        }
        if (!this.state.inLink && (n = this.tokenizer.url(t))) {
          t = t.substring(n.raw.length), e.push(n);
          continue;
        }
        if (s = t, this.options.extensions && this.options.extensions.startInline) {
          let p = 1 / 0;
          const g = t.slice(1);
          let m;
          this.options.extensions.startInline.forEach((w) => {
            m = w.call({ lexer: this }, g), typeof m == "number" && m >= 0 && (p = Math.min(p, m));
          }), p < 1 / 0 && p >= 0 && (s = t.substring(0, p + 1));
        }
        if (n = this.tokenizer.inlineText(s)) {
          t = t.substring(n.raw.length), n.raw.slice(-1) !== "_" && (u = n.raw.slice(-1)), a = !0, r = e[e.length - 1], r && r.type === "text" ? (r.raw += n.raw, r.text += n.text) : e.push(n);
          continue;
        }
        if (t) {
          const p = "Infinite loop on byte: " + t.charCodeAt(0);
          if (this.options.silent) {
            console.error(p);
            break;
          } else
            throw new Error(p);
        }
      }
    return e;
  }
}
class ri {
  constructor(t) {
    v(this, "options");
    this.options = t || Se;
  }
  code(t, e, n) {
    var s;
    const r = (s = (e || "").match(/^\S*/)) == null ? void 0 : s[0];
    return t = t.replace(/\n$/, "") + `
`, r ? '<pre><code class="language-' + St(r) + '">' + (n ? t : St(t, !0)) + `</code></pre>
` : "<pre><code>" + (n ? t : St(t, !0)) + `</code></pre>
`;
  }
  blockquote(t) {
    return `<blockquote>
${t}</blockquote>
`;
  }
  html(t, e) {
    return t;
  }
  heading(t, e, n) {
    return `<h${e}>${t}</h${e}>
`;
  }
  hr() {
    return `<hr>
`;
  }
  list(t, e, n) {
    const r = e ? "ol" : "ul", s = e && n !== 1 ? ' start="' + n + '"' : "";
    return "<" + r + s + `>
` + t + "</" + r + `>
`;
  }
  listitem(t, e, n) {
    return `<li>${t}</li>
`;
  }
  checkbox(t) {
    return "<input " + (t ? 'checked="" ' : "") + 'disabled="" type="checkbox">';
  }
  paragraph(t) {
    return `<p>${t}</p>
`;
  }
  table(t, e) {
    return e && (e = `<tbody>${e}</tbody>`), `<table>
<thead>
` + t + `</thead>
` + e + `</table>
`;
  }
  tablerow(t) {
    return `<tr>
${t}</tr>
`;
  }
  tablecell(t, e) {
    const n = e.header ? "th" : "td";
    return (e.align ? `<${n} align="${e.align}">` : `<${n}>`) + t + `</${n}>
`;
  }
  /**
   * span level renderer
   */
  strong(t) {
    return `<strong>${t}</strong>`;
  }
  em(t) {
    return `<em>${t}</em>`;
  }
  codespan(t) {
    return `<code>${t}</code>`;
  }
  br() {
    return "<br>";
  }
  del(t) {
    return `<del>${t}</del>`;
  }
  link(t, e, n) {
    const r = us(t);
    if (r === null)
      return n;
    t = r;
    let s = '<a href="' + t + '"';
    return e && (s += ' title="' + e + '"'), s += ">" + n + "</a>", s;
  }
  image(t, e, n) {
    const r = us(t);
    if (r === null)
      return n;
    t = r;
    let s = `<img src="${t}" alt="${n}"`;
    return e && (s += ` title="${e}"`), s += ">", s;
  }
  text(t) {
    return t;
  }
}
class wr {
  // no need for block level renderers
  strong(t) {
    return t;
  }
  em(t) {
    return t;
  }
  codespan(t) {
    return t;
  }
  del(t) {
    return t;
  }
  html(t) {
    return t;
  }
  text(t) {
    return t;
  }
  link(t, e, n) {
    return "" + n;
  }
  image(t, e, n) {
    return "" + n;
  }
  br() {
    return "";
  }
}
class Bt {
  constructor(t) {
    v(this, "options");
    v(this, "renderer");
    v(this, "textRenderer");
    this.options = t || Se, this.options.renderer = this.options.renderer || new ri(), this.renderer = this.options.renderer, this.renderer.options = this.options, this.textRenderer = new wr();
  }
  /**
   * Static Parse Method
   */
  static parse(t, e) {
    return new Bt(e).parse(t);
  }
  /**
   * Static Parse Inline Method
   */
  static parseInline(t, e) {
    return new Bt(e).parseInline(t);
  }
  /**
   * Parse Loop
   */
  parse(t, e = !0) {
    let n = "";
    for (let r = 0; r < t.length; r++) {
      const s = t[r];
      if (this.options.extensions && this.options.extensions.renderers && this.options.extensions.renderers[s.type]) {
        const o = s, l = this.options.extensions.renderers[o.type].call({ parser: this }, o);
        if (l !== !1 || !["space", "hr", "heading", "code", "table", "blockquote", "list", "html", "paragraph", "text"].includes(o.type)) {
          n += l || "";
          continue;
        }
      }
      switch (s.type) {
        case "space":
          continue;
        case "hr": {
          n += this.renderer.hr();
          continue;
        }
        case "heading": {
          const o = s;
          n += this.renderer.heading(this.parseInline(o.tokens), o.depth, Tl(this.parseInline(o.tokens, this.textRenderer)));
          continue;
        }
        case "code": {
          const o = s;
          n += this.renderer.code(o.text, o.lang, !!o.escaped);
          continue;
        }
        case "table": {
          const o = s;
          let l = "", a = "";
          for (let p = 0; p < o.header.length; p++)
            a += this.renderer.tablecell(this.parseInline(o.header[p].tokens), { header: !0, align: o.align[p] });
          l += this.renderer.tablerow(a);
          let u = "";
          for (let p = 0; p < o.rows.length; p++) {
            const g = o.rows[p];
            a = "";
            for (let m = 0; m < g.length; m++)
              a += this.renderer.tablecell(this.parseInline(g[m].tokens), { header: !1, align: o.align[m] });
            u += this.renderer.tablerow(a);
          }
          n += this.renderer.table(l, u);
          continue;
        }
        case "blockquote": {
          const o = s, l = this.parse(o.tokens);
          n += this.renderer.blockquote(l);
          continue;
        }
        case "list": {
          const o = s, l = o.ordered, a = o.start, u = o.loose;
          let p = "";
          for (let g = 0; g < o.items.length; g++) {
            const m = o.items[g], w = m.checked, N = m.task;
            let O = "";
            if (m.task) {
              const L = this.renderer.checkbox(!!w);
              u ? m.tokens.length > 0 && m.tokens[0].type === "paragraph" ? (m.tokens[0].text = L + " " + m.tokens[0].text, m.tokens[0].tokens && m.tokens[0].tokens.length > 0 && m.tokens[0].tokens[0].type === "text" && (m.tokens[0].tokens[0].text = L + " " + m.tokens[0].tokens[0].text)) : m.tokens.unshift({
                type: "text",
                text: L + " "
              }) : O += L + " ";
            }
            O += this.parse(m.tokens, u), p += this.renderer.listitem(O, N, !!w);
          }
          n += this.renderer.list(p, l, a);
          continue;
        }
        case "html": {
          const o = s;
          n += this.renderer.html(o.text, o.block);
          continue;
        }
        case "paragraph": {
          const o = s;
          n += this.renderer.paragraph(this.parseInline(o.tokens));
          continue;
        }
        case "text": {
          let o = s, l = o.tokens ? this.parseInline(o.tokens) : o.text;
          for (; r + 1 < t.length && t[r + 1].type === "text"; )
            o = t[++r], l += `
` + (o.tokens ? this.parseInline(o.tokens) : o.text);
          n += e ? this.renderer.paragraph(l) : l;
          continue;
        }
        default: {
          const o = 'Token with "' + s.type + '" type was not found.';
          if (this.options.silent)
            return console.error(o), "";
          throw new Error(o);
        }
      }
    }
    return n;
  }
  /**
   * Parse Inline Tokens
   */
  parseInline(t, e) {
    e = e || this.renderer;
    let n = "";
    for (let r = 0; r < t.length; r++) {
      const s = t[r];
      if (this.options.extensions && this.options.extensions.renderers && this.options.extensions.renderers[s.type]) {
        const o = this.options.extensions.renderers[s.type].call({ parser: this }, s);
        if (o !== !1 || !["escape", "html", "link", "image", "strong", "em", "codespan", "br", "del", "text"].includes(s.type)) {
          n += o || "";
          continue;
        }
      }
      switch (s.type) {
        case "escape": {
          const o = s;
          n += e.text(o.text);
          break;
        }
        case "html": {
          const o = s;
          n += e.html(o.text);
          break;
        }
        case "link": {
          const o = s;
          n += e.link(o.href, o.title, this.parseInline(o.tokens, e));
          break;
        }
        case "image": {
          const o = s;
          n += e.image(o.href, o.title, o.text);
          break;
        }
        case "strong": {
          const o = s;
          n += e.strong(this.parseInline(o.tokens, e));
          break;
        }
        case "em": {
          const o = s;
          n += e.em(this.parseInline(o.tokens, e));
          break;
        }
        case "codespan": {
          const o = s;
          n += e.codespan(o.text);
          break;
        }
        case "br": {
          n += e.br();
          break;
        }
        case "del": {
          const o = s;
          n += e.del(this.parseInline(o.tokens, e));
          break;
        }
        case "text": {
          const o = s;
          n += e.text(o.text);
          break;
        }
        default: {
          const o = 'Token with "' + s.type + '" type was not found.';
          if (this.options.silent)
            return console.error(o), "";
          throw new Error(o);
        }
      }
    }
    return n;
  }
}
class pn {
  constructor(t) {
    v(this, "options");
    this.options = t || Se;
  }
  /**
   * Process markdown before marked
   */
  preprocess(t) {
    return t;
  }
  /**
   * Process HTML after marked is finished
   */
  postprocess(t) {
    return t;
  }
}
v(pn, "passThroughHooks", /* @__PURE__ */ new Set([
  "preprocess",
  "postprocess"
]));
var Ae, Qi, fo;
class Sl {
  constructor(...t) {
    Lt(this, Ae);
    v(this, "defaults", br());
    v(this, "options", this.setOptions);
    v(this, "parse", Ln(this, Ae, Qi).call(this, Ut.lex, Bt.parse));
    v(this, "parseInline", Ln(this, Ae, Qi).call(this, Ut.lexInline, Bt.parseInline));
    v(this, "Parser", Bt);
    v(this, "Renderer", ri);
    v(this, "TextRenderer", wr);
    v(this, "Lexer", Ut);
    v(this, "Tokenizer", ii);
    v(this, "Hooks", pn);
    this.use(...t);
  }
  /**
   * Run callback for every token
   */
  walkTokens(t, e) {
    var r, s;
    let n = [];
    for (const o of t)
      switch (n = n.concat(e.call(this, o)), o.type) {
        case "table": {
          const l = o;
          for (const a of l.header)
            n = n.concat(this.walkTokens(a.tokens, e));
          for (const a of l.rows)
            for (const u of a)
              n = n.concat(this.walkTokens(u.tokens, e));
          break;
        }
        case "list": {
          const l = o;
          n = n.concat(this.walkTokens(l.items, e));
          break;
        }
        default: {
          const l = o;
          (s = (r = this.defaults.extensions) == null ? void 0 : r.childTokens) != null && s[l.type] ? this.defaults.extensions.childTokens[l.type].forEach((a) => {
            n = n.concat(this.walkTokens(l[a], e));
          }) : l.tokens && (n = n.concat(this.walkTokens(l.tokens, e)));
        }
      }
    return n;
  }
  use(...t) {
    const e = this.defaults.extensions || { renderers: {}, childTokens: {} };
    return t.forEach((n) => {
      const r = { ...n };
      if (r.async = this.defaults.async || r.async || !1, n.extensions && (n.extensions.forEach((s) => {
        if (!s.name)
          throw new Error("extension name required");
        if ("renderer" in s) {
          const o = e.renderers[s.name];
          o ? e.renderers[s.name] = function(...l) {
            let a = s.renderer.apply(this, l);
            return a === !1 && (a = o.apply(this, l)), a;
          } : e.renderers[s.name] = s.renderer;
        }
        if ("tokenizer" in s) {
          if (!s.level || s.level !== "block" && s.level !== "inline")
            throw new Error("extension level must be 'block' or 'inline'");
          const o = e[s.level];
          o ? o.unshift(s.tokenizer) : e[s.level] = [s.tokenizer], s.start && (s.level === "block" ? e.startBlock ? e.startBlock.push(s.start) : e.startBlock = [s.start] : s.level === "inline" && (e.startInline ? e.startInline.push(s.start) : e.startInline = [s.start]));
        }
        "childTokens" in s && s.childTokens && (e.childTokens[s.name] = s.childTokens);
      }), r.extensions = e), n.renderer) {
        const s = this.defaults.renderer || new ri(this.defaults);
        for (const o in n.renderer) {
          const l = n.renderer[o], a = o, u = s[a];
          s[a] = (...p) => {
            let g = l.apply(s, p);
            return g === !1 && (g = u.apply(s, p)), g || "";
          };
        }
        r.renderer = s;
      }
      if (n.tokenizer) {
        const s = this.defaults.tokenizer || new ii(this.defaults);
        for (const o in n.tokenizer) {
          const l = n.tokenizer[o], a = o, u = s[a];
          s[a] = (...p) => {
            let g = l.apply(s, p);
            return g === !1 && (g = u.apply(s, p)), g;
          };
        }
        r.tokenizer = s;
      }
      if (n.hooks) {
        const s = this.defaults.hooks || new pn();
        for (const o in n.hooks) {
          const l = n.hooks[o], a = o, u = s[a];
          pn.passThroughHooks.has(o) ? s[a] = (p) => {
            if (this.defaults.async)
              return Promise.resolve(l.call(s, p)).then((m) => u.call(s, m));
            const g = l.call(s, p);
            return u.call(s, g);
          } : s[a] = (...p) => {
            let g = l.apply(s, p);
            return g === !1 && (g = u.apply(s, p)), g;
          };
        }
        r.hooks = s;
      }
      if (n.walkTokens) {
        const s = this.defaults.walkTokens, o = n.walkTokens;
        r.walkTokens = function(l) {
          let a = [];
          return a.push(o.call(this, l)), s && (a = a.concat(s.call(this, l))), a;
        };
      }
      this.defaults = { ...this.defaults, ...r };
    }), this;
  }
  setOptions(t) {
    return this.defaults = { ...this.defaults, ...t }, this;
  }
  lexer(t, e) {
    return Ut.lex(t, e ?? this.defaults);
  }
  parser(t, e) {
    return Bt.parse(t, e ?? this.defaults);
  }
}
Ae = new WeakSet(), Qi = function(t, e) {
  return (n, r) => {
    const s = { ...r }, o = { ...this.defaults, ...s };
    this.defaults.async === !0 && s.async === !1 && (o.silent || console.warn("marked(): The async option was set to true by an extension. The async: false option sent to parse will be ignored."), o.async = !0);
    const l = Ln(this, Ae, fo).call(this, !!o.silent, !!o.async);
    if (typeof n > "u" || n === null)
      return l(new Error("marked(): input parameter is undefined or null"));
    if (typeof n != "string")
      return l(new Error("marked(): input parameter is of type " + Object.prototype.toString.call(n) + ", string expected"));
    if (o.hooks && (o.hooks.options = o), o.async)
      return Promise.resolve(o.hooks ? o.hooks.preprocess(n) : n).then((a) => t(a, o)).then((a) => o.walkTokens ? Promise.all(this.walkTokens(a, o.walkTokens)).then(() => a) : a).then((a) => e(a, o)).then((a) => o.hooks ? o.hooks.postprocess(a) : a).catch(l);
    try {
      o.hooks && (n = o.hooks.preprocess(n));
      const a = t(n, o);
      o.walkTokens && this.walkTokens(a, o.walkTokens);
      let u = e(a, o);
      return o.hooks && (u = o.hooks.postprocess(u)), u;
    } catch (a) {
      return l(a);
    }
  };
}, fo = function(t, e) {
  return (n) => {
    if (n.message += `
Please report this to https://github.com/markedjs/marked.`, t) {
      const r = "<p>An error occurred:</p><pre>" + St(n.message + "", !0) + "</pre>";
      return e ? Promise.resolve(r) : r;
    }
    if (e)
      return Promise.reject(n);
    throw n;
  };
};
const xe = new Sl();
function z(i, t) {
  return xe.parse(i, t);
}
z.options = z.setOptions = function(i) {
  return xe.setOptions(i), z.defaults = xe.defaults, ho(z.defaults), z;
};
z.getDefaults = br;
z.defaults = Se;
z.use = function(...i) {
  return xe.use(...i), z.defaults = xe.defaults, ho(z.defaults), z;
};
z.walkTokens = function(i, t) {
  return xe.walkTokens(i, t);
};
z.parseInline = xe.parseInline;
z.Parser = Bt;
z.parser = Bt.parse;
z.Renderer = ri;
z.TextRenderer = wr;
z.Lexer = Ut;
z.lexer = Ut.lex;
z.Tokenizer = ii;
z.Hooks = pn;
z.parse = z;
z.options;
z.setOptions;
z.use;
z.walkTokens;
z.parseInline;
Bt.parse;
Ut.lex;
var El = Object.defineProperty, $l = Object.getOwnPropertyDescriptor, pi = (i, t, e, n) => {
  for (var r = n > 1 ? void 0 : n ? $l(t, e) : t, s = i.length - 1, o; s >= 0; s--)
    (o = i[s]) && (r = (n ? o(t, e, r) : o(r)) || r);
  return n && r && El(t, e, r), r;
};
let vn = class extends yt {
  constructor() {
    super(...arguments), this.url = void 0, this.previewContent = void 0, this.loading = !1;
  }
  retrieveMarkdown() {
    this.url && fetch(this.url).then((i) => i.text()).then((i) => {
      this.previewContent = z.parse(i);
    }).finally(() => {
      this.loading = !1;
    });
  }
  willUpdate(i) {
    this.url && i.has("url") && i.get("url") !== this.url && this.url.endsWith(".md") && (this.loading = !0, this.retrieveMarkdown());
  }
  renderContent() {
    return this.url ? E`
        ${this.previewContent ? E` ${Xn(this.previewContent)}` : E` <iframe title="Preview" src="${this.url}" width="100%" height="850px" sandbox />`}
      ` : E``;
  }
  render() {
    return E`
      ${this.loading ? E`<loading-indicator label="${B.LOADING_TEXT}"></loading-indicator>` : this.renderContent()}
    `;
  }
};
pi([
  D({ type: String })
], vn.prototype, "url", 2);
pi([
  ke()
], vn.prototype, "previewContent", 2);
pi([
  ke()
], vn.prototype, "loading", 2);
vn = pi([
  Nt("document-previewer")
], vn);
var Il = Object.getOwnPropertyDescriptor, Rl = (i, t, e, n) => {
  for (var r = n > 1 ? void 0 : n ? Il(t, e) : t, s = i.length - 1, o; s >= 0; s--)
    (o = i[s]) && (r = o(r) || r);
  return r;
};
let Ki = class extends At {
  render(i, t) {
    return E`<document-previewer url="${t}"></document-previewer>`;
  }
};
Ki = Rl([
  wt()
], Ki);
lt.bind(W.Citation).to(Ki);
const Ol = `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">\r
  <path d="M12.5001 3C6.70106 3 2.00005 7.70101 2.00005 13.5C2.00005 14.7989 2.23632 16.044 2.66849 17.1938C2.79635 17.534 2.94135 17.8658 3.10245 18.1881L2.0527 22.1058C1.75384 23.2212 2.77447 24.2418 3.88982 23.943L7.80465 22.894C9.2185 23.6019 10.8141 24 12.5001 24C18.299 24 23.0001 19.299 23.0001 13.5C23.0001 7.70101 18.299 3 12.5001 3ZM5.04572 17.5882C4.37944 16.3761 4.00005 14.9839 4.00005 13.5C4.00005 8.80558 7.80563 5 12.5001 5C17.1945 5 21.0001 8.80558 21.0001 13.5C21.0001 18.1944 17.1945 22 12.5001 22C11.0137 22 9.61924 21.6193 8.4058 20.951C8.1796 20.8264 7.91397 20.7941 7.66452 20.861L4.2087 21.787L5.13533 18.3287C5.2021 18.0796 5.16999 17.8142 5.04572 17.5882ZM14.4549 25.3417C13.8187 25.446 13.1657 25.5002 12.5 25.5002C12.2132 25.5002 11.9287 25.4901 11.647 25.4703C13.5704 27.6358 16.3758 29.0002 19.5 29.0002C21.186 29.0002 22.7815 28.6021 24.1954 27.8941L28.1102 28.9431C29.2255 29.242 30.2462 28.2214 29.9473 27.106L28.8976 23.1883C29.0587 22.8659 29.2037 22.5341 29.3315 22.194C29.7637 21.0442 30 19.799 30 18.5002C30 14.1361 27.3376 10.3939 23.5485 8.80908C23.9114 9.6628 24.1783 10.5672 24.3355 11.5087C26.5498 13.0431 28 15.6023 28 18.5002C28 19.984 27.6206 21.3763 26.9543 22.5883C26.83 22.8144 26.7979 23.0797 26.8647 23.3289L27.7913 26.7871L24.3355 25.8611C24.086 25.7943 23.8204 25.8266 23.5942 25.9511C22.3808 26.6195 20.9863 27.0002 19.5 27.0002C17.611 27.0002 15.866 26.384 14.4549 25.3417ZM11.5 15C11.5 15.55 11.95 16 12.5 16C13.05 16 13.5 15.55 13.5 15C13.5 14.0992 14.0096 13.5217 14.6019 12.8505L14.62 12.83C15.27 12.09 16 11.21 16 10C16 8.79 15.07 7 12.5 7C9.93 7 9 8.79 9 10C9 10.55 9.45 11 10 11C10.55 11 11 10.55 11 10C11 9.83 11.07 9 12.5 9C13.82 9 13.99 9.71 14 10C14 10.48 13.68 10.86 13.12 11.5L13.1009 11.5217C12.3842 12.3378 11.5 13.3447 11.5 15ZM13.75 18.75C13.75 19.4404 13.1904 20 12.5 20C11.8096 20 11.25 19.4404 11.25 18.75C11.25 18.0596 11.8096 17.5 12.5 17.5C13.1904 17.5 13.75 18.0596 13.75 18.75Z" />\r
</svg>`;
var Ml = Object.getOwnPropertyDescriptor, Dl = (i, t, e, n) => {
  for (var r = n > 1 ? void 0 : n ? Ml(t, e) : t, s = i.length - 1, o; s >= 0; s--)
    (o = i[s]) && (r = o(r) || r);
  return r;
};
let Ji = class extends At {
  render(i, t) {
    const e = i.followupQuestions;
    return e && e.length > 0 ? E`
        <div class="items__listWrapper">
          ${jt(Ol)}
          <ul class="items__list followup">
            ${e.map(
      (n) => E`
                <li class="items__listItem--followup">
                  <a
                    class="items__link"
                    href="#"
                    data-testid="followUpQuestion"
                    @click="${() => t(n)}"
                    >${n}</a
                  >
                </li>
              `
    )}
          </ul>
        </div>
      ` : "";
  }
};
Ji = Dl([
  wt()
], Ji);
lt.bind(W.ChatEntryInlineInput).to(Ji);
const Nl = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">\r
  <path d="M15.4,4.9a8.3,8.3,0,0,1,0,6.2,9.009,9.009,0,0,1-1.7,2.6,9.009,9.009,0,0,1-2.6,1.7A8.112,8.112,0,0,1,8,16a7.509,7.509,0,0,1-2.6-.4,7.609,7.609,0,0,1-2.3-1.3,7.31,7.31,0,0,1-1.7-1.8L.7,11.4c-.1-.4-.3-.8-.4-1.3l1-.2a7.207,7.207,0,0,0,.9,2,8.716,8.716,0,0,0,1.6,1.7,6.9,6.9,0,0,0,1.9,1A6.184,6.184,0,0,0,8,15l1.9-.2,1.6-.8a4.9,4.9,0,0,0,1.4-1.1A4.9,4.9,0,0,0,14,11.5a7.976,7.976,0,0,0,.8-1.6A12.233,12.233,0,0,0,15,8a12.233,12.233,0,0,0-.2-1.9A7.976,7.976,0,0,0,14,4.5a4.9,4.9,0,0,0-1.1-1.4A4.9,4.9,0,0,0,11.5,2a4.61,4.61,0,0,0-1.6-.7A6.283,6.283,0,0,0,8,1a6.879,6.879,0,0,0-2,.3,5.292,5.292,0,0,0-1.7.8A4.708,4.708,0,0,0,2.8,3.4,4.6,4.6,0,0,0,1.7,5H4V6H0V2H1V4.1l.3-.4.3-.5A9.122,9.122,0,0,1,3.3,1.5,7.6,7.6,0,0,1,5.5.4,7.308,7.308,0,0,1,8,0a8.112,8.112,0,0,1,3.1.6,9.009,9.009,0,0,1,2.6,1.7A9.009,9.009,0,0,1,15.4,4.9Z" />\r
  <polygon points="8 3 8 7.3 10.9 10.1 10.1 10.9 7 7.7 7 3 8 3" />\r
</svg>`, Pl = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">\r
  <path d="M4.75 12C4.75 15.743 7.58642 18.8235 11.2271 19.2093C11.4284 19.9498 11.7573 20.6378 12.1888 21.2481C12.126 21.2494 12.0631 21.25 12 21.25C6.89137 21.25 2.75 17.1086 2.75 12C2.75 11.6174 2.77322 11.2403 2.81834 10.8699C2.88069 10.3581 3.33398 10 3.8496 10C4.44068 10 4.86674 10.5685 4.79864 11.1556C4.76652 11.4326 4.75 11.7144 4.75 12ZM12.8096 13C13.5854 12.1915 14.5683 11.5832 15.6729 11.2603C15.4953 11.0986 15.2592 11 15 11H13V8C13 7.44772 12.5523 7 12 7C11.4477 7 11 7.44772 11 8V12C11 12.5523 11.4477 13 12 13H12.8096ZM21.2481 12.1888C20.6378 11.7573 19.9498 11.4284 19.2093 11.2271C18.8235 7.58642 15.743 4.75 12 4.75C10.3379 4.75 8.80642 5.30932 7.58352 6.25H8.25C8.80228 6.25 9.25 6.69772 9.25 7.25C9.25 7.80228 8.80228 8.25 8.25 8.25H5.25C4.69772 8.25 4.25 7.80228 4.25 7.25V7H4.21647L4.25 6.94829V4.25C4.25 3.69772 4.69772 3.25 5.25 3.25C5.80228 3.25 6.25 3.69772 6.25 4.25V4.75385C7.82875 3.49939 9.82686 2.75 12 2.75C17.1086 2.75 21.25 6.89137 21.25 12C21.25 12.0631 21.2494 12.126 21.2481 12.1888ZM23 17.5C23 20.5376 20.5376 23 17.5 23C14.4624 23 12 20.5376 12 17.5C12 14.4624 14.4624 12 17.5 12C20.5376 12 23 14.4624 23 17.5ZM15.8536 15.1464C15.6583 14.9512 15.3417 14.9512 15.1464 15.1464C14.9512 15.3417 14.9512 15.6583 15.1464 15.8536L16.7929 17.5L15.1464 19.1464C14.9512 19.3417 14.9512 19.6583 15.1464 19.8536C15.3417 20.0488 15.6583 20.0488 15.8536 19.8536L17.5 18.2071L19.1464 19.8536C19.3417 20.0488 19.6583 20.0488 19.8536 19.8536C20.0488 19.6583 20.0488 19.3417 19.8536 19.1464L18.2071 17.5L19.8536 15.8536C20.0488 15.6583 20.0488 15.3417 19.8536 15.1464C19.6583 14.9512 19.3417 14.9512 19.1464 15.1464L17.5 16.7929L15.8536 15.1464Z" />\r
</svg>`, fs = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">\r
  <polygon points="14.65 12.05 8.05 5.35 1.35 12.05 0.65 11.35 8.05 3.95 15.35 11.35 14.65 12.05" />\r
</svg>`;
var Ll = Object.getOwnPropertyDescriptor, go = (i, t, e, n) => {
  for (var r = n > 1 ? void 0 : n ? Ll(t, e) : t, s = i.length - 1, o; s >= 0; s--)
    (o = i[s]) && (r = o(r) || r);
  return r;
};
const tr = "showChatHistory";
let er = class extends At {
  constructor() {
    super(), this.getShowChatHistory = this.getShowChatHistory.bind(this), this.setShowChatHistory = this.setShowChatHistory.bind(this);
  }
  getShowChatHistory() {
    return this.context.getState(tr);
  }
  setShowChatHistory(i) {
    this.context.setState(tr, i);
  }
  render(i) {
    if (this.context.interactionModel === "ask")
      return E``;
    const t = this.getShowChatHistory();
    return E`
      <chat-action-button
        .label="${t ? B.HIDE_CHAT_HISTORY_LABEL : B.SHOW_CHAT_HISTORY_LABEL}"
        actionId="chat-history-button"
        @click="${() => this.setShowChatHistory(!t)}"
        .isDisabled="${i}"
        .svgIcon="${t ? Pl : Nl}"
      >
      </chat-action-button>
    `;
  }
};
er = go([
  wt()
], er);
let He = class extends At {
  constructor() {
    super(), this._chatHistory = [], this.getShowChatHistory = this.getShowChatHistory.bind(this);
  }
  getShowChatHistory() {
    return this.context.getState(tr);
  }
  hostConnected() {
    const i = localStorage.getItem(He.CHATHISTORY_ID);
    if (i) {
      const t = JSON.parse(decodeURIComponent(atob(i))), e = t.map((r, s) => {
        if (r.isUserMessage)
          return s;
      }).filter((r) => r !== void 0).slice(-Xr), n = e.length === 0 ? t : t.slice(e[0]);
      this._chatHistory = n;
    }
  }
  save(i) {
    const t = [...this._chatHistory, ...i];
    localStorage.setItem(
      He.CHATHISTORY_ID,
      btoa(encodeURIComponent(JSON.stringify(t)))
    );
  }
  reset() {
    this._chatHistory = [];
  }
  merge(i) {
    return [...this._chatHistory, ...i];
  }
  render(i) {
    return this.getShowChatHistory() ? E`
      <div class="chat-history__container">
        ${i(this._chatHistory)}
        <div class="chat-history__footer">
          ${jt(fs)}
          ${B.CHAT_HISTORY_FOOTER_TEXT.replace(B.CHAT_MAX_COUNT_TAG, Xr)}
          ${jt(fs)}
        </div>
      </div>
    ` : E``;
  }
};
He.CHATHISTORY_ID = "ms-azoaicc:history";
He = go([
  wt()
], He);
lt.bind(W.ChatAction).to(er);
lt.bind(W.ChatThread).to(He);
function Hl(i, t) {
  const e = "Next questions:|<<([^>]+)>>", n = /\[(.*?)]/g, r = /:(.*?)(?:Follow-up questions:|Next questions:|<<|$)/s, s = /Next Questions:(.*?)$/s, o = /<<([^<>]+)>>/g, l = /^\d+\.\s/, a = {};
  let u = [], p = 1, g = i.replace(n, (et, F) => {
    const qt = F.trim();
    return a[qt] || (a[qt] = p++), `<sup class="citation">${a[qt]}</sup>`;
  });
  u = Object.keys(a).map((et, F) => ({
    ref: F + 1,
    text: et
  })), t[0] = u;
  const m = g.includes(e), w = g.match(r), L = (w ? w[1].trim() : "").split(`
`).filter(Boolean).map((et) => et.replace(l, ""));
  t[1] = L;
  const ct = m ? s : o, mt = g.match(ct) ?? [];
  let K = [];
  K = Ul([...mt]);
  const Z = g.indexOf("s:");
  return g = Z !== -1 ? i.substring(0, Z + 6) : i, t[2] = K, { replacedText: g, arrays: t };
}
function Ul(i) {
  return i && i.length > 0 && i[0].startsWith("<<") && (i = i.map((t) => t.replace("<<", "").replace(">>", ""))), i;
}
function Bl() {
  return (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: !0
  });
}
function mo(i) {
  return i.text.map((e) => {
    var n;
    return e.value + `

` + ((n = e.followingSteps) == null ? void 0 : n.map((r, s) => `${s + 1}.` + r).join(`
`));
  }).join(`

`).replaceAll(/<sup[^>]*>(.*?)<\/sup>/g, "");
}
class nr extends Error {
  constructor(t, e) {
    super(t), this.code = e;
  }
}
function fn(i, t, e) {
  return [...i.slice(0, t), e, ...i.slice(t + 1)];
}
const jl = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2048 2048">\r
  <path d="M1491 595l90 90-749 749-365-365 90-90 275 275 659-659zM1024 0q141 0 272 36t245 103 207 160 160 208 103 245 37 272q0 141-36 272t-103 245-160 207-208 160-245 103-272 37q-141 0-272-36t-245-103-207-160-160-208-103-244-37-273q0-141 36-272t103-245 160-207 208-160T751 37t273-37zm0 1920q123 0 237-32t214-90 182-141 140-181 91-214 32-238q0-123-32-237t-90-214-141-182-181-140-214-91-238-32q-123 0-237 32t-214 90-182 141-140 181-91 214-32 238q0 123 32 237t90 214 141 182 181 140 214 91 238 32z" />\r
</svg>`, zl = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2048 2048">\r
  <path d="M1920 805v1243H640v-384H128V0h859l384 384h128l421 421zm-384-37h165l-165-165v165zM640 384h549L933 128H256v1408h384V384zm1152 512h-384V512H768v1408h1024V896z" />\r
</svg>`;
var Fl = Object.getOwnPropertyDescriptor, ql = (i, t, e, n) => {
  for (var r = n > 1 ? void 0 : n ? Fl(t, e) : t, s = i.length - 1, o; s >= 0; s--)
    (o = i[s]) && (r = o(r) || r);
  return r;
};
let ir = class extends At {
  constructor() {
    super(...arguments), this._isResponseCopied = !1;
  }
  set isResponseCopied(i) {
    this._isResponseCopied = i, this.host.requestUpdate();
  }
  get isResponseCopied() {
    return this._isResponseCopied;
  }
  // Copy response to clipboard
  copyResponseToClipboard(i) {
    const t = mo(i);
    navigator.clipboard.writeText(t), this.isResponseCopied = !0;
  }
  render(i, t) {
    return E`
      <chat-action-button
        .label="${B.COPY_RESPONSE_BUTTON_LABEL_TEXT}"
        .svgIcon="${this.isResponseCopied ? jl : zl}"
        .isDisabled="${t}"
        actionId="copy-to-clipboard"
        .tooltip="${this.isResponseCopied ? B.COPIED_SUCCESSFULLY_MESSAGE : B.COPY_RESPONSE_BUTTON_LABEL_TEXT}"
        @click="${() => this.copyResponseToClipboard(i)}"
      ></chat-action-button>
    `;
  }
};
ir = ql([
  wt()
], ir);
lt.bind(W.ChatEntryAction).to(ir);
/*! @license DOMPurify 3.3.0 | (c) Cure53 and other contributors | Released under the Apache license 2.0 and Mozilla Public License 2.0 | github.com/cure53/DOMPurify/blob/3.3.0/LICENSE */
const {
  entries: _o,
  setPrototypeOf: gs,
  isFrozen: Vl,
  getPrototypeOf: Gl,
  getOwnPropertyDescriptor: Wl
} = Object;
let {
  freeze: vt,
  seal: It,
  create: rr
} = Object, {
  apply: sr,
  construct: or
} = typeof Reflect < "u" && Reflect;
vt || (vt = function(t) {
  return t;
});
It || (It = function(t) {
  return t;
});
sr || (sr = function(t, e) {
  for (var n = arguments.length, r = new Array(n > 2 ? n - 2 : 0), s = 2; s < n; s++)
    r[s - 2] = arguments[s];
  return t.apply(e, r);
});
or || (or = function(t) {
  for (var e = arguments.length, n = new Array(e > 1 ? e - 1 : 0), r = 1; r < e; r++)
    n[r - 1] = arguments[r];
  return new t(...n);
});
const jn = bt(Array.prototype.forEach), Zl = bt(Array.prototype.lastIndexOf), ms = bt(Array.prototype.pop), sn = bt(Array.prototype.push), Xl = bt(Array.prototype.splice), Vn = bt(String.prototype.toLowerCase), Ii = bt(String.prototype.toString), Ri = bt(String.prototype.match), on = bt(String.prototype.replace), Yl = bt(String.prototype.indexOf), Ql = bt(String.prototype.trim), Dt = bt(Object.prototype.hasOwnProperty), _t = bt(RegExp.prototype.test), an = Kl(TypeError);
function bt(i) {
  return function(t) {
    t instanceof RegExp && (t.lastIndex = 0);
    for (var e = arguments.length, n = new Array(e > 1 ? e - 1 : 0), r = 1; r < e; r++)
      n[r - 1] = arguments[r];
    return sr(i, t, n);
  };
}
function Kl(i) {
  return function() {
    for (var t = arguments.length, e = new Array(t), n = 0; n < t; n++)
      e[n] = arguments[n];
    return or(i, e);
  };
}
function U(i, t) {
  let e = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : Vn;
  gs && gs(i, null);
  let n = t.length;
  for (; n--; ) {
    let r = t[n];
    if (typeof r == "string") {
      const s = e(r);
      s !== r && (Vl(t) || (t[n] = s), r = s);
    }
    i[r] = !0;
  }
  return i;
}
function Jl(i) {
  for (let t = 0; t < i.length; t++)
    Dt(i, t) || (i[t] = null);
  return i;
}
function Qt(i) {
  const t = rr(null);
  for (const [e, n] of _o(i))
    Dt(i, e) && (Array.isArray(n) ? t[e] = Jl(n) : n && typeof n == "object" && n.constructor === Object ? t[e] = Qt(n) : t[e] = n);
  return t;
}
function ln(i, t) {
  for (; i !== null; ) {
    const n = Wl(i, t);
    if (n) {
      if (n.get)
        return bt(n.get);
      if (typeof n.value == "function")
        return bt(n.value);
    }
    i = Gl(i);
  }
  function e() {
    return null;
  }
  return e;
}
const _s = vt(["a", "abbr", "acronym", "address", "area", "article", "aside", "audio", "b", "bdi", "bdo", "big", "blink", "blockquote", "body", "br", "button", "canvas", "caption", "center", "cite", "code", "col", "colgroup", "content", "data", "datalist", "dd", "decorator", "del", "details", "dfn", "dialog", "dir", "div", "dl", "dt", "element", "em", "fieldset", "figcaption", "figure", "font", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hgroup", "hr", "html", "i", "img", "input", "ins", "kbd", "label", "legend", "li", "main", "map", "mark", "marquee", "menu", "menuitem", "meter", "nav", "nobr", "ol", "optgroup", "option", "output", "p", "picture", "pre", "progress", "q", "rp", "rt", "ruby", "s", "samp", "search", "section", "select", "shadow", "slot", "small", "source", "spacer", "span", "strike", "strong", "style", "sub", "summary", "sup", "table", "tbody", "td", "template", "textarea", "tfoot", "th", "thead", "time", "tr", "track", "tt", "u", "ul", "var", "video", "wbr"]), Oi = vt(["svg", "a", "altglyph", "altglyphdef", "altglyphitem", "animatecolor", "animatemotion", "animatetransform", "circle", "clippath", "defs", "desc", "ellipse", "enterkeyhint", "exportparts", "filter", "font", "g", "glyph", "glyphref", "hkern", "image", "inputmode", "line", "lineargradient", "marker", "mask", "metadata", "mpath", "part", "path", "pattern", "polygon", "polyline", "radialgradient", "rect", "stop", "style", "switch", "symbol", "text", "textpath", "title", "tref", "tspan", "view", "vkern"]), Mi = vt(["feBlend", "feColorMatrix", "feComponentTransfer", "feComposite", "feConvolveMatrix", "feDiffuseLighting", "feDisplacementMap", "feDistantLight", "feDropShadow", "feFlood", "feFuncA", "feFuncB", "feFuncG", "feFuncR", "feGaussianBlur", "feImage", "feMerge", "feMergeNode", "feMorphology", "feOffset", "fePointLight", "feSpecularLighting", "feSpotLight", "feTile", "feTurbulence"]), tc = vt(["animate", "color-profile", "cursor", "discard", "font-face", "font-face-format", "font-face-name", "font-face-src", "font-face-uri", "foreignobject", "hatch", "hatchpath", "mesh", "meshgradient", "meshpatch", "meshrow", "missing-glyph", "script", "set", "solidcolor", "unknown", "use"]), Di = vt(["math", "menclose", "merror", "mfenced", "mfrac", "mglyph", "mi", "mlabeledtr", "mmultiscripts", "mn", "mo", "mover", "mpadded", "mphantom", "mroot", "mrow", "ms", "mspace", "msqrt", "mstyle", "msub", "msup", "msubsup", "mtable", "mtd", "mtext", "mtr", "munder", "munderover", "mprescripts"]), ec = vt(["maction", "maligngroup", "malignmark", "mlongdiv", "mscarries", "mscarry", "msgroup", "mstack", "msline", "msrow", "semantics", "annotation", "annotation-xml", "mprescripts", "none"]), ys = vt(["#text"]), vs = vt(["accept", "action", "align", "alt", "autocapitalize", "autocomplete", "autopictureinpicture", "autoplay", "background", "bgcolor", "border", "capture", "cellpadding", "cellspacing", "checked", "cite", "class", "clear", "color", "cols", "colspan", "controls", "controlslist", "coords", "crossorigin", "datetime", "decoding", "default", "dir", "disabled", "disablepictureinpicture", "disableremoteplayback", "download", "draggable", "enctype", "enterkeyhint", "exportparts", "face", "for", "headers", "height", "hidden", "high", "href", "hreflang", "id", "inert", "inputmode", "integrity", "ismap", "kind", "label", "lang", "list", "loading", "loop", "low", "max", "maxlength", "media", "method", "min", "minlength", "multiple", "muted", "name", "nonce", "noshade", "novalidate", "nowrap", "open", "optimum", "part", "pattern", "placeholder", "playsinline", "popover", "popovertarget", "popovertargetaction", "poster", "preload", "pubdate", "radiogroup", "readonly", "rel", "required", "rev", "reversed", "role", "rows", "rowspan", "spellcheck", "scope", "selected", "shape", "size", "sizes", "slot", "span", "srclang", "start", "src", "srcset", "step", "style", "summary", "tabindex", "title", "translate", "type", "usemap", "valign", "value", "width", "wrap", "xmlns", "slot"]), Ni = vt(["accent-height", "accumulate", "additive", "alignment-baseline", "amplitude", "ascent", "attributename", "attributetype", "azimuth", "basefrequency", "baseline-shift", "begin", "bias", "by", "class", "clip", "clippathunits", "clip-path", "clip-rule", "color", "color-interpolation", "color-interpolation-filters", "color-profile", "color-rendering", "cx", "cy", "d", "dx", "dy", "diffuseconstant", "direction", "display", "divisor", "dur", "edgemode", "elevation", "end", "exponent", "fill", "fill-opacity", "fill-rule", "filter", "filterunits", "flood-color", "flood-opacity", "font-family", "font-size", "font-size-adjust", "font-stretch", "font-style", "font-variant", "font-weight", "fx", "fy", "g1", "g2", "glyph-name", "glyphref", "gradientunits", "gradienttransform", "height", "href", "id", "image-rendering", "in", "in2", "intercept", "k", "k1", "k2", "k3", "k4", "kerning", "keypoints", "keysplines", "keytimes", "lang", "lengthadjust", "letter-spacing", "kernelmatrix", "kernelunitlength", "lighting-color", "local", "marker-end", "marker-mid", "marker-start", "markerheight", "markerunits", "markerwidth", "maskcontentunits", "maskunits", "max", "mask", "mask-type", "media", "method", "mode", "min", "name", "numoctaves", "offset", "operator", "opacity", "order", "orient", "orientation", "origin", "overflow", "paint-order", "path", "pathlength", "patterncontentunits", "patterntransform", "patternunits", "points", "preservealpha", "preserveaspectratio", "primitiveunits", "r", "rx", "ry", "radius", "refx", "refy", "repeatcount", "repeatdur", "restart", "result", "rotate", "scale", "seed", "shape-rendering", "slope", "specularconstant", "specularexponent", "spreadmethod", "startoffset", "stddeviation", "stitchtiles", "stop-color", "stop-opacity", "stroke-dasharray", "stroke-dashoffset", "stroke-linecap", "stroke-linejoin", "stroke-miterlimit", "stroke-opacity", "stroke", "stroke-width", "style", "surfacescale", "systemlanguage", "tabindex", "tablevalues", "targetx", "targety", "transform", "transform-origin", "text-anchor", "text-decoration", "text-rendering", "textlength", "type", "u1", "u2", "unicode", "values", "viewbox", "visibility", "version", "vert-adv-y", "vert-origin-x", "vert-origin-y", "width", "word-spacing", "wrap", "writing-mode", "xchannelselector", "ychannelselector", "x", "x1", "x2", "xmlns", "y", "y1", "y2", "z", "zoomandpan"]), bs = vt(["accent", "accentunder", "align", "bevelled", "close", "columnsalign", "columnlines", "columnspan", "denomalign", "depth", "dir", "display", "displaystyle", "encoding", "fence", "frame", "height", "href", "id", "largeop", "length", "linethickness", "lspace", "lquote", "mathbackground", "mathcolor", "mathsize", "mathvariant", "maxsize", "minsize", "movablelimits", "notation", "numalign", "open", "rowalign", "rowlines", "rowspacing", "rowspan", "rspace", "rquote", "scriptlevel", "scriptminsize", "scriptsizemultiplier", "selection", "separator", "separators", "stretchy", "subscriptshift", "supscriptshift", "symmetric", "voffset", "width", "xmlns"]), zn = vt(["xlink:href", "xml:id", "xlink:title", "xml:space", "xmlns:xlink"]), nc = It(/\{\{[\w\W]*|[\w\W]*\}\}/gm), ic = It(/<%[\w\W]*|[\w\W]*%>/gm), rc = It(/\$\{[\w\W]*/gm), sc = It(/^data-[\-\w.\u00B7-\uFFFF]+$/), oc = It(/^aria-[\-\w]+$/), yo = It(
  /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|matrix):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i
  // eslint-disable-line no-useless-escape
), ac = It(/^(?:\w+script|data):/i), lc = It(
  /[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g
  // eslint-disable-line no-control-regex
), vo = It(/^html$/i), cc = It(/^[a-z][.\w]*(-[.\w]+)+$/i);
var ws = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  ARIA_ATTR: oc,
  ATTR_WHITESPACE: lc,
  CUSTOM_ELEMENT: cc,
  DATA_ATTR: sc,
  DOCTYPE_NAME: vo,
  ERB_EXPR: ic,
  IS_ALLOWED_URI: yo,
  IS_SCRIPT_OR_DATA: ac,
  MUSTACHE_EXPR: nc,
  TMPLIT_EXPR: rc
});
const cn = {
  element: 1,
  text: 3,
  // Deprecated
  progressingInstruction: 7,
  comment: 8,
  document: 9
}, hc = function() {
  return typeof window > "u" ? null : window;
}, uc = function(t, e) {
  if (typeof t != "object" || typeof t.createPolicy != "function")
    return null;
  let n = null;
  const r = "data-tt-policy-suffix";
  e && e.hasAttribute(r) && (n = e.getAttribute(r));
  const s = "dompurify" + (n ? "#" + n : "");
  try {
    return t.createPolicy(s, {
      createHTML(o) {
        return o;
      },
      createScriptURL(o) {
        return o;
      }
    });
  } catch {
    return console.warn("TrustedTypes policy " + s + " could not be created."), null;
  }
}, Cs = function() {
  return {
    afterSanitizeAttributes: [],
    afterSanitizeElements: [],
    afterSanitizeShadowDOM: [],
    beforeSanitizeAttributes: [],
    beforeSanitizeElements: [],
    beforeSanitizeShadowDOM: [],
    uponSanitizeAttribute: [],
    uponSanitizeElement: [],
    uponSanitizeShadowNode: []
  };
};
function bo() {
  let i = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : hc();
  const t = (I) => bo(I);
  if (t.version = "3.3.0", t.removed = [], !i || !i.document || i.document.nodeType !== cn.document || !i.Element)
    return t.isSupported = !1, t;
  let {
    document: e
  } = i;
  const n = e, r = n.currentScript, {
    DocumentFragment: s,
    HTMLTemplateElement: o,
    Node: l,
    Element: a,
    NodeFilter: u,
    NamedNodeMap: p = i.NamedNodeMap || i.MozNamedAttrMap,
    HTMLFormElement: g,
    DOMParser: m,
    trustedTypes: w
  } = i, N = a.prototype, O = ln(N, "cloneNode"), L = ln(N, "remove"), ct = ln(N, "nextSibling"), mt = ln(N, "childNodes"), K = ln(N, "parentNode");
  if (typeof o == "function") {
    const I = e.createElement("template");
    I.content && I.content.ownerDocument && (e = I.content.ownerDocument);
  }
  let Z, et = "";
  const {
    implementation: F,
    createNodeIterator: qt,
    createDocumentFragment: Rt,
    getElementsByTagName: En
  } = e, {
    importNode: je
  } = n;
  let ut = Cs();
  t.isSupported = typeof _o == "function" && typeof K == "function" && F && F.createHTMLDocument !== void 0;
  const {
    MUSTACHE_EXPR: ze,
    ERB_EXPR: Fe,
    TMPLIT_EXPR: qe,
    DATA_ATTR: $n,
    ARIA_ATTR: Ve,
    IS_SCRIPT_OR_DATA: In,
    ATTR_WHITESPACE: Ge,
    CUSTOM_ELEMENT: Rn
  } = ws;
  let {
    IS_ALLOWED_URI: We
  } = ws, it = null;
  const Ze = U({}, [..._s, ...Oi, ...Mi, ...Di, ...ys]);
  let k = null;
  const Vt = U({}, [...vs, ...Ni, ...bs, ...zn]);
  let J = Object.seal(rr(null, {
    tagNameCheck: {
      writable: !0,
      configurable: !1,
      enumerable: !0,
      value: null
    },
    attributeNameCheck: {
      writable: !0,
      configurable: !1,
      enumerable: !0,
      value: null
    },
    allowCustomizedBuiltInElements: {
      writable: !0,
      configurable: !1,
      enumerable: !0,
      value: !1
    }
  })), X = null, Xe = null;
  const re = Object.seal(rr(null, {
    tagCheck: {
      writable: !0,
      configurable: !1,
      enumerable: !0,
      value: null
    },
    attributeCheck: {
      writable: !0,
      configurable: !1,
      enumerable: !0,
      value: null
    }
  }));
  let Ye = !0, Qe = !0, kt = !1, Ke = !0, Ot = !1, ue = !0, Gt = !1, de = !1, Ee = !1, Wt = !1, pe = !1, fe = !1, Je = !0, $e = !1;
  const fi = "user-content-";
  let tn = !0, ge = !1, se = {}, Et = null;
  const On = U({}, ["annotation-xml", "audio", "colgroup", "desc", "foreignobject", "head", "iframe", "math", "mi", "mn", "mo", "ms", "mtext", "noembed", "noframes", "noscript", "plaintext", "script", "style", "svg", "template", "thead", "title", "video", "xmp"]);
  let Mn = null;
  const Dn = U({}, ["audio", "video", "img", "source", "image", "track"]);
  let me = null;
  const h = U({}, ["alt", "class", "for", "id", "label", "name", "pattern", "placeholder", "role", "summary", "title", "value", "style", "xmlns"]), d = "http://www.w3.org/1998/Math/MathML", f = "http://www.w3.org/2000/svg", y = "http://www.w3.org/1999/xhtml";
  let $ = y, Y = !1, tt = null;
  const P = U({}, [d, f, y], Ii);
  let b = U({}, ["mi", "mo", "mn", "ms", "mtext"]), T = U({}, ["annotation-xml"]);
  const A = U({}, ["title", "style", "font", "a", "script"]);
  let x = null;
  const H = ["application/xhtml+xml", "text/html"], q = "text/html";
  let M = null, ht = null;
  const Nn = e.createElement("form"), Pn = function(c) {
    return c instanceof RegExp || c instanceof Function;
  }, en = function() {
    let c = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    if (!(ht && ht === c)) {
      if ((!c || typeof c != "object") && (c = {}), c = Qt(c), x = // eslint-disable-next-line unicorn/prefer-includes
      H.indexOf(c.PARSER_MEDIA_TYPE) === -1 ? q : c.PARSER_MEDIA_TYPE, M = x === "application/xhtml+xml" ? Ii : Vn, it = Dt(c, "ALLOWED_TAGS") ? U({}, c.ALLOWED_TAGS, M) : Ze, k = Dt(c, "ALLOWED_ATTR") ? U({}, c.ALLOWED_ATTR, M) : Vt, tt = Dt(c, "ALLOWED_NAMESPACES") ? U({}, c.ALLOWED_NAMESPACES, Ii) : P, me = Dt(c, "ADD_URI_SAFE_ATTR") ? U(Qt(h), c.ADD_URI_SAFE_ATTR, M) : h, Mn = Dt(c, "ADD_DATA_URI_TAGS") ? U(Qt(Dn), c.ADD_DATA_URI_TAGS, M) : Dn, Et = Dt(c, "FORBID_CONTENTS") ? U({}, c.FORBID_CONTENTS, M) : On, X = Dt(c, "FORBID_TAGS") ? U({}, c.FORBID_TAGS, M) : Qt({}), Xe = Dt(c, "FORBID_ATTR") ? U({}, c.FORBID_ATTR, M) : Qt({}), se = Dt(c, "USE_PROFILES") ? c.USE_PROFILES : !1, Ye = c.ALLOW_ARIA_ATTR !== !1, Qe = c.ALLOW_DATA_ATTR !== !1, kt = c.ALLOW_UNKNOWN_PROTOCOLS || !1, Ke = c.ALLOW_SELF_CLOSE_IN_ATTR !== !1, Ot = c.SAFE_FOR_TEMPLATES || !1, ue = c.SAFE_FOR_XML !== !1, Gt = c.WHOLE_DOCUMENT || !1, Wt = c.RETURN_DOM || !1, pe = c.RETURN_DOM_FRAGMENT || !1, fe = c.RETURN_TRUSTED_TYPE || !1, Ee = c.FORCE_BODY || !1, Je = c.SANITIZE_DOM !== !1, $e = c.SANITIZE_NAMED_PROPS || !1, tn = c.KEEP_CONTENT !== !1, ge = c.IN_PLACE || !1, We = c.ALLOWED_URI_REGEXP || yo, $ = c.NAMESPACE || y, b = c.MATHML_TEXT_INTEGRATION_POINTS || b, T = c.HTML_INTEGRATION_POINTS || T, J = c.CUSTOM_ELEMENT_HANDLING || {}, c.CUSTOM_ELEMENT_HANDLING && Pn(c.CUSTOM_ELEMENT_HANDLING.tagNameCheck) && (J.tagNameCheck = c.CUSTOM_ELEMENT_HANDLING.tagNameCheck), c.CUSTOM_ELEMENT_HANDLING && Pn(c.CUSTOM_ELEMENT_HANDLING.attributeNameCheck) && (J.attributeNameCheck = c.CUSTOM_ELEMENT_HANDLING.attributeNameCheck), c.CUSTOM_ELEMENT_HANDLING && typeof c.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements == "boolean" && (J.allowCustomizedBuiltInElements = c.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements), Ot && (Qe = !1), pe && (Wt = !0), se && (it = U({}, ys), k = [], se.html === !0 && (U(it, _s), U(k, vs)), se.svg === !0 && (U(it, Oi), U(k, Ni), U(k, zn)), se.svgFilters === !0 && (U(it, Mi), U(k, Ni), U(k, zn)), se.mathMl === !0 && (U(it, Di), U(k, bs), U(k, zn))), c.ADD_TAGS && (typeof c.ADD_TAGS == "function" ? re.tagCheck = c.ADD_TAGS : (it === Ze && (it = Qt(it)), U(it, c.ADD_TAGS, M))), c.ADD_ATTR && (typeof c.ADD_ATTR == "function" ? re.attributeCheck = c.ADD_ATTR : (k === Vt && (k = Qt(k)), U(k, c.ADD_ATTR, M))), c.ADD_URI_SAFE_ATTR && U(me, c.ADD_URI_SAFE_ATTR, M), c.FORBID_CONTENTS && (Et === On && (Et = Qt(Et)), U(Et, c.FORBID_CONTENTS, M)), tn && (it["#text"] = !0), Gt && U(it, ["html", "head", "body"]), it.table && (U(it, ["tbody"]), delete X.tbody), c.TRUSTED_TYPES_POLICY) {
        if (typeof c.TRUSTED_TYPES_POLICY.createHTML != "function")
          throw an('TRUSTED_TYPES_POLICY configuration option must provide a "createHTML" hook.');
        if (typeof c.TRUSTED_TYPES_POLICY.createScriptURL != "function")
          throw an('TRUSTED_TYPES_POLICY configuration option must provide a "createScriptURL" hook.');
        Z = c.TRUSTED_TYPES_POLICY, et = Z.createHTML("");
      } else
        Z === void 0 && (Z = uc(w, r)), Z !== null && typeof et == "string" && (et = Z.createHTML(""));
      vt && vt(c), ht = c;
    }
  }, Cr = U({}, [...Oi, ...Mi, ...tc]), Tr = U({}, [...Di, ...ec]), wo = function(c) {
    let _ = K(c);
    (!_ || !_.tagName) && (_ = {
      namespaceURI: $,
      tagName: "template"
    });
    const S = Vn(c.tagName), Q = Vn(_.tagName);
    return tt[c.namespaceURI] ? c.namespaceURI === f ? _.namespaceURI === y ? S === "svg" : _.namespaceURI === d ? S === "svg" && (Q === "annotation-xml" || b[Q]) : !!Cr[S] : c.namespaceURI === d ? _.namespaceURI === y ? S === "math" : _.namespaceURI === f ? S === "math" && T[Q] : !!Tr[S] : c.namespaceURI === y ? _.namespaceURI === f && !T[Q] || _.namespaceURI === d && !b[Q] ? !1 : !Tr[S] && (A[S] || !Cr[S]) : !!(x === "application/xhtml+xml" && tt[c.namespaceURI]) : !1;
  }, Pt = function(c) {
    sn(t.removed, {
      element: c
    });
    try {
      K(c).removeChild(c);
    } catch {
      L(c);
    }
  }, _e = function(c, _) {
    try {
      sn(t.removed, {
        attribute: _.getAttributeNode(c),
        from: _
      });
    } catch {
      sn(t.removed, {
        attribute: null,
        from: _
      });
    }
    if (_.removeAttribute(c), c === "is")
      if (Wt || pe)
        try {
          Pt(_);
        } catch {
        }
      else
        try {
          _.setAttribute(c, "");
        } catch {
        }
  }, xr = function(c) {
    let _ = null, S = null;
    if (Ee)
      c = "<remove></remove>" + c;
    else {
      const st = Ri(c, /^[\r\n\t ]+/);
      S = st && st[0];
    }
    x === "application/xhtml+xml" && $ === y && (c = '<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>' + c + "</body></html>");
    const Q = Z ? Z.createHTML(c) : c;
    if ($ === y)
      try {
        _ = new m().parseFromString(Q, x);
      } catch {
      }
    if (!_ || !_.documentElement) {
      _ = F.createDocument($, "template", null);
      try {
        _.documentElement.innerHTML = Y ? et : Q;
      } catch {
      }
    }
    const gt = _.body || _.documentElement;
    return c && S && gt.insertBefore(e.createTextNode(S), gt.childNodes[0] || null), $ === y ? En.call(_, Gt ? "html" : "body")[0] : Gt ? _.documentElement : gt;
  }, Ar = function(c) {
    return qt.call(
      c.ownerDocument || c,
      c,
      // eslint-disable-next-line no-bitwise
      u.SHOW_ELEMENT | u.SHOW_COMMENT | u.SHOW_TEXT | u.SHOW_PROCESSING_INSTRUCTION | u.SHOW_CDATA_SECTION,
      null
    );
  }, gi = function(c) {
    return c instanceof g && (typeof c.nodeName != "string" || typeof c.textContent != "string" || typeof c.removeChild != "function" || !(c.attributes instanceof p) || typeof c.removeAttribute != "function" || typeof c.setAttribute != "function" || typeof c.namespaceURI != "string" || typeof c.insertBefore != "function" || typeof c.hasChildNodes != "function");
  }, kr = function(c) {
    return typeof l == "function" && c instanceof l;
  };
  function Zt(I, c, _) {
    jn(I, (S) => {
      S.call(t, c, _, ht);
    });
  }
  const Sr = function(c) {
    let _ = null;
    if (Zt(ut.beforeSanitizeElements, c, null), gi(c))
      return Pt(c), !0;
    const S = M(c.nodeName);
    if (Zt(ut.uponSanitizeElement, c, {
      tagName: S,
      allowedTags: it
    }), ue && c.hasChildNodes() && !kr(c.firstElementChild) && _t(/<[/\w!]/g, c.innerHTML) && _t(/<[/\w!]/g, c.textContent) || c.nodeType === cn.progressingInstruction || ue && c.nodeType === cn.comment && _t(/<[/\w]/g, c.data))
      return Pt(c), !0;
    if (!(re.tagCheck instanceof Function && re.tagCheck(S)) && (!it[S] || X[S])) {
      if (!X[S] && $r(S) && (J.tagNameCheck instanceof RegExp && _t(J.tagNameCheck, S) || J.tagNameCheck instanceof Function && J.tagNameCheck(S)))
        return !1;
      if (tn && !Et[S]) {
        const Q = K(c) || c.parentNode, gt = mt(c) || c.childNodes;
        if (gt && Q) {
          const st = gt.length;
          for (let Ct = st - 1; Ct >= 0; --Ct) {
            const Xt = O(gt[Ct], !0);
            Xt.__removalCount = (c.__removalCount || 0) + 1, Q.insertBefore(Xt, ct(c));
          }
        }
      }
      return Pt(c), !0;
    }
    return c instanceof a && !wo(c) || (S === "noscript" || S === "noembed" || S === "noframes") && _t(/<\/no(script|embed|frames)/i, c.innerHTML) ? (Pt(c), !0) : (Ot && c.nodeType === cn.text && (_ = c.textContent, jn([ze, Fe, qe], (Q) => {
      _ = on(_, Q, " ");
    }), c.textContent !== _ && (sn(t.removed, {
      element: c.cloneNode()
    }), c.textContent = _)), Zt(ut.afterSanitizeElements, c, null), !1);
  }, Er = function(c, _, S) {
    if (Je && (_ === "id" || _ === "name") && (S in e || S in Nn))
      return !1;
    if (!(Qe && !Xe[_] && _t($n, _))) {
      if (!(Ye && _t(Ve, _))) {
        if (!(re.attributeCheck instanceof Function && re.attributeCheck(_, c))) {
          if (!k[_] || Xe[_]) {
            if (
              // First condition does a very basic check if a) it's basically a valid custom element tagname AND
              // b) if the tagName passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.tagNameCheck
              // and c) if the attribute name passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.attributeNameCheck
              !($r(c) && (J.tagNameCheck instanceof RegExp && _t(J.tagNameCheck, c) || J.tagNameCheck instanceof Function && J.tagNameCheck(c)) && (J.attributeNameCheck instanceof RegExp && _t(J.attributeNameCheck, _) || J.attributeNameCheck instanceof Function && J.attributeNameCheck(_, c)) || // Alternative, second condition checks if it's an `is`-attribute, AND
              // the value passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.tagNameCheck
              _ === "is" && J.allowCustomizedBuiltInElements && (J.tagNameCheck instanceof RegExp && _t(J.tagNameCheck, S) || J.tagNameCheck instanceof Function && J.tagNameCheck(S)))
            ) return !1;
          } else if (!me[_]) {
            if (!_t(We, on(S, Ge, ""))) {
              if (!((_ === "src" || _ === "xlink:href" || _ === "href") && c !== "script" && Yl(S, "data:") === 0 && Mn[c])) {
                if (!(kt && !_t(In, on(S, Ge, "")))) {
                  if (S)
                    return !1;
                }
              }
            }
          }
        }
      }
    }
    return !0;
  }, $r = function(c) {
    return c !== "annotation-xml" && Ri(c, Rn);
  }, Ir = function(c) {
    Zt(ut.beforeSanitizeAttributes, c, null);
    const {
      attributes: _
    } = c;
    if (!_ || gi(c))
      return;
    const S = {
      attrName: "",
      attrValue: "",
      keepAttr: !0,
      allowedAttributes: k,
      forceKeepAttr: void 0
    };
    let Q = _.length;
    for (; Q--; ) {
      const gt = _[Q], {
        name: st,
        namespaceURI: Ct,
        value: Xt
      } = gt, Ie = M(st), mi = Xt;
      let dt = st === "value" ? mi : Ql(mi);
      if (S.attrName = Ie, S.attrValue = dt, S.keepAttr = !0, S.forceKeepAttr = void 0, Zt(ut.uponSanitizeAttribute, c, S), dt = S.attrValue, $e && (Ie === "id" || Ie === "name") && (_e(st, c), dt = fi + dt), ue && _t(/((--!?|])>)|<\/(style|title|textarea)/i, dt)) {
        _e(st, c);
        continue;
      }
      if (Ie === "attributename" && Ri(dt, "href")) {
        _e(st, c);
        continue;
      }
      if (S.forceKeepAttr)
        continue;
      if (!S.keepAttr) {
        _e(st, c);
        continue;
      }
      if (!Ke && _t(/\/>/i, dt)) {
        _e(st, c);
        continue;
      }
      Ot && jn([ze, Fe, qe], (Or) => {
        dt = on(dt, Or, " ");
      });
      const Rr = M(c.nodeName);
      if (!Er(Rr, Ie, dt)) {
        _e(st, c);
        continue;
      }
      if (Z && typeof w == "object" && typeof w.getAttributeType == "function" && !Ct)
        switch (w.getAttributeType(Rr, Ie)) {
          case "TrustedHTML": {
            dt = Z.createHTML(dt);
            break;
          }
          case "TrustedScriptURL": {
            dt = Z.createScriptURL(dt);
            break;
          }
        }
      if (dt !== mi)
        try {
          Ct ? c.setAttributeNS(Ct, st, dt) : c.setAttribute(st, dt), gi(c) ? Pt(c) : ms(t.removed);
        } catch {
          _e(st, c);
        }
    }
    Zt(ut.afterSanitizeAttributes, c, null);
  }, Co = function I(c) {
    let _ = null;
    const S = Ar(c);
    for (Zt(ut.beforeSanitizeShadowDOM, c, null); _ = S.nextNode(); )
      Zt(ut.uponSanitizeShadowNode, _, null), Sr(_), Ir(_), _.content instanceof s && I(_.content);
    Zt(ut.afterSanitizeShadowDOM, c, null);
  };
  return t.sanitize = function(I) {
    let c = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, _ = null, S = null, Q = null, gt = null;
    if (Y = !I, Y && (I = "<!-->"), typeof I != "string" && !kr(I))
      if (typeof I.toString == "function") {
        if (I = I.toString(), typeof I != "string")
          throw an("dirty is not a string, aborting");
      } else
        throw an("toString is not a function");
    if (!t.isSupported)
      return I;
    if (de || en(c), t.removed = [], typeof I == "string" && (ge = !1), ge) {
      if (I.nodeName) {
        const Xt = M(I.nodeName);
        if (!it[Xt] || X[Xt])
          throw an("root node is forbidden and cannot be sanitized in-place");
      }
    } else if (I instanceof l)
      _ = xr("<!---->"), S = _.ownerDocument.importNode(I, !0), S.nodeType === cn.element && S.nodeName === "BODY" || S.nodeName === "HTML" ? _ = S : _.appendChild(S);
    else {
      if (!Wt && !Ot && !Gt && // eslint-disable-next-line unicorn/prefer-includes
      I.indexOf("<") === -1)
        return Z && fe ? Z.createHTML(I) : I;
      if (_ = xr(I), !_)
        return Wt ? null : fe ? et : "";
    }
    _ && Ee && Pt(_.firstChild);
    const st = Ar(ge ? I : _);
    for (; Q = st.nextNode(); )
      Sr(Q), Ir(Q), Q.content instanceof s && Co(Q.content);
    if (ge)
      return I;
    if (Wt) {
      if (pe)
        for (gt = Rt.call(_.ownerDocument); _.firstChild; )
          gt.appendChild(_.firstChild);
      else
        gt = _;
      return (k.shadowroot || k.shadowrootmode) && (gt = je.call(n, gt, !0)), gt;
    }
    let Ct = Gt ? _.outerHTML : _.innerHTML;
    return Gt && it["!doctype"] && _.ownerDocument && _.ownerDocument.doctype && _.ownerDocument.doctype.name && _t(vo, _.ownerDocument.doctype.name) && (Ct = "<!DOCTYPE " + _.ownerDocument.doctype.name + `>
` + Ct), Ot && jn([ze, Fe, qe], (Xt) => {
      Ct = on(Ct, Xt, " ");
    }), Z && fe ? Z.createHTML(Ct) : Ct;
  }, t.setConfig = function() {
    let I = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    en(I), de = !0;
  }, t.clearConfig = function() {
    ht = null, de = !1;
  }, t.isValidAttribute = function(I, c, _) {
    ht || en({});
    const S = M(I), Q = M(c);
    return Er(S, Q, _);
  }, t.addHook = function(I, c) {
    typeof c == "function" && sn(ut[I], c);
  }, t.removeHook = function(I, c) {
    if (c !== void 0) {
      const _ = Zl(ut[I], c);
      return _ === -1 ? void 0 : Xl(ut[I], _, 1)[0];
    }
    return ms(ut[I]);
  }, t.removeHooks = function(I) {
    ut[I] = [];
  }, t.removeAllHooks = function() {
    ut = Cs();
  }, t;
}
var Ts = bo();
const dc = zt`
  :host {
    --c-primary: #123f58;
    --c-secondary: #f5f5f5;
    --c-text: var(--c-primary);
    --c-white: #fff;
    --c-black: #111111;
    --c-red: #ff0000;
    --c-light-gray: #e3e3e3;
    --c-base-gray: var(--c-secondary);
    --c-dark-gray: #4e5288;
    --c-accent-high: #692b61;
    --c-accent-dark: #5e3c7d;
    --c-accent-light: #f6d5f2;
    --c-error: #8a0000;
    --c-error-background: rgb(253, 231, 233);
    --c-success: #26b32b;
    --font-r-small: 1vw;
    --font-r-base: 3vw;
    --font-r-large: 5vw;
    --font-base: 14px;
    --font-rel-base: 1.2rem;
    --font-small: small;
    --font-large: large;
    --font-larger: x-large;
    --border-base: 3px;
    --border-thin: 1px;
    --border-thicker: 8px;
    --radius-small: 5px;
    --radius-base: 10px;
    --radius-large: 25px;
    --radius-none: 0;
    --width-wide: 90%;
    --width-base: 80%;
    --width-narrow: 50%;
    --d-base: 20px;
    --d-small: 10px;
    --d-xsmall: 5px;
    --d-large: 30px;
    --d-xlarge: 50px;
    --shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    width: 100vw;
    display: block;
    padding: var(--d-base);
    color: var(--c-text);
  }
  :host([data-theme='dark']) {
    --c-primary: #fdfeff;
    --c-secondary: #32343e;
    --c-text: var(--c-primary);
    --c-white: var(--c-secondary);
    --c-black: var(--c-primary);
    --c-red: #ff0000;
    --c-light-gray: #636d9c;
    --c-dark-gray: #e3e3e3;
    --c-base-gray: var(--c-secondary);
    --c-accent-high: #dcdef8;
    --c-accent-dark: var(--c-primary);
    --c-accent-light: #032219;
    --c-error: #8a0000;
    --c-error-background: rgb(253, 231, 233);
    --c-success: #26b32b;
  }
  html {
    scroll-behavior: smooth;
  }
  ul {
    margin-block-start: 0;
    margin-block-end: 0;
  }
  .button {
    color: var(--c-text);
    border: 0;
    background: none;
    cursor: pointer;
    text-decoration: underline;
  }
  .overlay {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    width: 100%;
    height: 0;
    background: var(--c-black);
    z-index: 2;
    opacity: 0.8;
    transition: all 0.3s ease-in-out;
  }
  .overlay.active {
    @media (max-width: 1024px) {
      height: 100%;
    }
  }
  .display-none {
    display: none;
    visibility: hidden;
  }
  .display-flex-grow {
    flex-grow: 1;
  }
  .container-col {
    display: flex;
    flex-direction: column;
    gap: var(--d-small);
  }
  .container-row {
    flex-direction: row;
  }
  .chat__header--thread {
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
  .chat__container {
    min-width: 100%;
    transition: width 0.3s ease-in-out;
    max-height: 100vh;
  }
  .chat__containerWrapper.aside-open {
    .chat__listItem {
      max-width: var(--width-wide);
    }
  }
  .chat__containerWrapper {
    display: grid;
    grid-template-columns: 1fr;
    gutter: var(--d-base);
  }
  .chat__containerWrapper.aside-open {
    display: grid;
    grid-template-columns: 1fr;
    grid-column-gap: var(--d-base);
    grid-row-gap: var(--d-base);

    @media (min-width: 1024px) {
      grid-template-columns: 1fr 1fr;
    }
  }
  .chat__containerWrapper.aside-open .aside {
    width: 100%;
    border-left: var(--border-thin) solid var(--c-light-gray);

    @media (max-width: 1024px) {
      width: var(--width-base);
    }
  }
  @media (max-width: 1024px) {
    .aside {
      top: var(-d-large);
      left: auto;
      z-index: 3;
      background: var(--c-white);
      display: block;
      padding: var(--d-base);
      position: absolute;
      width: var(--width-base);
      border-radius: var(--radius-base);
    }
  }
  .form__container {
    margin-top: var(--d-large);
    padding: var(--d-small);
  }
  .form__container-sticky {
    position: sticky;
    bottom: 0;
    z-index: 1;
    border-radius: var(--radius-base);
    background: linear-gradient(0deg, var(--c-base-gray) 0%, var(--c-base-gray) 75%, var(--c-base-gray) 100%);
    box-shadow: var(--shadow);
    padding: var(--d-small) var(--d-small) var(--d-large);
  }
  .form__label {
    display: block;
    padding: var(-d-xsmall) 0;
    font-size: var(--font-small);
  }
  .chatbox__button:disabled,
  .chatbox__input:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  .chatbox__button svg {
    fill: var(--c-accent-high);
    width: calc(var(--d-base) + var(--d-xsmall));
  }
  .chatbox__container {
    position: relative;
    height: 50px;
  }
  .chatbox__button {
    background: var(--c-white);
    border: none;
    color: var(--text-color);
    font-weight: bold;
    cursor: pointer;
    border-radius: 4px;
    margin-left: 8px;
    width: calc(var(--d-large) + var(--d-xlarge));
    box-shadow: var(--shadow);
    transition: background 0.3s ease-in-out;
  }
  .chatbox__button:hover,
  .chatbox__button:focus {
    background: var(--c-secondary);
  }
  .chatbox__button:hover svg,
  .chatbox__button:focus svg {
    opacity: 0.8;
  }
  .chatbox__button--reset {
    position: absolute;
    right: 115px;
    top: 15px;
    background: transparent;
    border: none;
    color: gray;
    background: var(--c-accent-dark);
    border-radius: 50%;
    color: var(--c-white);
    font-weight: bold;
    height: 20px;
    width: var(--d-base);
    cursor: pointer;
  }
  .chatbox__input-container {
    display: flex;
    border: var(--border-thin) solid var(--c-black);
    background: var(--c-white);
    border-radius: 4px;
  }
  .chatbox__input-container:focus-within {
    outline: -webkit-focus-ring-color auto 1px;
  }
  .chatbox__input {
    background: transparent;
    color: var(--text-color);
    border: none;
    padding: var(--d-small);
    flex: 1 1 auto;
    font-size: 1rem;
  }
  .chatbox__input:focus-visible {
    outline: none;
  }
  .aside__header {
    display: flex;
    justify-content: end;
  }
  .tab-component__content {
    padding: var(--d-base) var(--d-base) var(--d-base) 0;
  }
  .tab-component__paragraph {
    font-family: monospace;
    font-size: var(--font-large);
    border: var(--border-thin) solid var(--c-light-gray);
    border-radius: var(--radius-large);
    padding: var(--d-base);
  }
  .chat-history__footer {
    display: flex;
    flex-direction: row;
    gap: 10px;
    justify-content: space-between;
    align-self: center;
    padding: 20px;
  }
  .chat-history__container {
    display: flex;
    flex-direction: column;
    border-bottom: 3px solid var(--light-gray);
    margin-bottom: 30px;
  }
`, pc = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2048 2048">\r
  <path d="M1792 384h-128v1472q0 40-15 75t-41 61-61 41-75 15H448q-40 0-75-15t-61-41-41-61-15-75V384H128V256h512V128q0-27 10-50t27-40 41-28 50-10h384q27 0 50 10t40 27 28 41 10 50v128h512v128zM768 256h384V128H768v128zm768 128H384v1472q0 26 19 45t45 19h1024q26 0 45-19t19-45V384zM768 1664H640V640h128v1024zm256 0H896V640h128v1024zm256 0h-128V640h128v1024z" />\r
</svg>`, fc = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2048 2048">\r
  <path d="M512 768h1024v128H512V768zm1024-256H512V384h1024v128zm-384 1408l127 128H256V0h1536v1348l-64 63-64-64V128H384v1792h768zm576 125l3 3h-6l3-3zm-192-893l-129 128H512v-128h1024zm-317 384l128 128H512v-128h707zm600 192l226 227-90 90-227-226-227 227-90-91 227-227-227-227 90-90 227 227 227-227 90 91-226 226z" />\r
</svg>`, gc = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2048 2048">\r
  <path d="M221 1027h931l128-64-128-64H223L18 77l1979 883L18 1843l203-816z" />\r
</svg>`, xs = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>\r
<svg\r
   xmlns:dc="http://purl.org/dc/elements/1.1/"\r
   xmlns:cc="http://creativecommons.org/ns#"\r
   xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"\r
   xmlns:svg="http://www.w3.org/2000/svg"\r
   xmlns="http://www.w3.org/2000/svg"\r
   xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"\r
   xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape"\r
   width="533.37976"\r
   height="479.4425"\r
   viewBox="0 0 141.12339 126.8525"\r
   version="1.1"\r
   id="svg8"\r
   inkscape:version="1.0.1 (c497b03c, 2020-09-10)"\r
   sodipodi:docname="brand-logo.svg">\r
  <defs\r
     id="defs2" />\r
  <sodipodi:namedview\r
     id="base"\r
     pagecolor="#ffffff"\r
     bordercolor="#666666"\r
     borderopacity="1.0"\r
     inkscape:pageopacity="0.0"\r
     inkscape:pageshadow="2"\r
     inkscape:zoom="0.4654497"\r
     inkscape:cx="303.64057"\r
     inkscape:cy="106.60712"\r
     inkscape:document-units="mm"\r
     inkscape:current-layer="layer1"\r
     inkscape:document-rotation="0"\r
     showgrid="false"\r
     inkscape:window-width="1187"\r
     inkscape:window-height="541"\r
     inkscape:window-x="119"\r
     inkscape:window-y="131"\r
     inkscape:window-maximized="0"\r
     units="px"\r
     fit-margin-top="0"\r
     fit-margin-left="0"\r
     fit-margin-right="0"\r
     fit-margin-bottom="0" />\r
  <metadata\r
     id="metadata5">\r
    <rdf:RDF>\r
      <cc:Work\r
         rdf:about="">\r
        <dc:format>image/svg+xml</dc:format>\r
        <dc:type\r
           rdf:resource="http://purl.org/dc/dcmitype/StillImage" />\r
        <dc:title></dc:title>\r
      </cc:Work>\r
    </rdf:RDF>\r
  </metadata>\r
  <g\r
     inkscape:label="Layer 1"\r
     inkscape:groupmode="layer"\r
     id="layer1"\r
     transform="translate(-18.235046,-25.370501)">\r
    <text\r
       xml:space="preserve"\r
       style="font-style:normal;font-weight:normal;font-size:18.7575px;line-height:1.25;font-family:sans-serif;fill:#000000;fill-opacity:1;stroke:none;stroke-width:0.468938"\r
       x="76.622147"\r
       y="77.940918"\r
       id="text837"\r
       transform="scale(0.95147583,1.0509988)"><tspan\r
         sodipodi:role="line"\r
         id="tspan835"\r
         x="76.622147"\r
         y="77.940918"\r
         style="stroke-width:0.468938">YOUR</tspan><tspan\r
         sodipodi:role="line"\r
         x="76.622147"\r
         y="101.38779"\r
         style="stroke-width:0.468938"\r
         id="tspan885">BRAND</tspan></text>\r
    <path\r
       sodipodi:type="star"\r
       style="opacity:0.99;fill:#eec4e6;fill-opacity:0.835294;fill-rule:evenodd;stroke-width:4.99999;stroke-linejoin:round"\r
       id="path887"\r
       sodipodi:sides="5"\r
       sodipodi:cx="55.752526"\r
       sodipodi:cy="87.899637"\r
       sodipodi:r1="26.130005"\r
       sodipodi:r2="13.065002"\r
       sodipodi:arg1="0.77001476"\r
       sodipodi:arg2="1.3983333"\r
       inkscape:flatsided="false"\r
       inkscape:rounded="0"\r
       inkscape:randomized="0"\r
       d="M 74.511266,106.08993 57.994602,100.77082 44.249297,111.36137 44.204142,94.009392 29.884399,84.209489 46.373155,78.804488 51.268372,62.157267 61.504139,76.168769 78.849293,75.680123 68.686589,89.744708 Z"\r
       inkscape:transform-center-x="1.3856798"\r
       inkscape:transform-center-y="-1.1403183" />\r
  </g>\r
</svg>\r
`;
async function mc({ question: i, type: t, approach: e, overrides: n, messages: r }, {
  method: s,
  url: o,
  stream: l,
  signal: a,
  chatId: u,
  personalityId: p
}) {
  var g;
  if (t === "chat" && (u !== void 0 || p !== void 0)) {
    const m = u ? typeof u == "string" ? Number.parseInt(u, 10) : u : null, w = p ? typeof p == "string" ? Number.parseInt(p, 10) : p : null, N = i || ((g = r == null ? void 0 : r[r.length - 1]) == null ? void 0 : g.content) || "", O = o.replace(/\/$/, ""), L = O.endsWith("/api/chat") ? O : `${O}/api/chat`;
    return await fetch(L, {
      method: s,
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      signal: a,
      body: JSON.stringify({
        input: N,
        chatId: m,
        personalityId: w,
        context: {
          ...n,
          approach: e
        },
        stream: l
      })
    });
  }
  return await fetch(`${o}/${t}`, {
    method: s,
    headers: {
      "Content-Type": "application/json"
    },
    credentials: "include",
    signal: a,
    body: JSON.stringify({
      messages: [
        ...r ?? [],
        {
          content: i,
          role: "user"
        }
      ],
      context: {
        ...n,
        approach: e
      },
      stream: t === "chat" ? l : !1
    })
  });
}
async function _c(i, t) {
  const e = await mc(i, t);
  if (i.type === "ask" ? !1 : t.stream)
    return e;
  const r = await e.json();
  if (e.status > 299 || !e.ok)
    throw new nr(e.statusText, e.status) || "API Response Error";
  return r;
}
class yc extends TransformStream {
  constructor() {
    let t;
    super({
      start: (e) => {
        t = e;
      },
      transform: (e) => {
        const n = e.split(`
`).filter(Boolean);
        for (const r of n)
          try {
            this.buffer += r, t.enqueue(JSON.parse(this.buffer)), this.buffer = "";
          } catch {
          }
      }
    }), this.buffer = "";
  }
}
function vc(i) {
  return i == null ? void 0 : i.pipeThrough(new TextDecoderStream()).pipeThrough(new yc()).getReader();
}
async function* bc(i) {
  if (!i)
    throw new Error("No response body or body is not readable");
  let t, e;
  for (; { value: t, done: e } = await i.read(), !e; )
    yield new Promise((n) => {
      setTimeout(() => {
        n(t);
      }, B.BOT_TYPING_EFFECT_INTERVAL);
    });
}
function qc(i) {
  i && i.cancel();
}
async function wc({
  chatEntry: i,
  apiResponseBody: t,
  signal: e,
  onChunkRead: n,
  onCancel: r
}) {
  var ct, mt;
  const s = vc(t), o = bc(s), l = [], a = [], u = [];
  let p = !1, g = !1, m = !1, w = 0, N = 0, O = 0, L = {
    ...i
  };
  for await (const K of o) {
    if (e.aborted) {
      r();
      return;
    }
    if (K.chatId && K.done) {
      window.dispatchEvent(
        new CustomEvent("chat-created", {
          detail: { chatId: K.chatId }
        })
      );
      continue;
    }
    if (K.error)
      throw new nr(K.message, K.statusCode);
    if (K.choices[0].finish_reason === "content_filter")
      throw new nr("Content filtered", 400);
    const { content: Z, context: et } = K.choices[0].delta;
    if (et != null && et.data_points) {
      L.dataPoints = ((ct = et.data_points) == null ? void 0 : ct.text) ?? [], L.thoughts = et.thoughts ?? "";
      continue;
    }
    let F = Z ?? "";
    if (F === "")
      continue;
    l.push(F);
    const qt = /(\d+)/;
    let Rt = (mt = F.match(qt)) == null ? void 0 : mt[0];
    if (Rt) {
      a.push(Rt);
      continue;
    }
    if (!m && F.includes("Next") || F.includes("<<")) {
      m = !0, u.push(F);
      continue;
    } else if (u.length > 0 && F.includes("Question")) {
      m = !0, u.push(F);
      continue;
    } else if (F.includes("<<") && m) {
      m = !0;
      continue;
    } else if (F.includes(`>
`)) {
      w = w + 1, m = !0;
      continue;
    } else m && (m = !0, F = F.replace(/:?\n/, "").replaceAll(">", ""));
    a.length > 0 && F.includes(".") ? (p = !0, Rt = a[0], a.length = 0) : F.includes(`

`) && p && (g = !0), Rt || p || m ? (Rt && (F = ""), N = Rt ? Number(Rt) - 1 : N, L = Ac({
      chunkValue: F,
      textBlockIndex: O,
      stepIndex: N,
      isFollowupQuestion: m,
      followUpQuestionIndex: w,
      chatEntry: L
    }), g && (p = !1, g = !1, m = !1, N = 0, O++)) : L = xc({ chunkValue: F, textBlockIndex: O, chatEntry: L });
    const je = Tc(l.join(""));
    L = Cc({ citations: je, chatEntry: L }), n(L);
  }
}
function Cc({
  citations: i,
  chatEntry: t
}) {
  const e = t, n = (s, o) => {
    const l = i.find((a) => a.text === o);
    return l ? `<sup class="citation">${l.ref}</sup>` : s;
  }, r = e.text.map((s) => {
    var a;
    const o = s.value.replaceAll(/\[(.*?)]/g, n), l = (a = s.followingSteps) == null ? void 0 : a.map(
      (u) => u.replaceAll(/\[(.*?)]/g, n)
    );
    return {
      value: o,
      followingSteps: l
    };
  });
  return {
    ...e,
    text: r,
    citations: i
  };
}
function Tc(i) {
  const t = /\[(.*?)]/g, e = {};
  let n = 1;
  return i.replaceAll(t, (r, s) => {
    const o = s.trim();
    return e[o] || (e[o] = n++), "";
  }), Object.keys(e).map((r, s) => ({
    ref: s + 1,
    text: r
  }));
}
function xc({
  chunkValue: i,
  textBlockIndex: t,
  chatEntry: e
}) {
  const { text: n } = e, r = n[t] ?? {
    value: "",
    followingSteps: []
  }, s = (r.value || "") + i;
  return {
    ...e,
    text: fn(n, t, {
      ...r,
      value: s
    })
  };
}
function Ac({
  chunkValue: i,
  textBlockIndex: t,
  stepIndex: e,
  isFollowupQuestion: n,
  followUpQuestionIndex: r,
  chatEntry: s
}) {
  const { followupQuestions: o, text: l } = s;
  if (n && o) {
    const a = (o[r] || "") + i;
    return {
      ...s,
      followupQuestions: fn(o, r, a)
    };
  }
  if (l && l[t]) {
    const { followingSteps: a } = l[t];
    if (a) {
      const u = (a[e] || "") + i;
      return {
        ...s,
        text: fn(l, t, {
          ...l[t],
          followingSteps: fn(a, e, u)
        })
      };
    }
  }
  return s;
}
class kc {
  constructor(t) {
    this._generatingAnswer = !1, this._isAwaitingResponse = !1, this._isProcessingResponse = !1, this._processingMessage = void 0, this._abortController = new AbortController(), (this.host = t).addController(this);
  }
  get isAwaitingResponse() {
    return this._isAwaitingResponse;
  }
  get isProcessingResponse() {
    return this._isProcessingResponse;
  }
  get processingMessage() {
    return this._processingMessage;
  }
  get generatingAnswer() {
    return this._generatingAnswer;
  }
  set generatingAnswer(t) {
    this._generatingAnswer = t, this.host.requestUpdate();
  }
  set processingMessage(t) {
    this._processingMessage = t ? {
      ...t
    } : void 0, this.host.requestUpdate();
  }
  set isAwaitingResponse(t) {
    this._isAwaitingResponse = t, this.host.requestUpdate();
  }
  set isProcessingResponse(t) {
    this._isProcessingResponse = t, this.host.requestUpdate();
  }
  hostConnected() {
  }
  hostDisconnected() {
  }
  clear() {
    this._isAwaitingResponse = !1, this._isProcessingResponse = !1, this._generatingAnswer = !1, this.host.requestUpdate();
  }
  reset() {
    this._processingMessage = void 0, this.clear();
  }
  async processResponse(t, e = !1, n = !1) {
    var g, m, w;
    const r = [], s = [], o = [], l = Bl();
    let a, u;
    const p = async (N, O) => {
      this.processingMessage = {
        id: crypto.randomUUID(),
        text: [
          {
            value: O ? "" : N,
            followingSteps: s
          }
        ],
        followupQuestions: o,
        citations: [...new Set(r)],
        timestamp: l,
        isUserMessage: e,
        thoughts: a,
        dataPoints: u
      }, O && this.processingMessage && (this.isProcessingResponse = !0, this._abortController = new AbortController(), await wc({
        chatEntry: this.processingMessage,
        signal: this._abortController.signal,
        apiResponseBody: N.body,
        onChunkRead: (L) => {
          this.processingMessage = L;
        },
        onCancel: () => {
          this.clear();
        }
      }), this.clear());
    };
    if (e || typeof t == "string")
      await p(t, !1);
    else if (n)
      await p(t, !0);
    else {
      const N = t.choices[0].message, O = Hl(N.content, [r, s, o]), L = O.replacedText;
      r.push(...O.arrays[0]), s.push(...O.arrays[1]), o.push(...O.arrays[2]), a = ((g = N.context) == null ? void 0 : g.thoughts) ?? "", u = ((w = (m = N.context) == null ? void 0 : m.data_points) == null ? void 0 : w.text) ?? [], await p(L, !1);
    }
  }
  async generateAnswer(t, e) {
    const { question: n } = t;
    if (n)
      try {
        this.generatingAnswer = !0, t.type === "chat" && await this.processResponse(n, !0, !1), this.isAwaitingResponse = !0, this.processingMessage = void 0;
        const r = await _c(t, e);
        this.isAwaitingResponse = !1, await this.processResponse(r, !1, e.stream);
      } catch (r) {
        const s = r, o = {
          message: (s == null ? void 0 : s.code) === 400 ? B.INVALID_REQUEST_ERROR : B.API_ERROR_MESSAGE
        };
        this.processingMessage || await this.processResponse("", !1, !1), this.processingMessage && (this.processingMessage = {
          ...this.processingMessage,
          error: o
        });
      } finally {
        this.clear();
      }
  }
  cancelRequest() {
    this._abortController.abort();
  }
}
var Sc = Object.defineProperty, Ec = Object.getOwnPropertyDescriptor, at = (i, t, e, n) => {
  for (var r = n > 1 ? void 0 : n ? Ec(t, e) : t, s = i.length - 1, o; s >= 0; s--)
    (o = i[s]) && (r = (n ? o(t, e, r) : o(r)) || r);
  return n && r && Sc(t, e, r), r;
};
let nt = class extends yt {
  constructor() {
    super(), this.inputPosition = "sticky", this.isCustomBranding = B.IS_CUSTOM_BRANDING, this.useStream = ji.stream, this.approach = Ai.approach, this.overrides = {}, this.customStyles = {}, this.chatId = void 0, this.personalityId = void 0, this.currentQuestion = "", this.isDisabled = !1, this.isResetInput = !1, this.chatController = new kc(this), this.chatContext = new Ka(this), this.chatThread = [], this.setQuestionInputValue = this.setQuestionInputValue.bind(this), this.renderChatThread = this.renderChatThread.bind(this);
  }
  set interactionModel(i) {
    this.chatContext.interactionModel = i || "chat";
  }
  get interactionModel() {
    return this.chatContext.interactionModel;
  }
  set apiUrl(i) {
    this.chatContext.apiUrl = i;
  }
  get apiUrl() {
    return this.chatContext.apiUrl;
  }
  set isChatStarted(i) {
    this.chatContext.isChatStarted = i;
  }
  get isChatStarted() {
    return this.chatContext.isChatStarted;
  }
  // Lifecycle method that runs when the component is first connected to the DOM
  connectedCallback() {
    if (super.connectedCallback(), this.chatInputComponents)
      for (const i of this.chatInputComponents)
        i.attach(this, this.chatContext);
    if (this.chatInputFooterComponets)
      for (const i of this.chatInputFooterComponets)
        i.attach(this, this.chatContext);
    if (this.chatSectionControllers)
      for (const i of this.chatSectionControllers)
        i.attach(this, this.chatContext);
    if (this.chatActionControllers)
      for (const i of this.chatActionControllers)
        i.attach(this, this.chatContext);
    if (this.chatThreadControllers)
      for (const i of this.chatThreadControllers)
        i.attach(this, this.chatContext);
  }
  updated(i) {
    super.updated(i), i.has("customStyles") && (this.style.setProperty("--c-accent-high", this.customStyles.AccentHigh), this.style.setProperty("--c-accent-lighter", this.customStyles.AccentLight), this.style.setProperty("--c-accent-dark", this.customStyles.AccentDark), this.style.setProperty("--c-text-color", this.customStyles.TextColor), this.style.setProperty("--c-light-gray", this.customStyles.BackgroundColor), this.style.setProperty("--c-dark-gray", this.customStyles.ForegroundColor), this.style.setProperty("--c-base-gray", this.customStyles.FormBackgroundColor), this.style.setProperty("--radius-base", this.customStyles.BorderRadius), this.style.setProperty("--border-base", this.customStyles.BorderWidth), this.style.setProperty("--font-base", this.customStyles.FontBaseSize));
  }
  // Send the question to the Open AI API and render the answer in the chat
  setQuestionInputValue(i) {
    this.questionInput.value = Ts.sanitize(i || ""), this.currentQuestion = this.questionInput.value;
  }
  handleInput(i) {
    var t;
    i == null || i.preventDefault(), this.setQuestionInputValue((t = i == null ? void 0 : i.detail) == null ? void 0 : t.value);
  }
  handleCitationClick(i) {
    var n, r;
    i == null || i.preventDefault();
    const t = (n = i == null ? void 0 : i.detail) == null ? void 0 : n.citation, e = (r = i == null ? void 0 : i.detail) == null ? void 0 : r.chatThreadEntry;
    t && (this.chatContext.selectedCitation = t), e && (this.chatContext.selectedChatEntry = e), this.chatContext.setState("showCitations", !0);
  }
  getMessageContext() {
    if (this.interactionModel === "ask")
      return [];
    let i = [...this.chatThread];
    if (this.chatThreadControllers)
      for (const e of this.chatThreadControllers)
        i = e.merge(i);
    return i.map((e) => ({
      content: mo(e),
      role: e.isUserMessage ? "user" : "assistant"
    }));
  }
  // Handle the click on the chat button and send the question to the API
  async handleUserChatSubmit(i) {
    i.preventDefault(), this.collapseAside(i);
    const t = Ts.sanitize(this.questionInput.value);
    this.isChatStarted = !0, await this.chatController.generateAnswer(
      {
        ...Ai,
        approach: this.approach,
        overrides: {
          ...Ai.overrides,
          ...this.overrides
        },
        question: t,
        type: this.interactionModel,
        messages: this.getMessageContext()
      },
      {
        // use defaults
        ...ji,
        // override if the user has provided different values
        url: this.apiUrl,
        stream: this.useStream,
        chatId: this.chatId,
        personalityId: this.personalityId
      }
    ), this.interactionModel === "chat" && this.saveChatThreads(this.chatThread), this.questionInput.value = "", this.isResetInput = !1;
  }
  // Reset the input field and the current question
  resetInputField(i) {
    i.preventDefault(), this.questionInput.value = "", this.currentQuestion = "", this.isResetInput = !1;
  }
  saveChatThreads(i) {
    if (this.chatThreadControllers)
      for (const t of this.chatThreadControllers)
        t.save(i);
  }
  // Load existing messages into the chat thread
  loadMessages(i) {
    this.chatThread = i.map((t) => {
      const e = (/* @__PURE__ */ new Date()).toISOString();
      return {
        id: crypto.randomUUID(),
        text: [
          {
            value: t.content,
            followingSteps: []
          }
        ],
        citations: t.citations || [],
        followupQuestions: [],
        isUserMessage: t.role === "user",
        timestamp: e,
        thoughts: void 0,
        dataPoints: void 0
      };
    }), this.isChatStarted = this.chatThread.length > 0, this.requestUpdate();
  }
  // Reset the chat and show the default prompts
  resetCurrentChat(i) {
    this.isChatStarted = !1, this.chatThread = [], this.isDisabled = !1, this.chatContext.selectedCitation = void 0, this.chatController.reset(), this.saveChatThreads(this.chatThread), this.collapseAside(i), this.handleUserChatCancel(i);
  }
  // Handle the change event on the input field
  handleOnInputChange() {
    this.isResetInput = !!this.questionInput.value;
  }
  // Stop generation
  handleUserChatCancel(i) {
    i == null || i.preventDefault(), this.chatController.cancelRequest();
  }
  // hide thought process aside
  collapseAside(i) {
    if (i == null || i.preventDefault(), this.chatSectionControllers)
      for (const t of this.chatSectionControllers)
        t.close();
  }
  renderChatOrCancelButton() {
    const i = E`<button
      class="chatbox__button"
      data-testid="submit-question-button"
      @click="${this.handleUserChatSubmit}"
      title="${B.CHAT_BUTTON_LABEL_TEXT}"
      ?disabled="${this.isDisabled}"
    >
      ${jt(gc)}
    </button>`, t = E`<button
      class="chatbox__button"
      data-testid="cancel-question-button"
      @click="${this.handleUserChatCancel}"
      title="${B.CHAT_CANCEL_BUTTON_LABEL_TEXT}"
    >
      ${jt(fc)}
    </button>`;
    return this.chatController.isProcessingResponse ? t : i;
  }
  willUpdate() {
    if (this.isDisabled = this.chatController.generatingAnswer, this.chatController.processingMessage) {
      const i = this.chatController.processingMessage, t = this.chatThread.findIndex((e) => e.id === i.id);
      this.chatThread = t > -1 ? fn(this.chatThread, t, i) : [...this.chatThread, i];
    }
  }
  renderChatThread(i) {
    return E`<chat-thread-component
      .chatThread="${i}"
      .isDisabled="${this.isDisabled}"
      .isProcessingResponse="${this.chatController.isProcessingResponse}"
      .selectedCitation="${this.chatContext.selectedCitation}"
      .isCustomBranding="${this.isCustomBranding}"
      .svgIcon="${xs}"
      .context="${this.chatContext}"
      @on-citation-click="${this.handleCitationClick}"
      @on-input="${this.handleInput}"
    >
    </chat-thread-component>`;
  }
  renderChatInputComponents(i) {
    return this.isResetInput || this.chatInputComponents === void 0 ? "" : this.chatInputComponents.filter((t) => t.position === i).map((t) => t.render(this.setQuestionInputValue));
  }
  // Render the chat component as a web component
  render() {
    var t, e, n, r, s;
    const i = (t = this.chatSectionControllers) == null ? void 0 : t.some((o) => o.isEnabled);
    return E`
      <div id="overlay" class="overlay ${i ? "active" : ""}"></div>
      <section id="chat__containerWrapper" class="chat__containerWrapper ${i ? "aside-open" : ""}">
        ${this.isCustomBranding && !this.isChatStarted ? E` <chat-stage
              svgIcon="${xs}"
              pagetitle="${B.BRANDING_HEADLINE}"
              url="${B.BRANDING_URL}"
            >
            </chat-stage>` : ""}
        <section class="chat__container" id="chat-container">
          ${this.isChatStarted ? E`
                <div class="chat__header--thread">
                  ${(e = this.chatActionControllers) == null ? void 0 : e.map((o) => o.render(this.isDisabled))}
                  <chat-action-button
                    .label="${B.RESET_CHAT_BUTTON_TITLE}"
                    actionId="chat-reset-button"
                    @click="${this.resetCurrentChat}"
                    .svgIcon="${pc}"
                  >
                  </chat-action-button>
                </div>
                ${(n = this.chatThreadControllers) == null ? void 0 : n.map((o) => o.render(this.renderChatThread))}
                ${this.renderChatThread(this.chatThread)}
              ` : ""}
          ${this.chatController.isAwaitingResponse ? E`<loading-indicator label="${B.LOADING_INDICATOR_TEXT}"></loading-indicator>` : ""}
          <!-- Teaser List with Default Prompts -->
          <div class="chat__container">${this.renderChatInputComponents("top")}</div>
          <form
            id="chat-form"
            class="form__container ${this.inputPosition === "sticky" ? "form__container-sticky" : ""}"
          >
            <div class="chatbox__container container-col container-row">
              <div class="chatbox__input-container display-flex-grow container-row">
                ${this.renderChatInputComponents("left")}
                <input
                  class="chatbox__input display-flex-grow"
                  data-testid="question-input"
                  id="question-input"
                  placeholder="${B.CHAT_INPUT_PLACEHOLDER}"
                  aria-labelledby="chatbox-label"
                  id="chatbox"
                  name="chatbox"
                  type="text"
                  :value=""
                  ?disabled="${this.isDisabled}"
                  autocomplete="off"
                  @keyup="${this.handleOnInputChange}"
                />
                ${this.renderChatInputComponents("right")}
              </div>
              ${this.renderChatOrCancelButton()}
              <button
                title="${B.RESET_BUTTON_TITLE_TEXT}"
                class="chatbox__button--reset"
                .hidden="${!this.isResetInput}"
                type="reset"
                id="resetBtn"
                title="Clear input"
                @click="${this.resetInputField}"
              >
                ${B.RESET_BUTTON_LABEL_TEXT}
              </button>
            </div>

            ${(r = this.chatInputFooterComponets) == null ? void 0 : r.map(
      (o) => o.render(this.resetCurrentChat, this.isChatStarted)
    )}
          </form>
        </section>
        ${i ? (s = this.chatSectionControllers) == null ? void 0 : s.map((o) => o.render()) : ""}
      </section>
    `;
  }
};
nt.styles = [dc];
at([
  D({ type: String, attribute: "data-input-position" })
], nt.prototype, "inputPosition", 2);
at([
  D({ type: String, attribute: "data-interaction-model" })
], nt.prototype, "interactionModel", 1);
at([
  D({ type: String, attribute: "data-api-url" })
], nt.prototype, "apiUrl", 1);
at([
  D({ type: String, attribute: "data-custom-branding", converter: (i) => (i == null ? void 0 : i.toLowerCase()) === "true" })
], nt.prototype, "isCustomBranding", 2);
at([
  D({ type: String, attribute: "data-use-stream", converter: (i) => (i == null ? void 0 : i.toLowerCase()) === "true" })
], nt.prototype, "useStream", 2);
at([
  D({ type: String, attribute: "data-approach" })
], nt.prototype, "approach", 2);
at([
  D({ type: String, attribute: "data-overrides", converter: (i) => JSON.parse(i || "{}") })
], nt.prototype, "overrides", 2);
at([
  D({ type: String, attribute: "data-custom-styles", converter: (i) => JSON.parse(i || "{}") })
], nt.prototype, "customStyles", 2);
at([
  D({ type: String, attribute: "data-chat-id" })
], nt.prototype, "chatId", 2);
at([
  D({ type: String, attribute: "data-personality-id" })
], nt.prototype, "personalityId", 2);
at([
  D({ type: String })
], nt.prototype, "currentQuestion", 2);
at([
  Ls("#question-input")
], nt.prototype, "questionInput", 2);
at([
  ke()
], nt.prototype, "isDisabled", 2);
at([
  ke()
], nt.prototype, "isResetInput", 2);
at([
  he(W.ChatInput)
], nt.prototype, "chatInputComponents", 2);
at([
  he(W.ChatInputFooter)
], nt.prototype, "chatInputFooterComponets", 2);
at([
  he(W.ChatSection)
], nt.prototype, "chatSectionControllers", 2);
at([
  he(W.ChatAction)
], nt.prototype, "chatActionControllers", 2);
at([
  he(W.ChatThread)
], nt.prototype, "chatThreadControllers", 2);
nt = at([
  Nt("chat-component")
], nt);
export {
  nt as ChatComponent,
  nr as ChatResponseError,
  At as ComposableReactiveControllerBase,
  W as ControllerType,
  Vi as DefaultChatSectionController,
  Gi as DefaultChatThreadController,
  ie as DefaultController,
  qi as DefaultInputController,
  mc as callHttpApi,
  qc as cancelStream,
  mo as chatEntryToString,
  Ul as cleanUpFollowUp,
  lt as container,
  vc as createReader,
  _c as getAPIResponse,
  Bl as getTimestamp,
  he as lazyMultiInject,
  fn as newListWithEntryAtIndex,
  Tc as parseCitations,
  wc as parseStreamedMessages,
  Hl as processText,
  bc as readStream,
  Cc as updateCitationsEntry,
  Ac as updateFollowingStepOrFollowupQuestionEntry,
  xc as updateTextEntry
};
