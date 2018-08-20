const browserSync = require('browser-sync');
const gulp = require('gulp');
const sass = require('gulp-sass');
const gulpif = require('gulp-if');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const babel = require('gulp-babel');
const del = require('del');

const env = process.env.NODE_ENV;

// BrowserSync
gulp.task('browserSync', function () {
  browserSync({
    server: {
      baseDir: './public/',
    },
  });
});

// HTML
gulp.task('html', function () {
  return gulp
    .src([
      'src/html/*.html',
      'src/html/**/*.html'
    ])
    .pipe(gulp.dest('public'))
    .pipe(gulpif(env === 'development', browserSync.stream(), false));
});

// Javascript
gulp.task('scripts', function () {
  return gulp
    .src([
      'node_modules/babel-polyfill/dist/polyfill.js',
      'src/js/*.js',
      'src/js/**/*.js'
    ])
    .pipe(babel({ presets: ['babel-preset-env'] }))
    .pipe(gulp.dest('public/js'))
    .pipe(gulpif(env === 'development', browserSync.stream(), false));
});

// Stylesheet
gulp.task('styles', function () {
  return gulp
    .src(['src/scss/*.scss', 'src/scss/**/*.scss'])
    .pipe(sourcemaps.init())
    .pipe(gulpif(env === 'production', sass({
        outputStyle: 'compressed'
      }), sass({ outputStyle: 'expanded' })))
    .pipe(autoprefixer({ browsers: ['last 3 versions'], cascade: false }))
    .pipe(gulpif(env === 'development', sourcemaps.write('../maps')))
    .pipe(gulp.dest('public/css'))
    .pipe(gulpif(env === 'development', browserSync.stream(), false));
});

// Assets
gulp.task('image', function() {
  return gulp
    .src('src/img/*')
    .pipe(gulp.dest('public/img'))
    .pipe(gulpif(env === 'development', browserSync.stream(), false));
});

// Clean
gulp.task('clean:maps', (env === 'production', deleteMapsFolder));

function deleteMapsFolder() {
  return del([
    'public//maps/**',
  ]);
}

// Watch
gulp.task('watch', function () {
  gulp.watch('src/img/*', ['image']);
  gulp.watch(['src/html/*.html', 'src/html/**/*.html'], ['html']);
  gulp.watch(['src/scss/*.scss', 'src/scss/**/*.scss'], ['styles']);
  gulp.watch(['src/js/*.js', 'src/js/**/*.js'], ['scripts']);
});

// Default tasks
gulp.task(
    'default', [
    'html',
    'styles',
    'scripts',
    'image',
    'clean:maps',
    'watch',
    'browserSync'
])

// Build tasks
gulp.task('build', [
  'html',
  'styles',
  'scripts',
  'image',
  'clean:maps'
]);
