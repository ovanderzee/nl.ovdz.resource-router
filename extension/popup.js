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
console.log('onload');
	var inputs = document.querySelectorAll('.required input');

	for (var i = 0; i < inputs.length; i++) {
		getLocalStorageItem.call(inputs[i]);
		inputs[i].addEventListener('blur', setLocalStorageItem, false);
	}

	var activate = document.querySelector('button#activate');
	var deactivate = document.querySelector('button#deactivate');
	if (!localStorage.getItem('http:')) {
		activate.style.display = 'none';
		deactivate.style.display = 'none';
	}
	if (localStorage.getItem('running')) {
		activate.style.display = 'none';
	} else {
		deactivate.style.display = 'none';
	}
	activate.addEventListener('click', function () {
		localStorage.setItem('running', 'running');
		activate.style.display = 'none';
		deactivate.style.display = '';
	}, false);
	deactivate.addEventListener('click', function () {
		localStorage.setItem('running', '');
		activate.style.display = '';
		deactivate.style.display = 'none';
	}, false);
	

/*
	var inputs = document.querySelectorAll('input[type="url"]');

	for (var i = 0; i < inputs.length; i++) {
		inputs[i].addEventListener('blur', signalRefresh, false);
	}
*/

};

