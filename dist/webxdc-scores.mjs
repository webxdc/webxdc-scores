const $ = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
function _(i, e, n, t) {
  let s, h, u;
  const l = e || [0], a = (n = n || 0) >>> 3, w = t === -1 ? 3 : 0;
  for (s = 0; s < i.length; s += 1)
    u = s + a, h = u >>> 2, l.length <= h && l.push(0), l[h] |= i[s] << 8 * (w + t * (u % 4));
  return { value: l, binLen: 8 * i.length + n };
}
function C(i, e, n) {
  switch (e) {
    case "UTF8":
    case "UTF16BE":
    case "UTF16LE":
      break;
    default:
      throw new Error("encoding must be UTF8, UTF16BE, or UTF16LE");
  }
  switch (i) {
    case "HEX":
      return function(t, s, h) {
        return function(u, l, a, w) {
          let f, c, o, m;
          if (u.length % 2 != 0)
            throw new Error("String of HEX type must be in byte increments");
          const A = l || [0], N = (a = a || 0) >>> 3, I = w === -1 ? 3 : 0;
          for (f = 0; f < u.length; f += 2) {
            if (c = parseInt(u.substr(f, 2), 16), isNaN(c))
              throw new Error("String of HEX type contains invalid characters");
            for (m = (f >>> 1) + N, o = m >>> 2; A.length <= o; )
              A.push(0);
            A[o] |= c << 8 * (I + w * (m % 4));
          }
          return { value: A, binLen: 4 * u.length + a };
        }(t, s, h, n);
      };
    case "TEXT":
      return function(t, s, h) {
        return function(u, l, a, w, f) {
          let c, o, m, A, N, I, g, S, d = 0;
          const E = a || [0], b = (w = w || 0) >>> 3;
          if (l === "UTF8")
            for (g = f === -1 ? 3 : 0, m = 0; m < u.length; m += 1)
              for (c = u.charCodeAt(m), o = [], 128 > c ? o.push(c) : 2048 > c ? (o.push(192 | c >>> 6), o.push(128 | 63 & c)) : 55296 > c || 57344 <= c ? o.push(224 | c >>> 12, 128 | c >>> 6 & 63, 128 | 63 & c) : (m += 1, c = 65536 + ((1023 & c) << 10 | 1023 & u.charCodeAt(m)), o.push(240 | c >>> 18, 128 | c >>> 12 & 63, 128 | c >>> 6 & 63, 128 | 63 & c)), A = 0; A < o.length; A += 1) {
                for (I = d + b, N = I >>> 2; E.length <= N; )
                  E.push(0);
                E[N] |= o[A] << 8 * (g + f * (I % 4)), d += 1;
              }
          else
            for (g = f === -1 ? 2 : 0, S = l === "UTF16LE" && f !== 1 || l !== "UTF16LE" && f === 1, m = 0; m < u.length; m += 1) {
              for (c = u.charCodeAt(m), S === !0 && (A = 255 & c, c = A << 8 | c >>> 8), I = d + b, N = I >>> 2; E.length <= N; )
                E.push(0);
              E[N] |= c << 8 * (g + f * (I % 4)), d += 2;
            }
          return { value: E, binLen: 8 * d + w };
        }(t, e, s, h, n);
      };
    case "B64":
      return function(t, s, h) {
        return function(u, l, a, w) {
          let f, c, o, m, A, N, I, g = 0;
          const S = l || [0], d = (a = a || 0) >>> 3, E = w === -1 ? 3 : 0, b = u.indexOf("=");
          if (u.search(/^[a-zA-Z0-9=+/]+$/) === -1)
            throw new Error("Invalid character in base-64 string");
          if (u = u.replace(/=/g, ""), b !== -1 && b < u.length)
            throw new Error("Invalid '=' found in base-64 string");
          for (c = 0; c < u.length; c += 4) {
            for (A = u.substr(c, 4), m = 0, o = 0; o < A.length; o += 1)
              f = $.indexOf(A.charAt(o)), m |= f << 18 - 6 * o;
            for (o = 0; o < A.length - 1; o += 1) {
              for (I = g + d, N = I >>> 2; S.length <= N; )
                S.push(0);
              S[N] |= (m >>> 16 - 8 * o & 255) << 8 * (E + w * (I % 4)), g += 1;
            }
          }
          return { value: S, binLen: 8 * g + a };
        }(t, s, h, n);
      };
    case "BYTES":
      return function(t, s, h) {
        return function(u, l, a, w) {
          let f, c, o, m;
          const A = l || [0], N = (a = a || 0) >>> 3, I = w === -1 ? 3 : 0;
          for (c = 0; c < u.length; c += 1)
            f = u.charCodeAt(c), m = c + N, o = m >>> 2, A.length <= o && A.push(0), A[o] |= f << 8 * (I + w * (m % 4));
          return { value: A, binLen: 8 * u.length + a };
        }(t, s, h, n);
      };
    case "ARRAYBUFFER":
      try {
        new ArrayBuffer(0);
      } catch {
        throw new Error("ARRAYBUFFER not supported by this environment");
      }
      return function(t, s, h) {
        return function(u, l, a, w) {
          return _(new Uint8Array(u), l, a, w);
        }(t, s, h, n);
      };
    case "UINT8ARRAY":
      try {
        new Uint8Array(0);
      } catch {
        throw new Error("UINT8ARRAY not supported by this environment");
      }
      return function(t, s, h) {
        return _(t, s, h, n);
      };
    default:
      throw new Error("format must be HEX, TEXT, B64, BYTES, ARRAYBUFFER, or UINT8ARRAY");
  }
}
function j(i, e, n, t) {
  switch (i) {
    case "HEX":
      return function(s) {
        return function(h, u, l, a) {
          const w = "0123456789abcdef";
          let f, c, o = "";
          const m = u / 8, A = l === -1 ? 3 : 0;
          for (f = 0; f < m; f += 1)
            c = h[f >>> 2] >>> 8 * (A + l * (f % 4)), o += w.charAt(c >>> 4 & 15) + w.charAt(15 & c);
          return a.outputUpper ? o.toUpperCase() : o;
        }(s, e, n, t);
      };
    case "B64":
      return function(s) {
        return function(h, u, l, a) {
          let w, f, c, o, m, A = "";
          const N = u / 8, I = l === -1 ? 3 : 0;
          for (w = 0; w < N; w += 3)
            for (o = w + 1 < N ? h[w + 1 >>> 2] : 0, m = w + 2 < N ? h[w + 2 >>> 2] : 0, c = (h[w >>> 2] >>> 8 * (I + l * (w % 4)) & 255) << 16 | (o >>> 8 * (I + l * ((w + 1) % 4)) & 255) << 8 | m >>> 8 * (I + l * ((w + 2) % 4)) & 255, f = 0; f < 4; f += 1)
              A += 8 * w + 6 * f <= u ? $.charAt(c >>> 6 * (3 - f) & 63) : a.b64Pad;
          return A;
        }(s, e, n, t);
      };
    case "BYTES":
      return function(s) {
        return function(h, u, l) {
          let a, w, f = "";
          const c = u / 8, o = l === -1 ? 3 : 0;
          for (a = 0; a < c; a += 1)
            w = h[a >>> 2] >>> 8 * (o + l * (a % 4)) & 255, f += String.fromCharCode(w);
          return f;
        }(s, e, n);
      };
    case "ARRAYBUFFER":
      try {
        new ArrayBuffer(0);
      } catch {
        throw new Error("ARRAYBUFFER not supported by this environment");
      }
      return function(s) {
        return function(h, u, l) {
          let a;
          const w = u / 8, f = new ArrayBuffer(w), c = new Uint8Array(f), o = l === -1 ? 3 : 0;
          for (a = 0; a < w; a += 1)
            c[a] = h[a >>> 2] >>> 8 * (o + l * (a % 4)) & 255;
          return f;
        }(s, e, n);
      };
    case "UINT8ARRAY":
      try {
        new Uint8Array(0);
      } catch {
        throw new Error("UINT8ARRAY not supported by this environment");
      }
      return function(s) {
        return function(h, u, l) {
          let a;
          const w = u / 8, f = l === -1 ? 3 : 0, c = new Uint8Array(w);
          for (a = 0; a < w; a += 1)
            c[a] = h[a >>> 2] >>> 8 * (f + l * (a % 4)) & 255;
          return c;
        }(s, e, n);
      };
    default:
      throw new Error("format must be HEX, B64, BYTES, ARRAYBUFFER, or UINT8ARRAY");
  }
}
const p = [1116352408, 1899447441, 3049323471, 3921009573, 961987163, 1508970993, 2453635748, 2870763221, 3624381080, 310598401, 607225278, 1426881987, 1925078388, 2162078206, 2614888103, 3248222580, 3835390401, 4022224774, 264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986, 2554220882, 2821834349, 2952996808, 3210313671, 3336571891, 3584528711, 113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291, 1695183700, 1986661051, 2177026350, 2456956037, 2730485921, 2820302411, 3259730800, 3345764771, 3516065817, 3600352804, 4094571909, 275423344, 430227734, 506948616, 659060556, 883997877, 958139571, 1322822218, 1537002063, 1747873779, 1955562222, 2024104815, 2227730452, 2361852424, 2428436474, 2756734187, 3204031479, 3329325298], L = [3238371032, 914150663, 812702999, 4144912697, 4290775857, 1750603025, 1694076839, 3204075428], K = [1779033703, 3144134277, 1013904242, 2773480762, 1359893119, 2600822924, 528734635, 1541459225], B = "Chosen SHA variant is not supported";
function P(i, e) {
  let n, t;
  const s = i.binLen >>> 3, h = e.binLen >>> 3, u = s << 3, l = 4 - s << 3;
  if (s % 4 != 0) {
    for (n = 0; n < h; n += 4)
      t = s + n >>> 2, i.value[t] |= e.value[n >>> 2] << u, i.value.push(0), i.value[t + 1] |= e.value[n >>> 2] >>> l;
    return (i.value.length << 2) - 4 >= h + s && i.value.pop(), { value: i.value, binLen: i.binLen + e.binLen };
  }
  return { value: i.value.concat(e.value), binLen: i.binLen + e.binLen };
}
function D(i) {
  const e = { outputUpper: !1, b64Pad: "=", outputLen: -1 }, n = i || {}, t = "Output length must be a multiple of 8";
  if (e.outputUpper = n.outputUpper || !1, n.b64Pad && (e.b64Pad = n.b64Pad), n.outputLen) {
    if (n.outputLen % 8 != 0)
      throw new Error(t);
    e.outputLen = n.outputLen;
  } else if (n.shakeLen) {
    if (n.shakeLen % 8 != 0)
      throw new Error(t);
    e.outputLen = n.shakeLen;
  }
  if (typeof e.outputUpper != "boolean")
    throw new Error("Invalid outputUpper formatting option");
  if (typeof e.b64Pad != "string")
    throw new Error("Invalid b64Pad formatting option");
  return e;
}
function U(i, e, n, t) {
  const s = i + " must include a value and format";
  if (!e) {
    if (!t)
      throw new Error(s);
    return t;
  }
  if (e.value === void 0 || !e.format)
    throw new Error(s);
  return C(e.format, e.encoding || "UTF8", n)(e.value);
}
class X {
  constructor(e, n, t) {
    const s = t || {};
    if (this.t = n, this.i = s.encoding || "UTF8", this.numRounds = s.numRounds || 1, isNaN(this.numRounds) || this.numRounds !== parseInt(this.numRounds, 10) || 1 > this.numRounds)
      throw new Error("numRounds must a integer >= 1");
    this.o = e, this.h = [], this.u = 0, this.l = !1, this.A = 0, this.H = !1, this.S = [], this.p = [];
  }
  update(e) {
    let n, t = 0;
    const s = this.m >>> 5, h = this.C(e, this.h, this.u), u = h.binLen, l = h.value, a = u >>> 5;
    for (n = 0; n < a; n += s)
      t + this.m <= u && (this.R = this.U(l.slice(n, n + s), this.R), t += this.m);
    return this.A += t, this.h = l.slice(t >>> 5), this.u = u % this.m, this.l = !0, this;
  }
  getHash(e, n) {
    let t, s, h = this.v;
    const u = D(n);
    if (this.K) {
      if (u.outputLen === -1)
        throw new Error("Output length must be specified in options");
      h = u.outputLen;
    }
    const l = j(e, h, this.T, u);
    if (this.H && this.F)
      return l(this.F(u));
    for (s = this.g(this.h.slice(), this.u, this.A, this.B(this.R), h), t = 1; t < this.numRounds; t += 1)
      this.K && h % 32 != 0 && (s[s.length - 1] &= 16777215 >>> 24 - h % 32), s = this.g(s, h, 0, this.L(this.o), h);
    return l(s);
  }
  setHMACKey(e, n, t) {
    if (!this.M)
      throw new Error("Variant does not support HMAC");
    if (this.l)
      throw new Error("Cannot set MAC key after calling update");
    const s = C(n, (t || {}).encoding || "UTF8", this.T);
    this.k(s(e));
  }
  k(e) {
    const n = this.m >>> 3, t = n / 4 - 1;
    let s;
    if (this.numRounds !== 1)
      throw new Error("Cannot set numRounds with MAC");
    if (this.H)
      throw new Error("MAC key already set");
    for (n < e.binLen / 8 && (e.value = this.g(e.value, e.binLen, 0, this.L(this.o), this.v)); e.value.length <= t; )
      e.value.push(0);
    for (s = 0; s <= t; s += 1)
      this.S[s] = 909522486 ^ e.value[s], this.p[s] = 1549556828 ^ e.value[s];
    this.R = this.U(this.S, this.R), this.A = this.m, this.H = !0;
  }
  getHMAC(e, n) {
    const t = D(n);
    return j(e, this.v, this.T, t)(this.Y());
  }
  Y() {
    let e;
    if (!this.H)
      throw new Error("Cannot call getHMAC without first setting MAC key");
    const n = this.g(this.h.slice(), this.u, this.A, this.B(this.R), this.v);
    return e = this.U(this.p, this.L(this.o)), e = this.g(n, this.v, this.m, e, this.v), e;
  }
}
function T(i, e) {
  return i << e | i >>> 32 - e;
}
function R(i, e) {
  return i >>> e | i << 32 - e;
}
function ee(i, e) {
  return i >>> e;
}
function J(i, e, n) {
  return i ^ e ^ n;
}
function te(i, e, n) {
  return i & e ^ ~i & n;
}
function ne(i, e, n) {
  return i & e ^ i & n ^ e & n;
}
function he(i) {
  return R(i, 2) ^ R(i, 13) ^ R(i, 22);
}
function v(i, e) {
  const n = (65535 & i) + (65535 & e);
  return (65535 & (i >>> 16) + (e >>> 16) + (n >>> 16)) << 16 | 65535 & n;
}
function ue(i, e, n, t) {
  const s = (65535 & i) + (65535 & e) + (65535 & n) + (65535 & t);
  return (65535 & (i >>> 16) + (e >>> 16) + (n >>> 16) + (t >>> 16) + (s >>> 16)) << 16 | 65535 & s;
}
function k(i, e, n, t, s) {
  const h = (65535 & i) + (65535 & e) + (65535 & n) + (65535 & t) + (65535 & s);
  return (65535 & (i >>> 16) + (e >>> 16) + (n >>> 16) + (t >>> 16) + (s >>> 16) + (h >>> 16)) << 16 | 65535 & h;
}
function ce(i) {
  return R(i, 7) ^ R(i, 18) ^ ee(i, 3);
}
function ae(i) {
  return R(i, 6) ^ R(i, 11) ^ R(i, 25);
}
function we(i) {
  return [1732584193, 4023233417, 2562383102, 271733878, 3285377520];
}
function se(i, e) {
  let n, t, s, h, u, l, a;
  const w = [];
  for (n = e[0], t = e[1], s = e[2], h = e[3], u = e[4], a = 0; a < 80; a += 1)
    w[a] = a < 16 ? i[a] : T(w[a - 3] ^ w[a - 8] ^ w[a - 14] ^ w[a - 16], 1), l = a < 20 ? k(T(n, 5), te(t, s, h), u, 1518500249, w[a]) : a < 40 ? k(T(n, 5), J(t, s, h), u, 1859775393, w[a]) : a < 60 ? k(T(n, 5), ne(t, s, h), u, 2400959708, w[a]) : k(T(n, 5), J(t, s, h), u, 3395469782, w[a]), u = h, h = s, s = T(t, 30), t = n, n = l;
  return e[0] = v(n, e[0]), e[1] = v(t, e[1]), e[2] = v(s, e[2]), e[3] = v(h, e[3]), e[4] = v(u, e[4]), e;
}
function fe(i, e, n, t) {
  let s;
  const h = 15 + (e + 65 >>> 9 << 4), u = e + n;
  for (; i.length <= h; )
    i.push(0);
  for (i[e >>> 5] |= 128 << 24 - e % 32, i[h] = 4294967295 & u, i[h - 1] = u / 4294967296 | 0, s = 0; s < i.length; s += 16)
    t = se(i.slice(s, s + 16), t);
  return t;
}
class le extends X {
  constructor(e, n, t) {
    if (e !== "SHA-1")
      throw new Error(B);
    super(e, n, t);
    const s = t || {};
    this.M = !0, this.F = this.Y, this.T = -1, this.C = C(this.t, this.i, this.T), this.U = se, this.B = function(h) {
      return h.slice();
    }, this.L = we, this.g = fe, this.R = [1732584193, 4023233417, 2562383102, 271733878, 3285377520], this.m = 512, this.v = 160, this.K = !1, s.hmacKey && this.k(U("hmacKey", s.hmacKey, this.T));
  }
}
function V(i) {
  let e;
  return e = i == "SHA-224" ? L.slice() : K.slice(), e;
}
function Z(i, e) {
  let n, t, s, h, u, l, a, w, f, c, o;
  const m = [];
  for (n = e[0], t = e[1], s = e[2], h = e[3], u = e[4], l = e[5], a = e[6], w = e[7], o = 0; o < 64; o += 1)
    m[o] = o < 16 ? i[o] : ue(R(A = m[o - 2], 17) ^ R(A, 19) ^ ee(A, 10), m[o - 7], ce(m[o - 15]), m[o - 16]), f = k(w, ae(u), te(u, l, a), p[o], m[o]), c = v(he(n), ne(n, t, s)), w = a, a = l, l = u, u = v(h, f), h = s, s = t, t = n, n = v(f, c);
  var A;
  return e[0] = v(n, e[0]), e[1] = v(t, e[1]), e[2] = v(s, e[2]), e[3] = v(h, e[3]), e[4] = v(u, e[4]), e[5] = v(l, e[5]), e[6] = v(a, e[6]), e[7] = v(w, e[7]), e;
}
class me extends X {
  constructor(e, n, t) {
    if (e !== "SHA-224" && e !== "SHA-256")
      throw new Error(B);
    super(e, n, t);
    const s = t || {};
    this.F = this.Y, this.M = !0, this.T = -1, this.C = C(this.t, this.i, this.T), this.U = Z, this.B = function(h) {
      return h.slice();
    }, this.L = V, this.g = function(h, u, l, a) {
      return function(w, f, c, o, m) {
        let A, N;
        const I = 15 + (f + 65 >>> 9 << 4), g = f + c;
        for (; w.length <= I; )
          w.push(0);
        for (w[f >>> 5] |= 128 << 24 - f % 32, w[I] = 4294967295 & g, w[I - 1] = g / 4294967296 | 0, A = 0; A < w.length; A += 16)
          o = Z(w.slice(A, A + 16), o);
        return N = m === "SHA-224" ? [o[0], o[1], o[2], o[3], o[4], o[5], o[6]] : o, N;
      }(h, u, l, a, e);
    }, this.R = V(e), this.m = 512, this.v = e === "SHA-224" ? 224 : 256, this.K = !1, s.hmacKey && this.k(U("hmacKey", s.hmacKey, this.T));
  }
}
class r {
  constructor(e, n) {
    this.N = e, this.I = n;
  }
}
function q(i, e) {
  let n;
  return e > 32 ? (n = 64 - e, new r(i.I << e | i.N >>> n, i.N << e | i.I >>> n)) : e !== 0 ? (n = 32 - e, new r(i.N << e | i.I >>> n, i.I << e | i.N >>> n)) : i;
}
function y(i, e) {
  let n;
  return e < 32 ? (n = 32 - e, new r(i.N >>> e | i.I << n, i.I >>> e | i.N << n)) : (n = 64 - e, new r(i.I >>> e | i.N << n, i.N >>> e | i.I << n));
}
function ie(i, e) {
  return new r(i.N >>> e, i.I >>> e | i.N << 32 - e);
}
function pe(i, e, n) {
  return new r(i.N & e.N ^ i.N & n.N ^ e.N & n.N, i.I & e.I ^ i.I & n.I ^ e.I & n.I);
}
function Ae(i) {
  const e = y(i, 28), n = y(i, 34), t = y(i, 39);
  return new r(e.N ^ n.N ^ t.N, e.I ^ n.I ^ t.I);
}
function H(i, e) {
  let n, t;
  n = (65535 & i.I) + (65535 & e.I), t = (i.I >>> 16) + (e.I >>> 16) + (n >>> 16);
  const s = (65535 & t) << 16 | 65535 & n;
  return n = (65535 & i.N) + (65535 & e.N) + (t >>> 16), t = (i.N >>> 16) + (e.N >>> 16) + (n >>> 16), new r((65535 & t) << 16 | 65535 & n, s);
}
function Ne(i, e, n, t) {
  let s, h;
  s = (65535 & i.I) + (65535 & e.I) + (65535 & n.I) + (65535 & t.I), h = (i.I >>> 16) + (e.I >>> 16) + (n.I >>> 16) + (t.I >>> 16) + (s >>> 16);
  const u = (65535 & h) << 16 | 65535 & s;
  return s = (65535 & i.N) + (65535 & e.N) + (65535 & n.N) + (65535 & t.N) + (h >>> 16), h = (i.N >>> 16) + (e.N >>> 16) + (n.N >>> 16) + (t.N >>> 16) + (s >>> 16), new r((65535 & h) << 16 | 65535 & s, u);
}
function Ie(i, e, n, t, s) {
  let h, u;
  h = (65535 & i.I) + (65535 & e.I) + (65535 & n.I) + (65535 & t.I) + (65535 & s.I), u = (i.I >>> 16) + (e.I >>> 16) + (n.I >>> 16) + (t.I >>> 16) + (s.I >>> 16) + (h >>> 16);
  const l = (65535 & u) << 16 | 65535 & h;
  return h = (65535 & i.N) + (65535 & e.N) + (65535 & n.N) + (65535 & t.N) + (65535 & s.N) + (u >>> 16), u = (i.N >>> 16) + (e.N >>> 16) + (n.N >>> 16) + (t.N >>> 16) + (s.N >>> 16) + (h >>> 16), new r((65535 & u) << 16 | 65535 & h, l);
}
function M(i, e) {
  return new r(i.N ^ e.N, i.I ^ e.I);
}
function ge(i) {
  const e = y(i, 19), n = y(i, 61), t = ie(i, 6);
  return new r(e.N ^ n.N ^ t.N, e.I ^ n.I ^ t.I);
}
function de(i) {
  const e = y(i, 1), n = y(i, 8), t = ie(i, 7);
  return new r(e.N ^ n.N ^ t.N, e.I ^ n.I ^ t.I);
}
function ve(i) {
  const e = y(i, 14), n = y(i, 18), t = y(i, 41);
  return new r(e.N ^ n.N ^ t.N, e.I ^ n.I ^ t.I);
}
const Ee = [new r(p[0], 3609767458), new r(p[1], 602891725), new r(p[2], 3964484399), new r(p[3], 2173295548), new r(p[4], 4081628472), new r(p[5], 3053834265), new r(p[6], 2937671579), new r(p[7], 3664609560), new r(p[8], 2734883394), new r(p[9], 1164996542), new r(p[10], 1323610764), new r(p[11], 3590304994), new r(p[12], 4068182383), new r(p[13], 991336113), new r(p[14], 633803317), new r(p[15], 3479774868), new r(p[16], 2666613458), new r(p[17], 944711139), new r(p[18], 2341262773), new r(p[19], 2007800933), new r(p[20], 1495990901), new r(p[21], 1856431235), new r(p[22], 3175218132), new r(p[23], 2198950837), new r(p[24], 3999719339), new r(p[25], 766784016), new r(p[26], 2566594879), new r(p[27], 3203337956), new r(p[28], 1034457026), new r(p[29], 2466948901), new r(p[30], 3758326383), new r(p[31], 168717936), new r(p[32], 1188179964), new r(p[33], 1546045734), new r(p[34], 1522805485), new r(p[35], 2643833823), new r(p[36], 2343527390), new r(p[37], 1014477480), new r(p[38], 1206759142), new r(p[39], 344077627), new r(p[40], 1290863460), new r(p[41], 3158454273), new r(p[42], 3505952657), new r(p[43], 106217008), new r(p[44], 3606008344), new r(p[45], 1432725776), new r(p[46], 1467031594), new r(p[47], 851169720), new r(p[48], 3100823752), new r(p[49], 1363258195), new r(p[50], 3750685593), new r(p[51], 3785050280), new r(p[52], 3318307427), new r(p[53], 3812723403), new r(p[54], 2003034995), new r(p[55], 3602036899), new r(p[56], 1575990012), new r(p[57], 1125592928), new r(p[58], 2716904306), new r(p[59], 442776044), new r(p[60], 593698344), new r(p[61], 3733110249), new r(p[62], 2999351573), new r(p[63], 3815920427), new r(3391569614, 3928383900), new r(3515267271, 566280711), new r(3940187606, 3454069534), new r(4118630271, 4000239992), new r(116418474, 1914138554), new r(174292421, 2731055270), new r(289380356, 3203993006), new r(460393269, 320620315), new r(685471733, 587496836), new r(852142971, 1086792851), new r(1017036298, 365543100), new r(1126000580, 2618297676), new r(1288033470, 3409855158), new r(1501505948, 4234509866), new r(1607167915, 987167468), new r(1816402316, 1246189591)];
function G(i) {
  return i === "SHA-384" ? [new r(3418070365, L[0]), new r(1654270250, L[1]), new r(2438529370, L[2]), new r(355462360, L[3]), new r(1731405415, L[4]), new r(41048885895, L[5]), new r(3675008525, L[6]), new r(1203062813, L[7])] : [new r(K[0], 4089235720), new r(K[1], 2227873595), new r(K[2], 4271175723), new r(K[3], 1595750129), new r(K[4], 2917565137), new r(K[5], 725511199), new r(K[6], 4215389547), new r(K[7], 327033209)];
}
function Q(i, e) {
  let n, t, s, h, u, l, a, w, f, c, o, m;
  const A = [];
  for (n = e[0], t = e[1], s = e[2], h = e[3], u = e[4], l = e[5], a = e[6], w = e[7], o = 0; o < 80; o += 1)
    o < 16 ? (m = 2 * o, A[o] = new r(i[m], i[m + 1])) : A[o] = Ne(ge(A[o - 2]), A[o - 7], de(A[o - 15]), A[o - 16]), f = Ie(w, ve(u), (I = l, g = a, new r((N = u).N & I.N ^ ~N.N & g.N, N.I & I.I ^ ~N.I & g.I)), Ee[o], A[o]), c = H(Ae(n), pe(n, t, s)), w = a, a = l, l = u, u = H(h, f), h = s, s = t, t = n, n = H(f, c);
  var N, I, g;
  return e[0] = H(n, e[0]), e[1] = H(t, e[1]), e[2] = H(s, e[2]), e[3] = H(h, e[3]), e[4] = H(u, e[4]), e[5] = H(l, e[5]), e[6] = H(a, e[6]), e[7] = H(w, e[7]), e;
}
class be extends X {
  constructor(e, n, t) {
    if (e !== "SHA-384" && e !== "SHA-512")
      throw new Error(B);
    super(e, n, t);
    const s = t || {};
    this.F = this.Y, this.M = !0, this.T = -1, this.C = C(this.t, this.i, this.T), this.U = Q, this.B = function(h) {
      return h.slice();
    }, this.L = G, this.g = function(h, u, l, a) {
      return function(w, f, c, o, m) {
        let A, N;
        const I = 31 + (f + 129 >>> 10 << 5), g = f + c;
        for (; w.length <= I; )
          w.push(0);
        for (w[f >>> 5] |= 128 << 24 - f % 32, w[I] = 4294967295 & g, w[I - 1] = g / 4294967296 | 0, A = 0; A < w.length; A += 32)
          o = Q(w.slice(A, A + 32), o);
        return N = m === "SHA-384" ? [o[0].N, o[0].I, o[1].N, o[1].I, o[2].N, o[2].I, o[3].N, o[3].I, o[4].N, o[4].I, o[5].N, o[5].I] : [o[0].N, o[0].I, o[1].N, o[1].I, o[2].N, o[2].I, o[3].N, o[3].I, o[4].N, o[4].I, o[5].N, o[5].I, o[6].N, o[6].I, o[7].N, o[7].I], N;
      }(h, u, l, a, e);
    }, this.R = G(e), this.m = 1024, this.v = e === "SHA-384" ? 384 : 512, this.K = !1, s.hmacKey && this.k(U("hmacKey", s.hmacKey, this.T));
  }
}
const He = [new r(0, 1), new r(0, 32898), new r(2147483648, 32906), new r(2147483648, 2147516416), new r(0, 32907), new r(0, 2147483649), new r(2147483648, 2147516545), new r(2147483648, 32777), new r(0, 138), new r(0, 136), new r(0, 2147516425), new r(0, 2147483658), new r(0, 2147516555), new r(2147483648, 139), new r(2147483648, 32905), new r(2147483648, 32771), new r(2147483648, 32770), new r(2147483648, 128), new r(0, 32778), new r(2147483648, 2147483658), new r(2147483648, 2147516545), new r(2147483648, 32896), new r(0, 2147483649), new r(2147483648, 2147516424)], Se = [[0, 36, 3, 41, 18], [1, 44, 10, 45, 2], [62, 6, 43, 15, 61], [28, 55, 25, 21, 56], [27, 20, 39, 8, 14]];
function z(i) {
  let e;
  const n = [];
  for (e = 0; e < 5; e += 1)
    n[e] = [new r(0, 0), new r(0, 0), new r(0, 0), new r(0, 0), new r(0, 0)];
  return n;
}
function Re(i) {
  let e;
  const n = [];
  for (e = 0; e < 5; e += 1)
    n[e] = i[e].slice();
  return n;
}
function x(i, e) {
  let n, t, s, h;
  const u = [], l = [];
  if (i !== null)
    for (t = 0; t < i.length; t += 2)
      e[(t >>> 1) % 5][(t >>> 1) / 5 | 0] = M(e[(t >>> 1) % 5][(t >>> 1) / 5 | 0], new r(i[t + 1], i[t]));
  for (n = 0; n < 24; n += 1) {
    for (h = z(), t = 0; t < 5; t += 1)
      u[t] = (a = e[t][0], w = e[t][1], f = e[t][2], c = e[t][3], o = e[t][4], new r(a.N ^ w.N ^ f.N ^ c.N ^ o.N, a.I ^ w.I ^ f.I ^ c.I ^ o.I));
    for (t = 0; t < 5; t += 1)
      l[t] = M(u[(t + 4) % 5], q(u[(t + 1) % 5], 1));
    for (t = 0; t < 5; t += 1)
      for (s = 0; s < 5; s += 1)
        e[t][s] = M(e[t][s], l[t]);
    for (t = 0; t < 5; t += 1)
      for (s = 0; s < 5; s += 1)
        h[s][(2 * t + 3 * s) % 5] = q(e[t][s], Se[t][s]);
    for (t = 0; t < 5; t += 1)
      for (s = 0; s < 5; s += 1)
        e[t][s] = M(h[t][s], new r(~h[(t + 1) % 5][s].N & h[(t + 2) % 5][s].N, ~h[(t + 1) % 5][s].I & h[(t + 2) % 5][s].I));
    e[0][0] = M(e[0][0], He[n]);
  }
  var a, w, f, c, o;
  return e;
}
function re(i) {
  let e, n, t = 0;
  const s = [0, 0], h = [4294967295 & i, i / 4294967296 & 2097151];
  for (e = 6; e >= 0; e--)
    n = h[e >> 2] >>> 8 * e & 255, n === 0 && t === 0 || (s[t + 1 >> 2] |= n << 8 * (t + 1), t += 1);
  return t = t !== 0 ? t : 1, s[0] |= t, { value: t + 1 > 4 ? s : [s[0]], binLen: 8 + 8 * t };
}
function O(i) {
  return P(re(i.binLen), i);
}
function W(i, e) {
  let n, t = re(e);
  t = P(t, i);
  const s = e >>> 2, h = (s - t.value.length % s) % s;
  for (n = 0; n < h; n++)
    t.value.push(0);
  return t.value;
}
class ye extends X {
  constructor(e, n, t) {
    let s = 6, h = 0;
    super(e, n, t);
    const u = t || {};
    if (this.numRounds !== 1) {
      if (u.kmacKey || u.hmacKey)
        throw new Error("Cannot set numRounds with MAC");
      if (this.o === "CSHAKE128" || this.o === "CSHAKE256")
        throw new Error("Cannot set numRounds for CSHAKE variants");
    }
    switch (this.T = 1, this.C = C(this.t, this.i, this.T), this.U = x, this.B = Re, this.L = z, this.R = z(), this.K = !1, e) {
      case "SHA3-224":
        this.m = h = 1152, this.v = 224, this.M = !0, this.F = this.Y;
        break;
      case "SHA3-256":
        this.m = h = 1088, this.v = 256, this.M = !0, this.F = this.Y;
        break;
      case "SHA3-384":
        this.m = h = 832, this.v = 384, this.M = !0, this.F = this.Y;
        break;
      case "SHA3-512":
        this.m = h = 576, this.v = 512, this.M = !0, this.F = this.Y;
        break;
      case "SHAKE128":
        s = 31, this.m = h = 1344, this.v = -1, this.K = !0, this.M = !1, this.F = null;
        break;
      case "SHAKE256":
        s = 31, this.m = h = 1088, this.v = -1, this.K = !0, this.M = !1, this.F = null;
        break;
      case "KMAC128":
        s = 4, this.m = h = 1344, this.X(t), this.v = -1, this.K = !0, this.M = !1, this.F = this._;
        break;
      case "KMAC256":
        s = 4, this.m = h = 1088, this.X(t), this.v = -1, this.K = !0, this.M = !1, this.F = this._;
        break;
      case "CSHAKE128":
        this.m = h = 1344, s = this.O(t), this.v = -1, this.K = !0, this.M = !1, this.F = null;
        break;
      case "CSHAKE256":
        this.m = h = 1088, s = this.O(t), this.v = -1, this.K = !0, this.M = !1, this.F = null;
        break;
      default:
        throw new Error(B);
    }
    this.g = function(l, a, w, f, c) {
      return function(o, m, A, N, I, g, S) {
        let d, E, b = 0;
        const F = [], Y = I >>> 5, oe = m >>> 5;
        for (d = 0; d < oe && m >= I; d += Y)
          N = x(o.slice(d, d + Y), N), m -= I;
        for (o = o.slice(d), m %= I; o.length < Y; )
          o.push(0);
        for (d = m >>> 3, o[d >> 2] ^= g << d % 4 * 8, o[Y - 1] ^= 2147483648, N = x(o, N); 32 * F.length < S && (E = N[b % 5][b / 5 | 0], F.push(E.I), !(32 * F.length >= S)); )
          F.push(E.N), b += 1, 64 * b % I == 0 && (x(null, N), b = 0);
        return F;
      }(l, a, 0, f, h, s, c);
    }, u.hmacKey && this.k(U("hmacKey", u.hmacKey, this.T));
  }
  O(e, n) {
    const t = function(h) {
      const u = h || {};
      return { funcName: U("funcName", u.funcName, 1, { value: [], binLen: 0 }), customization: U("Customization", u.customization, 1, { value: [], binLen: 0 }) };
    }(e || {});
    n && (t.funcName = n);
    const s = P(O(t.funcName), O(t.customization));
    if (t.customization.binLen !== 0 || t.funcName.binLen !== 0) {
      const h = W(s, this.m >>> 3);
      for (let u = 0; u < h.length; u += this.m >>> 5)
        this.R = this.U(h.slice(u, u + (this.m >>> 5)), this.R), this.A += this.m;
      return 4;
    }
    return 31;
  }
  X(e) {
    const n = function(s) {
      const h = s || {};
      return { kmacKey: U("kmacKey", h.kmacKey, 1), funcName: { value: [1128353099], binLen: 32 }, customization: U("Customization", h.customization, 1, { value: [], binLen: 0 }) };
    }(e || {});
    this.O(e, n.funcName);
    const t = W(O(n.kmacKey), this.m >>> 3);
    for (let s = 0; s < t.length; s += this.m >>> 5)
      this.R = this.U(t.slice(s, s + (this.m >>> 5)), this.R), this.A += this.m;
    this.H = !0;
  }
  _(e) {
    const n = P({ value: this.h.slice(), binLen: this.u }, function(t) {
      let s, h, u = 0;
      const l = [0, 0], a = [4294967295 & t, t / 4294967296 & 2097151];
      for (s = 6; s >= 0; s--)
        h = a[s >> 2] >>> 8 * s & 255, h === 0 && u === 0 || (l[u >> 2] |= h << 8 * u, u += 1);
      return u = u !== 0 ? u : 1, l[u >> 2] |= u << 8 * u, { value: u + 1 > 4 ? l : [l[0]], binLen: 8 + 8 * u };
    }(e.outputLen));
    return this.g(n.value, n.binLen, this.A, this.B(this.R), e.outputLen);
  }
}
class Le {
  constructor(e, n, t) {
    if (e == "SHA-1")
      this.P = new le(e, n, t);
    else if (e == "SHA-224" || e == "SHA-256")
      this.P = new me(e, n, t);
    else if (e == "SHA-384" || e == "SHA-512")
      this.P = new be(e, n, t);
    else {
      if (e != "SHA3-224" && e != "SHA3-256" && e != "SHA3-384" && e != "SHA3-512" && e != "SHAKE128" && e != "SHAKE256" && e != "CSHAKE128" && e != "CSHAKE256" && e != "KMAC128" && e != "KMAC256")
        throw new Error(B);
      this.P = new ye(e, n, t);
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
const Ke = (() => {
  let i = [], e = "", n;
  const t = new Le("SHA-512", "TEXT", { encoding: "UTF8" }).update(window.webxdc.selfAddr).getHash("HEX"), s = "webxdc-scores.max_serial", h = "webxdc-scores.players";
  function u(f, c, ...o) {
    const m = document.createElement(f);
    return c && Object.entries(c).forEach((A) => {
      m.setAttribute(A[0], A[1]);
    }), m.append(...o), m;
  }
  function l(f) {
    return i[f] ? i[f].score : 0;
  }
  function a() {
    const f = Object.keys(i).map((c) => ({
      current: c === t,
      ...i[c]
    })).sort((c, o) => o.score - c.score);
    for (let c = 0; c < f.length; c++)
      f[c].pos = c + 1;
    return f;
  }
  function w() {
    if (!n)
      return;
    let f = a(), c = u("div");
    for (let o = 0; o < f.length; o++) {
      const m = f[o], A = u("span", { class: "row-pos" }, m.pos);
      A.innerHTML += ".&nbsp;&nbsp;", c.appendChild(
        u(
          "div",
          { class: "score-row" + (m.current ? " you" : "") },
          A,
          u("span", { class: "row-name" }, m.name),
          u("span", { class: "row-score" }, m.score)
        )
      );
    }
    n.innerHTML = c.innerHTML;
  }
  return {
    selfID: t,
    init: (f, c) => (e = f, c && (n = document.getElementById(c)), i = JSON.parse(localStorage.getItem(h) || "{}"), w(), window.webxdc.setUpdateListener((o) => {
      const m = o.payload;
      (m.force || m.score > l(m.id)) && (i[m.id] = { name: m.name, score: m.score }), o.serial === o.max_serial && (localStorage.setItem(h, JSON.stringify(i)), localStorage.setItem(s, o.max_serial), w());
    }, parseInt(localStorage.getItem(s) || 0))),
    getScore: () => l(t),
    setScore: function(f, c = !1) {
      const o = this.getScore();
      if (f > o || c) {
        const m = window.webxdc.selfName;
        i[t] = { name: m, score: f };
        let A = m + " scored " + f;
        e && (A += " in " + e), window.webxdc.sendUpdate(
          {
            payload: {
              id: t,
              name: m,
              score: f,
              force: c
            },
            info: A
          },
          A
        );
      } else
        console.log("[webxdc-score] Ignoring score: " + f + " <= " + o);
    },
    getHighScores: a
  };
})();
window.highscores = Ke;
export {
  Ke as highscores
};
