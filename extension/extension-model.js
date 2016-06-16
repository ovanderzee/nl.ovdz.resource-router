var extensionModel = new function () {
    var self = this;
    this.settings = {
        loose: 'localhost:80',
        secure: 'localhost:443',
        running: ''
    };
    var store = {};
    this.urls = [];
    for (var i = 0; i < localStorage.length; i++) {
        var key = localStorage.key(i);
        var keyMatch = key.match(/[a-z]+/);
        if (keyMatch && keyMatch.length && key === keyMatch[0]) {
            // a setting is a string
            store[key] = localStorage.getItem(key);
        } else {
            // it probably is an url
            this.urls.push(key);
        }
    }

    this.get = function () {
        this.value = self.settings[this.id];
    };
    this.set = function () {
        self.settings[this.id] = this.value;
        localStorage.setItem(this.id, this.value);
    };

    this.getLocalHostName = function (protocol) {
        (protocol === 'https:') ? 'secure' : 'loose';
    };

    this.activate = function () {
		self.set.call({id: 'running', value: 'running'});
		self.activateView.call(this.form);
    };
    this.deactivate = function () {
		self.set.call({id: 'running', value: ''});
		self.deactivateView.call(this.form);
    };

    this.activateView = function () {
        this.className = this.className.replace(' passive', '');
        this.className += ' active';
        chrome.browserAction.setBadgeBackgroundColor({color: [50, 205, 50, 255]});
    };
    this.deactivateView = function () {
        this.className = this.className.replace(' active', '');
        this.className += ' passive';
        chrome.browserAction.setBadgeBackgroundColor({color: [255, 165, 0, 255]});
    };
};
