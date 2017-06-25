
localStorage.setItem ('http://www.test.it/css/active.css', '{"active":true,"local":"test.it/styles.css"}');
localStorage.setItem ('http://www.test.it/css/passive.css', '{"active":false,"local":"test.it/styles.css"}');
localStorage.setItem ('validating', '{}');
localStorage.setItem ('rerouting', 'running');

describe('Extension Background: conditional redirection', function () {

	it('should redirect when all conditions are set', function () {
	    var details = {url: 'http://www.test.it/css/active.css'};
        var redirection = routingResponse(details);
        expect(redirection.redirectUrl).to.equal("http://localhost:80/test.it/styles.css");
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
	    var details = {url: 'http://www.test.it/css/active.css'};
	    localStorage.setItem ('rerouting', 'idle');
        var redirection = routingResponse(details);
        expect(redirection.cancel).to.be.false;
	    localStorage.setItem ('rerouting', 'running');
	});

	it('should not redirect when the url is being validated', function () {
	    var details = {url: 'http://www.test.it/css/active.css'};
	    var validationObject = {'http://www.test.it/css/active.css': '#route_1 input[name="live"]'};
	    localStorage.setItem ('validating', JSON.stringify(validationObject));
        var redirection = routingResponse(details);
        expect(redirection.cancel).to.be.false;
	    localStorage.setItem ('validating', {});
	});

});

