/* ----------------------------
   Prime-Resonance — script.js
   ---------------------------- */

/* ---------- Helpers ---------- */
const $ = (id) => document.getElementById(id);

const parseBigInt = (s) => {
  if (!s) return null;
  const t = s.replace(/[\s_,]/g, '').trim();
  if (!/^[+-]?\d+$/.test(t)) return null;
  return BigInt(t);
};
const toStr = (x) => x.toString();

/* ---------- Modular arithmetic (BigInt) ---------- */
const modAdd = (a, b, m) => {
  a %= m; b %= m;
  let r = a + b;
  return r >= m ? r - m : r;
};
const modSub = (a, b, m) => {
  a %= m; b %= m;
  let r = a - b;
  return r < 0n ? r + m : r;
};
const modMul = (a, b, m) => {
  a %= m; b %= m;
  let r = 0n;
  while (b > 0n) {
    if (b & 1n) r = (r + a) % m;
    a = (a + a) % m;
    b >>= 1n;
  }
  return r;
};
const modPow = (a, e, m) => {
  a %= m;
  let r = 1n;
  while (e > 0n) {
    if (e & 1n) r = modMul(r, a, m);
    a = modMul(a, a, m);
    e >>= 1n;
  }
  return r;
};

const gcd = (a, b) => {
  a = a < 0n ? -a : a;
  b = b < 0n ? -b : b;
  while (b) {
    const t = a % b; a = b; b = t;
  }
  return a;
};

/* ---------- Small primes (for trial division) ---------- */
const SMALL_PRIMES = (() => {
  const lim = 7919; // primes up to 7919 (~1e4 ops worst)
  const sieve = new Uint8Array(lim + 1);
  sieve.fill(1); sieve[0] = 0; sieve[1] = 0;
  for (let p = 2; p * p <= lim; p++) {
    if (sieve[p]) for (let q = p * p; q <= lim; q += p) sieve[q] = 0;
  }
  const arr = [];
  for (let i = 2; i <= lim; i++) if (sieve[i]) arr.push(BigInt(i));
  return arr;
})();

/* ---------- Miller–Rabin (BigInt) ---------- */
function isProbablePrime(n) {
  n = BigInt(n);
  if (n < 2n) return false;
  // quick small-primes check
  for (const p of [2n,3n,5n,7n,11n,13n,17n,19n,23n,29n,31n,37n]) {
    if (n === p) return true;
    if (n % p === 0n) return false;
  }
  // write n-1 = d * 2^s
  let d = n - 1n, s = 0n;
  while ((d & 1n) === 0n) { d >>= 1n; s++; }

  // Deterministic for n < 2^64; probabilistic otherwise
  const bases = (n < (2n ** 64n))
    ? [2n, 325n, 9375n, 28178n, 450775n, 9780504n, 1795265022n]
    : [2n,3n,5n,7n,11n,13n,17n,19n,23n];

  const trial = (a) => {
    if (a % n === 0n) return true;
    let x = modPow(a, d, n);
    if (x === 1n || x === n - 1n) return true;
    for (let r = 1n; r < s; r++) {
      x = modMul(x, x, n);
      if (x === n - 1n) return true;
    }
    return false;
  };

  for (const a of bases) if (!trial(a)) return false;
  return true;
}

/* ---------- Small factor via trial division ---------- */
function smallFactor(n) {
  n = n < 0n ? -n : n;
  for (const p of SMALL_PRIMES) {
    if (p * p > n) break;
    if (n % p === 0n) return p;
  }
  return null;
}

/* ---------- Goldbach: non-blocking finder ---------- */
let stopFlag = false;

function goldbachFind(E, onUpdate) {
  stopFlag = false;
  if (E % 2n !== 0n || E <= 4n) {
    onUpdate({ err: "E must be even and > 4." });
    return;
  }
  const m = E / 2n;

  // simple CRT-esque filter for mod 3 to cut useless t
  const tAdmissible = (t) => {
    if (E % 3n === 0n) return (t % 3n) !== 0n; // avoid multiples of 3
    return (t % 3n) === 0n;                    // prefer multiples of 3
  };

  let t = 1n;
  const CHUNK = 2000; // work per frame to keep UI responsive

  (function loop() {
    if (stopFlag) return;
    let count = 0;
    while (count < CHUNK) {
      if (tAdmissible(t)) {
        const p = m - t, q = m + t;
        if (p > 1n && isProbablePrime(p) && isProbablePrime(q)) {
          onUpdate({ p, q, t });
          return;
        }
      }
      t += 1n; count++;
    }
    onUpdate({ scan: t });
    setTimeout(loop, 0); // yield to UI
  })();
}
function goldbachStop() { stopFlag = true; }

/* ---------- UI Wiring ---------- */
function setupUI() {
  const outPrime = $("outPrime");
  const outGoldbach = $("outGoldbach");

  $("btnPrime")?.addEventListener("click", () => {
    const n = parseBigInt($("n").value);
    if (n === null) {
      outPrime.innerHTML = `<span class="pill bad">ERR</span> Enter an integer.`;
      return;
    }
    const prime = isProbablePrime(n);
    outPrime.innerHTML = prime
      ? `<span class="pill ok">PRIME</span> ${toStr(n)}`
      : `<span class="pill bad">COMPOSITE</span> ${toStr(n)} <span class="muted">(probabilistic MR)</span>`;
  });

  $("btnFactor")?.addEventListener("click", () => {
    const n = parseBigInt($("n").value);
    if (n === null) {
      outPrime.innerHTML = `<span class="pill bad">ERR</span> Enter an integer.`;
      return;
    }
    if (isProbablePrime(n)) {
      outPrime.innerHTML = `<span class="pill ok">PRIME</span> No small factor.`;
      return;
    }
    const f = smallFactor(n);
    outPrime.innerHTML = f
      ? `<span class="pill bad">FACTOR</span> small factor ≈ ${toStr(f)}`
      : `<span class="pill bad">NO SMALL FACTOR</span> Try ECM/MPQS offline.`;
  });

  $("btnGoldbach")?.addEventListener("click", () => {
    const E = parseBigInt($("E").value);
    if (E === null) {
      outGoldbach.innerHTML = `<span class="pill bad">ERR</span> Enter an even integer.`;
      return;
    }
    outGoldbach.textContent = "Searching… (chunked)";
    goldbachFind(E, ({ p, q, t, err, scan }) => {
      if (err) { outGoldbach.innerHTML = `<span class="pill bad">ERR</span> ${err}`; return; }
      if (p && q) {
        outGoldbach.innerHTML =
          `<span class="pill ok">FOUND</span> E = ${toStr(E)} = <b>${toStr(p)}</b> + <b>${toStr(q)}</b> (t = ${toStr(t)})`;
      } else if (scan) {
        outGoldbach.textContent = `Scanning t up to ${toStr(scan)}…`;
      }
    });
  });

  $("btnStop")?.addEventListener("click", () => {
    goldbachStop();
    outGoldbach.textContent = "Stopped.";
  });
}

document.addEventListener("DOMContentLoaded", setupUI);

/* ---------- Optional exports (for debugging in console) ---------- */
window.PrimeResonance = {
  parseBigInt, isProbablePrime, smallFactor,
  goldbachFind, goldbachStop,
  modAdd, modSub, modMul, modPow, gcd
};
