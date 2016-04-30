var localHost = {
	'http:': 'http://0.0.0.0:9000',
	'https:': 'https://0.0.0.0:8443'
};

var assets = {
	'https://angularjs.org/css/docs.css': 'file.css',
	'http://www.hastalavista.dds.nl/spel/mijnenveger.js': 'file.js',
	'http://www.hastalavista.dds.nl/spel/mijnenveger.css': 'file.css'
};

var running = true;

var routingResponse = function (details) {
	var localRsrc = assets[details.url];
	if (running && localRsrc) {
		linkElement.createURL(details.url);
		localRsrc = localHost[linkElement.protocol] + '/' + localRsrc;
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


