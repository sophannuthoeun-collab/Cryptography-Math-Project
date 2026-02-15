// ===== affine.js =====
// Card 3: Affine Cipher (Two keys: a and b) with Brute Force

// Helper function to calculate GCD
function gcd(a, b) {
    while (b) {
        const temp = b;
        b = a % b;
        a = temp;
    }
    return a;
}

// Helper function to find modular inverse
function modInverse(a, m) {
    a = a % m;
    for (let x = 1; x < m; x++) {
        if ((a * x) % m === 1) {
            return x;
        }
    }
    return -1;
}

// Affine Cipher Encryption
function affineEncrypt(plaintext, a, b) {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const mod = alphabet.length;
    let ciphertext = '';

    // Check if 'a' is coprime with 26
    if (gcd(a, mod) !== 1) {
        return `Error: Key 'a' (${a}) must be coprime with 26. Valid values: 1,3,5,7,9,11,15,17,19,21,23,25`;
    }

    for (let char of plaintext.toUpperCase()) {
        if (alphabet.includes(char)) {
            const x = alphabet.indexOf(char);
            const y = (a * x + b) % mod;
            ciphertext += alphabet[y];
        } else {
            ciphertext += char;
        }
    }

    return ciphertext;
}

// Affine Cipher Decryption
function affineDecrypt(ciphertext, a, b) {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const mod = alphabet.length;
    let plaintext = '';

    // Check if 'a' is coprime with 26
    if (gcd(a, mod) !== 1) {
        return `Error: Key 'a' (${a}) must be coprime with 26. Valid values: 1,3,5,7,9,11,15,17,19,21,23,25`;
    }

    // Find the modular inverse of a
    const aInverse = modInverse(a, mod);
    
    if (aInverse === -1) {
        return `Error: Key 'a' (${a}) has no modular inverse modulo 26.`;
    }

    for (let char of ciphertext.toUpperCase()) {
        if (alphabet.includes(char)) {
            const y = alphabet.indexOf(char);
            // Formula: x = a⁻¹ * (y - b) mod 26
            const x = (aInverse * (y - b + mod)) % mod;
            plaintext += alphabet[x];
        } else {
            plaintext += char;
        }
    }

    return plaintext;
}

// Affine Cipher Brute Force Decryption - FIXED VERSION
function affineBruteForce(ciphertext) {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const results = [];
    
    // If ciphertext is empty, return empty results
    if (!ciphertext || ciphertext.trim() === '') {
        return { results: [], total: 0 };
    }

    // Valid 'a' values that are coprime with 26
    const validAValues = [1, 3, 5, 7, 9, 11, 15, 17, 19, 21, 23, 25];
    
    for (let a of validAValues) {
        const aInverse = modInverse(a, 26);
        
        for (let b = 0; b < 26; b++) {
            let plaintext = '';

            for (let char of ciphertext.toUpperCase()) {
                if (alphabet.includes(char)) {
                    const y = alphabet.indexOf(char);
                    // Formula: x = a⁻¹ * (y - b) mod 26
                    // Make sure we handle negative values correctly
                    let x = (aInverse * (y - b)) % 26;
                    if (x < 0) x += 26;
                    plaintext += alphabet[x];
                } else {
                    plaintext += char;
                }
            }

            results.push({ a, b, plaintext });
        }
    }

    return { results, total: results.length };
}

// DOM Elements for Card 3 - Using UNIQUE IDs
document.addEventListener('DOMContentLoaded', function() {
    const messageInput = document.getElementById('affineMessage');
    const keyAInput = document.getElementById('affineKeyA');
    const keyBInput = document.getElementById('affineKeyB');
    const resultOutput = document.getElementById('affineResult');
    const encryptBtn = document.getElementById('affineEncryptBtn');
    const decryptBtn = document.getElementById('affineDecryptBtn');
    const bruteForceBtn = document.getElementById('affineBruteForceBtn');
    const copyBtn = document.getElementById('copyAffineBtn');
    const bruteResults = document.getElementById('affineBruteResults');

    // Check if elements exist
    console.log('Affine Cipher Elements:', {
        messageInput, keyAInput, keyBInput, resultOutput,
        encryptBtn, decryptBtn, bruteForceBtn, copyBtn, bruteResults
    });

    // Valid 'a' values for reference
    const validAValues = [1, 3, 5, 7, 9, 11, 15, 17, 19, 21, 23, 25];

    // Validate key a input
    if (keyAInput) {
        keyAInput.addEventListener('change', function() {
            let value = parseInt(this.value);
            if (value < 1) this.value = 1;
            if (value > 25) this.value = 25;
            if (isNaN(value)) this.value = 1;
            
            value = parseInt(this.value);
            if (!validAValues.includes(value)) {
                alert(`Warning: Key 'a' must be coprime with 26.\nValid values: ${validAValues.join(', ')}`);
            }
        });
    }

    // Validate key b input
    if (keyBInput) {
        keyBInput.addEventListener('change', function() {
            let value = parseInt(this.value);
            if (value < 0) this.value = 0;
            if (value > 25) this.value = 25;
            if (isNaN(value)) this.value = 3;
        });
    }

    // Encrypt button
    if (encryptBtn) {
        encryptBtn.addEventListener('click', () => {
            const text = messageInput.value;
            const a = parseInt(keyAInput.value) || 1;
            const b = parseInt(keyBInput.value) || 3;
            
            if (!text.trim()) {
                resultOutput.value = 'Please enter text to encrypt';
                return;
            }
            
            resultOutput.value = affineEncrypt(text, a, b);
        });
    }

    // Decrypt button
    if (decryptBtn) {
        decryptBtn.addEventListener('click', () => {
            const text = messageInput.value;
            const a = parseInt(keyAInput.value) || 1;
            const b = parseInt(keyBInput.value) || 3;
            
            if (!text.trim()) {
                resultOutput.value = 'Please enter text to decrypt';
                return;
            }
            
            resultOutput.value = affineDecrypt(text, a, b);
        });
    }

    // Brute Force button - FIXED WORKING VERSION
    if (bruteForceBtn) {
        bruteForceBtn.addEventListener('click', () => {
            const text = messageInput.value;
            
            if (!text.trim()) {
                bruteResults.innerHTML = '<div class="brute-item">Please enter ciphertext to brute force</div>';
                bruteResults.classList.add('active');
                return;
            }
            
            // Show loading message
            bruteResults.innerHTML = '<div class="brute-item">Processing 312 combinations...</div>';
            bruteResults.classList.add('active');
            
            // Use setTimeout to allow UI to update and prevent freezing
            setTimeout(() => {
                const { results, total } = affineBruteForce(text);
                
                let html = `
                    <h4 style="color: #ffd966; margin-bottom: 1rem;">
                        Affine Brute Force Results (${total} combinations):
                    </h4>
                `;
                
                if (results.length === 0) {
                    html += '<div class="brute-item">No results generated</div>';
                } else {
                    // Display first 30 results to avoid UI lag
                    const displayResults = results.slice(0, 30);
                    
                    displayResults.forEach(result => {
                        // Truncate long text for display
                        const displayText = result.plaintext.length > 40 
                            ? result.plaintext.substring(0, 40) + '...' 
                            : result.plaintext;
                        
                        html += `
                            <div class="brute-item">
                                <span class="brute-shift">a=${result.a.toString().padStart(2, '0')}, b=${result.b.toString().padStart(2, '0')}:</span>
                                <span class="brute-text">${displayText}</span>
                            </div>
                        `;
                    });
                    
                    if (results.length > 30) {
                        html += `<div class="brute-item">... and ${results.length - 30} more combinations</div>`;
                    }
                }
                
                bruteResults.innerHTML = html;
                
                // Show first result in main output as preview
                if (results.length > 0) {
                    resultOutput.value = `First result (a=${results[0].a}, b=${results[0].b}): ${results[0].plaintext}`;
                }
            }, 100); // Small delay to allow UI update
        });
    }

    // Copy button
    if (copyBtn) {
        copyBtn.addEventListener('click', () => {
            resultOutput.select();
            navigator.clipboard.writeText(resultOutput.value).catch(() => {
                alert('Press Ctrl+C to copy');
            });
        });
    }
});