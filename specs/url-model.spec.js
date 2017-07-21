
describe('URL Model: initialise URL validation', function () {

    // executing localStorage.clear in a before hook will raise an error while local servers a tested
    localStorage.clear();

	it('should initiate an empty validation stack', function () {
	    var validationStack = localStorage.getItem('validating');
        expect(validationStack === '{}').to.be.true;
	});

});

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

});


