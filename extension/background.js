// init badge decoration

extensionModel.setBadge();

var routingResponse = function (details) {
    var localRsrc = routeModel.getLocalResource(details.url);
//    console.log( details.url + ' ==> ' + localRsrc + '\n runs: ' + extensionModel.isRunning() + ' validates: ' + urlModel.isValidating(details.url) );
    var reRoute = localRsrc && extensionModel.isRunning() && !urlModel.isValidating(details.url);
	if (reRoute) {
	    var localHost = routeModel.localHost(details.url);
	    var localUrl = localHost + "/" + localRsrc;
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
