var routeModel = new function () {
    var getValue = function (live, key) {
        var item = localStorage.getItem(live);
        if (item) {
            var obj = JSON.parse(item);
            return obj[key];
        }
    };

    var setValue = function (live, key, value) {
        var item = localStorage.getItem(live);
        var obj;
        if (item) {
            obj = JSON.parse(item);
        } else {
            obj = {};
        }
        obj[key] = value;
        item = JSON.stringify(obj);
        localStorage.setItem(live, item);
     };

    var renameItem = function (initial, proposed) {
        var item = localStorage.getItem(initial);
        var none = localStorage.getItem(proposed);
        if (item === none) {return false;}
        if (none) {return null;}
        if (item && !none) {
            localStorage.setItem(proposed, item);
            localStorage.removeItem(initial);
            return true;
        }
    };

    var removeItem = function (live) {
        localStorage.removeItem(live);
    };

    var addItem = function (live, local) {
        var none = localStorage.getItem(live);
        if (none) {return null;}
        var obj = {active: true, local: local};
        var item = JSON.stringify(obj);
        localStorage.setItem(live, item);
    };

    /* BACKGROUND */

    var getResource = function (live) {
        if (getValue(live, 'active')) {
            return getValue(live, 'local');
        }
    };

    this.getLocalResource = function (live) {
        // remove hash
        if (live.indexOf('#') > 0) {
            live = live.replace(/#(.+)\?/, '?').replace(/#(.+)$/, '');
        }
        // include searchterm in test (when interpreted)
        var localRsrc = getResource(live);
        if (!localRsrc && live.indexOf('?') > 0) {
            // exclude searchterm from test (when for versioning)
            localRsrc = getResource(live.split('?')[0]);
        }
        return localRsrc;
    };

	this.getLocalHost = function (live) {
		linkElement.createURL(live);
        var localHostName = localStorage.getItem(
            (linkElement.protocol === 'https:') ? 'secure' : 'loose'
        );
		return linkElement.protocol + '//' + localHostName;
    };

    /* POPUP */

    this.setActive = function () {
        var livefield = this.form.elements.live;
        setValue(livefield.value, 'active', this.checked);
    };

    this.setLocal = function () {
        var livefield = this.form.elements.live;
        setValue(livefield.value, 'local', this.value);
    };

    this.setLive = function () {
        var initialfield = this.form.elements.initial;
        var renaming = renameItem(initialfield.value, this.value);
        if (renaming === true) {
            initialfield.value = this.value;
        }
        return renaming;
    };

    this.removeRoute = function () {
        var livefield = this.form.elements.live;
        removeItem(livefield.value);
    };

    this.addRoute = function () {
        var livefield = this.elements.live;
        var localfield = this.elements.local;
        addItem(livefield.value, localfield.value);
    };

};
