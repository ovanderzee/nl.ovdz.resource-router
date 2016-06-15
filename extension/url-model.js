var urlModel = new function () {
    var self = this;
    this.table = {};

    this.get = function () {
        self.table[this.value] = this;
        this.className = this.className.replace(' request-.*$', '');
        this.className += ' request-lost';
        this.title = 'No response';
        var oReq = new XMLHttpRequest();
        oReq.open("GET", this.value);
        oReq.send();
    };
    this.handle = function (details) {
        this.title = details.statusLine || details.statusCode;
        if (details.statusCode === 200) {
            this.className = this.className.replace(' request-lost', ' request-found');
        } else {
            this.className = this.className.replace(' request-lost', ' request-failed');
        }
    };

//    chrome.webRequest.onHeadersReceived.addListener(function (details) {
//        var control = self.table[details.url];
//        if (control) {
//            self.handle.call(control, details);
//        }
//        return {cancel: true};
////        return {cancel: localStorage.running};
//    }, {
//        urls: ['*://*/*']
//    }, ['blocking']);

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
