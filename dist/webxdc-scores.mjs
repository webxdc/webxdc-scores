const W = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", ee = "ARRAYBUFFER not supported by this environment", te = "UINT8ARRAY not supported by this environment";
function z(s, e, n, t) {
  let i, h, a;
  const l = e || [0], u = (n = n || 0) >>> 3, w = t === -1 ? 3 : 0;
  for (i = 0; i < s.length; i += 1) a = i + u, h = a >>> 2, l.length <= h && l.push(0), l[h] |= s[i] << 8 * (w + t * (a % 4));
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
        return function(a, l, u, w) {
          let f, o, c, p;
          if (a.length % 2 != 0) throw new Error("String of HEX type must be in byte increments");
          const A = l || [0], I = (u = u || 0) >>> 3, N = w === -1 ? 3 : 0;
          for (f = 0; f < a.length; f += 2) {
            if (o = parseInt(a.substr(f, 2), 16), isNaN(o)) throw new Error("String of HEX type contains invalid characters");
            for (p = (f >>> 1) + I, c = p >>> 2; A.length <= c; ) A.push(0);
            A[c] |= o << 8 * (N + w * (p % 4));
          }
          return { value: A, binLen: 4 * a.length + u };
        }(t, i, h, n);
      };
    case "TEXT":
      return function(t, i, h) {
        return function(a, l, u, w, f) {
          let o, c, p, A, I, N, b, g, H = 0;
          const E = u || [0], v = (w = w || 0) >>> 3;
          if (l === "UTF8") for (b = f === -1 ? 3 : 0, p = 0; p < a.length; p += 1) for (o = a.charCodeAt(p), c = [], 128 > o ? c.push(o) : 2048 > o ? (c.push(192 | o >>> 6), c.push(128 | 63 & o)) : 55296 > o || 57344 <= o ? c.push(224 | o >>> 12, 128 | o >>> 6 & 63, 128 | 63 & o) : (p += 1, o = 65536 + ((1023 & o) << 10 | 1023 & a.charCodeAt(p)), c.push(240 | o >>> 18, 128 | o >>> 12 & 63, 128 | o >>> 6 & 63, 128 | 63 & o)), A = 0; A < c.length; A += 1) {
            for (N = H + v, I = N >>> 2; E.length <= I; ) E.push(0);
            E[I] |= c[A] << 8 * (b + f * (N % 4)), H += 1;
          }
          else for (b = f === -1 ? 2 : 0, g = l === "UTF16LE" && f !== 1 || l !== "UTF16LE" && f === 1, p = 0; p < a.length; p += 1) {
            for (o = a.charCodeAt(p), g === !0 && (A = 255 & o, o = A << 8 | o >>> 8), N = H + v, I = N >>> 2; E.length <= I; ) E.push(0);
            E[I] |= o << 8 * (b + f * (N % 4)), H += 2;
          }
          return { value: E, binLen: 8 * H + w };
        }(t, e, i, h, n);
      };
    case "B64":
      return function(t, i, h) {
        return function(a, l, u, w) {
          let f, o, c, p, A, I, N, b = 0;
          const g = l || [0], H = (u = u || 0) >>> 3, E = w === -1 ? 3 : 0, v = a.indexOf("=");
          if (a.search(/^[a-zA-Z0-9=+/]+$/) === -1) throw new Error("Invalid character in base-64 string");
          if (a = a.replace(/=/g, ""), v !== -1 && v < a.length) throw new Error("Invalid '=' found in base-64 string");
          for (o = 0; o < a.length; o += 4) {
            for (A = a.substr(o, 4), p = 0, c = 0; c < A.length; c += 1) f = W.indexOf(A.charAt(c)), p |= f << 18 - 6 * c;
            for (c = 0; c < A.length - 1; c += 1) {
              for (N = b + H, I = N >>> 2; g.length <= I; ) g.push(0);
              g[I] |= (p >>> 16 - 8 * c & 255) << 8 * (E + w * (N % 4)), b += 1;
            }
          }
          return { value: g, binLen: 8 * b + u };
        }(t, i, h, n);
      };
    case "BYTES":
      return function(t, i, h) {
        return function(a, l, u, w) {
          let f, o, c, p;
          const A = l || [0], I = (u = u || 0) >>> 3, N = w === -1 ? 3 : 0;
          for (o = 0; o < a.length; o += 1) f = a.charCodeAt(o), p = o + I, c = p >>> 2, A.length <= c && A.push(0), A[c] |= f << 8 * (N + w * (p % 4));
          return { value: A, binLen: 8 * a.length + u };
        }(t, i, h, n);
      };
    case "ARRAYBUFFER":
      try {
        new ArrayBuffer(0);
      } catch {
        throw new Error(ee);
      }
      return function(t, i, h) {
        return function(a, l, u, w) {
          return z(new Uint8Array(a), l, u, w);
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
function D(s, e, n, t) {
  switch (s) {
    case "HEX":
      return function(i) {
        return function(h, a, l, u) {
          const w = "0123456789abcdef";
          let f, o, c = "";
          const p = a / 8, A = l === -1 ? 3 : 0;
          for (f = 0; f < p; f += 1) o = h[f >>> 2] >>> 8 * (A + l * (f % 4)), c += w.charAt(o >>> 4 & 15) + w.charAt(15 & o);
          return u.outputUpper ? c.toUpperCase() : c;
        }(i, e, n, t);
      };
    case "B64":
      return function(i) {
        return function(h, a, l, u) {
          let w, f, o, c, p, A = "";
          const I = a / 8, N = l === -1 ? 3 : 0;
          for (w = 0; w < I; w += 3) for (c = w + 1 < I ? h[w + 1 >>> 2] : 0, p = w + 2 < I ? h[w + 2 >>> 2] : 0, o = (h[w >>> 2] >>> 8 * (N + l * (w % 4)) & 255) << 16 | (c >>> 8 * (N + l * ((w + 1) % 4)) & 255) << 8 | p >>> 8 * (N + l * ((w + 2) % 4)) & 255, f = 0; f < 4; f += 1) A += 8 * w + 6 * f <= a ? W.charAt(o >>> 6 * (3 - f) & 63) : u.b64Pad;
          return A;
        }(i, e, n, t);
      };
    case "BYTES":
      return function(i) {
        return function(h, a, l) {
          let u, w, f = "";
          const o = a / 8, c = l === -1 ? 3 : 0;
          for (u = 0; u < o; u += 1) w = h[u >>> 2] >>> 8 * (c + l * (u % 4)) & 255, f += String.fromCharCode(w);
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
        return function(h, a, l) {
          let u;
          const w = a / 8, f = new ArrayBuffer(w), o = new Uint8Array(f), c = l === -1 ? 3 : 0;
          for (u = 0; u < w; u += 1) o[u] = h[u >>> 2] >>> 8 * (c + l * (u % 4)) & 255;
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
        return function(h, a, l) {
          let u;
          const w = a / 8, f = l === -1 ? 3 : 0, o = new Uint8Array(w);
          for (u = 0; u < w; u += 1) o[u] = h[u >>> 2] >>> 8 * (f + l * (u % 4)) & 255;
          return o;
        }(i, e, n);
      };
    default:
      throw new Error("format must be HEX, B64, BYTES, ARRAYBUFFER, or UINT8ARRAY");
  }
}
const k = 4294967296, m = [1116352408, 1899447441, 3049323471, 3921009573, 961987163, 1508970993, 2453635748, 2870763221, 3624381080, 310598401, 607225278, 1426881987, 1925078388, 2162078206, 2614888103, 3248222580, 3835390401, 4022224774, 264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986, 2554220882, 2821834349, 2952996808, 3210313671, 3336571891, 3584528711, 113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291, 1695183700, 1986661051, 2177026350, 2456956037, 2730485921, 2820302411, 3259730800, 3345764771, 3516065817, 3600352804, 4094571909, 275423344, 430227734, 506948616, 659060556, 883997877, 958139571, 1322822218, 1537002063, 1747873779, 1955562222, 2024104815, 2227730452, 2361852424, 2428436474, 2756734187, 3204031479, 3329325298], L = [3238371032, 914150663, 812702999, 4144912697, 4290775857, 1750603025, 1694076839, 3204075428], U = [1779033703, 3144134277, 1013904242, 2773480762, 1359893119, 2600822924, 528734635, 1541459225], B = "Chosen SHA variant is not supported", ne = "Cannot set numRounds with MAC";
function P(s, e) {
  let n, t;
  const i = s.binLen >>> 3, h = e.binLen >>> 3, a = i << 3, l = 4 - i << 3;
  if (i % 4 != 0) {
    for (n = 0; n < h; n += 4) t = i + n >>> 2, s.value[t] |= e.value[n >>> 2] << a, s.value.push(0), s.value[t + 1] |= e.value[n >>> 2] >>> l;
    return (s.value.length << 2) - 4 >= h + i && s.value.pop(), { value: s.value, binLen: s.binLen + e.binLen };
  }
  return { value: s.value.concat(e.value), binLen: s.binLen + e.binLen };
}
function $(s) {
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
    const i = this.m >>> 5, h = this.C(e, this.h, this.u), a = h.binLen, l = h.value, u = a >>> 5;
    for (n = 0; n < u; n += i) t + this.m <= a && (this.U = this.v(l.slice(n, n + i), this.U), t += this.m);
    return this.A += t, this.h = l.slice(t >>> 5), this.u = a % this.m, this.l = !0, this;
  }
  getHash(e, n) {
    let t, i, h = this.R;
    const a = $(n);
    if (this.K) {
      if (a.outputLen === -1) throw new Error("Output length must be specified in options");
      h = a.outputLen;
    }
    const l = D(e, h, this.T, a);
    if (this.H && this.g) return l(this.g(a));
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
    const t = $(n);
    return D(e, this.R, this.T, t)(this.Y());
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
function j(s, e, n) {
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
  let n, t, i, h, a, l, u;
  const w = [];
  for (n = e[0], t = e[1], i = e[2], h = e[3], a = e[4], u = 0; u < 80; u += 1) w[u] = u < 16 ? s[u] : T(w[u - 3] ^ w[u - 8] ^ w[u - 14] ^ w[u - 16], 1), l = u < 20 ? M(T(n, 5), ie(t, i, h), a, 1518500249, w[u]) : u < 40 ? M(T(n, 5), j(t, i, h), a, 1859775393, w[u]) : u < 60 ? M(T(n, 5), re(t, i, h), a, 2400959708, w[u]) : M(T(n, 5), j(t, i, h), a, 3395469782, w[u]), a = h, h = i, i = T(t, 30), t = n, n = l;
  return e[0] = d(n, e[0]), e[1] = d(t, e[1]), e[2] = d(i, e[2]), e[3] = d(h, e[3]), e[4] = d(a, e[4]), e;
}
function pe(s, e, n, t) {
  let i;
  const h = 15 + (e + 65 >>> 9 << 4), a = e + n;
  for (; s.length <= h; ) s.push(0);
  for (s[e >>> 5] |= 128 << 24 - e % 32, s[h] = 4294967295 & a, s[h - 1] = a / k | 0, i = 0; i < s.length; i += 16) t = oe(s.slice(i, i + 16), t);
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
function J(s) {
  let e;
  return e = s == "SHA-224" ? L.slice() : U.slice(), e;
}
function V(s, e) {
  let n, t, i, h, a, l, u, w, f, o, c;
  const p = [];
  for (n = e[0], t = e[1], i = e[2], h = e[3], a = e[4], l = e[5], u = e[6], w = e[7], c = 0; c < 64; c += 1) p[c] = c < 16 ? s[c] : we(R(A = p[c - 2], 17) ^ R(A, 19) ^ se(A, 10), p[c - 7], fe(p[c - 15]), p[c - 16]), f = M(w, le(a), ie(a, l, u), m[c], p[c]), o = d(ae(n), re(n, t, i)), w = u, u = l, l = a, a = d(h, f), h = i, i = t, t = n, n = d(f, o);
  var A;
  return e[0] = d(n, e[0]), e[1] = d(t, e[1]), e[2] = d(i, e[2]), e[3] = d(h, e[3]), e[4] = d(a, e[4]), e[5] = d(l, e[5]), e[6] = d(u, e[6]), e[7] = d(w, e[7]), e;
}
let Ie = class extends O {
  constructor(s, e, n) {
    if (s !== "SHA-224" && s !== "SHA-256") throw new Error(B);
    super(s, e, n);
    const t = n || {};
    this.g = this.Y, this.M = !0, this.T = -1, this.C = C(this.t, this.i, this.T), this.v = V, this.L = function(i) {
      return i.slice();
    }, this.B = J, this.F = function(i, h, a, l) {
      return function(u, w, f, o, c) {
        let p, A;
        const I = 15 + (w + 65 >>> 9 << 4), N = w + f;
        for (; u.length <= I; ) u.push(0);
        for (u[w >>> 5] |= 128 << 24 - w % 32, u[I] = 4294967295 & N, u[I - 1] = N / k | 0, p = 0; p < u.length; p += 16) o = V(u.slice(p, p + 16), o);
        return A = c === "SHA-224" ? [o[0], o[1], o[2], o[3], o[4], o[5], o[6]] : o, A;
      }(i, h, a, l, s);
    }, this.U = J(s), this.m = 512, this.R = s === "SHA-224" ? 224 : 256, this.K = !1, t.hmacKey && this.k(K("hmacKey", t.hmacKey, this.T));
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
function Ne(s, e, n) {
  return new r(s.N & e.N ^ s.N & n.N ^ e.N & n.N, s.I & e.I ^ s.I & n.I ^ e.I & n.I);
}
function ge(s) {
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
  const a = (65535 & h) << 16 | 65535 & i;
  return i = (65535 & s.N) + (65535 & e.N) + (65535 & n.N) + (65535 & t.N) + (h >>> 16), h = (s.N >>> 16) + (e.N >>> 16) + (n.N >>> 16) + (t.N >>> 16) + (i >>> 16), new r((65535 & h) << 16 | 65535 & i, a);
}
function be(s, e, n, t, i) {
  let h, a;
  h = (65535 & s.I) + (65535 & e.I) + (65535 & n.I) + (65535 & t.I) + (65535 & i.I), a = (s.I >>> 16) + (e.I >>> 16) + (n.I >>> 16) + (t.I >>> 16) + (i.I >>> 16) + (h >>> 16);
  const l = (65535 & a) << 16 | 65535 & h;
  return h = (65535 & s.N) + (65535 & e.N) + (65535 & n.N) + (65535 & t.N) + (65535 & i.N) + (a >>> 16), a = (s.N >>> 16) + (e.N >>> 16) + (n.N >>> 16) + (t.N >>> 16) + (i.N >>> 16) + (h >>> 16), new r((65535 & a) << 16 | 65535 & h, l);
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
const Se = [new r(m[0], 3609767458), new r(m[1], 602891725), new r(m[2], 3964484399), new r(m[3], 2173295548), new r(m[4], 4081628472), new r(m[5], 3053834265), new r(m[6], 2937671579), new r(m[7], 3664609560), new r(m[8], 2734883394), new r(m[9], 1164996542), new r(m[10], 1323610764), new r(m[11], 3590304994), new r(m[12], 4068182383), new r(m[13], 991336113), new r(m[14], 633803317), new r(m[15], 3479774868), new r(m[16], 2666613458), new r(m[17], 944711139), new r(m[18], 2341262773), new r(m[19], 2007800933), new r(m[20], 1495990901), new r(m[21], 1856431235), new r(m[22], 3175218132), new r(m[23], 2198950837), new r(m[24], 3999719339), new r(m[25], 766784016), new r(m[26], 2566594879), new r(m[27], 3203337956), new r(m[28], 1034457026), new r(m[29], 2466948901), new r(m[30], 3758326383), new r(m[31], 168717936), new r(m[32], 1188179964), new r(m[33], 1546045734), new r(m[34], 1522805485), new r(m[35], 2643833823), new r(m[36], 2343527390), new r(m[37], 1014477480), new r(m[38], 1206759142), new r(m[39], 344077627), new r(m[40], 1290863460), new r(m[41], 3158454273), new r(m[42], 3505952657), new r(m[43], 106217008), new r(m[44], 3606008344), new r(m[45], 1432725776), new r(m[46], 1467031594), new r(m[47], 851169720), new r(m[48], 3100823752), new r(m[49], 1363258195), new r(m[50], 3750685593), new r(m[51], 3785050280), new r(m[52], 3318307427), new r(m[53], 3812723403), new r(m[54], 2003034995), new r(m[55], 3602036899), new r(m[56], 1575990012), new r(m[57], 1125592928), new r(m[58], 2716904306), new r(m[59], 442776044), new r(m[60], 593698344), new r(m[61], 3733110249), new r(m[62], 2999351573), new r(m[63], 3815920427), new r(3391569614, 3928383900), new r(3515267271, 566280711), new r(3940187606, 3454069534), new r(4118630271, 4000239992), new r(116418474, 1914138554), new r(174292421, 2731055270), new r(289380356, 3203993006), new r(460393269, 320620315), new r(685471733, 587496836), new r(852142971, 1086792851), new r(1017036298, 365543100), new r(1126000580, 2618297676), new r(1288033470, 3409855158), new r(1501505948, 4234509866), new r(1607167915, 987167468), new r(1816402316, 1246189591)];
function q(s) {
  return s === "SHA-384" ? [new r(3418070365, L[0]), new r(1654270250, L[1]), new r(2438529370, L[2]), new r(355462360, L[3]), new r(1731405415, L[4]), new r(41048885895, L[5]), new r(3675008525, L[6]), new r(1203062813, L[7])] : [new r(U[0], 4089235720), new r(U[1], 2227873595), new r(U[2], 4271175723), new r(U[3], 1595750129), new r(U[4], 2917565137), new r(U[5], 725511199), new r(U[6], 4215389547), new r(U[7], 327033209)];
}
function G(s, e) {
  let n, t, i, h, a, l, u, w, f, o, c, p;
  const A = [];
  for (n = e[0], t = e[1], i = e[2], h = e[3], a = e[4], l = e[5], u = e[6], w = e[7], c = 0; c < 80; c += 1) c < 16 ? (p = 2 * c, A[c] = new r(s[p], s[p + 1])) : A[c] = de(Ee(A[c - 2]), A[c - 7], He(A[c - 15]), A[c - 16]), f = be(w, ve(a), (N = l, b = u, new r((I = a).N & N.N ^ ~I.N & b.N, I.I & N.I ^ ~I.I & b.I)), Se[c], A[c]), o = S(ge(n), Ne(n, t, i)), w = u, u = l, l = a, a = S(h, f), h = i, i = t, t = n, n = S(f, o);
  var I, N, b;
  return e[0] = S(n, e[0]), e[1] = S(t, e[1]), e[2] = S(i, e[2]), e[3] = S(h, e[3]), e[4] = S(a, e[4]), e[5] = S(l, e[5]), e[6] = S(u, e[6]), e[7] = S(w, e[7]), e;
}
let Re = class extends O {
  constructor(s, e, n) {
    if (s !== "SHA-384" && s !== "SHA-512") throw new Error(B);
    super(s, e, n);
    const t = n || {};
    this.g = this.Y, this.M = !0, this.T = -1, this.C = C(this.t, this.i, this.T), this.v = G, this.L = function(i) {
      return i.slice();
    }, this.B = q, this.F = function(i, h, a, l) {
      return function(u, w, f, o, c) {
        let p, A;
        const I = 31 + (w + 129 >>> 10 << 5), N = w + f;
        for (; u.length <= I; ) u.push(0);
        for (u[w >>> 5] |= 128 << 24 - w % 32, u[I] = 4294967295 & N, u[I - 1] = N / k | 0, p = 0; p < u.length; p += 32) o = G(u.slice(p, p + 32), o);
        return A = c === "SHA-384" ? [o[0].N, o[0].I, o[1].N, o[1].I, o[2].N, o[2].I, o[3].N, o[3].I, o[4].N, o[4].I, o[5].N, o[5].I] : [o[0].N, o[0].I, o[1].N, o[1].I, o[2].N, o[2].I, o[3].N, o[3].I, o[4].N, o[4].I, o[5].N, o[5].I, o[6].N, o[6].I, o[7].N, o[7].I], A;
      }(i, h, a, l, s);
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
  const a = [], l = [];
  if (s !== null) for (t = 0; t < s.length; t += 2) e[(t >>> 1) % 5][(t >>> 1) / 5 | 0] = F(e[(t >>> 1) % 5][(t >>> 1) / 5 | 0], new r(s[t + 1], s[t]));
  for (n = 0; n < 24; n += 1) {
    for (h = _(), t = 0; t < 5; t += 1) a[t] = (u = e[t][0], w = e[t][1], f = e[t][2], o = e[t][3], c = e[t][4], new r(u.N ^ w.N ^ f.N ^ o.N ^ c.N, u.I ^ w.I ^ f.I ^ o.I ^ c.I));
    for (t = 0; t < 5; t += 1) l[t] = F(a[(t + 4) % 5], Z(a[(t + 1) % 5], 1));
    for (t = 0; t < 5; t += 1) for (i = 0; i < 5; i += 1) e[t][i] = F(e[t][i], l[t]);
    for (t = 0; t < 5; t += 1) for (i = 0; i < 5; i += 1) h[i][(2 * t + 3 * i) % 5] = Z(e[t][i], Le[t][i]);
    for (t = 0; t < 5; t += 1) for (i = 0; i < 5; i += 1) e[t][i] = F(h[t][i], new r(~h[(t + 1) % 5][i].N & h[(t + 2) % 5][i].N, ~h[(t + 1) % 5][i].I & h[(t + 2) % 5][i].I));
    e[0][0] = F(e[0][0], ye[n]);
  }
  var u, w, f, o, c;
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
    this.F = function(a, l, u, w, f) {
      return function(o, c, p, A, I, N, b) {
        let g, H, E = 0;
        const v = [], Y = I >>> 5, ce = c >>> 5;
        for (g = 0; g < ce && c >= I; g += Y) A = x(o.slice(g, g + Y), A), c -= I;
        for (o = o.slice(g), c %= I; o.length < Y; ) o.push(0);
        for (g = c >>> 3, o[g >> 2] ^= N << g % 4 * 8, o[Y - 1] ^= 2147483648, A = x(o, A); 32 * v.length < b && (H = A[E % 5][E / 5 | 0], v.push(H.I), !(32 * v.length >= b)); ) v.push(H.N), E += 1, 64 * E % I == 0 && (x(null, A), E = 0);
        return v;
      }(a, l, 0, w, i, t, f);
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
      const a = [0, 0], l = [4294967295 & n, n / k & 2097151];
      for (t = 6; t >= 0; t--) i = l[t >> 2] >>> 8 * t & 255, i === 0 && h === 0 || (a[h >> 2] |= i << 8 * h, h += 1);
      return h = h !== 0 ? h : 1, a[h >> 2] |= h << 8 * h, { value: h + 1 > 4 ? a : [a[0]], binLen: 8 + 8 * h };
    }(s.outputLen));
    return this.F(e.value, e.binLen, this.A, this.L(this.U), s.outputLen);
  }
};
class Te {
  constructor(e, n, t) {
    if (e == "SHA-1") this.P = new Ae(e, n, t);
    else if (e == "SHA-224" || e == "SHA-256") this.P = new Ie(e, n, t);
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
  let s = {}, e = (u, w) => `${u} scored ${w}`, n = (u, w) => u - w, t = () => {
  };
  const i = "_webxdc-scores_.max_serial", h = "_webxdc-scores_.scoreboards", a = (u, w, ...f) => {
    const o = document.createElement(u);
    return w && Object.entries(w).forEach((c) => {
      o.setAttribute(c[0], c[1]);
    }), o.append(...f), o;
  }, l = (u, w) => {
    const f = s[w] || {};
    return f[u] ? f[u].score : 0;
  };
  return {
    selfID: new Te("SHA-512", "TEXT", { encoding: "UTF8" }).update(window.webxdc.selfAddr).getHash("HEX"),
    init: function({
      getAnnouncement: u,
      compareScores: w,
      onHighscoresChanged: f
    } = {}) {
      u && (e = u), w && (n = w), f && (t = f), s = JSON.parse(localStorage.getItem(h) || "{}");
      for (const o of Object.keys(s))
        t(o);
      return window.webxdc.setUpdateListener(
        (o) => {
          const c = o.payload, p = c.scoreboard;
          (c.force || n(c.score, l(c.id, p), p) > 0) && (s[p] === void 0 && (s[p] = {}), s[p][c.id] = {
            name: c.name,
            score: c.score
          }), o.serial === o.max_serial && (localStorage.setItem(h, JSON.stringify(s)), localStorage.setItem(i, o.max_serial), t(p));
        },
        parseInt(localStorage.getItem(i) || 0)
      );
    },
    getScore: function(u) {
      return l(this.selfID, u);
    },
    setScore: function(u, w = !1, f = void 0) {
      const o = this.getScore(f), c = this.selfID;
      if (w || n(u, o, f) > 0) {
        s[f] === void 0 && (s[f] = {});
        const p = window.webxdc.selfName;
        s[f][c] = { name: p, score: u };
        const A = e(p, u, f);
        window.webxdc.sendUpdate(
          {
            payload: {
              id: c,
              name: p,
              score: u,
              force: w,
              scoreboard: f
            },
            info: A
          },
          ""
        );
      } else
        console.log(`[webxdc-score] Ignoring score: ${u} <= ${o}`);
    },
    getHighScores: function(u) {
      const w = s[u] || {}, f = this.selfID, o = Object.keys(w).map((c) => ({
        current: c === f,
        ...w[c]
      })).sort((c, p) => n(p.score, c.score, u));
      for (let c = 0; c < o.length; c++)
        o[c].pos = c + 1;
      return o;
    },
    renderScoreboard: function(u) {
      let w = this.getHighScores(u), f = a("div");
      for (const o of w) {
        const c = a("span", { class: "row-pos" }, o.pos);
        c.innerHTML += ".&nbsp;&nbsp;", f.appendChild(
          a(
            "div",
            { class: "score-row" + (o.current ? " you" : "") },
            c,
            a("span", { class: "row-name" }, o.name),
            a("span", { class: "row-score" }, o.score)
          )
        );
      }
      return f;
    }
  };
})();
window.highscores = Ce;
export {
  Ce as highscores
};
