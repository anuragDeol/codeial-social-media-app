// gulp-cli (cli is command line interface)
// gulp is used to BUILD PROJECT - i.e. minification/optimising assets
// tip: gulp executes tasks given to it
const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));     // *new SYNTAX
const cssnano = require('gulp-cssnano');    // converts css code into single lined code
const rev = require('gulp-rev');
const uglify = require('gulp-uglify');
const imagemin = require('gulp-imagemin');  // -v7.1.0 installed, because latest version (i.e 8.0.0) does not support require() of ES module
const del = require('del');     // -v6.1.1 installed, because latest version (i.e 7.0.0) doesn't support require() of ES module

// Task::minify css
gulp.task('css', function(done) {
    console.log('minifying css...');
    gulp.src('./assets/sass/**/*.scss')
    .pipe(sass())
    .pipe(cssnano())
    .pipe(gulp.dest('./assets.css'));

    // manifesting assets (appending hashcode to file names and saving)
    gulp.src('./assets/**/*.css')
    .pipe(rev())
    .pipe(gulp.dest('./public/assets'))
    .pipe(rev.manifest({     // create a manifest - stores assets' new version with new name
        cwd: 'public',
        merge: true
    }))
    .pipe(gulp.dest('./public/assets'));
    done();
});

// Task:: minify js
gulp.task('js', function(done) {
    console.log('minifying js...');
    gulp.src('./assets/**/*.js')
    .pipe(uglify())
    .pipe(rev())
    .pipe(gulp.dest('./public/assets'))
    .pipe(rev.manifest({
        cwd: 'public',
        merge: true
    }))
    .pipe(gulp.dest('./public/assets'));
    done()
});

// Task::minify image
gulp.task('image', function(done) {
    console.log('compressing images...');
    gulp.src('./assets/**/*.+(png|jpg|gif|svg|jpeg)')
    .pipe(imagemin())
    .pipe(rev())
    .pipe(gulp.dest('./public/assets'))
    .pipe(rev.manifest({
        cwd: 'public',
        merge: true
    }))
    .pipe(gulp.dest('./public/assets'));
    done();
});

// Task::empty the public/assets directory - clears the previous build upon every new build
gulp.task('clean:assets', async function(done) {
    console.log('clearing previous build...');
    del.sync('./public/assets');
    done();
});

// Task::executing all the tasks - building the project
gulp.task('build', gulp.series('clean:assets', 'css', 'js'), function(done) {
    console.log('Building assets...');
    done();
});

