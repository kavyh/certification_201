module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: {
            dist: {
                src: ['public']
            }
        },
        cssmin: {
            dist: {
                options: {
                    compatibility: 'ie8',
                    keepSpecialComments: '*',
                    noAdvanced: true
                },
                core: {
                    files: {'./public/app.css': ["./bower_components/bootstrap/dist/css/bootstrap.min.css",
                            "./bower_components/font-awesome/css/font-awesome.min.css",
                            "./bower_components/textAngular/dist/textAngular.css",
                            "./src/css/app.css"
                        ]}
                }}
        },
        concat: {
            options: {
                separator: ';',
                sourceMap: true
            },
            lib: {
                src: [
                    "./bower_components/angular/angular.min.js",
                    "./bower_components/angular-cookies/angular-cookies.min.js",
                    "./bower_components/angular-messages/angular-messages.min.js",
                    "./bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js",
                    "./bower_components/angular-ui-router/release/angular-ui-router.min.js",
                    "./bower_components/ngstorage/ngStorage.min.js",
                    "./bower_components/textAngular/dist/textAngular-rangy.min.js",
                    "./bower_components/textAngular/dist/textAngular-sanitize.min.js",
                    "./bower_components/textAngular/dist/textAngular.min.js",
                    "./bower_components/ng-file-upload/ng-file-upload.min.js",
                    "./bower_components/ng-file-upload/ng-file-upload-shim.min.js",
                    "./bower_components/angular-bootstrap-lightbox/dist/angular-bootstrap-lightbox.min.js"
                ],
                dest: 'public/lib.min.js'
            }
        },
        jshint: {
            files: ['gruntfile.js', 'src/js/*.js', 'src/js/**/*.js'],
            options: {
                globals: {
                    jQuery: true,
                    console: true,
                    module: true
                }
            }
        },
        copy: {
            main: {
                files: [
                    // includes files within path and its sub-directories
                    {expand: true, cwd: 'src/js/', src: '**', dest: 'public/js'},
                    {expand: true, cwd: './bower_components/font-awesome', src: '**', dest: 'public/css/font-awesome'},
                    {expand: true, cwd: 'src/templates/', src: '**', dest: 'public/templates'},
                    {expand: true, cwd: 'src/images/', src: '**', dest: 'public/images'},
                    {expand: true, flatten: true, src: ["./bower_components/bootstrap/dist/css/bootstrap.min.css",
                            "./bower_components/textAngular/dist/textAngular.css",
                            "./src/css/app.css"], dest: 'public/css', filter: 'isFile'}
                ]
            }
        }

    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-jshint');
//    grunt.loadNpmTasks('grunt-contrib-cssmin');

    grunt.option('force', true);
    grunt.registerTask('default', ['clean', 'copy', 'jshint', 'concat']);
};

