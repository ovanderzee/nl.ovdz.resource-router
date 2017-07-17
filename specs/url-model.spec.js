
describe('URL Model: validate URL\'s', function () {

    // executing localStorage.clear in a before hook will raise an error while local servers a tested
    localStorage.clear();

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

	it('should initiate an empty validation stack', function () {
	    var validationStack = localStorage.getItem('validating');
        expect(validationStack === '{}').to.be.true;
	});

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

	it('should set the validation-array when starting a validation', function () {
	    localStorage.setItem('validating', '{}');
        urlModel.setupValidation.call(testForm.live, '');
	    var validationMode = urlModel.isValidating(testForm.live.value);
        expect(validationMode).to.be.true;
	});

	it('should set a timeout for handling the callback when starting a validation', function () {
	    localStorage.setItem('validating', '{}');
        urlModel.setupValidation.call(testForm.live, '');
        expect(typeof testForm.live.dataset.timeout === 'number').to.be.true;
	});

});


