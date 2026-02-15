// ===== general.js =====
// Card 2: General Shift Cipher (User-defined shift)

// General Shift Cipher Encryption
function generalEncrypt(plaintext, shift) {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let ciphertext = '';

    for (let i = 0; i < plaintext.length; i++) {
        const char = plaintext[i].toUpperCase();
        const index = alphabet.indexOf(char);

        if (index !== -1) {
            const newIndex = (index + shift) % 26;
            ciphertext += alphabet[newIndex];
        } else {
            ciphertext += char;
        }
    }

    return ciphertext;
}

// General Shift Cipher Decryption
function generalDecrypt(ciphertext, shift) {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let plaintext = '';

    for (let i = 0; i < ciphertext.length; i++) {
        const char = ciphertext[i].toUpperCase();
        const index = alphabet.indexOf(char);

        if (index !== -1) {
            const newIndex = (index - shift + 26) % 26;
            plaintext += alphabet[newIndex];
        } else {
            plaintext += char;
        }
    }

    return plaintext;
}

// General Shift Cipher Brute Force
function generalBruteForce(ciphertext) {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const results = [];

    for (let shift = 1; shift < 26; shift++) {
        let plaintext = '';

        for (let i = 0; i < ciphertext.length; i++) {
            const char = ciphertext[i].toUpperCase();
            const index = alphabet.indexOf(char);

            if (index !== -1) {
                const newIndex = (index - shift + 26) % 26;
                plaintext += alphabet[newIndex];
            } else {
                plaintext += char;
            }
        }

        results.push({ shift, plaintext });
    }

    return results;
}

// DOM Elements for Card 2
document.addEventListener('DOMContentLoaded', function() {
    const messageInput = document.getElementById('message2');
    const shiftInput = document.getElementById('shiftValue2');
    const resultOutput = document.getElementById('result2');
    const encryptBtn = document.getElementById('encryptBtn2');
    const decryptBtn = document.getElementById('decryptBtn2');
    const bruteForceBtn = document.getElementById('bruteForceBtn2');
    const copyBtn = document.getElementById('copyBtn2');
    const bruteResults = document.getElementById('bruteResults2');

    // Validate shift input
    if (shiftInput) {
        shiftInput.addEventListener('change', function() {
            let value = parseInt(this.value);
            if (value < 1) this.value = 1;
            if (value > 25) this.value = 25;
            if (isNaN(value)) this.value = 5;
        });
    }

    // Encrypt button
    if (encryptBtn) {
        encryptBtn.addEventListener('click', () => {
            const text = messageInput.value;
            const shift = parseInt(shiftInput.value) || 5;
            
            if (!text.trim()) {
                resultOutput.value = 'Please enter text to encrypt';
                return;
            }
            
            resultOutput.value = generalEncrypt(text, shift);
        });
    }

    // Decrypt button
    if (decryptBtn) {
        decryptBtn.addEventListener('click', () => {
            const text = messageInput.value;
            const shift = parseInt(shiftInput.value) || 5;
            
            if (!text.trim()) {
                resultOutput.value = 'Please enter text to decrypt';
                return;
            }
            
            resultOutput.value = generalDecrypt(text, shift);
        });
    }

    // Brute Force button
    if (bruteForceBtn) {
        bruteForceBtn.addEventListener('click', () => {
            const text = messageInput.value;
            
            if (!text.trim()) {
                bruteResults.innerHTML = '<div class="brute-item">Please enter ciphertext to brute force</div>';
                bruteResults.classList.add('active');
                return;
            }
            
            const results = generalBruteForce(text);
            
            let html = '<h4 style="color: #ffd966; margin-bottom: 1rem;">General Shift Brute Force Results:</h4>';
            results.forEach(result => {
                html += `
                    <div class="brute-item">
                        <span class="brute-shift">Shift ${result.shift.toString().padStart(2, '0')}:</span>
                        <span class="brute-text">${result.plaintext}</span>
                    </div>
                `;
            });
            
            bruteResults.innerHTML = html;
            bruteResults.classList.add('active');
            
            if (results.length > 0) {
                resultOutput.value = `Top 3 possibilities:\n` +
                    results.slice(0, 3).map(r => `Shift ${r.shift}: ${r.plaintext}`).join('\n');
            }
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