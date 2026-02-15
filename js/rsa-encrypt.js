// ===== rsa-encrypt.js =====
// Card 6: RSA Encryption

// Helper function for modular exponentiation
function modPow(base, exponent, modulus) {
    if (modulus === 1) return 0;
    let result = 1;
    base = base % modulus;
    while (exponent > 0) {
        if (exponent % 2 === 1) {
            result = (result * base) % modulus;
        }
        base = (base * base) % modulus;
        exponent = Math.floor(exponent / 2);
    }
    return result;
}

// Convert text to number array
function textToNumbers(text) {
    const numbers = [];
    for (let i = 0; i < text.length; i++) {
        numbers.push(text.charCodeAt(i));
    }
    return numbers;
}

// RSA Encryption
function rsaEncrypt(text, e, n) {
    const numbers = textToNumbers(text);
    const encrypted = [];
    
    for (let i = 0; i < numbers.length; i++) {
        // Check if number is within modulus
        if (numbers[i] >= n) {
            return `Error: Character code ${numbers[i]} is >= modulus n (${n}). Use larger primes or shorter text.`;
        }
        const c = modPow(numbers[i], e, n);
        encrypted.push(c);
    }
    
    return encrypted.join(' ');
}

// DOM Elements for Card 6
document.addEventListener('DOMContentLoaded', function() {
    const messageInput = document.getElementById('rsaEncryptMessage');
    const eInput = document.getElementById('rsaEncryptE');
    const nInput = document.getElementById('rsaEncryptN');
    const encryptBtn = document.getElementById('rsaEncryptBtn');
    const resultOutput = document.getElementById('rsaEncryptResult');
    const copyBtn = document.getElementById('copyRSAEncrypt');

    if (encryptBtn) {
        encryptBtn.addEventListener('click', () => {
            const text = messageInput.value;
            const e = parseInt(eInput.value);
            const n = parseInt(nInput.value);
            
            if (!text.trim()) {
                resultOutput.value = 'Please enter text to encrypt';
                return;
            }
            
            if (isNaN(e) || isNaN(n)) {
                resultOutput.value = 'Please enter valid public key (e) and modulus (n)';
                return;
            }
            
            resultOutput.value = rsaEncrypt(text, e, n);
        });
    }

    if (copyBtn) {
        copyBtn.addEventListener('click', () => {
            resultOutput.select();
            navigator.clipboard.writeText(resultOutput.value).catch(() => {
                alert('Press Ctrl+C to copy');
            });
        });
    }
});