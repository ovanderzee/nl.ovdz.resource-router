var assets = {
	'http://www.hastalavista.dds.nl/spel/mijnenveger.js': 'http://0.0.0.0:9000/file.js',
	'http://www.hastalavista.dds.nl/spel/mijnenveger.css': 'http://0.0.0.0:9000/file.css'
};

var running = true;

var routingResponse = function (details) {
	var localRsrc = assets[details.url];
	if (running && localRsrc) {
		console.log('REPLACE ' + details.url + ' by: ' + localRsrc);
		return {redirectUrl: localRsrc};
	} else {
		console.log('KEEP ' + details.url);
		return {cancel: false};
	}
};

chrome.webRequest.onBeforeRequest.addListener(function (details) {
	return routingResponse(details);
}, {
	urls: ['*://*/*'],
	types: ['image', 'object', 'script', 'stylesheet', 'xmlhttprequest', 'other']
}, ['blocking']);
