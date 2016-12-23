var urlModel = new function () {
    var self = this;
    var stack = {};
    var responseHeaders = {};

    var validatableURL = function (input) {
        var prefix = input.dataset.prefix || '';
        var suffix = input.dataset.suffix || '';
        var url = prefix + input.value + suffix;
        return url;
    };

    var clearHttpCode = function (input) {
        input.className = input.className.replace(/request-\w+/g, '');
    };

    var showHttpCode = function (input, url) {
        var details = responseHeaders[url];
        var className = 'failed';
        if (details.statusCode) {
            if (details.statusCode === 200 || details.statusCode === 304) {
                className = 'found';
            }
        } else {
            className = 'timeout';
        }
        input.className  += ' request-' + className;
    };

    var clearHttpComment = function (input) {
        var commentElem = input.parentNode.parentNode.querySelector('.comment span');
        commentElem.textContent = String.fromCharCode(160);
    };

    var showHttpComment = function (input, url) {
        // ex.: "statusLine":"HTTP/1.1 404 Not Found"
        var details = responseHeaders[url];
        var commentElem = input.parentNode.parentNode.querySelector('.comment span');
        var text = details.statusLine;
        text = text.replace('HTTP/1.1 ','');
        text = text.replace(/^\d+ /,'');
        commentElem.textContent = text;
    };

    this.isValidating = function () {
        return JSON.stringify(stack) !== '{}';
    };

    this.setupValidation = function (host) {
        var input = this;
        var url = input.value;
        if (input.dataset.prefix || input.dataset.suffix) { // local servers
            url = validatableURL(input);
        } else { // local resource as hostless string
            linkElement.createURL(url)
            if (linkElement.protocol === location.protocol) { // chrome-extension:
                url = host + "/" + url;
            }
        }

        stack[url] = input;

        // clear comments and input state
        delete responseHeaders[url];
        clearHttpCode(input);
        clearHttpComment(input);

        var httpRequest = new XMLHttpRequest();
        httpRequest.open('GET', url); // HEAD ??
        httpRequest.send();

        // handle hopeless requests
        input.dataset.timeout = setTimeout(function () {
            handleValidation({
                "method": "GET",
                "statusCode": 0,
                "statusLine": "No response",
                "timeStamp": new Date().getTime(),
                "type": "xmlhttprequest",
                "url": url
            });
        }, 1200);
    };

    var handleValidation = function (details) {
        var input = stack[details.url];
        var returnObj = {cancel: false};
        if (!input) {
            return returnObj;
        }
        clearTimeout(input.dataset.timeout);

        responseHeaders[details.url] = details;
        showHttpCode(input, details.url);
        showHttpComment(input, details.url);

        // (when) to end
        delete stack[details.url];
        return returnObj;
    };

    chrome.webRequest.onHeadersReceived.addListener(handleValidation, {urls: ['*://*/*']}, ['responseHeaders']);

/*
    responseHeaders + JSON.stringify(details));
    200 {"frameId":0,"method":"GET","parentFrameId":-1,"requestId":"14909","responseHeaders":[
        {"name":"Accept-Ranges","value":"bytes"},{"name":"Cache-Control","value":"public, max-age=0"},
        {"name":"Last-Modified","value":"Sun, 29 May 2016 20:55:07 GMT"},
        {"name":"Date","value":"Fri, 17 Jun 2016 15:06:10 GMT"},{"name":"ETag","value":"W/\"80-154fe4c7ff8\""},
        {"name":"Content-Type","value":"text/css; charset=UTF-8"},
        {"name":"Content-Length","value":"128"}
    ],"statusCode":200,"statusLine":"HTTP/1.1 200 OK","tabId":-1,"timeStamp":1466175970780.751,
    "type":"xmlhttprequest","url":"http://localhost:9080/file.css"}
    204 {"frameId":0,"method":"GET","parentFrameId":-1,"requestId":"14892","responseHeaders":[
        {"name":"Server","value":"nginx/1.6.2"},
        {"name":"Date","value":"Fri, 17 Jun 2016 15:05:19 GMT"},{"name":"Connection","value":"keep-alive"}
    ],"statusCode":204,"statusLine":"HTTP/1.1 204 No Content","tabId":-1,"timeStamp":1466175970779.8271,
    "type":"xmlhttprequest","url":"http://robwu.nl/204"}

    304 {"frameId":0,"method":"GET","parentFrameId":-1,"requestId":"1017","responseHeaders":[
        {"name":"Accept-Ranges","value":"bytes"},{"name":"Cache-Control","value":"public, max-age=0"},
        {"name":"Last-Modified","value":"Sun, 29 May 2016 20:55:07 GMT"},{"name":"ETag","value":"W/\"22-154fe4c7ff8\""},
        {"name":"Date","value":"Fri, 23 Dec 2016 22:03:26 GMT"},
        {"name":"Connection","value":"keep-alive"}
    ],"statusCode":304,"statusLine":"HTTP/1.1 304 Not Modified","tabId":-1,"timeStamp":1482530606468.914,
    "type":"xmlhttprequest","url":"http://localhost:9080/file.js"}

    401 {"frameId":0,"method":"GET","parentFrameId":-1,"requestId":"14893","responseHeaders":[
        {"name":"Date","value":"Fri, 17 Jun 2016 15:05:19 GMT"},{"name":"WWW-Authenticate","value":"Basic realm=\"Please login\""},
        {"name":"Vary","value":"Accept-Encoding"},
        {"name":"Content-Encoding","value":"gzip"},
        {"name":"Content-Length","value":"351"},{"name":"Connection","value":"close"},
        {"name":"Content-Type","value":"text/html; charset=iso-8859-1"}
    ],"statusCode":401,"statusLine":"HTTP/1.1 401 Authorization Required","tabId":-1,"timeStamp":1466175970771.569,
    "type":"xmlhttprequest","url":"http://servicepunt.mbor.finalist.com/sites/all/themes/servicepunt/static/css/main.css"}
    404 {"frameId":0,"method":"GET","parentFrameId":-1,"requestId":"14905","responseHeaders":[
        {"name":"X-Content-Type-Options","value":"nosniff"},
        {"name":"Content-Type","value":"text/html; charset=utf-8"},
        {"name":"Content-Length","value":"22"},
        {"name":"Date","value":"Fri, 17 Jun 2016 15:06:10 GMT"},{"name":"Connection","value":"keep-alive"}
    ],"statusCode":404,"statusLine":"HTTP/1.1 404 Not Found","tabId":-1,"timeStamp":1466175970782.819,
    "type":"xmlhttprequest","url":"http://localhost:9080/style.css"}
*/
};
