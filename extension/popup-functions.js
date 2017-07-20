var signalRefresh = function () {
	chrome.runtime.sendMessage('refresh', function () {
	});
};

/*
* waitTime: Caluclate total transition time
*  this is an element with the transition defined in a stylesheet
*  return delay + duration in milliseconds
*/
var waitTime = function () {
    var timeComponent = function (prop) {
        var time = window.getComputedStyle(this, null).getPropertyValue(prop);
        var unit = time.replace(/[.\d]+/, '');
        var ms = (unit === 'ms') ? parseInt(time) : parseFloat(time) * 1000;
        return ms;
    };

    var delay = timeComponent.call(this, 'transition-delay');
    var duration = timeComponent.call(this, 'transition-duration');
    return delay + duration;
};

    /* UTILS */

var proceedLocalHTTPS = function () {
    var creationObj = {"url": "https://" + localStorage.getItem('secure')};
    chrome.tabs.create(creationObj);
};

    /* NEW */

var newEntry = function () {
    var live = this.form.elements.live;
    var local = this.form.elements.local;
    if (live.value && local.value) {
        routeModel.addRoute.call(this.form);
        populatePopup(live.value);
        live.value = '';
        local.value = '';
    }
};

    /* ROUTES */

var routeForm = new function () {
    var eventEnd;
    var self = this;
    this.init = function () {
        // measure anything, in the bright light
        this.style.maxHeight = this.clientHeight + 'px';
        this.className += ' collapsed';
        this.style.minHeight = this.clientHeight + 'px';
        this.style.height = this.clientHeight + 'px';
        this.addEventListener('transitionend', self.transitionEnd);
    };
    this.toggle = function (event) {
        var titleClicked = event.target.tagName === 'LEGEND';
        if (!titleClicked) return;
        if (this.className.indexOf(' collapsed') > -1) {
            self.expand.call(this, event);
        } else {
            self.collapse.call(this);
        }
    };
    this.transitionEnd = function () {
        eventEnd.call(this);
    };
    this.expand = function () {
        eventEnd = function () {
            // geen nabewerking; scrollen kan meteen
        };
        // scroll
        var docAt = document.body.scrollTop; // gescrollde afstand
        var thisAt = this.offsetTop; // afstand element tot bovenkant doc
        var winHeight = window.innerHeight; // hoogte van het venster

        var thisMinHeight = parseInt(this.style.minHeight); // hoogte ingeklapt element vlgs stylesheet
        var thisMaxHeight = parseInt(this.style.maxHeight); // hoogte uitgeklapt element vlgs stylesheet
        var thisStyle = window.getComputedStyle(this, null);
        var thisBottom = parseInt(thisStyle.paddingBottom) + parseInt(thisStyle.borderBottomWidth) + parseInt(thisStyle.marginBottom);

        var scrollToViewAll = thisAt + thisMaxHeight + thisBottom - docAt - winHeight;
        var scrollToViewNext = thisAt + thisMinHeight + thisBottom - docAt - winHeight;
        var scrollDuration = waitTime.call(this);
        var scrollLeap = 3;

        if (scrollToViewAll > 0) {
            var scrollDistance = thisMaxHeight - thisMinHeight;
            if (scrollToViewNext > 0) {
                scrollDistance = thisMaxHeight + thisBottom;
            }
            var scrollInterval = Math.round(scrollDuration * scrollLeap / scrollDistance);
            var interval = setInterval(function () {
                var lastScrollTop = document.body.scrollTop;
                window.scrollBy(0, scrollLeap);
                var scrollCompleted = document.body.scrollTop >= (docAt + scrollDistance);
                var scrollAtMax = lastScrollTop === document.body.scrollTop;
                if (scrollCompleted || scrollAtMax) {
                    clearInterval(interval);
                }
            }, scrollInterval);
        }

        // css transitie
        this.className = this.className.replace(' collapsed', '');
        this.style.height = this.style.maxHeight;

    };
    this.collapse = function () {
        eventEnd = function () {
            this.className += ' collapsed';
        };
        this.style.height = this.style.minHeight;
        this.scrollTop = 0;
    };
};

var routeActive = new function () {
    var self = this;
    this.init = function () {
        var newState = this.checked ? ' active' : ' passive';
        this.form.className += newState;
    };
    this.click = function () {
        var control = this;
        routeModel.setActive.call(this);
        this.form.className = this.form.className.replace(' passive', '');
        this.form.className = this.form.className.replace(' active', '');
        self.init.call(this);
        chrome.browserAction.getBadgeText({}, function (count) {
            count = Number(count);
            control.checked ? count++ : count--;
            chrome.browserAction.setBadgeText({text: String(count)});
        });
    };
};

var routeLive = {
    blur: function () {
        var renaming = routeModel.setLive.call(this);
        if (renaming) {this.form.querySelector('legend').textContent = this.value;}
        if (renaming === null ) {
            this.value = this.form.initial.value;
            var textNode = document.createTextNode("Reverted. That already exists.");
            this.parentNode.appendChild(textNode);
        }
    }
};

var routeRemove = function (button) {
    var self = this;
    this.style = button.querySelector('span').style;
    button.addEventListener('blur', function () {
        self.style.display = 'none';
    }, false);
    button.addEventListener('click', function () {
        if (self.style.display === 'none') {
            self.style.display = '';
        } else {
            routeModel.removeRoute.call(button);
            button.form.parentNode.removeChild(button.form);
        }
    }, false);
};

var routeTest = {
    perform: function () {
        var form = this.form;
        var localHost = routeModel.getLocalHost(form.elements.live.value);
        urlModel.setupValidation.call(form.elements.live, '');
        urlModel.setupValidation.call(form.elements.local, localHost + '/');
    }
};
