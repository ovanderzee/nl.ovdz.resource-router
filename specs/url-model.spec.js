
describe('URL Model: validate entered URL\'s', function () {

    // executing localStorage.clear in a before hook will raise an error while local servers a tested
    localStorage.clear();

    var liveUrl = "http://www.bv.nl/test-url";
    var liveElementQuery = "route_1 input[name=\"live\"]";
    var localUrl = "/local-rsrc";
    var localElementQuery = "route_1 input[name=\"local\"]";
    var testStack = {};
    testStack[liveUrl] = liveElementQuery;
    testStack[localUrl] = localElementQuery;

	it('should initiate an empty validation stack', function () {
	    var validationStack = localStorage.getItem('validating');
        expect(validationStack === '{}').to.be.true;
	});

	it('should confirm the validation mode for a specific URL', function () {
	    localStorage.setItem('validating', JSON.stringify(testStack));
	    var validationMode = urlModel.isValidating(liveUrl);
        expect(validationMode).to.be.true;
	});

	it('should negate the validation mode for a specific URL', function () {
	    localStorage.setItem('validating', '{}');
	    var validationMode = urlModel.isValidating(liveUrl);
        expect(validationMode).to.be.false;
	});

});


