var extensionModel = new function () {
    var self = this;
    var defaults = {
        loose: 'localhost:80',
        secure: 'localhost:443',
        rerouting: 'idle'
    };
    for (prop in defaults) {
        if (!localStorage.getItem(prop)) {
            localStorage.setItem(prop, defaults[prop]);
        }
    }

    this.urls = [];
    for (var i = 0; i < localStorage.length; i++) {
        var key = localStorage.key(i);
        if (!key) {
            localStorage.removeItem(key);
            continue;
        }
        var keyMatch = key.match(/^\w+$/);
        if (!keyMatch) {
            // if a stored item is not a word, it probably is an url
            this.urls.push(key);
        }
    }
    var activeState = {
        className: 'active',
        badgeColor: [50, 205, 50, 255],
        buttonLabel: 'dismiss',
        buttonValue: 'idle'
    }
    var passiveState = {
        className: 'passive',
        badgeColor: [255, 165, 0, 255],
        buttonLabel: 'engage',
        buttonValue: 'running'
    }

    this.get = function () {
        this.value = localStorage.getItem(this.id);
    };
    this.set = function () {
        localStorage.setItem(this.id, this.value);
    };

    this.isRunning = function () {
        return localStorage.getItem('rerouting') === 'running';
    };
    this.stateVars = function () {
        return self.isRunning() ? activeState : passiveState;
    };
    this.stateView = function () {
        this.className = this.className.replace(' ' + activeState.className, '');
        this.className = this.className.replace(' ' + passiveState.className, '');
        var newState = self.stateVars();
        this.className += ' ' + newState.className;
        document.body.className = localStorage.getItem('rerouting');
        this.rerouting.value = newState.buttonValue;
        this.rerouting.textContent = newState.buttonLabel;
        chrome.browserAction.setBadgeBackgroundColor({color: newState.badgeColor});
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
        chrome.browserAction.setBadgeBackgroundColor({color: extensionModel.stateVars().badgeColor});
    };
};
