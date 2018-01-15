var autoprefixer = require('gulp-autoprefixer');
var babel = require('gulp-babel');
var cleanCSS = require('gulp-clean-css');
var concat = require('gulp-concat');
var gulp = require('gulp');
var livereload = require('gulp-livereload');
var plumber = require('gulp-plumber');
var sourcemaps = require('gulp-sourcemaps');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');

// LESS Plugins
var less = require('gulp-less');
var LessAutoprefix = require('less-plugin-autoprefix');
var lessAutoprefix = new LessAutoprefix({
	browsers: ['last 2 versions']
});

// Handlebars Plugins
var handlebars = require('gulp-handlebars');
var handlebarsLib = require('handlebars');
var declare = require('gulp-declare');
var wrap = require('gulp-wrap');

// File Paths
var DIST_PATH = 'public/dist'
var SCRIPTS_PATH = 'public/scripts/**/*.js';
var CSS_PATH = 'public/css/**/*.css';
var TEMPLATES_PATH = 'templates/**/*.hbs'

// // Styles
// gulp.task('styles', function () {
// 	console.log('starting styles task');
// 	return gulp.src(['public/css/reset.css', CSS_PATH])
// 		.pipe(plumber(function (err) {
// 			console.log('Styles Task Error');
// 			console.log(err);
// 			this.emit('end');
// 		}))
// 		.pipe(sourcemaps.init())
// 		.pipe(autoprefixer())
// 		.pipe(concat('styles.css'))
// 		.pipe(cleanCSS())
// 		.pipe(sourcemaps.write())
// 		.pipe(gulp.dest(DIST_PATH))
// 		.pipe(livereload());
// });

// // SCSS Styles
// gulp.task('styles', function () {
// 	console.log('starting styles task');
// 	return gulp.src('public/scss/styles.scss')
// 		.pipe(plumber(function (err) {
// 			console.log('Styles Task Error');
// 			console.log(err);
// 			this.emit('end');
// 		}))
// 		.pipe(sourcemaps.init())
// 		.pipe(autoprefixer())
// 		.pipe(sass({
// 			outputStyle: 'compressed'
// 		}))
// 		.pipe(sourcemaps.write())
// 		.pipe(gulp.dest(DIST_PATH))
// 		.pipe(livereload());
// });

// LESS Styles
gulp.task('styles', function () {
	console.log('starting styles task');
	return gulp.src('public/less/styles.less')
		.pipe(plumber(function (err) {
			console.log('Styles Task Error');
			console.log(err);
			this.emit('end');
		}))
		.pipe(sourcemaps.init())
		.pipe(less({
			plugins: [lessAutoprefix]
		}))
		.pipe(cleanCSS())
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(DIST_PATH))
		.pipe(livereload());
});

// Scripts
gulp.task('scripts', function () {
	console.log('starting scripts task');

	return gulp.src('public/scripts/*.js')
		.pipe(plumber(function (err) {
			console.log('Scripts task error!');
			console.log(err);
			this.emit('end');
		}))
		.pipe(sourcemaps.init())
		.pipe(babel({
			presets: ['env']
		}))
		.pipe(uglify())
		.pipe(concat('scripts.js'))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(DIST_PATH))
		.pipe(livereload());
});

// Images
gulp.task('images', function () {
	console.log('starting images task');
});

gulp.task('templates', function () {
	return gulp.src(TEMPLATES_PATH)
 		.pipe(handlebars({
			handlebars: handlebarsLib
		}))
		.pipe(wrap('Handlebars.template(<%= contents %>)'))
		.pipe(declare({
			namespace: 'templates',
			noRedeclare: true
		}))
		.pipe(concat('templates.js'))
		.pipe(gulp.dest(DIST_PATH))
		.pipe(livereload());
});

gulp.task('default', ['images', 'templates', 'styles', 'scripts'], function () {
	console.log('Starting default task');
});

gulp.task('watch', ['default'], function() {
	console.log('Starting watch task.');
	require('./server.js');
	livereload.listen();
	gulp.watch(SCRIPTS_PATH, ['scripts']);
	// gulp.watch(CSS_PATH, ['styles']);
	// gulp.watch('public/scss/**/*.scss', ['styles']);
	gulp.watch('public/less/**/*.less', ['styles']);
	gulp.watch(TEMPLATES_PATH, ['templates']);
});
