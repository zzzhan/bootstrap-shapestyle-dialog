module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        banner: '/*! <%= pkg.file %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
	  mangle: {toplevel: true},
	  squeeze: {dead_code: false},
	  codegen: {quote_keys: true},
      build: {
		files: {
			'dist/js/<%= pkg.file %>.min.js':'src/js/<%=pkg.file %>.js'
		}
      }
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: false,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        unused: true,
        boss: true,
        eqnull: true,
        browser: true,
        globals: {
          $ : true,
          Modernizr : true,
          console: true,
          define: true,
          module: true,
          require: true
        },
        "-W099": true,
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      js: {
        src: 'src/js/<%=pkg.file %>.js'
      }
	},
    concat: {
      options: {
        separator: ';',
        stripBanners: true
      },
      css:{
        src: [
          "src/css/*.css"
        ],
        dest: "dist/css/<%=pkg.file %>.css"
      }
    },
	cssmin: {
      options: {
        report: 'gzip'
      },
      build: {
		files: {
			'dist/css/<%= pkg.file %>.min.css':'dist/css/<%=pkg.file %>.css'
		}
      }
	},
    imagemin: {
      prod: {
        options: {
          optimizationLevel: 7,
          pngquant: true
        },
        files: [
          {expand: true, cwd: 'src', src: ['img/*.{png,jpg,jpeg,gif,webp,svg}'], dest: 'dist'}
        ]
      }
    },
	copy: {
      build: {
		files: {
			'dist/js/<%= pkg.file %>.js':'src/js/<%=pkg.file %>.js'
		}
      }
	},
	htmlmin: {
      dist: {
        options: {
          removeComments: true,
          collapseWhitespace: true
        },
        files: {
          'dist/tpl/<%=pkg.file %>.min.html': 'src/tpl/<%=pkg.file %>.html'
        }
      }
    },
    clean: ['dist']
  });
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
  grunt.registerTask('default', ['jshint','clean','uglify','concat','cssmin','htmlmin','imagemin']);
};