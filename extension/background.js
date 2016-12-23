var routingResponse = function (details) {
    if (!localStorage.running || localStorage.testing) {
		return {cancel: false};
    }
    var localRsrc = routeModel.localRsrc(details.url);
	if (localRsrc) {
	    var localUrl = routeModel.localUrl(details.url, localRsrc);
		console.log('ROUTE ' + details.url + ' to: ' + localUrl);
		return {redirectUrl: localUrl};
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
