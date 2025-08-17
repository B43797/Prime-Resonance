# Prime-Resonance 🔔✨

![Primality Test](https://img.shields.io/badge/Feature-Primality%20Test-green)  
![Goldbach Pairs](https://img.shields.io/badge/Feature-Goldbach%20Pairs-blue)  
![Factorization](https://img.shields.io/badge/Feature-Factorization-orange)  
![Math Research](https://img.shields.io/badge/Context-Riemann%20%26%20Goldbach-purple)

**Prime-Resonance** is an experimental web tool based on the idea of *resonance symmetry*.  
It can test whether a number is prime, attempt to find a prime factor of an odd composite number, and display Goldbach pairs for even numbers.

---

## 🚀 Features
- **Primality Test** → enter any integer and check if it is prime.  
- **Factorization (Odd Numbers)** → apply the fractional resonance method to try to detect one prime factor.  
- **Goldbach Pairs** → for an even number *E*, find prime pairs *(p, q)* such that **p + q = E**.  

---

## 📖 How It Works
The site is built entirely in **HTML + CSS + JavaScript**.  
It uses a resonance-inspired algorithm:
- For primality: quick division checks up to √n.  
- For factorization: resonance fractions of type `O / (X + d)` with corrections by powers of 2.  
- For Goldbach: searches primes around `E/2` until a valid pair *(p, q)* is found.  

---

## 🌐 Live Demo
👉 [Prime-Resonance on GitHub Pages](https://YOUR_USERNAME.github.io/Prime-Resonance/)  

---

## 📂 Project Structure---

## 🧑‍🔬 Author
Created by **Bahbouhi Bouchaib**  
Independent researcher in mathematics (Nantes, France).  

---

## ⚠️ Disclaimer
This project is a mathematical experiment.  
It is **not** optimized for very large numbers (JavaScript limits apply, typically ≤ 10^15–10^18).  
For extremely large numbers, use specialized software or number theory libraries.

---

## 🔗 Deeper Mathematical Context
The **resonance symmetry** idea suggests that:
- Prime numbers can be detected through oscillatory structures similar to wave resonance.  
- Goldbach pairs naturally emerge from the symmetry of primes around **E/2**.  
- This approach conceptually connects to the **Riemann Hypothesis**, since both rely on prime distribution symmetry.  

In this vision:  
**Resonance → Goldbach pairs → Symmetry on Re(s) = 1/2 (Riemann line)**.  

Thus, exploring resonance experimentally may provide insights into two of the most profound open problems in mathematics:  
the **Goldbach Conjecture** and the **Riemann Hypothesis**.
