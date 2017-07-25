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

var eventHandling = function () {

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

    showAllRoutes.addEventListener('click', function () {
        document.body.className = '';
    }, false);

    /* NEW */

    var newRoute = document.getElementById('new');
    newRoute.addEventListener('click', routeForm.toggle, false);
    routeForm.init.call(newRoute);
    newRoute.elements.add.addEventListener('click', newEntry, false);
    newRoute.elements.test.addEventListener('click', routeTest.perform, false);

};

var buildUI = function () {
    var validating = JSON.parse(localStorage.getItem('validating'));
    if (validating === null) {
        // do not run before all scripts and intended html was loaded (karma)
        return;
    }
    template = document.getElementById('template');
    showAllRoutes = document.getElementById('show-all');
    eventHandling();
    var routes = extensionModel.routes();
    for (var i = 0; i < routes.length; i++) {
        populatePopup(routes[i]);
    }
};

document.addEventListener('readystatechange', function () {
    if (document.readyState === 'interactive') {
        buildUI();
    }
}, false);
