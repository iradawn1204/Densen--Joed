// see video explanation: https://youtu.be/ubHwScDfRQA

const { src, dest, watch, series} = require('gulp');
const terser = require('gulp-terser');
const imagemin = require('gulp-imagemin');
const imagewebp = require('gulp-webp');

const htmlmin = require('gulp-htmlmin');

// ADD FILES IN YOUR FOLDERS SO THAT GULP WILL AUTO MOVE THEM TO DIST, IF THEY ARE EMPTY THEN IT WON'T DO ANYTHING

// Copy html files to dist
// if you want to copy php files, just copy this function give it a different name and change the 'html' to 'php'
function copyHtml() {
  return src(['src/*.html', 'src/*/*.html'])
  .pipe(htmlmin({collapseWhitespace: true, ignoreCustomFragments: [ /<%[\s\S]*?%>/,  /<\?[=|html]?[\s\S]*?\?>/ ]}))
  .pipe(dest('dist'))
}

function svgMove () {
  return src('src/assets/images/**/*.svg') 
  .pipe(dest('dist/assets/images'))
}

//optimize and move images
function optimizeimg() {
  return src('src/assets/images/**/*.{jpg,png}') 
    .pipe(imagemin([
      imagemin.mozjpeg({ quality: 80, progressive: true }),
      imagemin.optipng({ optimizationLevel: 2 }),
    ]))
    .pipe(dest('dist/assets/images')) 
};

function webpImage() {
  return src(['dist/assets/images/*.{jpg,png}', 'dist/assets/images/logo/*.{jpg,png}']) 
    .pipe(imagewebp())
    .pipe(dest('dist/assets/images')) 
};


// minify js
function jsmin(){
  return src('src/js/*.js') 
    .pipe(terser())
    .pipe(dest('dist/js')); 
}

//watchtask
function watchTask(){
  watch(['src/*.html', 'src/*/*.html'], copyHtml); 
  watch('src/js/*.js', jsmin); 
  watch('src/assets/images/*.{jpg,png}', optimizeimg); 
  watch('dist/assets/images/*.{jpg,png}', webpImage); 
  watch('src/assets/images/*.svg', svgMove); 
}

// Default Gulp task 
exports.default = series(
  copyHtml,
  svgMove,
  jsmin,
  optimizeimg,
  webpImage,
  watchTask
);