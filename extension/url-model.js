var urlModel = new function () {
    var self = this;
    var stack = {};
    this.responseHeaders = {};

    this.setupValidation = function (url) {
//        self.table[this.value] = this;
//        this.className = this.className.replace(/ request-.+/, '');
//        this.className += ' request-lost';
//        this.title = 'No response';
        stack[url] = {statusCode: 0, statusLine: 'No response'};
        if (self.responseHeaders[url]) {
            self.responseHeaders[url] = Object(self.responseHeaders[url], stack[url]);
        }
        extensionModel.startUrlTest();
        var httpRequest = new XMLHttpRequest();
        httpRequest.open('GET', url);
        httpRequest.send();
    };

    var handleValidation = function (details) {
//        if (details.statusCode === 200) {
//            this.className = this.className.replace(' request-lost', ' request-found');
//        } else {
//            this.className = this.className.replace(' request-lost', ' request-failed');
//        }
        var url = details.url;
console.log ('handleValidation ' + JSON.stringify (details));
        if (stack[url]) {
            self.responseHeaders[url] = Object(stack[url], details);
            delete stack[url];
            if (JSON.stringify(stack) === '{}') {
                extensionModel.stopUrlTest();
            }
        }
        return {cancel: false};
    };

    chrome.webRequest.onHeadersReceived.addListener(handleValidation, {urls: ['*://*/*']}, ['blocking']);

/*
    console.log('HDRS ' + JSON.stringify(details));
    200 {"frameId":0,"method":"GET","parentFrameId":-1,"requestId":"2904","statusCode":200,
        "statusLine":"HTTP/1.1 200 OK","tabId":-1,"timeStamp":1465684419237.712,"type":"xmlhttprequest",
        "url":"http://www.hastalavista.dds.nl/spel/mijnenveger.css"}
    204 {"frameId":0,"method":"GET","parentFrameId":-1,"requestId":"3696","statusCode":204,
        "statusLine":"HTTP/1.1 204 No Content","tabId":-1,"timeStamp":1465765999474.283,"type":"xmlhttprequest",
        "url":"https://robwu.nl/204"}
    401 {"frameId":0,"method":"GET","parentFrameId":-1,"requestId":"3642","statusCode":401,
        "statusLine":"HTTP/1.1 401 Authorization Required","tabId":-1,"timeStamp":1465765285869.165,"type":"xmlhttprequest",
        "url":"http://t-cromhouthuis-d7.finalist.nl/sites/cromhouthuis/themes/cromhouthuis/static/css/main.css"}
    404 {"frameId":0,"method":"GET","parentFrameId":-1,"requestId":"3772","statusCode":404,
        "statusLine":"HTTP/1.1 404 Not Found","tabId":-1,"timeStamp":1465766266855.254,"type":"xmlhttprequest",
        "url":"http://localhost:9080/none.html"}
*/
};
