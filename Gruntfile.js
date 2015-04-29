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
		},
		shell: {
			multiple: {
				command: [
					'git add -A',
					'git commit',
					'git push'
				].join('&&')
			}
		}
	});

	//Testing stuff, stuff, stuff, stuff

	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-cafe-mocha');
	grunt.loadNpmTasks('grunt-jscs');
	grunt.loadNpmTasks('grunt-shell');

	grunt.registerTask('default', ['jshint', 'jscs', 'cafemocha', 'shell']);

};
