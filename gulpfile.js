const { series, src, dest } = require('gulp');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const webpack = require('webpack-stream');


function build () {
  // body omitted
  return src('index.js')
    .pipe(babel())
    .pipe(webpack({
      mode: 'production',
      output: {
        filename: 'index.js',
      }
    }))
    .pipe(uglify())
    .pipe(dest('lib/'))
    .pipe(dest('docs/'));
}

exports.build = build;

exports.default = series(build);