var gulp = require('gulp');
var path = require('path');
var mocha = require('gulp-mocha');
var browserSync = require('browser-sync');
var nodemon = require('gulp-nodemon');
var cp = require('child_process');
const ts = require('gulp-typescript');

// pull in the project TypeScript config
const tsProject = ts.createProject('tsconfig.json');

gulp.task('scripts', () => {
  const tsResult = tsProject.src()
    .pipe(tsProject());
  return tsResult.js.pipe(gulp.dest('dist'));
});

// run browser-sync on for client changes
gulp.task('browser-sync', ['nodemon', 'watch'], function () {
    browserSync.init(null, {
        proxy: "http://localhost:3000",
        files: ["src/public/**/*.*", "src/views/**/*.*"],
        browser: "google chrome",
        port: 7000,
    });
});

// run nodemon on server file changes
gulp.task('nodemon', function (cb) {
    var started = false;
    return nodemon({
        script: 'dist/index.js',
        watch: ['dist/**/*.js']
    }).on('start', function () {
        if (!started) {
            cb();
            started = true;
        }
    }).on('restart', function onRestart() {
        setTimeout(function reload() {
            browserSync.reload({
                stream: false
            });
        }, 1000);  // browserSync reload delay
    });
});

gulp.task('watch', function () {
    gulp.watch('src/**/*.ts', ['scripts','nodemon']);
}); 

gulp.task('dev', ['scripts', 'browser-sync']);
gulp.task('default', ['scripts']);
