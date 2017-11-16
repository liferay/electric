'use strict';

let _ = require('lodash');
let updateNotifier = require('update-notifier');
let yeoman = require('yeoman-generator');

module.exports = yeoman.Base.extend({
	initializing: function() {
		let pkg = require('../../package.json');

		this.pkg = pkg;

		let notifier = updateNotifier({
			pkg: pkg,
			updateCheckInterval: 1000 * 60 * 60 * 12
		});

		notifier.notify();
	},

	prompting: function() {
		this._prompt();
	},

	configuring: function() {
		this.destinationRoot(this.projectId);
	},

	writing: {
		app: function() {
			this.template('package.json', 'package.json', this);
			this.template('electric.config.js', 'electric.config.js', this);
			this.template('README.md', 'README.md', this);
			this.fs.copy(
				this.templatePath('gitignore'),
				this.destinationPath('.gitignore')
			);
		},

		projectfiles: function() {
			this.fs.copy(this.templatePath('src'), this.destinationPath('src'));

			this.template('src/site.json', 'src/site.json', this);
		}
	},

	install: function() {
		let skipInstall = this.options['skip-install'];

		if (!skipInstall) {
			this.installDependencies({
				bower: false
			});
		}
	},

	_afterPrompt: function(done, props) {
		_.assign(this, props);

		done();
	},

	_getPrompts: function() {
		let user = this.user;

		let prompts = [
			{
				default: 'My Site',
				message: 'What would you like to call your project?',
				name: 'projectName',
				type: 'input'
			},
			{
				default: function(answers) {
					return _.kebabCase(_.deburr(answers.projectName || ''));
				},
				message: 'Would you like to use this as the project id? (determines folder name)', // eslint-disable-line
				name: 'projectId',
				type: 'input'
			},
			{
				default: function(answers) {
					let done = this.async();

					user.github.username(function(err, res) {
						let username = res ? res : 'my-user';
						let repository = username + '/' + answers.projectId;

						done(null, repository);
					});
				},
				message: 'What GitHub repository are you going to use?',
				name: 'githubRepo',
				type: 'input'
			},
			{
				default: 'UA-37033501-5',
				message: 'What is your Google Analytics tracking id?',
				name: 'googleAnalytics',
				type: 'input'
			}
		];

		return prompts;
	},

	_prompt: function() {
		let done = this.async();

		this.prompt(this._getPrompts()).then(this._afterPrompt.bind(this, done));
	}
});
