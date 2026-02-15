// ===== rsa-decrypt.js =====
// Card 7: RSA Decryption

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

// Convert number array back to text
function numbersToText(numbers) {
    let text = '';
    for (let i = 0; i < numbers.length; i++) {
        text += String.fromCharCode(numbers[i]);
    }
    return text;
}

// RSA Decryption
function rsaDecrypt(ciphertext, d, n) {
    // Split the ciphertext string into numbers
    const parts = ciphertext.trim().split(/\s+/);
    const numbers = [];
    
    for (let i = 0; i < parts.length; i++) {
        const num = parseInt(parts[i]);
        if (isNaN(num)) {
            return `Error: Invalid ciphertext format at position ${i + 1}`;
        }
        numbers.push(num);
    }
    
    const decrypted = [];
    
    for (let i = 0; i < numbers.length; i++) {
        const m = modPow(numbers[i], d, n);
        decrypted.push(m);
    }
    
    return numbersToText(decrypted);
}

// DOM Elements for Card 7
document.addEventListener('DOMContentLoaded', function() {
    const messageInput = document.getElementById('rsaDecryptMessage');
    const dInput = document.getElementById('rsaDecryptD');
    const nInput = document.getElementById('rsaDecryptN');
    const decryptBtn = document.getElementById('rsaDecryptBtn');
    const resultOutput = document.getElementById('rsaDecryptResult');
    const copyBtn = document.getElementById('copyRSADecrypt');

    if (decryptBtn) {
        decryptBtn.addEventListener('click', () => {
            const ciphertext = messageInput.value;
            const d = parseInt(dInput.value);
            const n = parseInt(nInput.value);
            
            if (!ciphertext.trim()) {
                resultOutput.value = 'Please enter ciphertext to decrypt';
                return;
            }
            
            if (isNaN(d) || isNaN(n)) {
                resultOutput.value = 'Please enter valid private key (d) and modulus (n)';
                return;
            }
            
            resultOutput.value = rsaDecrypt(ciphertext, d, n);
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