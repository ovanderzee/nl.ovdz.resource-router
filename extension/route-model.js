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
        if (item && !none) {
            localStorage.setItem(proposed, item);
            localStorage.removeItem(initial);
            return true;
        }
        console.error('The initial item does not exist or the proposed already exists')
    };

    var removeItem = function (live) {
        localStorage.removeItem(live);
    };

    /* BACKGROUND */

    this.route = function (live) {
        if (getValue(live, 'active')) {
            return getValue(live, 'local');
        }
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
        if (renameItem(initialfield.value, this.value)) {
            initialfield.value = this.value;
        }
    };

    this.removeRoute = function () {
        var livefield = this.form.elements.live;
        removeItem(livefield.value);
    };
};
