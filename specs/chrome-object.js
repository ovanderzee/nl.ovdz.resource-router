
var chrome = {
    browserAction: {
        setBadgeText: function () {},
        setBadgeBackgroundColor: function () {}
    },
    webRequest: {
        onBeforeRequest: {
            addListener: function () {}
        },
        onHeadersReceived: {
            addListener: function () {}
        }
    },
    runtime: {
        onMessage: {
            addListener: function () {}
        },
        sendMessage: function () {}
    }
};
