# 🎨 Paint by Numbers Generator

Transform any image into a beautiful paint-by-numbers pattern with this interactive web application. Perfect for artists, educators, and craft enthusiasts!

![version](https://img.shields.io/badge/version-1.0.0-blue)
![license](https://img.shields.io/badge/license-MIT-green)
![javascript](https://img.shields.io/badge/JavaScript-ES6-yellow)
![html](https://img.shields.io/badge/HTML5-supported-orange)
![css](https://img.shields.io/badge/CSS3-styled-blue)

---

## ✨ Features

- 🎨 **Image Upload**: Upload any image (JPG, PNG, etc.)
- 🔢 **Smart Color Reduction**: Automatically reduces images to 3–20 colors
- 📐 **Region Detection**: Identifies distinct color regions
- 🔢 **Number Placement**: Places numbers in each region for easy painting
- 🎯 **Customizable Settings**: Adjust colors, region size, and font
- 📱 **Responsive Design**: Works on desktop, tablet, and mobile
- 💾 **Export Function**: Download your paint-by-numbers pattern
- 🎨 **Color Palette**: Interactive palette with copy functionality
- ⚡ **Fast Processing**: Optimized algorithms for quick results

---

## 🚀 Quick Start

### Live Demo
Try it here! *(Add your deployment link)*

### Local Installation

```bash
git clone https://github.com/AyoubMoustahfid/get-color-from-image-javascript.git
```

Or download the ZIP file and extract it.

Open app.html in your web browser.

✅ No server or installation required.
## 📖 How to Use
I. Load an Image
    Click "Load New Image" to upload your own photo
    Or use the default sample image

II. Adjust Settings
    Number of Colors: 3–20
    Minimum Region Area: 5–100 pixels
    Font Size: 4–20px

III. Generate Pattern
    Click "Generate Paint by Numbers"
    Wait a few seconds for processing

IV. Use the Result
    Paint each numbered region with the corresponding color
    Refer to the color palette for guidance
    Download the pattern to print or save

## 🛠️ Technical Details
### Built With

  HTML5 Canvas for image processing

  JavaScript for algorithm implementation

  CSS3 for modern responsive design

  Quantize.js for color reduction

### Algorithms Used

  Median Cut Algorithm (color quantization)

  Breadth-First Search (BFS) for region detection

  Connected Component Analysis

  Boundary Detection for outlines

### Browser Support

  ✅ Chrome 60+

  ✅ Firefox 55+

  ✅ Safari 12+

  ✅ Edge 79+

  ✅ Opera 50+

## 📁 Project Structure
```txt
paint-by-numbers/
│
├── app.html          # Main application file
├── style.css         # Styles and responsive design
├── script.js         # Core JavaScript functionality
│
├── README.md         # Documentation
└── assets/           # Example images (optional)
```

## 🔧 Customization
Advanced Users, you can modify the code to:

  * Change outline thickness

  * Add different numbering styles

  * Implement advanced color algorithms

  * Add printing functionality

  * Integrate painting tutorials

For Developers
```js
// Example: Change default parameters
PaintByNumbers.params = {
  nColors: 8,
  minRegionArea: 15,
  fontSize: 10
};
```
## 🤝 Contributing

Contributions are welcome!

    🐞 Report bugs via issues

    💡 Suggest new features

    🔀 Submit pull requests

    📚 Improve documentation

### Development Setup
```txt
git clone https://github.com/AyoubMoustahfid/get-color-from-image-javascript.git
cd get-color-from-image-javascript
code .
```

## 📄 License

This project is licensed under the MIT License.
See the LICENSE file for details.
🙏 Acknowledgments

    Quantize.js for color quantization

    Unsplash for sample images

    Font Awesome for icons

    The open-source community

## 📞 Support

Need help?

    Check existing issues

    Open a new issue with details

    Email: ayoub.moustahfid@zohomail.com

🌟 Show Your Support

If you find this project useful, give it a ⭐ on GitHub!
<div align="center">

Made with ❤️ for artists everywhere

"Every great painting begins with a simple outline"
</div> 
