module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      lib: ['lib/**/*.js', 'Gruntfile.js'],
      test: ['test/**/*.js']
    },
    release: {}
  });

  grunt.registerTask('default', 'jshint');

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-release');
};