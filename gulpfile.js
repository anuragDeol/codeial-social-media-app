// gulp-cli (cli is command line interface)
// gulp is used to BUILD PROJECT - i.e. css minification/optimising assets
const gulp = require('gulp');

// const sass = require('gulp-sass');      // *deprecated
const sass = require('gulp-sass')(require('sass'));     // *new SYNTAX

const cssnano = require('gulp-cssnano');    // makes css (single lined)
const rev = require('gulp-rev');    // renames the file with a hashcode along the older name

// gulp executes tasks given to it
// minify css (task)
gulp.task('css', function() {
    // to execute this task write "gulp css" in terminal
    console.log('minifying css...');
    gulp.src('./assets/sass/**/*.scss')
    .pipe(sass())
    .pipe(cssnano())
    .pipe(gulp.dest('./assets.css'));

    // changing naming convention
    return gulp.src('./assets/**/*.css')
    .pipe(rev())
    .pipe(gulp.dest('./public/assets'))
    .pipe(rev.manifest({     // create a manifest - stores assets' new version with new name
        cwd: 'public',
        merge: true
    }))
    .pipe(gulp.dest('./public/assets'));
});
