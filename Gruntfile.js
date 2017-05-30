module.exports = function (grunt) {
  'use strict';

  grunt.initConfig({
    postcss: {
      options: {
        processors: [
          require('./task.js')({
            'comments': {
              before: 2,
              after: 2
            }
          })
        ],
        syntax: require('sugarss')
      },
      dist: {
        src: '*.sass'
      }
    }
  });

  grunt.loadNpmTasks('grunt-postcss');

  grunt.registerTask('default', ['postcss']);
};