Minify
======
Application was made by [Skrz.cz](https://skrz.cz) [developers](https://devblog.skrz.cz/) to enable bulk minification of images from photo storage. Based on [Imagemin](https://github.com/imagemin/imagemin).

**Basic installation**
```
git clone https://github.com/skrz/minify.git
cd minify
npm install
mkdir source/ optimized/
```

**Source folder content**
Loops inside app are ready for this source files directory tree. 
```
source/
    20190111
        747508e3f7c6adc4357b6963bcd500c6.jpg
        9eb7ec3fd2bf347c1acde48109fec0be.png
    20190112
        ...
```

Your images will be stored in *optimized/* folder after you start app with:
```
node index.js
```
