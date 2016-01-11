module.exports = function (grunt) {
  "use strict";

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    lint: {
      files: ['grunt.js', 'index.js', 'lib/*.js', 'test/*.js']
    },
    watch: {
      files: ['grunt.js', 'index.js', 'lib/*.js', 'test/*.js'],
      tasks: 'lint'
    },
    dirs: {
      dest: 'dist'
    },
    min: {
      dist: {
        src: ['lib/jsonp-client.js'],
        dest: '<%= dirs.dest %>/jsonp-client.min.js'
      }
    },
    jshint: {
      options: {
        bitwise: true,
        curly: true,
        eqeqeq: true,
        forin: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        nonew: true,
        plusplus: true,
        regexp: true,
        noempty: true,
        sub: true,
        undef: true,
        trailing: true,
        eqnull: true,
        browser: true,
        node: true,
        indent: 2,
        onevar: true,
        white: true
      },
      globals: {
        describe: true,
        expect: true,
        it: true,
        before: true
      }
    },
    uglify: {}
  });

  // Default task.
  grunt.registerTask('default', 'watch');

  // Build task.
  grunt.registerTask('build', 'lint min');

};