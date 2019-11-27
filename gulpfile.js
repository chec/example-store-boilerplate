var gulp  = require('gulp'),
    gutil = require('gulp-util'),
    sass   = require('gulp-sass'),
    concat = require('gulp-concat'),
    coffee = require('gulp-coffee'),
    notify = require('gulp-notify');

//CSS
gulp.task('build-scss', function() {
  return gulp.src(['src/sass/master.scss'])
  .pipe(sass({ errLogToConsole: false, }))
    .on('error', function(err) {
        notify().write(err);
        this.emit('end');
    })
    .pipe(concat('store.css'))
    .pipe(gulp.dest('public/assets/css'))
    .pipe(notify('Styles compiled!'));
});

//JS
gulp.task('concat-js', function() {
  return gulp.src(['src/js/jquery.min.js', 'src/js/**/*.js'])
    .pipe(concat('vendor.js'))
    .pipe(gulp.dest('public/assets/js'));
});

//Coffeescript
gulp.task('build-coffeescript', function() {
  gulp.src(['src/coffeescript/store.coffee', 'src/coffeescript/**/*.coffee'])
    .pipe(coffee({bare: true}))
    .pipe(concat('store.js'))
    .pipe(gulp.dest('public/assets/js'));
});

//watch
gulp.task('default', function() {
  gulp.watch('src/sass/**/*', ['build-scss']);
  gulp.watch('src/sassjs/**/*', ['concat-js']);
  gulp.watch('src/coffeescript/**/*', ['build-coffeescript']);
});
