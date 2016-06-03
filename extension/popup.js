// var signalRefresh = function () {
// 	chrome.runtime.sendMessage('refresh', function () {});
// };
var getLocalStorageItem = function () {
	this.value = localStorage.getItem(this.id);
};
var setLocalStorageItem = function () {
	localStorage.setItem(this.id, this.value);
};

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
    },
    mouseout: function () {
        setTimeout(function () {
            this.className += ' collapsed';
        }, 500);
        this.style.height = this.style.minHeight;
    },
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
    },
};

var routeLive = {
    blur: function () {
        var renaming = routeModel.setLive.call(this);
        if (renaming) this.form.querySelector('legend').textContent = this.value;
        if (renaming === null ) {
            this.value = this.form.initial.value;
            var textNode = document.createTextNode("Reverted. That already exists.");
            this.parentNode.appendChild(textNode);
        }
    },
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
    },
};

window.onload = function () {

    /* GENERAL SETTINGS */

	var generalInputs = document.querySelectorAll('#general input');
	for (var i = 0; i < generalInputs.length; i++) {
		getLocalStorageItem.call(generalInputs[i]);
		generalInputs[i].addEventListener('blur', setLocalStorageItem, false);
	}

    /* EXTENSION ACTIVE */

	var generalFieldset = document.querySelector('#general fieldset');
	var activate = document.querySelector('button#activate');
	var deactivate = document.querySelector('button#deactivate');
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
	if (!localStorage.getItem('loose')) {
		activate.style.display = 'none';
		deactivate.style.display = 'none';
	}
	if (localStorage.getItem('running')) {
		extensionActiveState();
	} else {
		extensionPassiveState();
	}
	activate.addEventListener('click', function () {
		localStorage.setItem('running', 'running');
		deactivate.style.display = '';
		extensionActiveState();
	}, false);
	deactivate.addEventListener('click', function () {
		localStorage.setItem('running', '');
		activate.style.display = '';
		extensionPassiveState();
	}, false);

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

    var newRoute = document.getElementById('new');
    newRoute.elements.live.addEventListener('blur', newEntry, false);
    newRoute.elements.local.addEventListener('blur', newEntry, false);
    newRoute.elements.add.addEventListener('click', newEntry, false);

    /* ROUTES */

    var template = document.getElementById('template');
    var populatePopup = function(key) {
        var item = JSON.parse(localStorage[key]);
        var form = template.cloneNode(true);
        form.id = 'route_' + i;
        form.addEventListener('mouseout', routeForm.mouseout, false);
        form.addEventListener('mouseover', routeForm.mouseover, false);

        form.elements.active.checked = Boolean(item.active);
        routeActive.init.call(form.elements.active);
        form.elements.active.addEventListener('click', routeActive.click, false);

        form.querySelector('legend').textContent = key;
        form.elements.initial.value = key;
        form.elements.live.value = key;
        form.elements.live.addEventListener('blur', routeLive.blur, false);

        form.elements.local.value = item.local;
        form.elements.local.addEventListener('blur', routeModel.setLocal, false);

        form.elements.remove.addEventListener('click', routeRemove.click, false);

        document.body.appendChild(form)
        routeForm.init.call(form);
    };

    for (var i = 0; i < localStorage.length; i++) {
        var key = localStorage.key(i);
        var protocol = key.split('//')[0];
        if (protocol == 'http:' || protocol == 'https:') {
            populatePopup(key);
        }
    }

};

