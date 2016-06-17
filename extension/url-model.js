var urlModel = new function () {
    var self = this;
    var stack = {};
    this.responseHeaders = {};

    this.setupValidation = function (url) {
//        self.table[this.value] = this;
//        this.className = this.className.replace(/ request-.+/, '');
//        this.className += ' request-lost';
//        this.title = 'No response';
        stack[url] = "asserted";
        extensionModel.startUrlTest();
        var httpRequest = new XMLHttpRequest();
        httpRequest.open('GET', url); // HEAD ??
        httpRequest.send();

        setTimeout(function () {
            handleValidation({
                "method":"GET",
                "statusCode":0,
                "statusLine":"No response",
                "timeStamp": new Date().getTime(),
                "type":"xmlhttprequest",
                "url": url
            })
        }, 2000);
    };

    var handleValidation = function (details) {
//        if (details.statusCode === 200) {
//            this.className = this.className.replace(' request-lost', ' request-found');
//        } else {
//            this.className = this.className.replace(' request-lost', ' request-failed');
//        }
        var url = details.url;
        if (stack[url]) {
            self.responseHeaders[url] = details;
            delete stack[url];
            if (JSON.stringify(stack) === '{}') {
                extensionModel.stopUrlTest();
            }
        }
        return {cancel: false};
    };

    chrome.webRequest.onHeadersReceived.addListener(handleValidation, {urls: ['*://*/*']}, ['responseHeaders']);

/*
    blocking + JSON.stringify(details));
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

    responseHeaders + JSON.stringify(details));
    200 {"frameId":0,"method":"GET","parentFrameId":-1,"requestId":"14909","responseHeaders":[
        {"name":"Accept-Ranges","value":"bytes"},{"name":"Cache-Control","value":"public, max-age=0"},{"name":"Last-Modified","value":"Sun, 29 May 2016 20:55:07 GMT"},
        {"name":"Date","value":"Fri, 17 Jun 2016 15:06:10 GMT"},{"name":"ETag","value":"W/\"80-154fe4c7ff8\""},{"name":"Content-Type","value":"text/css; charset=UTF-8"},
        {"name":"Content-Length","value":"128"}
        ],"statusCode":200,"statusLine":"HTTP/1.1 200 OK","tabId":-1,"timeStamp":1466175970780.751,
        "type":"xmlhttprequest","url":"http://localhost:9080/file.css"}
    204 {"frameId":0,"method":"GET","parentFrameId":-1,"requestId":"14892","responseHeaders":[
        {"name":"Server","value":"nginx/1.6.2"},
        {"name":"Date","value":"Fri, 17 Jun 2016 15:05:19 GMT"},{"name":"Connection","value":"keep-alive"}
        ],"statusCode":204,"statusLine":"HTTP/1.1 204 No Content","tabId":-1,"timeStamp":1466175970779.8271,
        "type":"xmlhttprequest","url":"http://robwu.nl/204"}
    401 {"frameId":0,"method":"GET","parentFrameId":-1,"requestId":"14893","responseHeaders":[
        {"name":"Date","value":"Fri, 17 Jun 2016 15:05:19 GMT"},{"name":"WWW-Authenticate","value":"Basic realm=\"Please login\""},{"name":"Vary","value":"Accept-Encoding"},{"name":"Content-Encoding","value":"gzip"},
        {"name":"Content-Length","value":"351"},{"name":"Connection","value":"close"},{"name":"Content-Type","value":"text/html; charset=iso-8859-1"}
        ],"statusCode":401,"statusLine":"HTTP/1.1 401 Authorization Required","tabId":-1,"timeStamp":1466175970771.569,
        "type":"xmlhttprequest","url":"http://servicepunt.mbor.finalist.com/sites/all/themes/servicepunt/static/css/main.css"}
    404 {"frameId":0,"method":"GET","parentFrameId":-1,"requestId":"14905","responseHeaders":[
        {"name":"X-Content-Type-Options","value":"nosniff"},{"name":"Content-Type","value":"text/html; charset=utf-8"},
        {"name":"Content-Length","value":"22"},
        {"name":"Date","value":"Fri, 17 Jun 2016 15:06:10 GMT"},{"name":"Connection","value":"keep-alive"}
        ],"statusCode":404,"statusLine":"HTTP/1.1 404 Not Found","tabId":-1,"timeStamp":1466175970782.819,
        "type":"xmlhttprequest","url":"http://localhost:9080/style.css"}
*/
};
