/*
 * helper-file.js
 *
 * Perform helping actions before the specs are tested
 *
 */

/*
	Prevent error when spying a function more than once.
	TypeError: Attempted to wrap setBadgeBackgroundColor which is already wrapped
		at checkWrappedMethod (node_modules/sinon/pkg/sinon.js:1336)
		at wrapMethod (node_modules/sinon/pkg/sinon.js:1374)
		at spy (node_modules/sinon/pkg/sinon.js:2520)
	So, setup the spies here beforehand:
*/

var badgeTextSpy = sinon.spy(chrome.browserAction, 'setBadgeText');
var badgeBgSpy = sinon.spy(chrome.browserAction, 'setBadgeBackgroundColor');
var timeoutSpy = sinon.spy(window, 'setTimeout');

/*
	Be aware that the spy is always active.
	When the first test calls a function succesfully,
	while the second test asserts the call being done,
	the assertion of the second test will always be confirmed
	So, always reset the spy as a prerequisite to the test
*/

/* Include the html in karma testfile */

for (prop in window.__html__) {
    var whitewash = window.__html__[prop].replace(/\s/gm, ' ')
    var bodyRegEx = /<body*>(.+)<\/body>/i;
    var popupBody = bodyRegEx.exec(whitewash);
    document.body.innerHTML += popupBody[1];
}

/* bootstrap the html and scripts for phantomJS */

buildUI();

/* Helper object for updating HTML and localStorage */

var specHelper = new function () {
    var self = this;

    var clearHTML = function () {
        var configuredRoutes = document.querySelectorAll('form.route.active, form.route.passive');
        for (var i = (configuredRoutes.length - 1); i >= 0; i--) {
            configuredRoutes[i].dispatchEvent(destroyRoute);
        }
    };
    var buildHTML = function () {
        populatePopup();
    };

    this.emptyDataSet = function () {
	    localStorage.clear();
	    clearHTML();
    };

    this.simpleDataSet = function () {
	    localStorage.clear();
	    clearHTML();
        localStorage.setItem ('http://www.test.it/css/active.css', '{"active":true,"local":"test.it/styles.css"}');
        localStorage.setItem ('http://www.test.it/css/passive.css', '{"active":false,"local":"test.it/styles.css"}');
        localStorage.setItem ('loose', 'localhost:9080');
        localStorage.setItem ('rerouting', 'running');
        localStorage.setItem ('secure', 'localhost:9443');
        localStorage.setItem ('validating', '{}');
        buildHTML();
    };

};
