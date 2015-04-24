module.exports = function(grunt) {

	grunt.initConfig({
		jshint: {
			files: ['Gruntfile.js', 'lib/**/*.js', '*.js', 'test/**/*.js'],
			options: {
				globals: {
					jQuery: true
				}
			}
		},
		cafemocha: {
			src: 'test/*.js',
			options: {
				ui: 'bdd',
				reporter: 'landing'
			}
		},
		jscs: {
			src: ['*.js', 'lib/**/*.js', 'test/*.js', 'Gruntfile.js']
		}
	});

	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-cafe-mocha');
	grunt.loadNpmTasks('grunt-jscs');

	grunt.registerTask('default', ['jshint', 'jscs', 'cafemocha']);

};
