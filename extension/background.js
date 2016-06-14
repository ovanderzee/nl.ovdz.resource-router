var routingResponse = function (details) {
    if (!localStorage.running) {
		return {cancel: false};
    }
    if (details.url.indexOf('#') > 0) {
        details.url = details.url.replace(/#(.+)\?/, '?').replace(/#(.+)$/, '');
    }
    // include searchterm in test
    var localRsrc = routeModel.route(details.url);
	if (!localRsrc && details.url.indexOf('?') > 0) {
        // exclude searchterm from test
	    var localRsrc = routeModel.route(details.url.split('?')[0]);
	}
	if (localRsrc) {
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
