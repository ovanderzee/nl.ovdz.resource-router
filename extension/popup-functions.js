//var waitTime = function () {
//    var timeComponent = function (prop) {
//        var time = window.getComputedStyle(this, null).getPropertyValue(prop);
//        var unit = time.replace(/[.\d]+/, '');
//        var ms = (unit === 'ms') ? parseInt(time) : parseInt(time) * 1000;
//        return ms;
//    };
//
//    var delay = timeComponent.call(this, 'transition-delay');
//    var duration = timeComponent.call(this, 'transition-duration');
//    return delay + duration;
//};
//
var signalRefresh = function () {
	chrome.runtime.sendMessage('refresh', function () {
	});
};

    /* GENERAL SETTINGS */

var getLocalStorageItem = function () {
	this.value = localStorage.getItem(this.id);
};
var setLocalStorageItem = function () {
	localStorage.setItem(this.id, this.value);
};

var urlState = new function () {
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

    chrome.webRequest.onHeadersReceived.addListener(function (details) {
        var control = urlState.table[details.url];
        if (control) {
            self.handle.call(control, details)
        }
        return {cancel: true};
    }, {
        urls: ['*://*/*']
    }, ['blocking']);

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

    /* EXTENSION ACTIVE */

var extensionState = {
    activate: function () {
        this.className = this.className.replace(' passive', '');
        this.className += ' active';
        chrome.browserAction.setBadgeBackgroundColor({color: [50, 205, 50, 255]});
    },
    deactivate: function () {
        this.className = this.className.replace(' active', '');
        this.className += ' passive';
        chrome.browserAction.setBadgeBackgroundColor({color: [255, 165, 0, 255]});
    }
};

    /* NEW */

var newEntry = function () {
    var live = this.form.elements.live;
    var local = this.form.elements.local;
    if (live.value && local.value) {
        routeModel.addRoute.call(this.form);
        populatePopup(live.value);
        live.value = '';
        local.value = '';
    }
};

    /* ROUTES */

var routeForm = {
    init: function () {
        this.style.maxHeight = this.clientHeight + 'px';
        this.className += ' collapsed';
        this.style.minHeight = this.clientHeight + 'px';
        this.style.height = this.clientHeight + 'px';
    },
    mouseover: function () {
        this.className = this.className.replace(' collapsed', '');
        this.style.height = this.style.maxHeight;
        this.elements.remove.focus();
        this.elements.remove.blur();
//        var self = this;
//        setTimeout(function () {
//            // scroll into view
//            self.elements.remove.focus();
//            self.elements.remove.blur();
//        }, waitTime.call(this));
    },
    mouseout: function () {
        setTimeout(function () {
            this.className += ' collapsed';
        }, 500);
        this.style.height = this.style.minHeight;
        this.scrollTop = 0;
    }
};

var routeActive = {
    init: function () {
        var newState = this.checked ? ' active' : ' passive';
        this.form.className += newState;
    },
    click: function () {
        routeModel.setActive.call(this);
        this.form.className = this.form.className.replace(' passive', '');
        this.form.className = this.form.className.replace(' active', '');
        routeActive.init.call(this);
    }
};

var routeLive = {
    blur: function () {
        var renaming = routeModel.setLive.call(this);
        if (renaming) {this.form.querySelector('legend').textContent = this.value;}
        if (renaming === null ) {
            this.value = this.form.initial.value;
            var textNode = document.createTextNode("Reverted. That already exists.");
            this.parentNode.appendChild(textNode);
        }
    }
};

var routeRemove = {
    click: function () {
        if (this.value) {
            this.textContent = this.value + ' ' + this.textContent;
            this.removeAttribute('value');
        } else {
            routeModel.removeRoute.call(this);
            this.form.parentNode.removeChild(this.form);
        }
    }
};