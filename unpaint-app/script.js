// script.js
// ==============================
// PARAMETERS & STATE
// ==============================
const PaintByNumbers = {
    params: {
        nColors: 10,
        minRegionArea: 10,
        fontSize: 7
    },
    
    state: {
        originalImage: null,
        processedImageData: null,
        isProcessing: false,
        palette: []
    },
    
    // DOM Elements
    elements: {
        originalCanvas: null,
        resultCanvas: null,
        paletteDiv: null,
        imageUpload: null,
        originalCtx: null,
        resultCtx: null,
        downloadBtn: null
    },
    
    // ==============================
    // INITIALIZATION
    // ==============================
    init() {
        // Get DOM elements
        this.elements.originalCanvas = document.getElementById('originalCanvas');
        this.elements.resultCanvas = document.getElementById('resultCanvas');
        this.elements.paletteDiv = document.getElementById('palette');
        this.elements.imageUpload = document.getElementById('imageUpload');
        this.elements.downloadBtn = document.getElementById('downloadBtn');
        
        // Get canvas contexts
        this.elements.originalCtx = this.elements.originalCanvas.getContext('2d');
        this.elements.resultCtx = this.elements.resultCanvas.getContext('2d');
        
        // Setup event listeners
        this.setupSliders();
        this.setupEventListeners();
        
        // Load default image
        this.loadDefaultImage();
    },
    
    // ==============================
    // EVENT LISTENERS
    // ==============================
    setupEventListeners() {
        // Image upload
        this.elements.imageUpload.addEventListener('change', (e) => this.handleImageUpload(e));
        
        // Process button
        document.getElementById('processBtn').addEventListener('click', () => this.processImage());
        
        // Load image button
        document.getElementById('loadImageBtn').addEventListener('click', () => this.elements.imageUpload.click());
        
        // Download button
        this.elements.downloadBtn.addEventListener('click', () => this.downloadResult());
    },
    
    setupSliders() {
        const sliders = [
            { id: 'numColors', valueId: 'numColorsValue', param: 'nColors', defaultValue: 10 },
            { id: 'minArea', valueId: 'minAreaValue', param: 'minRegionArea', defaultValue: 10 },
            { id: 'fontSize', valueId: 'fontSizeValue', param: 'fontSize', defaultValue: 7 }
        ];
        
        sliders.forEach(({ id, valueId, param, defaultValue }) => {
            const slider = document.getElementById(id);
            const valueSpan = document.getElementById(valueId);
            
            slider.value = defaultValue;
            valueSpan.textContent = defaultValue;
            
            slider.addEventListener('input', (e) => {
                valueSpan.textContent = e.target.value;
                this.params[param] = parseInt(e.target.value);
            });
        });
    },
    
    // ==============================
    // IMAGE HANDLING
    // ==============================
    loadDefaultImage() {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600&h=800&fit=crop';
        
        img.onload = () => {
            this.state.originalImage = img;
            this.displayOriginalImage();
            this.enableDownloadButton();
        };
        
        img.onerror = () => {
            console.error('Failed to load default image');
            this.showNotification('Failed to load default image', 'error');
        };
    },
    
    handleImageUpload(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        if (!file.type.match('image.*')) {
            this.showNotification('Please select an image file', 'error');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                this.state.originalImage = img;
                this.displayOriginalImage();
                this.showNotification('Image loaded successfully!', 'success');
            };
            img.onerror = () => {
                this.showNotification('Failed to load image', 'error');
            };
            img.src = e.target.result;
        };
        reader.onerror = () => {
            this.showNotification('Failed to read file', 'error');
        };
        reader.readAsDataURL(file);
    },
    
    displayOriginalImage() {
        if (!this.state.originalImage) return;
        
        const maxWidth = 600;
        const maxHeight = 800;
        let width = this.state.originalImage.width;
        let height = this.state.originalImage.height;
        
        // Maintain aspect ratio
        if (width > maxWidth) {
            height = (maxWidth / width) * height;
            width = maxWidth;
        }
        if (height > maxHeight) {
            width = (maxHeight / height) * width;
            height = maxHeight;
        }
        
        this.elements.originalCanvas.width = width;
        this.elements.originalCanvas.height = height;
        this.elements.resultCanvas.width = width;
        this.elements.resultCanvas.height = height;
        
        this.elements.originalCtx.drawImage(this.state.originalImage, 0, 0, width, height);
    },
    
    // ==============================
    // PROCESSING FUNCTIONS
    // ==============================
    processImage() {
        if (!this.state.originalImage) {
            this.showNotification('Please load an image first!', 'error');
            return;
        }
        
        if (this.state.isProcessing) return;
        this.state.isProcessing = true;
        
        // Show loading state
        this.showNotification('Processing image...', 'info');
        document.getElementById('processBtn').classList.add('loading');
        
        // Use setTimeout to allow UI update
        setTimeout(() => {
            try {
                const width = this.elements.originalCanvas.width;
                const height = this.elements.originalCanvas.height;
                
                // Get image data
                const imageData = this.elements.originalCtx.getImageData(0, 0, width, height);
                
                // Step 1: Color quantization
                this.state.palette = this.extractPalette(imageData, this.params.nColors);
                
                // Step 2: Create color-reduced image
                const colorLabels = this.createColorMap(imageData, this.state.palette);
                
                // Step 3: Draw paint by numbers
                this.drawPaintByNumbers(colorLabels, this.state.palette, width, height);
                
                // Step 4: Display palette
                this.displayPalette(this.state.palette);
                
                // Enable download
                this.enableDownloadButton();
                
                this.showNotification('Paint by numbers generated successfully!', 'success');
            } catch (error) {
                console.error('Processing error:', error);
                this.showNotification('Error processing image', 'error');
            } finally {
                this.state.isProcessing = false;
                document.getElementById('processBtn').classList.remove('loading');
            }
        }, 100);
    },
    
    extractPalette(imageData, nColors) {
        const pixels = [];
        const data = imageData.data;
        
        // Extract pixel data (sample to improve performance)
        const sampleRate = Math.max(1, Math.floor(data.length / (4 * 10000)));
        for (let i = 0; i < data.length; i += 4 * sampleRate) {
            pixels.push([data[i], data[i + 1], data[i + 2]]);
        }
        
        // Use quantize.js for color quantization
        if (typeof quantize !== 'undefined') {
            const cmap = quantize(pixels, nColors);
            return cmap.palette();
        } else {
            // Fallback to simple median cut
            return this.simpleMedianCut(pixels, nColors);
        }
    },
    
    simpleMedianCut(pixels, maxColors) {
        function getColorBox(pixels) {
            let rMin = 255, rMax = 0;
            let gMin = 255, gMax = 0;
            let bMin = 255, bMax = 0;
            
            pixels.forEach(pixel => {
                rMin = Math.min(rMin, pixel[0]);
                rMax = Math.max(rMax, pixel[0]);
                gMin = Math.min(gMin, pixel[1]);
                gMax = Math.max(gMax, pixel[1]);
                bMin = Math.min(bMin, pixel[2]);
                bMax = Math.max(bMax, pixel[2]);
            });
            
            return { rMin, rMax, gMin, gMax, bMin, bMax };
        }
        
        function getLongestDimension(box) {
            const rRange = box.rMax - box.rMin;
            const gRange = box.gMax - box.gMin;
            const bRange = box.bMax - box.bMin;
            
            if (rRange >= gRange && rRange >= bRange) return 0; // R
            if (gRange >= rRange && gRange >= bRange) return 1; // G
            return 2; // B
        }
        
        function medianCut(pixels, maxColors) {
            let boxes = [pixels];
            
            while (boxes.length < maxColors) {
                const newBoxes = [];
                
                for (const box of boxes) {
                    if (box.length <= 1) {
                        newBoxes.push(box);
                        continue;
                    }
                    
                    const colorBox = getColorBox(box);
                    const dimension = getLongestDimension(colorBox);
                    
                    box.sort((a, b) => a[dimension] - b[dimension]);
                    const median = Math.floor(box.length / 2);
                    newBoxes.push(box.slice(0, median));
                    newBoxes.push(box.slice(median));
                }
                
                boxes = newBoxes;
            }
            
            return boxes;
        }
        
        const boxes = medianCut(pixels, maxColors);
        return boxes.map(box => {
            const avg = box.reduce((acc, pixel) => {
                acc[0] += pixel[0];
                acc[1] += pixel[1];
                acc[2] += pixel[2];
                return acc;
            }, [0, 0, 0]);
            
            return [
                Math.round(avg[0] / box.length),
                Math.round(avg[1] / box.length),
                Math.round(avg[2] / box.length)
            ];
        });
    },
    
    createColorMap(imageData, palette) {
        const data = imageData.data;
        const width = this.elements.originalCanvas.width;
        const height = this.elements.originalCanvas.height;
        const colorLabels = new Array(width * height);
        
        // Pre-calculate palette distances
        const paletteArray = palette.map(color => ({
            r: color[0], g: color[1], b: color[2]
        }));
        
        // Assign color labels
        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            const pixelIndex = i / 4;
            
            let minDist = Infinity;
            let bestIndex = 0;
            
            // Find nearest color (optimized)
            for (let j = 0; j < paletteArray.length; j++) {
                const pr = paletteArray[j].r;
                const pg = paletteArray[j].g;
                const pb = paletteArray[j].b;
                
                const dr = r - pr;
                const dg = g - pg;
                const db = b - pb;
                const dist = dr * dr + dg * dg + db * db;
                
                if (dist < minDist) {
                    minDist = dist;
                    bestIndex = j;
                }
            }
            
            colorLabels[pixelIndex] = bestIndex;
        }
        
        return colorLabels;
    },
    
    drawPaintByNumbers(colorLabels, palette, width, height) {
        // Clear canvas with white background
        this.elements.resultCtx.fillStyle = '#FFFFFF';
        this.elements.resultCtx.fillRect(0, 0, width, height);
        
        // Create 2D array for color labels
        const labelGrid = [];
        for (let y = 0; y < height; y++) {
            labelGrid[y] = colorLabels.slice(y * width, (y + 1) * width);
        }
        
        // Draw outlines
        this.drawOutlines(labelGrid, width, height);
        
        // Find and label regions
        const regions = this.findRegions(labelGrid, width, height);
        this.drawNumbers(regions, palette);
    },
    
    drawOutlines(labelGrid, width, height) {
        this.elements.resultCtx.fillStyle = '#000000';
        
        for (let y = 1; y < height - 1; y++) {
            for (let x = 1; x < width - 1; x++) {
                const currentColor = labelGrid[y][x];
                
                // Check if this pixel is on a boundary
                if (labelGrid[y - 1][x] !== currentColor ||
                    labelGrid[y + 1][x] !== currentColor ||
                    labelGrid[y][x - 1] !== currentColor ||
                    labelGrid[y][x + 1] !== currentColor) {
                    
                    this.elements.resultCtx.fillRect(x, y, 1, 1);
                }
            }
        }
    },
    
    findRegions(labelGrid, width, height) {
        const visited = Array(height).fill().map(() => Array(width).fill(false));
        const regions = [];
        
        const bfs = (startX, startY, targetColor) => {
            const queue = [[startX, startY]];
            let area = 0;
            let sumX = 0, sumY = 0;
            
            visited[startY][startX] = true;
            
            while (queue.length > 0) {
                const [x, y] = queue.shift();
                area++;
                sumX += x;
                sumY += y;
                
                // Check 4-connected neighbors
                const neighbors = [
                    [x - 1, y], [x + 1, y],
                    [x, y - 1], [x, y + 1]
                ];
                
                for (const [nx, ny] of neighbors) {
                    if (nx >= 0 && nx < width && ny >= 0 && ny < height &&
                        !visited[ny][nx] && labelGrid[ny][nx] === targetColor) {
                        visited[ny][nx] = true;
                        queue.push([nx, ny]);
                    }
                }
            }
            
            return {
                color: targetColor,
                area: area,
                centroid: [Math.round(sumX / area), Math.round(sumY / area)]
            };
        };
        
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                if (!visited[y][x]) {
                    const targetColor = labelGrid[y][x];
                    const region = bfs(x, y, targetColor);
                    
                    if (region.area >= this.params.minRegionArea) {
                        regions.push(region);
                    }
                }
            }
        }
        
        return regions;
    },
    
    drawNumbers(regions, palette) {
        this.elements.resultCtx.fillStyle = '#000000';
        this.elements.resultCtx.font = `bold ${this.params.fontSize}px Arial`;
        this.elements.resultCtx.textAlign = 'center';
        this.elements.resultCtx.textBaseline = 'middle';
        
        regions.forEach(region => {
            const [x, y] = region.centroid;
            const colorNumber = region.color + 1;
            
            // Draw white background for better readability
            this.elements.resultCtx.fillStyle = '#FFFFFF';
            this.elements.resultCtx.fillText(colorNumber, x + 1, y + 1);
            
            // Draw black text
            this.elements.resultCtx.fillStyle = '#000000';
            this.elements.resultCtx.fillText(colorNumber, x, y);
        });
    },
    
    // ==============================
    // PALETTE DISPLAY
    // ==============================
    displayPalette(palette) {
        this.elements.paletteDiv.innerHTML = '';
        
        palette.forEach((color, index) => {
            const colorCard = this.createPaletteCard(color, index);
            this.elements.paletteDiv.appendChild(colorCard);
        });
    },
    
    createPaletteCard(color, index) {
        const colorCard = document.createElement('div');
        colorCard.className = 'palette-card';
        
        const colorBox = document.createElement('div');
        const colorText = document.createElement('p');
        const copyButton = document.createElement('button');
        
        // Convert RGB to hex
        const hexColor = this.rgbToHex(color[0], color[1], color[2]);
        const rgbColor = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
        
        // Color Box
        colorBox.className = 'color-box';
        colorBox.style.backgroundColor = rgbColor;
        colorBox.textContent = index + 1;
        
        // Determine text color based on background brightness
        const brightness = this.calculateBrightness(color[0], color[1], color[2]);
        colorBox.style.color = brightness > 128 ? '#000000' : '#FFFFFF';
        
        // Color Text
        colorText.className = 'color-text';
        colorText.textContent = `#${hexColor}`;
        colorText.title = `Color ${index + 1}: #${hexColor}`;
        colorText.addEventListener('click', () => this.copyColor(hexColor, rgbColor, index + 1));
        
        // Copy Button
        copyButton.className = 'copy-button';
        copyButton.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
            </svg>
            <span>Copy</span>
        `;
        
        copyButton.addEventListener('click', () => this.copyColor(hexColor, rgbColor, index + 1, copyButton));
        
        colorCard.appendChild(colorBox);
        colorCard.appendChild(colorText);
        colorCard.appendChild(copyButton);
        
        return colorCard;
    },
    
    // ==============================
    // UTILITY FUNCTIONS
    // ==============================
    rgbToHex(r, g, b) {
        return [r, g, b]
            .map(x => {
                const hex = Math.max(0, Math.min(255, x)).toString(16);
                return hex.length === 1 ? '0' + hex : hex;
            })
            .join('')
            .toUpperCase();
    },
    
    calculateBrightness(r, g, b) {
        return (r * 299 + g * 587 + b * 114) / 1000;
    },
    
    copyColor(hexColor, rgbColor, colorNumber, button = null) {
        const textToCopy = `Color ${colorNumber}: #${hexColor}`;
        
        navigator.clipboard.writeText(textToCopy)
            .then(() => {
                this.showNotification(`Copied Color ${colorNumber} (#${hexColor})`, 'success');
                
                if (button) {
                    const originalHTML = button.innerHTML;
                    button.innerHTML = `
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                        <span>Copied!</span>
                    `;
                    button.classList.add('copied');
                    
                    setTimeout(() => {
                        button.innerHTML = originalHTML;
                        button.classList.remove('copied');
                    }, 2000);
                }
            })
            .catch(err => {
                console.error('Failed to copy: ', err);
                this.showNotification('Failed to copy color', 'error');
            });
    },
    
    enableDownloadButton() {
        if (this.elements.downloadBtn) {
            this.elements.downloadBtn.disabled = false;
        }
    },
    
    downloadResult() {
        if (!this.elements.resultCanvas) return;
        
        const link = document.createElement('a');
        link.download = `paint-by-numbers-${Date.now()}.png`;
        link.href = this.elements.resultCanvas.toDataURL('image/png');
        link.click();
        
        this.showNotification('Image downloaded!', 'success');
    },
    
    showNotification(message, type = 'info') {
        // Remove existing notification
        const existingNotification = document.querySelector('.color-notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `color-notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Auto-remove notification after 3 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'fadeOut 0.4s ease-out';
                setTimeout(() => notification.remove(), 400);
            }
        }, 3000);
    }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    PaintByNumbers.init();
});

// Export for module usage if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PaintByNumbers;
}