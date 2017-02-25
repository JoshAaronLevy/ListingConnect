var _ = require('lodash');
const BUILD_PATH = '_output/';
const ASSETS_PATH = ["images/**/*.{jpg,jpeg,png,gif}", "fonts/**"];
const CONFIG = require('./config');

if (!global._babelPolyfill) {
  // require('babel-core/polyfill')
	require("babel/register")({
		ignore: /bower_components|node_modules|_output\//,
		sourceMaps: true
		//
	});
}

// // './js/apps/universal/index.js',
// // './js/main.js',
// // './js/modules/parse-angular.js',
// // 'js/classie.js',
// // 'js/mobileMenu.js'

var jsLibs = [
'./bower_components/angular-sanitize/angular-sanitize.min.js',
'./bower_components/velocity/velocity.js',
'./bower_components/bootstrap/dist/js/bootstrap.js',
'./bower_components/html5shiv/dist/html5shiv.js',
'./bower_components/ckeditor/ckeditor.js',
'./bower_components/moment/moment.js',
// './bower_components/ag-grid/dist/ag-grid.js',
'./bower_components/ui-select/dist/select.js',
'./bower_components/angular-spinners/dist/angular-spinners.min.js',
// './bower_components/ng-ckeditor/config.js',
// './bower_components/ng-ckeditor/lang/en.js',
'./bower_components/ng-ckeditor/ng-ckeditor.js',
// './js/vendor/apps/index.js',
// './js/vendor/app.js',
'./js/vendor/repute-scripts.js',
// './js/vendor/slick.js',
// './js/vendor/jquery.bootstrap-autohidingnavbar.js',
// './js/vendor/fastclick.js',
'./js/vendor/modernizr.js',
// './js/vendor/intro.js',
// './js/vendor/messaging.js',
// './js/vendor/loading.js',
// './js/vendor/uiSelectChoicesDirective.js',
// './js/vendor/ui-select.js',
// './js/vendor/dashboard.js',
// './js/vendor/dashboard2.js',
// './js/vendor/jquery-slimscroll.js',
// './js/vendor/jquery-sparkline.js',
'./js/vendor/animated-signup.js',
// './js/vendor/bootstrap-tour.js',
// './js/vendor/bootstrap-tour.min.js',
'./js/vendor/jquery-ui.js',
// './js/vendor/jquery-knob.js',
// './js/vendor/select2-full.js',
// './js/vendor/ion-rangeSlider.min.js',
// './js/vendor/morris.js',
// './js/vendor/pace.js',
'./js/vendor/main.js',
// './js/vendor/bootstrap.js',
'./js/vendor/hover-dropdown.js',
'./js/vendor/jquery-easing.js',
// './js/vendor/jquery-mixitup.js',
'./js/vendor/scrollReveal.js',
// './js/vendor/owl-carousel.js',
// './js/vendor/jquery-magnific-popup.js',
'./js/vendor/jquery-snippet.js',
'./js/vendor/jquery-fitvids.js',
// './js/vendor/style-switcher.js',
'./js/vendor/activate-snippet.js',
'./js/vendor/skrollr.min.js',
'./js/vendor/jquery.ui.widget.js',
'./js/vendor/jquery.iframe-transport.js',
'./js/vendor/jquery.fileupload.js',

// './js/vendor/image-editor/scripts.min.js',
// './js/vendor/image-editor/App.js',
// './js/vendor/image-editor/Canvas.js',
// './js/vendor/image-editor/EditorController.js',
// './js/vendor/image-editor/EditorUploadsController.js',
// './js/vendor/image-editor/History.js',
// './js/vendor/image-editor/LocalStorage.js',
// './js/vendor/image-editor/pixie-integrate.js',
// './js/vendor/image-editor/Saver.js',
// './js/vendor/image-editor/TopPanelController.js',
// './js/vendor/image-editor/zoomController.js',

// './js/vendor/image-editor/basics/CanvasBackgroundController.js',
// './js/vendor/image-editor/basics/ResizeController.js',
// './js/vendor/image-editor/basics/RotateController.js',
// './js/vendor/image-editor/basics/RoundedCornersController.js',

// './js/vendor/image-editor/crop/cropController.js',
// './js/vendor/image-editor/crop/cropper.js',
// './js/vendor/image-editor/crop/cropzone.js',

// './js/vendor/image-editor/directives/ColorPicker.js',
// './js/vendor/image-editor/directives/FileUploader.js',
// './js/vendor/image-editor/directives/LazyShow.js',
// './js/vendor/image-editor/directives/PrettyScrollbar.js',
// './js/vendor/image-editor/directives/Slider.js',
// './js/vendor/image-editor/directives/Tabs.js',
// './js/vendor/image-editor/directives/TogglePanelVisibility.js',
// './js/vendor/image-editor/directives/ToggleSidebar.js',

// './js/vendor/image-editor/objects/ObjectsPanelController.js',
// './js/vendor/image-editor/objects/ObjectsPanelSortableDirective.js',

// './js/vendor/image-editor/resources/colors.js',
// './js/vendor/image-editor/resources/gradients.js',

// './js/vendor/agency.js',
// './js/vendor/cbpAnimatedHeader.js',
// './js/vendor/classie.js',
// './js/vendor/contact_me.js',
// './js/vendor/jqBootstrapValidation.js',

 // "js/bootstrap.min.js",
 //  "js/hover-dropdown.js",
 //  "js/jquery.easing.min.js",
 //  "js/jquery.mixitup.min.js",
 //  "js/scrollReveal.js",
 //  "js/owl.carousel.min.js",
 //  "js/jquery.magnific-popup.min.js",
 //  "js/jquery.snippet.min.js",
 //  "js/jquery.fitvids.js",
 //  "js/style-switcher.js",
 //  "js/activate-snippet.js",
 //  "js/skrollr.min.js"
];

var wysiwyg = ['./ckeditor/*'];

module.exports = function(grunt) {
	// Force use of Unix newlines
	grunt.util.linefeed = '\n';

	// Project configuration.
	grunt.initConfig({

		// Metadata.
		pkg: grunt.file.readJSON('package.json'),

		distPath: BUILD_PATH,

		clean: {
			dist: BUILD_PATH + ""
		},

		jade: {
			options: {
				pretty: true,
				data: _.extend({
          cacheBreaker: (Date.now()+'').substr(7),
					assets: '../' + BUILD_PATH
			  },
        CONFIG)
			},
			build: {
				files: [{
					expand: true,
					cwd: 'site/',
					src: './**/*.jade',
					dest: BUILD_PATH,
					ext: '.html'
				}]//{'views/**/*.tmpl.jade': 'public/views/**/*.html'}
			}
		},

		uglify: {
			options: {
				debug: true,
				prettify: true,
				data: {
					// assets: '../' + BUILD_PATH
				}
			},
      vendor: {
      	dest: BUILD_PATH + 'js/vendor.min.js',
      	src: jsLibs
      },
      build: {
        files: [{
					expand: true,
					cwd: 'js/',
					src: ['**/*.js'],
					dest: BUILD_PATH + 'js',
					ext: '.min.js'
				}]//{'views/**/*.tmpl.jade': 'public/views/**/*.html'}
			}

		},

		copy: {
			test: {
				src: './test/**',
				dest: BUILD_PATH + '',
				expand: true
			},
			favicon: {
				src: './favicon.ico',
				dest: BUILD_PATH + '',
			},
			data: {
				src: './data/**',
				dest: BUILD_PATH + '',
				expand: true
			},
			css: {
				expand: true,
				flatten: true,
				src: [
					'css/*.fileupload*.css',
          'bower_components/ng-ckeditor/ng-ckeditor.css',
					'bower_components/font-awesome/css/font-awesome.min.css',
					'bower_components/ideal-image-slider/ideal-image-slider.css',
					'bower_components/ideal-image-slider/themes/default/default.css'
				],
				dest: BUILD_PATH + 'css/'
			},
			vendor: {
				files: [{
          expand: true,
          flatten: false,
          src: '**',
          cwd: 'bower_components/ckeditor',
          dest: BUILD_PATH + 'ckeditor'
        }, {
				// 	expand: true,
				// 	flatten: true,
				// 	src: './js/vendor/*.js',
				// 	dest: BUILD_PATH + 'js/vendor/'
				// }, {
					expand: true,
					flatten: true,
					src: [
						'bower_components/animate-css/animate.min.css',
						'bower_components/bootstrap/dist/css/bootstrap.min.css'
					],
					dest: BUILD_PATH + 'css/'
				}]
			},
			assets: {
				expand: true,
				src: ASSETS_PATH,
				dest: BUILD_PATH
			}
		},

		less: {
			options: {"debug": true},
			main: {
				files: [
					{
						cwd: './less',
						expand: true,
						dest: BUILD_PATH + 'styles',
						src: './*.less',
						ext: '.min.css'
					}
				]
			}
		},

		browserify: {
      options: {
        transform: [
          'jadeify',
	        ['babelify', {ignore: /bower_components|node_modules|_output\// }],
	        'debowerify'
	      ],
        browserifyOptions: { debug: true },
        noparse: ['lodash'],
        ignore: ['angular', 'jquery']
      },
			dist: {
		    files: [{
					cwd: './js',
					expand: true,
					dest: BUILD_PATH + 'js',
					src: 'apps/**/index.js*',
					ext: '.min.js'
				}, {
					cwd: './test',
					expand: true,
					dest: BUILD_PATH + 'test',
					src: './**/*.js',
					ext: '.min.js'
				}]
  		}
		},
    concat: {
      vendor: {
        dest: BUILD_PATH + 'js/vendor.js',
        src: jsLibs
      }
    },
		concurrent: {
			options: {
				logConcurrentOutput: true
			},
			dev: ['watch', 'browserSync']
		},

		watch: {
			options: {
				livereload: true
			},
			less: {
				files: './**/*.{less,css}',
				tasks: ['less']
			},
			test: {
				files: ['./test/**/*'],
				tasks: ['copy:test']
			},
			js: {
				files: ['./js/**/*.js', './config/**/*.js'],
				tasks: ['newer:copy', 'browserify'/*, 'uglify:vendor'*/]
			},
			jade: {
				files: ['./site/**/*.jade', './themes/**/*.jade'],
				tasks: ['jade']
			}
		},
		browserSync: {
			default_options: {
				bsFiles: {
					src: [BUILD_PATH + "**/*.{css,html,js}"]
				},
				options: {
					watchTask: false,// set to true if apart of steps ending in 'watch'
					// browser: "/opt/google/chrome/chrome",
					reloadDelay: 750,
					reloadDebounce: 2500,
					injectChanges: false,
					// port: 4001,
					server: BUILD_PATH
				}
			}
		}
	});

	require('load-grunt-tasks')(grunt);

	grunt.registerTask('html', ['jade']);
  grunt.registerTask('build', ['newer:concat', 'newer:copy', 'browserify'/*, 'uglify:vendor'*/, 'jade', 'less']);
	grunt.registerTask('watch', ['browserSync', /*'clean', 'build',*/ 'watch']);
	grunt.registerTask('default', ['build'/*, 'browserSync'*/]);
};
