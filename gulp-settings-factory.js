/*
 *
 * Factory for composing a settings object.
 *
 * Use data from given defaults, filed projectdata and commandline arguments.
 * Combine the data in a flat object for the sake of transparency.
 * Commandline option "project" is reserved to find the right entry in the project data object.
 *
 */

var defaultSettings = {};

var localProjects = {};

var getProjectSettings = function (name) {
	var props = localProjects[name] || {};
	if (JSON.stringify(props) === '{}') {
		console.error ('No project found in local projects')
	}
	return props;	
};

var getPromptSettings = function (argv) {
	var args = {};
	for (arg of argv) {
		var setting = arg.replace(/^--/, '');
		if (setting !== arg) {
			var pair = setting.split('=');
			args[pair[0]] = pair.length ? pair[1] : true;
		}
	}
	if (!args.project) {
		console.error ('No project found in prompt')
	}
	return args;
};

/* project settings for gulptasks */
module.exports = {
	"make": function (argv) {
		var promptSettings = getPromptSettings(argv);
		var projectSettings = getProjectSettings(promptSettings.project);
		return Object.assign({}, defaultSettings, projectSettings, promptSettings);
	},
	"new": function (defaults, projects) {
		defaultSettings = defaults;
		localProjects = projects;
		return defaultSettings;
	}
};

