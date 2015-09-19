module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        banner: '/*! <%= pkg.file %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
        mangle: {toplevel: true},
        squeeze: {dead_code: false},
        codegen: {quote_keys: true}
      },
      build: {
    		files: {
    			'dist/js/<%= pkg.file %>.min.js':'src/js/<%=pkg.file %>.js'
    		}
      }
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      all: [
        'Gruntfile.js',
        'src/js/*.js'
      ]
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
        dest: "tmp/css/<%=pkg.file %>.css"
      }
    },
  	cssmin: {
      options: {
        report: 'gzip'
      },
      build: {
        files: {
        'dist/css/<%= pkg.file %>.min.css':'tmp/css/<%=pkg.file %>.css'
        }
      }
  	},
    imagemin: {
      build: {
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
        'dist/img/<%= pkg.file %>.png':'src/img/<%=pkg.file %>.png'
        }
      }
    },
    htmlmin: {
      build: {
        options: {
          removeComments: true,
          collapseWhitespace: true
        },
	    files: [{       
          expand: true,
		  cwd: 'tmp',
		  src: '**/*.html',
		  dest: 'dist'
		}]
      }
    },
    clean: ['tmp', 'dist'],
    dotpl: {
      options: {
        main:'src/tpl/bootstrap-ssdlg.html',
        test:'src/tpl/test.html'
      },
      main: {
        files: {
          'tmp/tpl/<%=pkg.file %>.html': ['src/lang/en-US/main.json'],
          'tmp/tpl/<%=pkg.file %>_zh-CN.html': ['src/lang/en-US/main.json', 'src/lang/zh-CN/main.json'],
          'tmp/tpl/<%=pkg.file %>_zh-TW.html': ['src/lang/en-US/main.json', 'src/lang/zh-CN/main.json', 'src/lang/zh-TW/main.json']
        }
	  },
      test: {
		options: {
		  renderer: function(k, v) {
			if(k==='__ssdlg_tpl') {
				v = grunt.file.read('tmp/tpl/bootstrap-ssdlg.html');
			}
			return v;
		  }
		},
        files: {
          'tmp/test.html': ['src/lang/en-US/main.json']
        }
	  }
    },
    cipher: {
      options: {
        pk:grunt.cli.options.pk||grunt.file.read('.pk')
      },
      encrypt: {
        files: [{
          expand:true,
          cwd:'src/',
          src:['**/*'],
          dest:'cipher/'
        }]
      },      
      decrypt: {
        options: {
          method:'decrypt'
        },
        files: [{
          expand:true,
          cwd:'cipher/',
          src:['**/*'],
          dest:'src/'
        }]
      }
    }
  });
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
  grunt.registerTask('decrypt', ['cipher:decrypt']);
  grunt.registerTask('default', ['jshint','clean','cipher:encrypt','dotpl','htmlmin','uglify','concat','cssmin','copy']);
  grunt.registerTask('imagemin', ['default','imagemin']);
};