const browserSync = require('browser-sync');
const gulp = require('gulp');
const sass = require('gulp-sass');
const gulpif = require('gulp-if');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const gutil = require('gulp-util');
const del = require('del');

const env = process.env.NODE_ENV;

gulp.task('browserSync', function () {
  browserSync({
    server: {
      baseDir: './public/',
    },
  });
});

gulp.task('html', function () {
  return gulp.src('public/*.html')
    .pipe(browserSync.stream());
});

gulp.task('styles', function () {
  gulp.src(['src/scss/*.scss', 'src/scss/**/*.scss'])
    .pipe(sourcemaps.init())

    // scss output compressed if production or expanded if development
    .pipe(gulpif(env === 'production', sass({ outputStyle: 'compressed' }),
      sass({ outputStyle: 'expanded' })))
    .on('error', gutil.log.bind(gutil, gutil.colors.red(
      '\n\n*********************************** \n' +
      'SASS ERROR:' +
      '\n*********************************** \n\n'
    )))
    .pipe(autoprefixer({
      browsers: ['last 3 versions'],
      cascade: false,
    }))
    .pipe(gulpif(env === 'development', sourcemaps.write('../maps')))
    .pipe(gulp.dest('public/css'))
    .pipe(browserSync.stream());
});

gulp.task('clean:maps', (env === 'production', deleteMapsFolder));

function deleteMapsFolder() {
  return del([
    'public//maps/**',
  ]);
}

gulp.task('watch', function () {
  gulp.watch('public/*.html', ['html']);
  gulp.watch(['src/scss/*.scss', 'src/scss/**/*.scss'], ['styles']);
});

gulp.task('default', ['styles', 'browserSync', 'clean:maps', 'watch']);
