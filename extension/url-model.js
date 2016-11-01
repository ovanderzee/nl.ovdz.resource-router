var urlModel = new function () {
    var self = this;
    var stack = {};
    var responseHeaders = {};

    var validatableURL = function (input) {
        var prefix = input.dataset.prefix || '';
        var suffix = input.dataset.suffix || '';
        return prefix + input.value + suffix;
    };

    var showHttpCode = function (input) {
        var url = validatableURL(input);
        var details = responseHeaders[url];
        if (!details) {
            return;
        }
        this.className = input.className.replace(/request-\w$/, '');
        var className = 'failed';
        if (details.statusCode) {
            if (details.statusCode === 200) {
                className = 'found';
            }
        } else {
            className = 'timeout';
        }
        input.className  += ' request-' + className;
    };

    var showHttpComment = function (input) {
        // ex.: "statusLine":"HTTP/1.1 404 Not Found"
        var url = validatableURL(input);
        var details = responseHeaders[url];
        if (!details) {
            return;
        }
        var text = details.statusLine;
        text = text.replace('HTTP/1.1 ','');
        text = text.replace(/^\d+ /,'');
        input.parentNode.querySelector('.http-status').textContent = text;
    };

    this.setupValidation = function () {
        var input = this;
        var url = validatableURL(input);
        stack[url] = input;

console.log('start validate ' + input.name + '#'  + input.id + ': ' + url);

        extensionModel.startUrlTest();
        var httpRequest = new XMLHttpRequest();
        httpRequest.open('GET', url); // HEAD ??
        httpRequest.send();

        // handle hopeless requests
        setTimeout(function () {
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
        responseHeaders[details.url] = details;
        var input = stack[details.url];
        var returnObj = {cancel: false};
        if (!input) {
            return returnObj;
        }

console.log('handle validate ' + input.name + '#'  + input.id + ': ' + details.statusCode);

        showHttpCode(input);
        showHttpComment(input);

        // (when) to end
        delete stack[details.url];
        if (JSON.stringify(stack) === '{}') {
            extensionModel.stopUrlTest();
        }
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
