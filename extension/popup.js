// var signalRefresh = function () {
// 	chrome.runtime.sendMessage('refresh', function () {});
// };
var getLocalStorageItem = function () {
	this.value = localStorage.getItem(this.id);
};
var setLocalStorageItem = function () {
	localStorage.setItem(this.id, this.value);
};

window.onload = function () {
	var inputs = document.querySelectorAll('.required input');

	for (var i = 0; i < inputs.length; i++) {
		getLocalStorageItem.call(inputs[i]);
		inputs[i].addEventListener('blur', setLocalStorageItem, false);
	}

	var required = document.querySelector('fieldset.required');
	var activate = document.querySelector('button#activate');
	var deactivate = document.querySelector('button#deactivate');
	var activeState = function () {
		activate.style.display = 'none';
		required.className = required.className.replace(' passive', '');
		required.className += ' active';
		chrome.browserAction.setBadgeBackgroundColor({color: [50, 205, 50, 255]});
	};
	var passiveState = function () {
		deactivate.style.display = 'none';
		required.className = required.className.replace(' active', '');
		required.className += ' passive';
		chrome.browserAction.setBadgeBackgroundColor({color: [255, 165, 0, 255]});
	};
	if (!localStorage.getItem('http:')) {
		activate.style.display = 'none';
		deactivate.style.display = 'none';
	}
	if (localStorage.getItem('running')) {
		activeState();
	} else {
		passiveState();
	}
	activate.addEventListener('click', function () {
		localStorage.setItem('running', 'running');
		deactivate.style.display = '';
		activeState();
	}, false);
	deactivate.addEventListener('click', function () {
		localStorage.setItem('running', '');
		activate.style.display = '';
		passiveState();
	}, false);
	

/*
	var inputs = document.querySelectorAll('input[type="url"]');

	for (var i = 0; i < inputs.length; i++) {
		inputs[i].addEventListener('blur', signalRefresh, false);
	}
*/

};

