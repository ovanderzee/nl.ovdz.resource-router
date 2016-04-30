var assets = {
	'https://angularjs.org/css/docs.css': 'file.css',
	'http://www.hastalavista.dds.nl/spel/mijnenveger.js': 'file.js',
	'http://www.hastalavista.dds.nl/spel/mijnenveger.css': 'file.css'
};

var routingResponse = function (details) {
	var localRsrc = assets[details.url];
	if (localStorage['running'] && localRsrc) {
		linkElement.createURL(details.url);
		localRsrc = linkElement.protocol + '//' + localStorage[linkElement.protocol] + '/' + localRsrc;
		console.log('ROUTE ' + details.url + ' to: ' + localRsrc);
		return {redirectUrl: localRsrc};
	} else {
//		console.log('KEEP ' + details.url);
		return {cancel: false};
	}
};

chrome.webRequest.onBeforeRequest.addListener(function (details) {
	return routingResponse(details);
}, {
	urls: ['*://*/*'],
	types: ['image', 'object', 'script', 'stylesheet', 'xmlhttprequest', 'other']
}, ['blocking']);


chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
	if (message === 'refresh') {
		sendResponse('the response');
	}
});
