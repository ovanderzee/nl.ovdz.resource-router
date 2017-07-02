/*
 * helper-file.js
 *
 * Perform helping actions before the specs are tested
 *
 */

/*
	Prevent error when spying a functiomn more than once.
	TypeError: Attempted to wrap setBadgeBackgroundColor which is already wrapped
		at checkWrappedMethod (node_modules/sinon/pkg/sinon.js:1336)
		at wrapMethod (node_modules/sinon/pkg/sinon.js:1374)
		at spy (node_modules/sinon/pkg/sinon.js:2520)
	So, setup the spies here beforehand:
*/
var badgeTextSpy = sinon.spy(chrome.browserAction, 'setBadgeText');
var badgeBgSpy = sinon.spy(chrome.browserAction, 'setBadgeBackgroundColor');


