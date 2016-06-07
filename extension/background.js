var assets = {
	'http://t-cromhouthuis-d7.finalist.nl/sites/cromhouthuis/themes/cromhouthuis/static/css/main.css': 'cromhouthuis/css/main.css',
	'https://angularjs.org/css/docs.css': 'file.css',
	'https://ssl.google-analytics.com/ga.js': 'file.js',
	'https://nodejs.org/api/assets/style.css': 'file.css',
	'http://www.hastalavista.dds.nl/spel/mijnenveger.js': 'file.js',
	'http://www.hastalavista.dds.nl/spel/mijnenveger.css': 'file.css'
};

var routingResponse = function (details) {
    if (details.url.indexOf('#') > 0) {
        details.url = details.url.replace(/#(.+)\?/, '?').replace(/#(.+)$/, '');
    }
    // include searchterm in test
    var localRsrc = routeModel.route(details.url);
	if (!localRsrc && details.url.indexOf('?') > 0) {
        // exclude searchterm from test
	    var localRsrc = routeModel.route(details.url.split('?')[0]);
	}
	if (localStorage.running && localRsrc) {
		linkElement.createURL(details.url);
		// compose local url
		localRsrc = linkElement.protocol + '//' + localStorage[linkElement.protocol] + '/' + localRsrc;
		console.log('ROUTE ' + details.url + ' to: ' + localRsrc);
		return {redirectUrl: localRsrc};
	} else {
		return {cancel: false};
	}
};

chrome.webRequest.onBeforeRequest.addListener(function (details) {
	return routingResponse(details);
}, {
	urls: ['*://*/*'],
	types: ['image', 'object', 'script', 'stylesheet', 'xmlhttprequest', 'other']
}, ['blocking']);


chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
	if (message === 'refresh') {
		sendResponse('the response');
	}
});
