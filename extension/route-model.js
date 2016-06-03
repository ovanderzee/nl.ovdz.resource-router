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

    var route = function (live) {
        if (getValue(live, 'active')) {
            return getValue(live, 'local');
        }
    };

    this.setActive = function (livefield, checkbox) {
        setValue(livefield.value, 'active', checkbox.value);
    };

    this.setLocal = function (livefield, textfield) {
        setValue(livefield.value, 'local', textfield.value);
    };

    this.setLive = function (initialfield, livefield) {
        if (rename(initialfield.value, livefield.value)) {
            initialfield.value = livefield.value;
        }
    };
};
