var template, showAllRoutes;
var populatePopup = function (key) {
    var item = JSON.parse(localStorage.getItem(key));
    var form = template.cloneNode(true);
    form.id = 'route_' + document.forms.length;
    form.addEventListener('click', routeForm.toggle, false);

    form.elements.active.checked = Boolean(item.active);
    routeActive.init.call(form.elements.active);
    form.elements.active.addEventListener('click', routeActive.click, false);
    form.elements.active.addEventListener('click', function () {
        if (this.checked) {
            routeTest.perform.call(this);
        }
    }, false);

    form.querySelector('legend').textContent = key;
    form.elements.initial.value = key;
    form.elements.live.value = key;
    form.elements.live.addEventListener('blur', routeLive.blur, false);

    form.elements.local.value = item.local;
    form.elements.local.addEventListener('blur', routeModel.setLocal, false);

    form.elements.test.addEventListener('click', routeTest.perform, false);
    var removeRoute = new routeRemove(form.elements.remove);

    document.body.insertBefore(form, showAllRoutes);
    routeForm.init.call(form);
};

window.onload = function () {

    /* GENERAL SETTINGS */

	var generalInputs = document.querySelectorAll('#general input');
	for (var i = 0; i < generalInputs.length; i++) {
        extensionModel.get.call(generalInputs[i]);
		generalInputs[i].addEventListener('blur', extensionModel.set, false);
	}
    urlModel.setupValidation.call(document.querySelector('input#loose'), 'http://');
    urlModel.setupValidation.call(document.querySelector('input#secure'), 'https://');

    /* EXTENSION ACTIVE */

	var generalForm = document.querySelector('form#general');
    generalForm.addEventListener('click', routeForm.toggle, false);
    routeForm.init.call(generalForm);

    var toggleButton = document.querySelector('button#rerouting');
	toggleButton.addEventListener('click', extensionModel.toggleState, false);
	extensionModel.stateView.call(generalForm);

    showAllRoutes = document.getElementById('show-all');
    showAllRoutes.addEventListener('click', function () {
        document.body.className = '';
    }, false);

    /* NEW */

    var newRoute = document.getElementById('new');
    newRoute.addEventListener('click', routeForm.toggle, false);
    routeForm.init.call(newRoute);
    newRoute.elements.add.addEventListener('click', newEntry, false);
    newRoute.elements.test.addEventListener('click', routeTest.perform, false);

    /* ROUTES */

    template = document.getElementById('template');
    for (var i = 0; i < extensionModel.urls.length; i++) {
        var key = extensionModel.urls[i];
        populatePopup(key);
    }

};

