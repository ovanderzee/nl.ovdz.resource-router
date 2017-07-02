
describe('Extension Background: display extension state', function () {

	before (initBadgeDecoration);

	it('should set the text of the badge', function () {
		expect(badgeTextSpy.called).to.be.true;
		badgeTextSpy.reset();
	});

	it('should set the background color of the badge', function () {
		expect(badgeBgSpy.called).to.be.true;
		badgeBgSpy.reset();
	});

});

describe('Extension Background: conditional redirection', function () {

    var details;
    var setData = function () {
	    details = {url: 'http://www.test.it/css/active.css'};
        localStorage.setItem ('http://www.test.it/css/active.css', '{"active":true,"local":"test.it/styles.css"}');
        localStorage.setItem ('http://www.test.it/css/passive.css', '{"active":false,"local":"test.it/styles.css"}');
        localStorage.setItem ('loose', 'localhost:9080');
        localStorage.setItem ('rerouting', 'running');
        localStorage.setItem ('secure', 'localhost:9443');
        localStorage.setItem ('validating', '{}');
    };

    // runs before on start of this block
    before(setData);

    // runs after each test in this block
    afterEach(setData);

	it('should redirect when all conditions are set', function () {
        var redirection = routingResponse(details);
        expect(redirection.redirectUrl).to.equal("http://localhost:9080/test.it/styles.css");
	});

	it('should not redirect a unregistered route', function () {
	    var details = {url: 'http://www.test.it/css/404.html'};
        var redirection = routingResponse(details);
        expect(redirection.cancel).to.be.false;
	});

	it('should not redirect a deactivated route', function () {
	    var details = {url: 'http://www.test.it/css/passive.css'};
        var redirection = routingResponse(details);
        expect(redirection.cancel).to.be.false;
	});

	it('should not redirect when the extention is dismissed', function () {
	    localStorage.setItem ('rerouting', 'idle');
        var redirection = routingResponse(details);
        expect(redirection.cancel).to.be.false;
	});

	it('should not redirect when the url is being validated', function () {
	    var validationObject = {'http://www.test.it/css/active.css': '#route_1 input[name="live"]'};
	    localStorage.setItem ('validating', JSON.stringify(validationObject));
        var redirection = routingResponse(details);
        expect(redirection.cancel).to.be.false;
	});

});

