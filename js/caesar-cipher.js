// ===== caesar.js =====
// Card 1: Caesar Cipher (Fixed shift of 3)

// Caesar Cipher Encryption
function caesarEncrypt(plaintext) {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const shift = 3; // Fixed shift of 3 for Caesar
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

// Caesar Cipher Decryption
function caesarDecrypt(ciphertext) {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const shift = 3; // Fixed shift of 3 for Caesar
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

// Caesar Cipher Brute Force (all 25 shifts)
function caesarBruteForce(ciphertext) {
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

// DOM Elements for Card 1
document.addEventListener('DOMContentLoaded', function() {
    const messageInput = document.getElementById('message1');
    const resultOutput = document.getElementById('result1');
    const encryptBtn = document.getElementById('encryptBtn1');
    const decryptBtn = document.getElementById('decryptBtn1');
    const bruteForceBtn = document.getElementById('bruteForceBtn1');
    const copyBtn = document.getElementById('copyBtn1');
    const bruteResults = document.getElementById('bruteResults1');

    // Encrypt button
    if (encryptBtn) {
        encryptBtn.addEventListener('click', () => {
            const text = messageInput.value;
            
            if (!text.trim()) {
                resultOutput.value = 'Please enter text to encrypt';
                return;
            }
            
            resultOutput.value = caesarEncrypt(text);
        });
    }

    // Decrypt button
    if (decryptBtn) {
        decryptBtn.addEventListener('click', () => {
            const text = messageInput.value;
            
            if (!text.trim()) {
                resultOutput.value = 'Please enter text to decrypt';
                return;
            }
            
            resultOutput.value = caesarDecrypt(text);
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
            
            const results = caesarBruteForce(text);
            
            let html = '<h4 style="color: #ffd966; margin-bottom: 1rem;">Caesar Brute Force Results:</h4>';
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