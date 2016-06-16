var template, populatePopup;

window.onload = function () {

    /* GENERAL SETTINGS */

	var generalInputs = document.querySelectorAll('#general input');
	for (var i = 0; i < generalInputs.length; i++) {
        extensionModel.get.call(generalInputs[i]);
		generalInputs[i].addEventListener('blur', extensionModel.set, false);
	}
//    urlModel.get.call(document.querySelector('input#loose'), 'http://');
//    urlModel.get.call(document.querySelector('input#secure'), 'https://');

    /* EXTENSION ACTIVE */

	var generalForm = document.querySelector('form#general');
	var activate = document.querySelector('button#activate');
	var deactivate = document.querySelector('button#deactivate');
    if (extensionModel.settings.running) {
		extensionModel.activateView.call(generalForm);
	} else {
		extensionModel.deactivateView.call(generalForm);
	}
	activate.addEventListener('click', extensionModel.activate, false);
	deactivate.addEventListener('click', extensionModel.deactivate, false);

    /* NEW */

    var newRoute = document.getElementById('new');
    newRoute.elements.live.addEventListener('blur', newEntry, false);
    newRoute.elements.local.addEventListener('blur', newEntry, false);
    newRoute.elements.add.addEventListener('click', newEntry, false);

    /* ROUTES */

    template = document.getElementById('template');
    populatePopup = function (key) {
        var item = JSON.parse(localStorage.getItem(key));
        var form = template.cloneNode(true);
        form.id = 'route_' + i;
        form.addEventListener('click', routeForm.toggle, false);

        form.elements.active.checked = Boolean(item.active);
        routeActive.init.call(form.elements.active);
        form.elements.active.addEventListener('click', routeActive.click, false);

        form.querySelector('legend').textContent = key;
        form.elements.initial.value = key;
        form.elements.live.value = key;
//        urlModel.get.call(form.elements.live, '');
        form.elements.live.addEventListener('blur', routeLive.blur, false);

        form.elements.local.value = item.local;
        linkElement.createURL(key);

//        urlModel.get.call(form.elements.local, linkElement.protocol + '//' + localHostName + '/');
        var localHostName = extensionModel.getLocalHostName(linkElement.protocol);
        form.elements.local.addEventListener('blur', routeModel.setLocal, false);

        form.elements.remove.addEventListener('click', routeRemove.click, false);

        document.body.appendChild(form);
        routeForm.init.call(form);
    };

    for (var i = 0; i < extensionModel.urls.length; i++) {
        var key = extensionModel.urls[i];
        linkElement.createURL(key);
        if (linkElement.protocol === 'http:' || linkElement.protocol === 'https:') {
            populatePopup(key);
        }
    }

};

