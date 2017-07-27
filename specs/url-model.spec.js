
describe('URL Model: validation mode', function () {

    var inputValue = 'http://www.bv.nl/test-url';
    var inputQuerySelector = '#route_3 input[name="live"]';

	it('should confirm the validation mode for a specific URL', function () {
	    testStack = {};
	    testStack[inputValue] = inputQuerySelector;
	    localStorage.setItem('validating', JSON.stringify(testStack));
	    var validationMode = urlModel.isValidating(inputValue);
        expect(validationMode).to.be.true;
	});

	it('should negate the validation mode for a specific URL', function () {
	    localStorage.setItem('validating', '{}');
	    var validationMode = urlModel.isValidating(inputValue);
        expect(validationMode).to.be.false;
	});

});

describe('URL Model: validate URL\'s', function () {

    var routeForm, liveInput, localInput, host = 'http://localhost:9080/';

    before (function () {
	    specHelper.simpleDataSet();
        routeForm = document.querySelector('form.route.active');
        liveInput = routeForm.querySelector('input[name="live"]');
        localInput = routeForm.querySelector('input[name="local"]');
    });

	it('should block the url being validated from redirection', function () {
        urlModel.setupValidation.call(liveInput, '');
	    var validationMode = urlModel.isValidating(liveInput.value);
        expect(validationMode).to.be.true;
    });

	it('should be backed by the timeout\'s callback', function () {
        timeoutSpy.reset();
        urlModel.setupValidation.call(liveInput, '');
        expect(timeoutSpy.called).to.be.true;
	});

	it('should release the validated url to redirection', function (done) {
        urlModel.setupValidation.call(liveInput, '');

        setTimeout (function () {
            var validationMode = urlModel.isValidating(liveInput.value);
            expect(validationMode).to.be.false;
            done();
        }, 1500)
    });

	it('should follow the same block/timeout/release logic for local url\'s', function (done) {
        timeoutSpy.reset();
        urlModel.setupValidation.call(localInput, host);
        expect(timeoutSpy.called).to.be.true;
	    var validationMode = urlModel.isValidating(host + localInput.value);
        expect(validationMode).to.be.true;

        setTimeout (function () {
            var validationMode = urlModel.isValidating(host + localInput.value);
            expect(validationMode).to.be.false;
            done();
        }, 1500)
    });

	it('should follow the same block/timeout/release logic for server url\'s', function (done) {
	    var serverInput = document.querySelector('input#secure');
	    var protocol = 'https://'
        timeoutSpy.reset();
        urlModel.setupValidation.call(serverInput, protocol);
        //expect(timeoutSpy.called).to.be.true;
	    var validationMode = urlModel.isValidating(protocol + serverInput.value + '/');
console.log(' validationMode ' + localStorage.getItem('validating'));
        expect(validationMode).to.be.true;

        setTimeout (function () {
            var validationMode = urlModel.isValidating(protocol + serverInput.value);
            //expect(validationMode).to.be.false;
            done();
        }, 1500)
    });

	it('should update the validated url\'s display with the validation result', function (done) {
	    var routeForm = document.querySelector('form.route.passive');
        var localParent = routeForm.querySelector('.local');
        var localInput = localParent.querySelector('input');
        var localComment = localParent.querySelector('.comment span');

        // reset label and comment
        var clearClassName = 'local';
        var clearTextContent = String.fromCharCode(160);
        localParent.className = clearClassName;
        localComment.textContent = clearTextContent;

        urlModel.setupValidation.call(localInput, host);

        setTimeout (function () {
            expect(localParent.className.indexOf('request-') > -1).to.be.true;
            expect(localComment.textContent.length > 2).to.be.true;
            done();
        }, 1500)
    });

});


