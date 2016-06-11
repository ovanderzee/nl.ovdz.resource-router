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

    /* EXTENSION ACTIVE */

var extensionActiveState = function () {
    activate.style.display = 'none';
    generalFieldset.className = generalFieldset.className.replace(' passive', '');
    generalFieldset.className += ' active';
    chrome.browserAction.setBadgeBackgroundColor({color: [50, 205, 50, 255]});
};
var extensionPassiveState = function () {
    deactivate.style.display = 'none';
    generalFieldset.className = generalFieldset.className.replace(' active', '');
    generalFieldset.className += ' passive';
    chrome.browserAction.setBadgeBackgroundColor({color: [255, 165, 0, 255]});
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
    },
    mouseout: function () {
        setTimeout(function () {
            this.className += ' collapsed';
        }, 500);
        this.style.height = this.style.minHeight;
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