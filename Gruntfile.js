'use strict';

module.exports = function (grunt) {

  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    // Lint js
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      files: {
        src: ['lib/**/*.js']
      }
    },

    // Run tests
    nodeunit: {
      validate: ['test/validate_test.js'],
      server: ['test/server_test.js']
    },

    // Start node server
    nodemon: {
      dev: {
        script: 'server/bin/www',
        options: {
          ext: 'js',
          nodeArgs: [
            '--debug'
          ],
          ignore: [
            'node_modules/**'
          ],
          watch: ['lib', 'test', 'server']
        },
      }
    },

    // Debugging server
    'node-inspector': {
      dev: {
        options: {
          'no-preload': true,
          'hidden': ['node_modules']
        }
      }
    },

    // Run nodemon concurrently
    concurrent: {
      watch: {
        tasks: ['nodemon:dev', 'node-inspector:dev', 'watch'],
        options: {
          logConcurrentOutput: true
        }
      }
    },

    // Watch for changes
    watch: {
      js: {
        files: [
          'lib/**/*.js',
          'server/**/*.js'
        ],
        tasks: ['jshint']
      },
      test: {
        files: [
          'test/**/*.js'
        ],
        tasks: ['jshint', 'nodeunit']
      },
      gruntfile: {
        files: ['Gruntfile.js']
      },
      livereload: {
        files: [
          'index.js',
          'lib/**/*.js',
          'server/**/*.js'
        ],
        options: {
          livereload: true
        }
      },
    },
  });

  grunt.registerTask('test', [
    'jshint',
    'nodeunit:validate'
  ]);

  grunt.registerTask('default', [
    'concurrent'
  ]);

};
