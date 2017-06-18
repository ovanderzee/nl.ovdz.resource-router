var spawn = require('child_process').spawn;
var util = require('gulp-util');

/**
 * Handle the project's gulpfile in a child process.
 * @author Onno van der Zee
 * @param project Project settings
 */

var runAsync = function (project) {

	var exec = project.command.exec;
	var args = project.command.args;

	var process = spawn(exec, args || [], {cwd: project.docroot}),
		stdout = '',
		stderr = '';

	process.stdout.setEncoding('utf8');
	process.stdout.on('data', function (data) {
		stdout += data;
		util.log(util.colors.blue(data));
	});

	process.stderr.setEncoding('utf8');
	process.stderr.on('data', function (data) {
		stderr += data;
		util.log(util.colors.blue.bold(data));
	});

	process.on('close', function(code) {
		util.log(util.colors.blue("Exiting " + project.name + " with code " + code));
	});

};

module.exports = {
	"run": runAsync
};
