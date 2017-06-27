
describe('Extension Model: data abstraction', function () {

    // executing localStorage.clear in a before hook will raise an error while local servers a tested
    localStorage.clear();

	it('should generate base settings on first run', function () {
        // localStorage has to be cleared beforehand
        var population = localStorage.length;
        expect(population).to.be.above(0);
	});

	it('should retrieve the value for an object accordimg to its id', function () {
	    localStorage.setItem('test', 'retrieve');
	    var testObject = {id: 'test'};
	    extensionModel.get.call(testObject);
        expect(testObject.value).to.equal('retrieve');
	});

	it('should store the id and value of an object as a key-value pair in localStorage', function () {
	    localStorage.removeItem('test');
	    var testObject = {id: 'test', value: 'store'};
	    extensionModel.set.call(testObject);
        expect(localStorage.getItem('test')).to.equal('store');
	});

	it('should return true when the extention is turned on', function () {
	    localStorage.setItem('rerouting', 'running');
        expect(extensionModel.isRunning()).to.be.true;
	});

	it('should return false when the extention is turned off', function () {
	    localStorage.setItem('rerouting', 'idle');
        expect(extensionModel.isRunning()).to.be.false;
	    localStorage.setItem('rerouting', '');
        expect(extensionModel.isRunning()).to.be.false;
	    localStorage.removeItem('rerouting');
        expect(extensionModel.isRunning()).to.be.false;
	});




});

