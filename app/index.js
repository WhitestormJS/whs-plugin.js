var generators = require('yeoman-generator');
var _ = require('lodash');
var _pluginType, _lcPT;

module.exports = generators.Base.extend({
	prompting: function () {
		var done = this.async();

		this.prompt([{
      type    : 'list',
      name    : 'type',
      message : 'Choose Whitestorm.js add-on you want to create',
      choices : ['Plugin', 'Component'],
      default : 'Plugin'
    }]).then(function (answers) {
    	_pluginType = answers.type;
    	_lcPT = _.lowerCase(_pluginType);

    	this.prompt([
    	{
	      type    : 'input',
	      name    : 'name',
	      message : function (answers) {
	      	return 'Your Whitestorm.js ' + _pluginType + ' name';
	      },
	      default : 'whs-' + _lcPT + '-myName',
	      validate: function (input) {
	      	return input.indexOf('whs-' + _lcPT + '-') === 0 ? true : 'Plugin name should start with \'whs-' + _lcPT + '-\'';
	      }
	    },
	    {
	      type    : 'input',
	      name    : 'description',
	      message : 'Short description of a ' + _lcPT
	    }, 
	    {
	      type    : 'input',
	      name    : 'filename',
	      message : 'Name of a file that will be generated and used as a ' + _lcPT,
	      default : function (answers) {
	      	return answers.name + '.js' || 'whs-' + _lcPT + '-myName.js'
	      }
	    },
	    {
	      type    : 'input',
	      name    : 'component',
	      message : 'Name that will be used in browser mode \n[example: WHS.MyCustomMesh]',
	      default : 'MyCustomMesh'
	    },
	    {
	      type    : 'confirm',
	      name    : 'babel',
	      message : 'Use es6 [babel]?',
	      default : 'true'
	    },
	    {
	      type    : 'confirm',
	      name    : 'bower',
	      message : 'Use bower?',
	      default : 'false'
	    }]).then(function (answers) {
	    	this.props = answers;
	    	done();
	    }.bind(this));
    }.bind(this));
  },

  writing: function() {
    var tmp = this.props.babel ?
    {
      // Config files.
      '_package.json': 'package.json',

      // Ignore files.
      '_.babelrc': '.babelrc',
      '_.npmignore': '.npmignore',
      '_.gitignore': '.gitignore',

      // Runner files
      '_gulpfile.babel.js': 'gulpfile.babel.js',
      '_webpack.config.babel.js': 'webpack.config.babel.js',

      // Sources.
      'src/_index.js': 'src/index.js',
      'src/_.babelrc': 'src/.babelrc',

      // Examples folder
      'examples/_index.html': 'examples/index.html',
    } :
    {
      // Config files.
      '_package_es5.json': 'package.json',

      // Ignore files.
      '_.gitignore': '.gitignore',
      '_.npmignore_es5': '.npmignore',

      // Runner files
      '_gulpfile.js': 'gulpfile.js',
      '_webpack.config.js': 'webpack.config.js',

      // Sources.
      'src/_index_es5.js': 'src/index.js',

      // Examples folder
      'examples/_index.html': 'examples/index.html',
    };

    if (this.props.bower) tmp['_bower.json'] = 'bower.json';

  	_.each(tmp, function (value, key) {
	  	this.fs.copyTpl(
	      this.templatePath(key),
	      this.destinationPath(value),
	      {
	      	type: _lcPT,
	        name: this.props.name,
	        filename: this.props.filename,
	        description: this.props.description,
	        component: this.props.component
	      }
	    );
	  }.bind(this));
  },

  installModules: function() {
  	this.installDependencies();
  }
});