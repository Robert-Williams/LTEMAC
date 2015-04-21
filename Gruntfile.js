module.exports = function(grunt) {

	grunt.initConfig({
		jshint: {
			files: ['Gruntfile.js', 'app/lib/**/*.js', 'app/*.js', 'test/**/*.js'],
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
			src: ['app/*.js', 'app/lib/**/*.js', 'test/*.js', 'Gruntfile.js']
		}
	});

	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-cafe-mocha');
	grunt.loadNpmTasks('grunt-jscs');

	grunt.registerTask('default', ['jshint', 'cafemocha', 'jscs']);

};
