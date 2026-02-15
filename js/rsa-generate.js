// ===== rsa-generate.js =====
// Card 5: RSA Key Generation

// Helper function to check if a number is prime
function isPrime(num) {
    if (num <= 1) return false;
    if (num <= 3) return true;
    if (num % 2 === 0 || num % 3 === 0) return false;
    
    for (let i = 5; i * i <= num; i += 6) {
        if (num % i === 0 || num % (i + 2) === 0) return false;
    }
    return true;
}

// Helper function to find greatest common divisor
function gcd(a, b) {
    return b === 0 ? a : gcd(b, a % b);
}

// Helper function to find modular inverse
function modInverse(e, phi) {
    for (let d = 1; d < phi; d++) {
        if ((e * d) % phi === 1) return d;
    }
    return -1;
}

// Generate RSA Keys
function generateRSAKeys(p, q) {
    // Check if inputs are prime
    if (!isPrime(p) || !isPrime(q)) {
        return { error: "Both inputs must be prime numbers!" };
    }
    
    if (p === q) {
        return { error: "p and q must be different prime numbers!" };
    }
    
    // Calculate n = p * q
    const n = p * q;
    
    // Calculate φ(n) = (p-1) * (q-1)
    const phi = (p - 1) * (q - 1);
    
    // Choose e (public key exponent)
    let e = 2;
    while (e < phi) {
        if (gcd(e, phi) === 1) break;
        e++;
    }
    
    // Calculate d (private key exponent)
    const d = modInverse(e, phi);
    
    return { n, phi, e, d };
}

// DOM Elements for Card 5
document.addEventListener('DOMContentLoaded', function() {
    const primeP = document.getElementById('primeP');
    const primeQ = document.getElementById('primeQ');
    const generateBtn = document.getElementById('generateRSAKeys');
    const modulusSpan = document.getElementById('modulusN');
    const totientSpan = document.getElementById('totient');
    const publicKeySpan = document.getElementById('publicKey');
    const privateKeySpan = document.getElementById('privateKey');
    
    // Auto-fill elements for other RSA cards
    const rsaEncryptE = document.getElementById('rsaEncryptE');
    const rsaEncryptN = document.getElementById('rsaEncryptN');
    const rsaDecryptD = document.getElementById('rsaDecryptD');
    const rsaDecryptN = document.getElementById('rsaDecryptN');

    if (generateBtn) {
        generateBtn.addEventListener('click', () => {
            const p = parseInt(primeP.value);
            const q = parseInt(primeQ.value);
            
            if (isNaN(p) || isNaN(q)) {
                alert('Please enter valid prime numbers');
                return;
            }
            
            const result = generateRSAKeys(p, q);
            
            if (result.error) {
                alert(result.error);
                return;
            }
            
            // Display results
            modulusSpan.textContent = result.n;
            totientSpan.textContent = result.phi;
            publicKeySpan.textContent = result.e;
            privateKeySpan.textContent = result.d;
            
            // Auto-fill encryption and decryption cards
            if (rsaEncryptE) rsaEncryptE.value = result.e;
            if (rsaEncryptN) rsaEncryptN.value = result.n;
            if (rsaDecryptD) rsaDecryptD.value = result.d;
            if (rsaDecryptN) rsaDecryptN.value = result.n;
        });
    }

    // Validate prime inputs
    if (primeP) {
        primeP.addEventListener('change', function() {
            let value = parseInt(this.value);
            if (value < 2) this.value = 2;
            if (!isPrime(value)) {
                alert('Warning: This number is not prime. RSA requires prime numbers.');
            }
        });
    }

    if (primeQ) {
        primeQ.addEventListener('change', function() {
            let value = parseInt(this.value);
            if (value < 2) this.value = 2;
            if (!isPrime(value)) {
                alert('Warning: This number is not prime. RSA requires prime numbers.');
            }
        });
    }
});