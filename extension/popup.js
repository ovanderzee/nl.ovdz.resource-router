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
	if (localStorage.getItem('running')) {
		extensionState.activate.call(generalFieldset);
	} else {
		extensionState.deactivate.call(generalFieldset);
	}
	activate.addEventListener('click', function () {
		localStorage.setItem('running', 'running');
		extensionState.activate.call(generalFieldset);
	}, false);
	deactivate.addEventListener('click', function () {
		localStorage.setItem('running', '');
		extensionState.deactivate.call(generalFieldset);
	}, false);

    /* NEW */

    var newRoute = document.getElementById('new');
    newRoute.elements.live.addEventListener('blur', newEntry, false);
    newRoute.elements.local.addEventListener('blur', newEntry, false);
    newRoute.elements.add.addEventListener('click', newEntry, false);

    /* ROUTES */

    var template = document.getElementById('template');
    var populatePopup = function (key) {
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

        document.body.appendChild(form);
        routeForm.init.call(form);
    };

    for (var i = 0; i < localStorage.length; i++) {
        var key = localStorage.key(i);
        var protocol = key.split('://')[0];
        if (protocol === 'http' || protocol === 'https') {
            populatePopup(key);
        }
    }

};

