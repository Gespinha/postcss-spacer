module.exports = function (grunt) {
  'use strict';

  // Project configuration
  grunt.initConfig({
    // Metadata
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
      ' Licensed <%= props.license %> */\n',

    // Task configuration
    postcss: {
      options: {
        processors: [
          require('postcss-spacer')({
            'comment-patterns': ['/* --'],
            'lines-before': 2,
            'lines-after': 2
          })
        ],
        syntax: require('sugarss')
      },
      dist: {
        src: '*.sass'
      }
    }
  });

  // These plugins provide necessary tasks
  grunt.loadNpmTasks('grunt-postcss');

  // Default task
  grunt.registerTask('default', ['postcss']);
};