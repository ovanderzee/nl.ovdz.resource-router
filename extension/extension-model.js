var extensionModel = new function () {
    var self = this;
    this.settings = {
        loose: 'localhost:80',
        secure: 'localhost:443',
        rerouting: 'idle'
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
        className: 'active',
        color: [50, 205, 50, 255],
        description: 'engaged'
    }
    var passiveState = {
        className: 'passive',
        color: [255, 165, 0, 255],
        description: 'dismissed'
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
        return self.settings.rerouting === 'running';
    };
    this.stateVars = function () {
        return self.isRunning() ? activeState : passiveState;
    };
    this.stateView = function () {
        this.className = this.className.replace(' ' + activeState.className, '');
        this.className = this.className.replace(' ' + passiveState.className, '');
        newState = self.stateVars();
        this.className += ' ' + newState.className;
        chrome.browserAction.setBadgeBackgroundColor({color: newState.color});
    };
    this.toggleState = function () {
        self.set.call(this);
        self.stateView.call(this.form);
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
