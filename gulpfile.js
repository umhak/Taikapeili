var gulp = require('gulp');
var gutil = require('gulp-util');
var webpack = require('webpack');
var rimraf = require('gulp-rimraf');
var webserver = require('gulp-webserver');
var runSequence = require('run-sequence');
var path = require('path');

var paths = {
    dist: 'dist/'
};

var filesToMove = [
    './index.html',
    'images/**/*.*',
    'lib/**/*.*',
    'css/**/*.*'
];

gulp.task('default', ['dev']);

gulp.task('webpack', function(callback) {
    webpack({
        // configuration
        entry: './js/main.jsx',
        devtool: 'eval-source-map',
        output: {
            path: paths.dist,
            filename: 'bundle.js',
            publicPath: '/'
        },
        module: {
            loaders: [
                {
                    test: /\.jsx?$/,
                    exclude: /node_modules/,
                    include: /js/,
                    loader: 'babel-loader',
                    query: {
                        presets: ['es2015', 'react']
                    }
                },
                {
                    test: /\.css$/,
                    loader: 'style-loader!css-loader?modules'
                },
                {
                    test: /\.(png|woff|woff2|eot|ttf|otf|svg)$/,
                    loader: 'url-loader?limit=100000'
                },
                {
                    test: /utils.js/,
                    loader: 'imports?_=./deps/lodash/lodash.compat-2.1.0.js,jQuery=./deps/jquery/jquery-1.10.2-min.js!exports?fi'
                },
                {
                    test: /wfsrequestparser.js/,
                    loader: 'imports?_=../lib/deps/lodash/lodash.compat-2.1.0.js,jQuery=../lib/deps/jquery/jquery-1.10.2-min.js,fi=metolibUtils!exports?fi'
                }
            ]
        },
        resolve: {
            root: path.resolve(__dirname),
            alias: {
                metolibUtils: 'lib/utils.js',
                wfsrequestparser: 'lib/wfsrequestparser.js'
            }
        }
    }, function(err, stats) {
        if(err) throw new gutil.PluginError('webpack', err);
        gutil.log('[webpack]', stats.toString({
            // output options
        }));
        callback();
    })
});

gulp.task('webserver', function() {
    gulp.src('dist')
        .pipe(webserver({
            livereload: true,
            open: true,
            fallback: 'index.html'
        }));
});

gulp.task('clean', function(){
  return gulp.src([paths.dist + '*'], {read:false})
  .pipe(rimraf());
});

gulp.task('copy-files', function(){
    gulp.src(filesToMove, {base: './'})
        .pipe(gulp.dest(paths.dist));
});

gulp.task('build', ['webpack', 'copy-files']);

gulp.task('dev', function(){
    runSequence(
        'clean',
        ['build', 'watch'],
        'webserver');
});

gulp.task('watch', function () {
    gulp.watch(['./js/**/*.*'], ['build']);
});

gulp.task('cleanProd', function () {
    return gulp.src(['prod'], { read: false })
    .pipe(rimraf());
});

gulp.task('moveApi', function () {
    gulp.src('api/**/*.*', { base: './' })
    .pipe(gulp.dest('prod/'));
});

gulp.task('prod', function () {
    paths.dist = 'prod/html';
    runSequence(
        'cleanProd',
        'build',
        'moveApi'
    );
});
