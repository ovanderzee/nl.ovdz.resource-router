/**
 * Project settings for gulptasks
 * Factory for composing a settings object.
 *
 * Use data from given defaults, filed projectdata and commandline arguments.
 * Combine the data in a flat object for the sake of transparency.
 * Commandline option "project" is reserved to find the right entry in the project data object.
 *
 */

var defaultSettings = {};

var localProjects = {};

/**
 * Gets all options from the project data file.
 * @author Onno van der Zee
 * @param name Project name
 * @return props Project settings
 */

var getProjectSettings = function (name) {
	var props = localProjects[name];
	if (!props) {
		console.error ('Project "' + name + '" not found in local projects')
	}
	return props || {};
};

/**
 * Gets all options from the commandline. Gulp-options start with --.
 * @author Onno van der Zee
 * @param argv Commandline as Array
 * @return args Commandline as Key-Value pairs
 */

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

/**
 * Compose the final settings object with filed project settings and commandline options in a gulp task.
 * @author Onno van der Zee
 * @return finalSettings Session settings
 */

var makeSettings = function () {
	var promptSettings = getPromptSettings(process.argv);
	var projectSettings = getProjectSettings(promptSettings.project);
	var finalSettings = Object.assign({}, defaultSettings, projectSettings, promptSettings);
	return Object.assign({}, defaultSettings, projectSettings, promptSettings);
};

/**
 * Create initial settings object in gulpfile.
 * @author Onno van der Zee
 * @param defaults Default settings
 * @param projects Settings of all known projects
 * @return defaultSettings Pass defaults
 */

var newSettings = function (defaults, projects) {
	defaultSettings = defaults;
	localProjects = projects;
	return defaultSettings;
};

module.exports = {
	"make": makeSettings,
	"new": newSettings
};

