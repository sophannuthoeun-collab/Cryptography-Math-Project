// ===== transposition.js =====
// Card 4: Columnar Transposition Cipher

// Helper function to remove spaces and prepare text
function prepareText(text) {
    return text.toUpperCase().replace(/\s+/g, '');
}

// Helper function to determine if key is numeric or alphabetic
function parseKey(key) {
    // Remove any non-alphanumeric characters
    const cleanKey = key.replace(/[^A-Za-z0-9]/g, '');
    
    if (cleanKey.length === 0) {
        return { type: 'invalid', value: [] };
    }
    
    // Check if key is numeric (all digits)
    if (/^\d+$/.test(cleanKey)) {
        // Numeric key: each digit represents column order
        const order = cleanKey.split('').map(d => parseInt(d) - 1);
        return { type: 'numeric', value: order, original: cleanKey };
    } else {
        // Alphabetic key: sort letters to determine column order
        const letters = cleanKey.toUpperCase().split('');
        // Create array of indices and sort based on letter order
        const indices = Array.from({ length: letters.length }, (_, i) => i);
        indices.sort((a, b) => {
            if (letters[a] < letters[b]) return -1;
            if (letters[a] > letters[b]) return 1;
            return 0;
        });
        
        // Create column order based on sorted indices
        const order = new Array(letters.length);
        for (let i = 0; i < indices.length; i++) {
            order[indices[i]] = i;
        }
        
        return { type: 'alphabetic', value: order, original: cleanKey };
    }
}

// Transposition Encryption
function transpositionEncrypt(plaintext, key) {
    // Prepare text (remove spaces, uppercase)
    const text = prepareText(plaintext);
    if (text.length === 0) return '';
    
    // Parse the key
    const keyInfo = parseKey(key);
    if (keyInfo.type === 'invalid') {
        return 'Error: Invalid key. Use numbers (e.g., 4312) or letters (e.g., COLUMN)';
    }
    
    const numCols = keyInfo.value.length;
    const numRows = Math.ceil(text.length / numCols);
    
    // Create grid row by row
    const grid = [];
    let index = 0;
    
    for (let row = 0; row < numRows; row++) {
        const gridRow = [];
        for (let col = 0; col < numCols; col++) {
            if (index < text.length) {
                gridRow.push(text[index]);
            } else {
                gridRow.push('X'); // Padding character
            }
            index++;
        }
        grid.push(gridRow);
    }
    
    // Read columns in key order
    let ciphertext = '';
    for (let colOrder = 0; colOrder < numCols; colOrder++) {
        // Find which actual column to read
        const actualCol = keyInfo.value.indexOf(colOrder);
        
        for (let row = 0; row < numRows; row++) {
            ciphertext += grid[row][actualCol];
        }
    }
    
    return ciphertext;
}

// Transposition Decryption
function transpositionDecrypt(ciphertext, key) {
    // Prepare text
    const text = prepareText(ciphertext);
    if (text.length === 0) return '';
    
    // Parse the key
    const keyInfo = parseKey(key);
    if (keyInfo.type === 'invalid') {
        return 'Error: Invalid key. Use numbers (e.g., 4312) or letters (e.g., COLUMN)';
    }
    
    const numCols = keyInfo.value.length;
    const numRows = Math.ceil(text.length / numCols);
    const totalCells = numRows * numCols;
    
    // Calculate how many cells are in each column
    const colLengths = new Array(numCols).fill(numRows);
    const lastColFilled = text.length % numCols;
    
    if (lastColFilled !== 0) {
        // Adjust column lengths based on key order
        for (let i = lastColFilled; i < numCols; i++) {
            colLengths[keyInfo.value.indexOf(i)] = numRows - 1;
        }
    }
    
    // Create empty grid
    const grid = Array(numRows).fill().map(() => Array(numCols).fill(''));
    
    // Fill grid column by column according to key order
    let textIndex = 0;
    
    for (let colOrder = 0; colOrder < numCols; colOrder++) {
        const actualCol = keyInfo.value.indexOf(colOrder);
        const colLength = colLengths[actualCol];
        
        for (let row = 0; row < colLength; row++) {
            if (textIndex < text.length) {
                grid[row][actualCol] = text[textIndex];
                textIndex++;
            }
        }
    }
    
    // Read row by row to get plaintext
    let plaintext = '';
    for (let row = 0; row < numRows; row++) {
        for (let col = 0; col < numCols; col++) {
            plaintext += grid[row][col];
        }
    }
    
    // Remove padding X's at the end
    plaintext = plaintext.replace(/X+$/, '');
    
    return plaintext;
}

// Common keys to try for brute force
const commonKeys = [
    '4312', '1234', '4321', '3124', '2413', '3142',
    'KEY', 'CODE', 'CIPHER', '123', '321', '213',
    'ABCD', 'DCBA', 'WORD', 'SECRET', 'CRYPTO'
];

// Try common keys (simplified brute force)
function transpositionTryCommonKeys(ciphertext) {
    const results = [];
    
    for (let key of commonKeys) {
        try {
            const decrypted = transpositionDecrypt(ciphertext, key);
            results.push({ key, plaintext: decrypted });
        } catch (e) {
            // Skip invalid keys
        }
    }
    
    return results;
}

// DOM Elements for Card 4
document.addEventListener('DOMContentLoaded', function() {
    const messageInput = document.getElementById('transpositionMessage');
    const keyInput = document.getElementById('transpositionKey');
    const resultOutput = document.getElementById('transpositionResult');
    const encryptBtn = document.getElementById('transpositionEncryptBtn');
    const decryptBtn = document.getElementById('transpositionDecryptBtn');
    const bruteForceBtn = document.getElementById('transpositionBruteForceBtn');
    const copyBtn = document.getElementById('copyTranspositionBtn');
    const bruteResults = document.getElementById('transpositionBruteResults');

    // Encrypt button
    if (encryptBtn) {
        encryptBtn.addEventListener('click', () => {
            const text = messageInput.value;
            const key = keyInput.value.trim() || '4312';
            
            if (!text.trim()) {
                resultOutput.value = 'Please enter text to encrypt';
                return;
            }
            
            if (!key) {
                resultOutput.value = 'Please enter a transposition key';
                return;
            }
            
            resultOutput.value = transpositionEncrypt(text, key);
        });
    }

    // Decrypt button
    if (decryptBtn) {
        decryptBtn.addEventListener('click', () => {
            const text = messageInput.value;
            const key = keyInput.value.trim() || '4312';
            
            if (!text.trim()) {
                resultOutput.value = 'Please enter text to decrypt';
                return;
            }
            
            if (!key) {
                resultOutput.value = 'Please enter a transposition key';
                return;
            }
            
            resultOutput.value = transpositionDecrypt(text, key);
        });
    }

    // Brute Force button (try common keys)
    if (bruteForceBtn) {
        bruteForceBtn.addEventListener('click', () => {
            const text = messageInput.value;
            
            if (!text.trim()) {
                bruteResults.innerHTML = '<div class="brute-item">Please enter ciphertext to analyze</div>';
                bruteResults.classList.add('active');
                return;
            }
            
            const results = transpositionTryCommonKeys(text);
            
            let html = '<h4 style="color: #ffd966; margin-bottom: 1rem;">Common Key Attempts:</h4>';
            
            if (results.length === 0) {
                html += '<div class="brute-item">No common keys produced valid results</div>';
            } else {
                results.forEach(result => {
                    // Truncate long text for display
                    const displayText = result.plaintext.length > 50 
                        ? result.plaintext.substring(0, 50) + '...' 
                        : result.plaintext;
                    
                    html += `
                        <div class="brute-item">
                            <span class="brute-shift">Key "${result.key}":</span>
                            <span class="brute-text">${displayText}</span>
                        </div>
                    `;
                });
            }
            
            bruteResults.innerHTML = html;
            bruteResults.classList.add('active');
            
            // Show first result in main output as preview
            if (results.length > 0) {
                resultOutput.value = `First result with key "${results[0].key}": ${results[0].plaintext}`;
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

    // Validate key input (just ensure it's not empty)
    if (keyInput) {
        keyInput.addEventListener('change', function() {
            if (!this.value.trim()) {
                this.value = '4312';
            }
        });
    }
});