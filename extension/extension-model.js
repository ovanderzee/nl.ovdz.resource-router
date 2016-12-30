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
        if (!key) {
            localStorage.removeItem(key);
            continue;
        }
        var keyMatch = key.match(/^\w+$/);
        if (keyMatch) {
            // a word is a setting is a string
            store[key] = localStorage.getItem(key);
        } else {
            // it probably is an url
            this.urls.push(key);
        }
    }
    var activeState = {
        className: ' active',
        color: [50, 205, 50, 255],
        description: 'engaged',
        toggleHint: 'dismiss'
    }
    var passiveState = {
        className: ' passive',
        color: [255, 165, 0, 255],
        description: 'dismissed',
        toggleHint: 'engage'
    }

    this.init = function () {
        // merge localStorage in settings
        self.settings = Object.assign(self.settings, store);
    };

    this.get = function () {
        this.value = self.settings[this.id];
    };
    this.set = function () {
        self.settings[this.id] = this.value;
        localStorage.setItem(this.id, this.value);
    };

    this.isRunning = function () {
        return self.settings.running === 'running';
    };
    this.stateVars = function () {
        return self.isRunning() ? activeState : passiveState;
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
        this.className += activeState.className;
        chrome.browserAction.setBadgeBackgroundColor({color: activeState.color});
    };
    this.deactivateView = function () {
        this.className = this.className.replace(' active', '');
        this.className += passiveState.className;
        chrome.browserAction.setBadgeBackgroundColor({color: passiveState.color});
    };

    this.setBadge = function () {
        var activeCount = 0;
        for (var i = 0; i < self.urls.length; i++) {
            var item = JSON.parse(localStorage.getItem(self.urls[i]));
            if (Boolean(item.active)) {
                activeCount++;
            }
        }
        chrome.browserAction.setBadgeText({text: String(activeCount)});
        chrome.browserAction.setBadgeBackgroundColor({color: extensionModel.stateVars().color});
    };
};
