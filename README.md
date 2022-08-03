
# Extracting a color palette from an image with javascript

![App Screenshot](https://static-cse.canva.com/image/3067/mint2.c0f21b5d.png)

## Table of Contents

Now that we know what we are dealing here, let’s start by explaining the process:

- [Introduction](#introduction)
- [Load an image into a canvas](#load-an-image-into-a-canvas)
- [Extract image information](#extract-image-information)
- [Build an array of RGB colors](#build-an-array-of-RGB-colors)
- [Apply Color quantization](#apply-color-quantization)

## Introduction

Today I am bring you something really interesting that I think is worth sharing. Let me begin by showcasing the end result.

If you can’t wait and want to test it yourself, here are the links to the app demo and the repository.

 - [Demo app](https://ayoubmoustahfid.github.io/get-color-from-image-javascript/)
 
 ## 🖼️ Load an image into a canvas
 
 First we create the basic HTML of our page, we need a form input of type file to upload the image and a canvas element because that’s how we gain access to the image’s data.
 
 index.html
 
 ![code](https://user-images.githubusercontent.com/47373251/182620862-db772810-0978-4ba9-8108-1f0a23781e32.png)

## 🚜 Extract image information

We load the image into the canvas using the event handler .onload, this allow us to access the **getImageData()** method from the canvas API.

index.js

```js
const main = () => {
  const imgFile = document.getElementById("imgfile");
  const image = new Image();
  const file = imgFile.files[0];
  const fileReader = new FileReader();

  fileReader.onload = () => {
    image.onload = () => {
      const canvas = document.getElementById("canvas");
      canvas.width = image.width;
      canvas.height = image.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(image, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    }
  }
}
```
The information returned from **getImageData()** represents all the pixels that compose the image, meaning that we have an humongous array of values in the following format:

```json
{
  data: [133,38,51,255,133,38,255,120...],
  colorSpace: "srgb",
  height: 420,
  width: 320
}
```

Each value inside data represents a channel of a pixel R (red), G (Green), B (Blue) and A (Alpha), Every four elements of the data array form the RGBA color model.

![rgba](https://res.cloudinary.com/practicaldev/image/fetch/s--bpHVknBs--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_880/https://dev-to-uploads.s3.amazonaws.com/uploads/articles/d5r4wa4dfi767qu2kc8l.png)
