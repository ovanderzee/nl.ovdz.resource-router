
describe('URL Model: validate entered URL\'s', function () {

	it('should confirm the validation mode', function () {
	    localStorage.setItem('validating', true);
	    var validationMode = urlModel.stateVars();
        expect(validationMode).to.be.true;
	});

	it('should negate the validation mode', function () {
	    localStorage.setItem('validating', false);
	    var validationMode = urlModel.stateVars();
        expect(validationMode).to.be.false;
	});

});


