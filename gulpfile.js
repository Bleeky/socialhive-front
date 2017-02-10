// 'use strict';
//
// var PROD = false;
// var LISCENCE = "";
// var gulp = require('gulp'),
//     jscs = require('gulp-jscs'),
//     jshint = require('gulp-jshint'),
//     karma = require('gulp-karma'),
//     obfuscate = require('gulp-obfuscate'),
//     istanbul = require('gulp-istanbul'),
//     shell = require('gulp-shell'),
//     riot = require('gulp-riot'),
//     babel = require('gulp-babel'),
//     header = require('gulp-header');
//
// var sources = ['./app/*.js']
//
// /*
//  * LINT
//  */
// gulp.task('lint', function () {
//     gulp.src(sources)
//         .pipe(jshint())
//         .pipe(jshint.reporter('default'))
//         .pipe(jscs())
//         .pipe(jscs.reporter());
// });
//
// /*
//  * LAUNCHING TESTS
//  */
// gulp.task('tests', ['code-coverage'], function () {
//     return gulp.src('tests/**/*.js')
//         .pipe(karma({
//             configFile: './config/karma.conf.js',
//             action: 'run'
//         }))
//         .on('error', function (err) {
//             throw err;
//         })
//         .pipe(istanbul.writeReports());
// });
//
// /*
//  * CODE COVERAGE
//  */
// gulp.task('code-coverage', function () {
//     return gulp.src(sources)
//         .pipe(istanbul())
//         .pipe(istanbul.hookRequire())
//         .pipe(gulp.dest('./coverage'));
// });
//
// /*
//  * DOCUMENTATION GENERATION
//  */
// gulp.task('docs', shell.task([
//     './node_modules/jsdoc/jsdoc.js . -r -d docs -t ./node_modules/ink-docstrap/template -c ./config/jsdoc.json'
// ]));
//
// /*
//  * COMPILE .TAG RIOTJS
//  */
// // gulp.task('compilation-riot', function() {
// //   return gulp.src('./app/**/*.tag', {base:'./'})
// //     .pipe(riot())
// //     .pipe(gulp.dest('.'))
// // });
//
// /*
//  * COMPILE COMPONENTS
//  */
// // gulp.task('compilation-components', shell.task([
// //     './node_modules/babel/bin/babel.js -r ./app/components/* --out-dir ./build/components/'
// // ]));
//
// // gulp.task('copy-static', function() {
// //   return gulp.src([
// //     './app/**/*.css',
// //     './app/**/*.html',
// //     './app/**/*.png'
// //   ], {base:'./app/'})
// //   .pipe(header(LISCENCE))
// //   .pipe(gulp.dest('./build/'))
// // })
//
// /*
//  * DELETE /BUILD
//  */
// gulp.task('clean', shell.task(
//   ['rm -rf ./build']
// ));
//
//
// /*
//  * DEFAULT BUILDING
//  */
// gulp.task('default', ['clean'], function () {
//
//     if (PROD) { /* If PRODUCTION ENV */
//       return gulp.src(sources)
//         .pipe(babel())
//         .pipe(obfuscate())
//         .pipe(header(LISCENCE))
//         .pipe(gulp.dest('build/'))
//     }
//     /* If DEVELOPMENT ENV */
//     return gulp.src(sources)
//         .pipe(babel())
//         .pipe(gulp.dest('build/'));
// });
