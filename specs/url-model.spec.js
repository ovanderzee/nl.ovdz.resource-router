
describe('URL Model: validate URL\'s', function () {

    var testForm = new function () {
        // form
        var self = this;
        this.id = 'route_1';
        this.query = '#' + this.id;
        this.querySelector = function (query) {
            switch (query) {
            case self.query:
                return self;
            case self.live.query:
                return self.live;
            case self.local.query:
                return self.local;
            case self.liveParent.query:
                return self.liveParent;
            case self.localParent.query:
                return self.localParent;
            case self.liveComment.query:
                return self.liveComment;
            case self.localComment.query:
                return self.localComment;
            }
        };

        // inputs
        var testInput = function (name, value) {
            this.className = '';
            this.dataset = {};
            this.form = self;
            this.name = name;
            this.query = self.query + ' input[name="' + name + '"]';
            this.value = value;
        };
        this.live = new testInput ('live', 'http://www.bv.nl/test-url'),
        this.local = new testInput ('local', 'local-rsrc')

        // parents
        var testParent = function (name) {
            this.query = '.' + name;
            this.className = '';
        };
        this.liveParent = new testParent ('live'),
        this.localParent = new testParent ('local')

        // comments
        var testComment = function (name) {
            this.query = '.' + name + ' .comment span';
            this.textContent = '';
        };
        this.liveComment = new testComment ('live'),
        this.localComment = new testComment ('local')
    };

    var testStack = {};
    testStack[testForm.live.value] = testForm.live.query;
    testStack[testForm.local.value] = testForm.local.query;

	it('should confirm the validation mode for a specific URL', function () {
	    localStorage.setItem('validating', JSON.stringify(testStack));
	    var validationMode = urlModel.isValidating(testForm.live.value);
        expect(validationMode).to.be.true;
	});

	it('should negate the validation mode for a specific URL', function () {
	    localStorage.setItem('validating', '{}');
	    var validationMode = urlModel.isValidating(testForm.live.value);
        expect(validationMode).to.be.false;
	});

	it('should block the url being validated from redirection', function () {
	    localStorage.setItem('validating', '{}');
        urlModel.setupValidation.call(testForm.live, '');
	    var validationMode = urlModel.isValidating(testForm.live.value);
        expect(validationMode).to.be.true;
    });

	it('should always execute the validation\'s callback', function () {
        timeoutSpy.reset();
        urlModel.setupValidation.call(testForm.live, '');
        expect(timeoutSpy.called).to.be.true;
	});

	it('should release the validated url to redirection', function (done) {
	    localStorage.setItem('validating', '{}');

        urlModel.setupValidation.call(testForm.live, '');

        setTimeout (function () {
            var validationMode = urlModel.isValidating(testForm.live.value);
            expect(validationMode).to.be.false;
            done();
        }, 1500)
    });

	it('should update the validated url\'s display with the validation result', function (done) {
	    specHelper.simpleDataSet();
	    var routeForm = document.querySelector('form.route.passive');
        var localParent = routeForm.querySelector('.local');
        var localInput = localParent.querySelector('input');
        var localComment = localParent.querySelector('.comment span');

        // reset label and comment
        var clearClassName = 'local';
        var clearTextContent = String.fromCharCode(160);
        localParent.className = clearClassName;
        localComment.textContent = clearTextContent;

        urlModel.setupValidation.call(localInput, '');

        setTimeout (function () {
            expect(localParent.className.indexOf('request-') > -1).to.be.true;
            expect(localComment.textContent.length > 2).to.be.true;
            done();
        }, 1500)
    });

});


