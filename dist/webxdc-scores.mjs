const W = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", ee = "ARRAYBUFFER not supported by this environment", te = "UINT8ARRAY not supported by this environment";
function z(s, e, n, t) {
  let i, h, c;
  const l = e || [0], w = (n = n || 0) >>> 3, a = t === -1 ? 3 : 0;
  for (i = 0; i < s.length; i += 1) c = i + w, h = c >>> 2, l.length <= h && l.push(0), l[h] |= s[i] << 8 * (a + t * (c % 4));
  return { value: l, binLen: 8 * s.length + n };
}
function C(s, e, n) {
  switch (e) {
    case "UTF8":
    case "UTF16BE":
    case "UTF16LE":
      break;
    default:
      throw new Error("encoding must be UTF8, UTF16BE, or UTF16LE");
  }
  switch (s) {
    case "HEX":
      return function(t, i, h) {
        return function(c, l, w, a) {
          let f, o, u, m;
          if (c.length % 2 != 0) throw new Error("String of HEX type must be in byte increments");
          const A = l || [0], N = (w = w || 0) >>> 3, g = a === -1 ? 3 : 0;
          for (f = 0; f < c.length; f += 2) {
            if (o = parseInt(c.substr(f, 2), 16), isNaN(o)) throw new Error("String of HEX type contains invalid characters");
            for (m = (f >>> 1) + N, u = m >>> 2; A.length <= u; ) A.push(0);
            A[u] |= o << 8 * (g + a * (m % 4));
          }
          return { value: A, binLen: 4 * c.length + w };
        }(t, i, h, n);
      };
    case "TEXT":
      return function(t, i, h) {
        return function(c, l, w, a, f) {
          let o, u, m, A, N, g, b, I, H = 0;
          const E = w || [0], v = (a = a || 0) >>> 3;
          if (l === "UTF8") for (b = f === -1 ? 3 : 0, m = 0; m < c.length; m += 1) for (o = c.charCodeAt(m), u = [], 128 > o ? u.push(o) : 2048 > o ? (u.push(192 | o >>> 6), u.push(128 | 63 & o)) : 55296 > o || 57344 <= o ? u.push(224 | o >>> 12, 128 | o >>> 6 & 63, 128 | 63 & o) : (m += 1, o = 65536 + ((1023 & o) << 10 | 1023 & c.charCodeAt(m)), u.push(240 | o >>> 18, 128 | o >>> 12 & 63, 128 | o >>> 6 & 63, 128 | 63 & o)), A = 0; A < u.length; A += 1) {
            for (g = H + v, N = g >>> 2; E.length <= N; ) E.push(0);
            E[N] |= u[A] << 8 * (b + f * (g % 4)), H += 1;
          }
          else for (b = f === -1 ? 2 : 0, I = l === "UTF16LE" && f !== 1 || l !== "UTF16LE" && f === 1, m = 0; m < c.length; m += 1) {
            for (o = c.charCodeAt(m), I === !0 && (A = 255 & o, o = A << 8 | o >>> 8), g = H + v, N = g >>> 2; E.length <= N; ) E.push(0);
            E[N] |= o << 8 * (b + f * (g % 4)), H += 2;
          }
          return { value: E, binLen: 8 * H + a };
        }(t, e, i, h, n);
      };
    case "B64":
      return function(t, i, h) {
        return function(c, l, w, a) {
          let f, o, u, m, A, N, g, b = 0;
          const I = l || [0], H = (w = w || 0) >>> 3, E = a === -1 ? 3 : 0, v = c.indexOf("=");
          if (c.search(/^[a-zA-Z0-9=+/]+$/) === -1) throw new Error("Invalid character in base-64 string");
          if (c = c.replace(/=/g, ""), v !== -1 && v < c.length) throw new Error("Invalid '=' found in base-64 string");
          for (o = 0; o < c.length; o += 4) {
            for (A = c.substr(o, 4), m = 0, u = 0; u < A.length; u += 1) f = W.indexOf(A.charAt(u)), m |= f << 18 - 6 * u;
            for (u = 0; u < A.length - 1; u += 1) {
              for (g = b + H, N = g >>> 2; I.length <= N; ) I.push(0);
              I[N] |= (m >>> 16 - 8 * u & 255) << 8 * (E + a * (g % 4)), b += 1;
            }
          }
          return { value: I, binLen: 8 * b + w };
        }(t, i, h, n);
      };
    case "BYTES":
      return function(t, i, h) {
        return function(c, l, w, a) {
          let f, o, u, m;
          const A = l || [0], N = (w = w || 0) >>> 3, g = a === -1 ? 3 : 0;
          for (o = 0; o < c.length; o += 1) f = c.charCodeAt(o), m = o + N, u = m >>> 2, A.length <= u && A.push(0), A[u] |= f << 8 * (g + a * (m % 4));
          return { value: A, binLen: 8 * c.length + w };
        }(t, i, h, n);
      };
    case "ARRAYBUFFER":
      try {
        new ArrayBuffer(0);
      } catch {
        throw new Error(ee);
      }
      return function(t, i, h) {
        return function(c, l, w, a) {
          return z(new Uint8Array(c), l, w, a);
        }(t, i, h, n);
      };
    case "UINT8ARRAY":
      try {
        new Uint8Array(0);
      } catch {
        throw new Error(te);
      }
      return function(t, i, h) {
        return z(t, i, h, n);
      };
    default:
      throw new Error("format must be HEX, TEXT, B64, BYTES, ARRAYBUFFER, or UINT8ARRAY");
  }
}
function $(s, e, n, t) {
  switch (s) {
    case "HEX":
      return function(i) {
        return function(h, c, l, w) {
          const a = "0123456789abcdef";
          let f, o, u = "";
          const m = c / 8, A = l === -1 ? 3 : 0;
          for (f = 0; f < m; f += 1) o = h[f >>> 2] >>> 8 * (A + l * (f % 4)), u += a.charAt(o >>> 4 & 15) + a.charAt(15 & o);
          return w.outputUpper ? u.toUpperCase() : u;
        }(i, e, n, t);
      };
    case "B64":
      return function(i) {
        return function(h, c, l, w) {
          let a, f, o, u, m, A = "";
          const N = c / 8, g = l === -1 ? 3 : 0;
          for (a = 0; a < N; a += 3) for (u = a + 1 < N ? h[a + 1 >>> 2] : 0, m = a + 2 < N ? h[a + 2 >>> 2] : 0, o = (h[a >>> 2] >>> 8 * (g + l * (a % 4)) & 255) << 16 | (u >>> 8 * (g + l * ((a + 1) % 4)) & 255) << 8 | m >>> 8 * (g + l * ((a + 2) % 4)) & 255, f = 0; f < 4; f += 1) A += 8 * a + 6 * f <= c ? W.charAt(o >>> 6 * (3 - f) & 63) : w.b64Pad;
          return A;
        }(i, e, n, t);
      };
    case "BYTES":
      return function(i) {
        return function(h, c, l) {
          let w, a, f = "";
          const o = c / 8, u = l === -1 ? 3 : 0;
          for (w = 0; w < o; w += 1) a = h[w >>> 2] >>> 8 * (u + l * (w % 4)) & 255, f += String.fromCharCode(a);
          return f;
        }(i, e, n);
      };
    case "ARRAYBUFFER":
      try {
        new ArrayBuffer(0);
      } catch {
        throw new Error(ee);
      }
      return function(i) {
        return function(h, c, l) {
          let w;
          const a = c / 8, f = new ArrayBuffer(a), o = new Uint8Array(f), u = l === -1 ? 3 : 0;
          for (w = 0; w < a; w += 1) o[w] = h[w >>> 2] >>> 8 * (u + l * (w % 4)) & 255;
          return f;
        }(i, e, n);
      };
    case "UINT8ARRAY":
      try {
        new Uint8Array(0);
      } catch {
        throw new Error(te);
      }
      return function(i) {
        return function(h, c, l) {
          let w;
          const a = c / 8, f = l === -1 ? 3 : 0, o = new Uint8Array(a);
          for (w = 0; w < a; w += 1) o[w] = h[w >>> 2] >>> 8 * (f + l * (w % 4)) & 255;
          return o;
        }(i, e, n);
      };
    default:
      throw new Error("format must be HEX, B64, BYTES, ARRAYBUFFER, or UINT8ARRAY");
  }
}
const k = 4294967296, p = [1116352408, 1899447441, 3049323471, 3921009573, 961987163, 1508970993, 2453635748, 2870763221, 3624381080, 310598401, 607225278, 1426881987, 1925078388, 2162078206, 2614888103, 3248222580, 3835390401, 4022224774, 264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986, 2554220882, 2821834349, 2952996808, 3210313671, 3336571891, 3584528711, 113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291, 1695183700, 1986661051, 2177026350, 2456956037, 2730485921, 2820302411, 3259730800, 3345764771, 3516065817, 3600352804, 4094571909, 275423344, 430227734, 506948616, 659060556, 883997877, 958139571, 1322822218, 1537002063, 1747873779, 1955562222, 2024104815, 2227730452, 2361852424, 2428436474, 2756734187, 3204031479, 3329325298], L = [3238371032, 914150663, 812702999, 4144912697, 4290775857, 1750603025, 1694076839, 3204075428], U = [1779033703, 3144134277, 1013904242, 2773480762, 1359893119, 2600822924, 528734635, 1541459225], B = "Chosen SHA variant is not supported", ne = "Cannot set numRounds with MAC";
function P(s, e) {
  let n, t;
  const i = s.binLen >>> 3, h = e.binLen >>> 3, c = i << 3, l = 4 - i << 3;
  if (i % 4 != 0) {
    for (n = 0; n < h; n += 4) t = i + n >>> 2, s.value[t] |= e.value[n >>> 2] << c, s.value.push(0), s.value[t + 1] |= e.value[n >>> 2] >>> l;
    return (s.value.length << 2) - 4 >= h + i && s.value.pop(), { value: s.value, binLen: s.binLen + e.binLen };
  }
  return { value: s.value.concat(e.value), binLen: s.binLen + e.binLen };
}
function j(s) {
  const e = { outputUpper: !1, b64Pad: "=", outputLen: -1 }, n = s || {}, t = "Output length must be a multiple of 8";
  if (e.outputUpper = n.outputUpper || !1, n.b64Pad && (e.b64Pad = n.b64Pad), n.outputLen) {
    if (n.outputLen % 8 != 0) throw new Error(t);
    e.outputLen = n.outputLen;
  } else if (n.shakeLen) {
    if (n.shakeLen % 8 != 0) throw new Error(t);
    e.outputLen = n.shakeLen;
  }
  if (typeof e.outputUpper != "boolean") throw new Error("Invalid outputUpper formatting option");
  if (typeof e.b64Pad != "string") throw new Error("Invalid b64Pad formatting option");
  return e;
}
function K(s, e, n, t) {
  const i = s + " must include a value and format";
  if (!e) {
    if (!t) throw new Error(i);
    return t;
  }
  if (e.value === void 0 || !e.format) throw new Error(i);
  return C(e.format, e.encoding || "UTF8", n)(e.value);
}
class O {
  constructor(e, n, t) {
    const i = t || {};
    if (this.t = n, this.i = i.encoding || "UTF8", this.numRounds = i.numRounds || 1, isNaN(this.numRounds) || this.numRounds !== parseInt(this.numRounds, 10) || 1 > this.numRounds) throw new Error("numRounds must a integer >= 1");
    this.o = e, this.h = [], this.u = 0, this.l = !1, this.A = 0, this.H = !1, this.S = [], this.p = [];
  }
  update(e) {
    let n, t = 0;
    const i = this.m >>> 5, h = this.C(e, this.h, this.u), c = h.binLen, l = h.value, w = c >>> 5;
    for (n = 0; n < w; n += i) t + this.m <= c && (this.U = this.v(l.slice(n, n + i), this.U), t += this.m);
    return this.A += t, this.h = l.slice(t >>> 5), this.u = c % this.m, this.l = !0, this;
  }
  getHash(e, n) {
    let t, i, h = this.R;
    const c = j(n);
    if (this.K) {
      if (c.outputLen === -1) throw new Error("Output length must be specified in options");
      h = c.outputLen;
    }
    const l = $(e, h, this.T, c);
    if (this.H && this.g) return l(this.g(c));
    for (i = this.F(this.h.slice(), this.u, this.A, this.L(this.U), h), t = 1; t < this.numRounds; t += 1) this.K && h % 32 != 0 && (i[i.length - 1] &= 16777215 >>> 24 - h % 32), i = this.F(i, h, 0, this.B(this.o), h);
    return l(i);
  }
  setHMACKey(e, n, t) {
    if (!this.M) throw new Error("Variant does not support HMAC");
    if (this.l) throw new Error("Cannot set MAC key after calling update");
    const i = C(n, (t || {}).encoding || "UTF8", this.T);
    this.k(i(e));
  }
  k(e) {
    const n = this.m >>> 3, t = n / 4 - 1;
    let i;
    if (this.numRounds !== 1) throw new Error(ne);
    if (this.H) throw new Error("MAC key already set");
    for (n < e.binLen / 8 && (e.value = this.F(e.value, e.binLen, 0, this.B(this.o), this.R)); e.value.length <= t; ) e.value.push(0);
    for (i = 0; i <= t; i += 1) this.S[i] = 909522486 ^ e.value[i], this.p[i] = 1549556828 ^ e.value[i];
    this.U = this.v(this.S, this.U), this.A = this.m, this.H = !0;
  }
  getHMAC(e, n) {
    const t = j(n);
    return $(e, this.R, this.T, t)(this.Y());
  }
  Y() {
    let e;
    if (!this.H) throw new Error("Cannot call getHMAC without first setting MAC key");
    const n = this.F(this.h.slice(), this.u, this.A, this.L(this.U), this.R);
    return e = this.v(this.p, this.B(this.o)), e = this.F(n, this.R, this.m, e, this.R), e;
  }
}
function T(s, e) {
  return s << e | s >>> 32 - e;
}
function R(s, e) {
  return s >>> e | s << 32 - e;
}
function se(s, e) {
  return s >>> e;
}
function J(s, e, n) {
  return s ^ e ^ n;
}
function ie(s, e, n) {
  return s & e ^ ~s & n;
}
function re(s, e, n) {
  return s & e ^ s & n ^ e & n;
}
function ae(s) {
  return R(s, 2) ^ R(s, 13) ^ R(s, 22);
}
function d(s, e) {
  const n = (65535 & s) + (65535 & e);
  return (65535 & (s >>> 16) + (e >>> 16) + (n >>> 16)) << 16 | 65535 & n;
}
function we(s, e, n, t) {
  const i = (65535 & s) + (65535 & e) + (65535 & n) + (65535 & t);
  return (65535 & (s >>> 16) + (e >>> 16) + (n >>> 16) + (t >>> 16) + (i >>> 16)) << 16 | 65535 & i;
}
function M(s, e, n, t, i) {
  const h = (65535 & s) + (65535 & e) + (65535 & n) + (65535 & t) + (65535 & i);
  return (65535 & (s >>> 16) + (e >>> 16) + (n >>> 16) + (t >>> 16) + (i >>> 16) + (h >>> 16)) << 16 | 65535 & h;
}
function fe(s) {
  return R(s, 7) ^ R(s, 18) ^ se(s, 3);
}
function le(s) {
  return R(s, 6) ^ R(s, 11) ^ R(s, 25);
}
function me(s) {
  return [1732584193, 4023233417, 2562383102, 271733878, 3285377520];
}
function oe(s, e) {
  let n, t, i, h, c, l, w;
  const a = [];
  for (n = e[0], t = e[1], i = e[2], h = e[3], c = e[4], w = 0; w < 80; w += 1) a[w] = w < 16 ? s[w] : T(a[w - 3] ^ a[w - 8] ^ a[w - 14] ^ a[w - 16], 1), l = w < 20 ? M(T(n, 5), ie(t, i, h), c, 1518500249, a[w]) : w < 40 ? M(T(n, 5), J(t, i, h), c, 1859775393, a[w]) : w < 60 ? M(T(n, 5), re(t, i, h), c, 2400959708, a[w]) : M(T(n, 5), J(t, i, h), c, 3395469782, a[w]), c = h, h = i, i = T(t, 30), t = n, n = l;
  return e[0] = d(n, e[0]), e[1] = d(t, e[1]), e[2] = d(i, e[2]), e[3] = d(h, e[3]), e[4] = d(c, e[4]), e;
}
function pe(s, e, n, t) {
  let i;
  const h = 15 + (e + 65 >>> 9 << 4), c = e + n;
  for (; s.length <= h; ) s.push(0);
  for (s[e >>> 5] |= 128 << 24 - e % 32, s[h] = 4294967295 & c, s[h - 1] = c / k | 0, i = 0; i < s.length; i += 16) t = oe(s.slice(i, i + 16), t);
  return t;
}
let Ae = class extends O {
  constructor(s, e, n) {
    if (s !== "SHA-1") throw new Error(B);
    super(s, e, n);
    const t = n || {};
    this.M = !0, this.g = this.Y, this.T = -1, this.C = C(this.t, this.i, this.T), this.v = oe, this.L = function(i) {
      return i.slice();
    }, this.B = me, this.F = pe, this.U = [1732584193, 4023233417, 2562383102, 271733878, 3285377520], this.m = 512, this.R = 160, this.K = !1, t.hmacKey && this.k(K("hmacKey", t.hmacKey, this.T));
  }
};
function D(s) {
  let e;
  return e = s == "SHA-224" ? L.slice() : U.slice(), e;
}
function V(s, e) {
  let n, t, i, h, c, l, w, a, f, o, u;
  const m = [];
  for (n = e[0], t = e[1], i = e[2], h = e[3], c = e[4], l = e[5], w = e[6], a = e[7], u = 0; u < 64; u += 1) m[u] = u < 16 ? s[u] : we(R(A = m[u - 2], 17) ^ R(A, 19) ^ se(A, 10), m[u - 7], fe(m[u - 15]), m[u - 16]), f = M(a, le(c), ie(c, l, w), p[u], m[u]), o = d(ae(n), re(n, t, i)), a = w, w = l, l = c, c = d(h, f), h = i, i = t, t = n, n = d(f, o);
  var A;
  return e[0] = d(n, e[0]), e[1] = d(t, e[1]), e[2] = d(i, e[2]), e[3] = d(h, e[3]), e[4] = d(c, e[4]), e[5] = d(l, e[5]), e[6] = d(w, e[6]), e[7] = d(a, e[7]), e;
}
let Ne = class extends O {
  constructor(s, e, n) {
    if (s !== "SHA-224" && s !== "SHA-256") throw new Error(B);
    super(s, e, n);
    const t = n || {};
    this.g = this.Y, this.M = !0, this.T = -1, this.C = C(this.t, this.i, this.T), this.v = V, this.L = function(i) {
      return i.slice();
    }, this.B = D, this.F = function(i, h, c, l) {
      return function(w, a, f, o, u) {
        let m, A;
        const N = 15 + (a + 65 >>> 9 << 4), g = a + f;
        for (; w.length <= N; ) w.push(0);
        for (w[a >>> 5] |= 128 << 24 - a % 32, w[N] = 4294967295 & g, w[N - 1] = g / k | 0, m = 0; m < w.length; m += 16) o = V(w.slice(m, m + 16), o);
        return A = u === "SHA-224" ? [o[0], o[1], o[2], o[3], o[4], o[5], o[6]] : o, A;
      }(i, h, c, l, s);
    }, this.U = D(s), this.m = 512, this.R = s === "SHA-224" ? 224 : 256, this.K = !1, t.hmacKey && this.k(K("hmacKey", t.hmacKey, this.T));
  }
};
class r {
  constructor(e, n) {
    this.N = e, this.I = n;
  }
}
function Z(s, e) {
  let n;
  return e > 32 ? (n = 64 - e, new r(s.I << e | s.N >>> n, s.N << e | s.I >>> n)) : e !== 0 ? (n = 32 - e, new r(s.N << e | s.I >>> n, s.I << e | s.N >>> n)) : s;
}
function y(s, e) {
  let n;
  return e < 32 ? (n = 32 - e, new r(s.N >>> e | s.I << n, s.I >>> e | s.N << n)) : (n = 64 - e, new r(s.I >>> e | s.N << n, s.N >>> e | s.I << n));
}
function he(s, e) {
  return new r(s.N >>> e, s.I >>> e | s.N << 32 - e);
}
function ge(s, e, n) {
  return new r(s.N & e.N ^ s.N & n.N ^ e.N & n.N, s.I & e.I ^ s.I & n.I ^ e.I & n.I);
}
function Ie(s) {
  const e = y(s, 28), n = y(s, 34), t = y(s, 39);
  return new r(e.N ^ n.N ^ t.N, e.I ^ n.I ^ t.I);
}
function S(s, e) {
  let n, t;
  n = (65535 & s.I) + (65535 & e.I), t = (s.I >>> 16) + (e.I >>> 16) + (n >>> 16);
  const i = (65535 & t) << 16 | 65535 & n;
  return n = (65535 & s.N) + (65535 & e.N) + (t >>> 16), t = (s.N >>> 16) + (e.N >>> 16) + (n >>> 16), new r((65535 & t) << 16 | 65535 & n, i);
}
function de(s, e, n, t) {
  let i, h;
  i = (65535 & s.I) + (65535 & e.I) + (65535 & n.I) + (65535 & t.I), h = (s.I >>> 16) + (e.I >>> 16) + (n.I >>> 16) + (t.I >>> 16) + (i >>> 16);
  const c = (65535 & h) << 16 | 65535 & i;
  return i = (65535 & s.N) + (65535 & e.N) + (65535 & n.N) + (65535 & t.N) + (h >>> 16), h = (s.N >>> 16) + (e.N >>> 16) + (n.N >>> 16) + (t.N >>> 16) + (i >>> 16), new r((65535 & h) << 16 | 65535 & i, c);
}
function be(s, e, n, t, i) {
  let h, c;
  h = (65535 & s.I) + (65535 & e.I) + (65535 & n.I) + (65535 & t.I) + (65535 & i.I), c = (s.I >>> 16) + (e.I >>> 16) + (n.I >>> 16) + (t.I >>> 16) + (i.I >>> 16) + (h >>> 16);
  const l = (65535 & c) << 16 | 65535 & h;
  return h = (65535 & s.N) + (65535 & e.N) + (65535 & n.N) + (65535 & t.N) + (65535 & i.N) + (c >>> 16), c = (s.N >>> 16) + (e.N >>> 16) + (n.N >>> 16) + (t.N >>> 16) + (i.N >>> 16) + (h >>> 16), new r((65535 & c) << 16 | 65535 & h, l);
}
function F(s, e) {
  return new r(s.N ^ e.N, s.I ^ e.I);
}
function Ee(s) {
  const e = y(s, 19), n = y(s, 61), t = he(s, 6);
  return new r(e.N ^ n.N ^ t.N, e.I ^ n.I ^ t.I);
}
function He(s) {
  const e = y(s, 1), n = y(s, 8), t = he(s, 7);
  return new r(e.N ^ n.N ^ t.N, e.I ^ n.I ^ t.I);
}
function ve(s) {
  const e = y(s, 14), n = y(s, 18), t = y(s, 41);
  return new r(e.N ^ n.N ^ t.N, e.I ^ n.I ^ t.I);
}
const Se = [new r(p[0], 3609767458), new r(p[1], 602891725), new r(p[2], 3964484399), new r(p[3], 2173295548), new r(p[4], 4081628472), new r(p[5], 3053834265), new r(p[6], 2937671579), new r(p[7], 3664609560), new r(p[8], 2734883394), new r(p[9], 1164996542), new r(p[10], 1323610764), new r(p[11], 3590304994), new r(p[12], 4068182383), new r(p[13], 991336113), new r(p[14], 633803317), new r(p[15], 3479774868), new r(p[16], 2666613458), new r(p[17], 944711139), new r(p[18], 2341262773), new r(p[19], 2007800933), new r(p[20], 1495990901), new r(p[21], 1856431235), new r(p[22], 3175218132), new r(p[23], 2198950837), new r(p[24], 3999719339), new r(p[25], 766784016), new r(p[26], 2566594879), new r(p[27], 3203337956), new r(p[28], 1034457026), new r(p[29], 2466948901), new r(p[30], 3758326383), new r(p[31], 168717936), new r(p[32], 1188179964), new r(p[33], 1546045734), new r(p[34], 1522805485), new r(p[35], 2643833823), new r(p[36], 2343527390), new r(p[37], 1014477480), new r(p[38], 1206759142), new r(p[39], 344077627), new r(p[40], 1290863460), new r(p[41], 3158454273), new r(p[42], 3505952657), new r(p[43], 106217008), new r(p[44], 3606008344), new r(p[45], 1432725776), new r(p[46], 1467031594), new r(p[47], 851169720), new r(p[48], 3100823752), new r(p[49], 1363258195), new r(p[50], 3750685593), new r(p[51], 3785050280), new r(p[52], 3318307427), new r(p[53], 3812723403), new r(p[54], 2003034995), new r(p[55], 3602036899), new r(p[56], 1575990012), new r(p[57], 1125592928), new r(p[58], 2716904306), new r(p[59], 442776044), new r(p[60], 593698344), new r(p[61], 3733110249), new r(p[62], 2999351573), new r(p[63], 3815920427), new r(3391569614, 3928383900), new r(3515267271, 566280711), new r(3940187606, 3454069534), new r(4118630271, 4000239992), new r(116418474, 1914138554), new r(174292421, 2731055270), new r(289380356, 3203993006), new r(460393269, 320620315), new r(685471733, 587496836), new r(852142971, 1086792851), new r(1017036298, 365543100), new r(1126000580, 2618297676), new r(1288033470, 3409855158), new r(1501505948, 4234509866), new r(1607167915, 987167468), new r(1816402316, 1246189591)];
function q(s) {
  return s === "SHA-384" ? [new r(3418070365, L[0]), new r(1654270250, L[1]), new r(2438529370, L[2]), new r(355462360, L[3]), new r(1731405415, L[4]), new r(41048885895, L[5]), new r(3675008525, L[6]), new r(1203062813, L[7])] : [new r(U[0], 4089235720), new r(U[1], 2227873595), new r(U[2], 4271175723), new r(U[3], 1595750129), new r(U[4], 2917565137), new r(U[5], 725511199), new r(U[6], 4215389547), new r(U[7], 327033209)];
}
function G(s, e) {
  let n, t, i, h, c, l, w, a, f, o, u, m;
  const A = [];
  for (n = e[0], t = e[1], i = e[2], h = e[3], c = e[4], l = e[5], w = e[6], a = e[7], u = 0; u < 80; u += 1) u < 16 ? (m = 2 * u, A[u] = new r(s[m], s[m + 1])) : A[u] = de(Ee(A[u - 2]), A[u - 7], He(A[u - 15]), A[u - 16]), f = be(a, ve(c), (g = l, b = w, new r((N = c).N & g.N ^ ~N.N & b.N, N.I & g.I ^ ~N.I & b.I)), Se[u], A[u]), o = S(Ie(n), ge(n, t, i)), a = w, w = l, l = c, c = S(h, f), h = i, i = t, t = n, n = S(f, o);
  var N, g, b;
  return e[0] = S(n, e[0]), e[1] = S(t, e[1]), e[2] = S(i, e[2]), e[3] = S(h, e[3]), e[4] = S(c, e[4]), e[5] = S(l, e[5]), e[6] = S(w, e[6]), e[7] = S(a, e[7]), e;
}
let Re = class extends O {
  constructor(s, e, n) {
    if (s !== "SHA-384" && s !== "SHA-512") throw new Error(B);
    super(s, e, n);
    const t = n || {};
    this.g = this.Y, this.M = !0, this.T = -1, this.C = C(this.t, this.i, this.T), this.v = G, this.L = function(i) {
      return i.slice();
    }, this.B = q, this.F = function(i, h, c, l) {
      return function(w, a, f, o, u) {
        let m, A;
        const N = 31 + (a + 129 >>> 10 << 5), g = a + f;
        for (; w.length <= N; ) w.push(0);
        for (w[a >>> 5] |= 128 << 24 - a % 32, w[N] = 4294967295 & g, w[N - 1] = g / k | 0, m = 0; m < w.length; m += 32) o = G(w.slice(m, m + 32), o);
        return A = u === "SHA-384" ? [o[0].N, o[0].I, o[1].N, o[1].I, o[2].N, o[2].I, o[3].N, o[3].I, o[4].N, o[4].I, o[5].N, o[5].I] : [o[0].N, o[0].I, o[1].N, o[1].I, o[2].N, o[2].I, o[3].N, o[3].I, o[4].N, o[4].I, o[5].N, o[5].I, o[6].N, o[6].I, o[7].N, o[7].I], A;
      }(i, h, c, l, s);
    }, this.U = q(s), this.m = 1024, this.R = s === "SHA-384" ? 384 : 512, this.K = !1, t.hmacKey && this.k(K("hmacKey", t.hmacKey, this.T));
  }
};
const ye = [new r(0, 1), new r(0, 32898), new r(2147483648, 32906), new r(2147483648, 2147516416), new r(0, 32907), new r(0, 2147483649), new r(2147483648, 2147516545), new r(2147483648, 32777), new r(0, 138), new r(0, 136), new r(0, 2147516425), new r(0, 2147483658), new r(0, 2147516555), new r(2147483648, 139), new r(2147483648, 32905), new r(2147483648, 32771), new r(2147483648, 32770), new r(2147483648, 128), new r(0, 32778), new r(2147483648, 2147483658), new r(2147483648, 2147516545), new r(2147483648, 32896), new r(0, 2147483649), new r(2147483648, 2147516424)], Le = [[0, 36, 3, 41, 18], [1, 44, 10, 45, 2], [62, 6, 43, 15, 61], [28, 55, 25, 21, 56], [27, 20, 39, 8, 14]];
function _(s) {
  let e;
  const n = [];
  for (e = 0; e < 5; e += 1) n[e] = [new r(0, 0), new r(0, 0), new r(0, 0), new r(0, 0), new r(0, 0)];
  return n;
}
function Ue(s) {
  let e;
  const n = [];
  for (e = 0; e < 5; e += 1) n[e] = s[e].slice();
  return n;
}
function x(s, e) {
  let n, t, i, h;
  const c = [], l = [];
  if (s !== null) for (t = 0; t < s.length; t += 2) e[(t >>> 1) % 5][(t >>> 1) / 5 | 0] = F(e[(t >>> 1) % 5][(t >>> 1) / 5 | 0], new r(s[t + 1], s[t]));
  for (n = 0; n < 24; n += 1) {
    for (h = _(), t = 0; t < 5; t += 1) c[t] = (w = e[t][0], a = e[t][1], f = e[t][2], o = e[t][3], u = e[t][4], new r(w.N ^ a.N ^ f.N ^ o.N ^ u.N, w.I ^ a.I ^ f.I ^ o.I ^ u.I));
    for (t = 0; t < 5; t += 1) l[t] = F(c[(t + 4) % 5], Z(c[(t + 1) % 5], 1));
    for (t = 0; t < 5; t += 1) for (i = 0; i < 5; i += 1) e[t][i] = F(e[t][i], l[t]);
    for (t = 0; t < 5; t += 1) for (i = 0; i < 5; i += 1) h[i][(2 * t + 3 * i) % 5] = Z(e[t][i], Le[t][i]);
    for (t = 0; t < 5; t += 1) for (i = 0; i < 5; i += 1) e[t][i] = F(h[t][i], new r(~h[(t + 1) % 5][i].N & h[(t + 2) % 5][i].N, ~h[(t + 1) % 5][i].I & h[(t + 2) % 5][i].I));
    e[0][0] = F(e[0][0], ye[n]);
  }
  var w, a, f, o, u;
  return e;
}
function ue(s) {
  let e, n, t = 0;
  const i = [0, 0], h = [4294967295 & s, s / k & 2097151];
  for (e = 6; e >= 0; e--) n = h[e >> 2] >>> 8 * e & 255, n === 0 && t === 0 || (i[t + 1 >> 2] |= n << 8 * (t + 1), t += 1);
  return t = t !== 0 ? t : 1, i[0] |= t, { value: t + 1 > 4 ? i : [i[0]], binLen: 8 + 8 * t };
}
function X(s) {
  return P(ue(s.binLen), s);
}
function Q(s, e) {
  let n, t = ue(e);
  t = P(t, s);
  const i = e >>> 2, h = (i - t.value.length % i) % i;
  for (n = 0; n < h; n++) t.value.push(0);
  return t.value;
}
let Ke = class extends O {
  constructor(s, e, n) {
    let t = 6, i = 0;
    super(s, e, n);
    const h = n || {};
    if (this.numRounds !== 1) {
      if (h.kmacKey || h.hmacKey) throw new Error(ne);
      if (this.o === "CSHAKE128" || this.o === "CSHAKE256") throw new Error("Cannot set numRounds for CSHAKE variants");
    }
    switch (this.T = 1, this.C = C(this.t, this.i, this.T), this.v = x, this.L = Ue, this.B = _, this.U = _(), this.K = !1, s) {
      case "SHA3-224":
        this.m = i = 1152, this.R = 224, this.M = !0, this.g = this.Y;
        break;
      case "SHA3-256":
        this.m = i = 1088, this.R = 256, this.M = !0, this.g = this.Y;
        break;
      case "SHA3-384":
        this.m = i = 832, this.R = 384, this.M = !0, this.g = this.Y;
        break;
      case "SHA3-512":
        this.m = i = 576, this.R = 512, this.M = !0, this.g = this.Y;
        break;
      case "SHAKE128":
        t = 31, this.m = i = 1344, this.R = -1, this.K = !0, this.M = !1, this.g = null;
        break;
      case "SHAKE256":
        t = 31, this.m = i = 1088, this.R = -1, this.K = !0, this.M = !1, this.g = null;
        break;
      case "KMAC128":
        t = 4, this.m = i = 1344, this.X(n), this.R = -1, this.K = !0, this.M = !1, this.g = this._;
        break;
      case "KMAC256":
        t = 4, this.m = i = 1088, this.X(n), this.R = -1, this.K = !0, this.M = !1, this.g = this._;
        break;
      case "CSHAKE128":
        this.m = i = 1344, t = this.O(n), this.R = -1, this.K = !0, this.M = !1, this.g = null;
        break;
      case "CSHAKE256":
        this.m = i = 1088, t = this.O(n), this.R = -1, this.K = !0, this.M = !1, this.g = null;
        break;
      default:
        throw new Error(B);
    }
    this.F = function(c, l, w, a, f) {
      return function(o, u, m, A, N, g, b) {
        let I, H, E = 0;
        const v = [], Y = N >>> 5, ce = u >>> 5;
        for (I = 0; I < ce && u >= N; I += Y) A = x(o.slice(I, I + Y), A), u -= N;
        for (o = o.slice(I), u %= N; o.length < Y; ) o.push(0);
        for (I = u >>> 3, o[I >> 2] ^= g << I % 4 * 8, o[Y - 1] ^= 2147483648, A = x(o, A); 32 * v.length < b && (H = A[E % 5][E / 5 | 0], v.push(H.I), !(32 * v.length >= b)); ) v.push(H.N), E += 1, 64 * E % N == 0 && (x(null, A), E = 0);
        return v;
      }(c, l, 0, a, i, t, f);
    }, h.hmacKey && this.k(K("hmacKey", h.hmacKey, this.T));
  }
  O(s, e) {
    const n = function(i) {
      const h = i || {};
      return { funcName: K("funcName", h.funcName, 1, { value: [], binLen: 0 }), customization: K("Customization", h.customization, 1, { value: [], binLen: 0 }) };
    }(s || {});
    e && (n.funcName = e);
    const t = P(X(n.funcName), X(n.customization));
    if (n.customization.binLen !== 0 || n.funcName.binLen !== 0) {
      const i = Q(t, this.m >>> 3);
      for (let h = 0; h < i.length; h += this.m >>> 5) this.U = this.v(i.slice(h, h + (this.m >>> 5)), this.U), this.A += this.m;
      return 4;
    }
    return 31;
  }
  X(s) {
    const e = function(t) {
      const i = t || {};
      return { kmacKey: K("kmacKey", i.kmacKey, 1), funcName: { value: [1128353099], binLen: 32 }, customization: K("Customization", i.customization, 1, { value: [], binLen: 0 }) };
    }(s || {});
    this.O(s, e.funcName);
    const n = Q(X(e.kmacKey), this.m >>> 3);
    for (let t = 0; t < n.length; t += this.m >>> 5) this.U = this.v(n.slice(t, t + (this.m >>> 5)), this.U), this.A += this.m;
    this.H = !0;
  }
  _(s) {
    const e = P({ value: this.h.slice(), binLen: this.u }, function(n) {
      let t, i, h = 0;
      const c = [0, 0], l = [4294967295 & n, n / k & 2097151];
      for (t = 6; t >= 0; t--) i = l[t >> 2] >>> 8 * t & 255, i === 0 && h === 0 || (c[h >> 2] |= i << 8 * h, h += 1);
      return h = h !== 0 ? h : 1, c[h >> 2] |= h << 8 * h, { value: h + 1 > 4 ? c : [c[0]], binLen: 8 + 8 * h };
    }(s.outputLen));
    return this.F(e.value, e.binLen, this.A, this.L(this.U), s.outputLen);
  }
};
class Te {
  constructor(e, n, t) {
    if (e == "SHA-1") this.P = new Ae(e, n, t);
    else if (e == "SHA-224" || e == "SHA-256") this.P = new Ne(e, n, t);
    else if (e == "SHA-384" || e == "SHA-512") this.P = new Re(e, n, t);
    else {
      if (e != "SHA3-224" && e != "SHA3-256" && e != "SHA3-384" && e != "SHA3-512" && e != "SHAKE128" && e != "SHAKE256" && e != "CSHAKE128" && e != "CSHAKE256" && e != "KMAC128" && e != "KMAC256") throw new Error(B);
      this.P = new Ke(e, n, t);
    }
  }
  update(e) {
    return this.P.update(e), this;
  }
  getHash(e, n) {
    return this.P.getHash(e, n);
  }
  setHMACKey(e, n, t) {
    this.P.setHMACKey(e, n, t);
  }
  getHMAC(e, n) {
    return this.P.getHMAC(e, n);
  }
}
const Ce = (() => {
  let s = {}, e = (a, f) => `${a} scored ${f}`, n = (a, f) => a - f, t = () => {
  };
  const i = "_webxdc-scores_.max_serial", h = "_webxdc-scores_.scoreboards", c = new Te("SHA-512", "TEXT", { encoding: "UTF8" }).update(window.webxdc.selfAddr).getHash("HEX"), l = (a, f, ...o) => {
    const u = document.createElement(a);
    return f && Object.entries(f).forEach((m) => {
      u.setAttribute(m[0], m[1]);
    }), u.append(...o), u;
  }, w = (a, f) => {
    const o = s[f] || {};
    return o[a] ? o[a].score : 0;
  };
  return {
    init: function({
      getAnnouncement: a,
      compareScores: f,
      onHighscoresChanged: o
    } = {}) {
      a && (e = a), f && (n = f), o && (t = o), s = JSON.parse(localStorage.getItem(h) || "{}");
      for (const u of Object.keys(s))
        t(u);
      return window.webxdc.setUpdateListener(
        (u) => {
          const m = u.payload, A = m.scoreboard;
          (m.force || n(m.score, w(m.id, A), A) > 0) && (s[A] === void 0 && (s[A] = {}), s[A][m.id] = {
            name: m.name,
            score: m.score
          }), u.serial === u.max_serial && (localStorage.setItem(h, JSON.stringify(s)), localStorage.setItem(i, u.max_serial), t(A));
        },
        parseInt(localStorage.getItem(i) || 0)
      );
    },
    getScore: function(a) {
      return w(c, a);
    },
    setScore: function(a, f = !1, o = void 0) {
      const u = this.getScore(o);
      if (f || n(a, u, o) > 0) {
        s[o] === void 0 && (s[o] = {});
        const m = window.webxdc.selfName;
        s[o][c] = { name: m, score: a };
        const A = e(m, a, o);
        window.webxdc.sendUpdate(
          {
            payload: {
              id: c,
              name: m,
              score: a,
              force: f,
              scoreboard: o
            },
            info: A
          },
          ""
        );
      } else
        console.log(`[webxdc-score] Ignoring score: ${a} <= ${u}`);
    },
    getHighScores: function(a) {
      const f = s[a] || {}, o = Object.keys(f).map((u) => ({
        current: u === c,
        ...f[u]
      })).sort((u, m) => n(m.score, u.score, a));
      for (let u = 0; u < o.length; u++)
        o[u].pos = u + 1;
      return o;
    },
    renderScoreboard: function(a) {
      let f = this.getHighScores(a), o = l("div");
      for (const u of f) {
        const m = l("span", { class: "row-pos" }, u.pos);
        m.innerHTML += ".&nbsp;&nbsp;", o.appendChild(
          l(
            "div",
            { class: "score-row" + (u.current ? " you" : "") },
            m,
            l("span", { class: "row-name" }, u.name),
            l("span", { class: "row-score" }, u.score)
          )
        );
      }
      return o;
    }
  };
})();
window.highscores = Ce;
export {
  Ce as highscores
};
