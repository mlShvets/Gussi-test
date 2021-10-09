const gulp = require('gulp');
const plumber = require('gulp-plumber');
const sourcemap = require('gulp-sourcemaps');
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const csso = require('postcss-csso');
const rename = require('gulp-rename');
const htmlmin = require('gulp-htmlmin');
const terser = require('gulp-terser');
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
const svgstore = require('gulp-svgstore');
const del = require('del');
const sync = require('browser-sync').create();
const combineMq = require('gulp-group-css-media-queries');
const ghPages = require('gh-pages');
const path = require('path');

// Styles

const styles = () => gulp.src('source/sass/style.scss')
  .pipe(plumber())
  .pipe(sourcemap.init())
  .pipe(sass())
  .pipe(postcss([
    autoprefixer(),
    csso(),
  ]))
  .pipe(rename('style.min.css'))
  .pipe(sourcemap.write('.'))
  .pipe(gulp.dest('build/css'))
  .pipe(sync.stream());

exports.styles = styles;

// HTML

const html = () => gulp.src('source/*.html')
  .pipe(htmlmin({
    collapseWhitespace: true
  }))
  .pipe(gulp.dest('build'));

exports.html = html;

// Scripts

const scripts = () => gulp.src('source/js/script.js')
  .pipe(terser())
  .pipe(rename('script.min.js'))
  .pipe(gulp.dest('build/js'))
  .pipe(sync.stream());

exports.scripts = scripts;

// Images

const optimizeImages = () => gulp.src('source/img/**/*.{png,jpg,svg}')
  .pipe(imagemin([
    imagemin.mozjpeg({
      progressive: true
    }),
    imagemin.optipng({
      optimizationLevel: 3
    }),
    imagemin.svgo(),
  ]))
  .pipe(gulp.dest('build/img'));

exports.optimizeImages = optimizeImages;

const copyImages = () => gulp.src('source/img/**/*.{png,jpg,svg}')
  .pipe(gulp.dest('build/img'));

exports.copyImages = copyImages;

// WebP

const createWebp = () => gulp.src(['source/img/**/*.{png,jpg}', '!source/img/icons/favicons/*'])
  .pipe(webp({
    quality: 90
  }))
  .pipe(gulp.dest('build/img'));

exports.createWebp = createWebp;

// Sprite

const sprite = () => gulp.src('source/img/icons/sprite/*.svg')
  .pipe(svgstore({
    inlineSvg: true,
  }))
  .pipe(rename('sprite.svg'))
  .pipe(gulp.dest('build/img/'));

exports.sprite = sprite;

// Copy

const copy = (done) => {
  gulp.src([
      'source/fonts/*.{woff2,woff}',
      'source/*.ico',
      'source/img/**/*.svg',
      '!source/img/icons/sprite/*svg',
      'source/favicon.webmanifest',
    ], {
      base: 'source',
    })
    .pipe(gulp.dest('build'));
  done();
};

exports.copy = copy;

// Clean

const clean = () => del('build');

// Server

const server = (done) => {
  sync.init({
    server: {
      baseDir: 'build',
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
};

exports.server = server;

// Reload

const reload = (done) => {
  sync.reload();
  done();
};

// Watcher

const watcher = () => {
  gulp.watch('source/sass/**/*.{scss,sass}', gulp.series(styles));
  gulp.watch('source/js/*.js', gulp.series(scripts, reload));
  gulp.watch('source/*.html', gulp.series(html, reload));
};

// Media queries

const combine = () => gulp.src('build/css/style.min.css')
  .pipe(combineMq({
    beautify: false,
  }))
  .pipe(gulp.dest('build/css'));

exports.combine = combine;

//Public GH Pages

function deploy(cb) {
  ghPages.publish(path.join(process.cwd(), './build'), cb);
}
exports.deploy = deploy;

// Build

const build = gulp.series(
  clean,
  copy,
  optimizeImages,
  gulp.parallel(
    styles,
    html,
    scripts,
    sprite,
    createWebp,
  ),
  gulp.series(
    combine,
  ),
);

exports.build = build;

// Build+server

const buildServer = gulp.series(
  clean,
  copy,
  optimizeImages,
  gulp.parallel(
    styles,
    html,
    scripts,
    sprite,
    createWebp,
  ),
  gulp.series(
    combine,
    server,
  ),
);

exports.buildServer = buildServer;

// Default

exports.default = gulp.series(
  clean,
  copy,
  copyImages,
  gulp.parallel(
    styles,
    html,
    scripts,
    sprite,
    createWebp,
  ),
  gulp.series(
    combine,
    server,
    watcher,
  ));
