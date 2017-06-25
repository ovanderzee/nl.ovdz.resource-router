
describe('LinkElement: pick properties from an URL', function () {

	it('should return a root name that combines the protocol and the host', function () {
		linkElement.createURL('http://localhost:8080/static/css/main.css');
		expect(linkElement.root).to.equal('http://localhost:8080');
	});

	it('should return a domain name, which is hostname minus subdomain', function () {
		linkElement.createURL('https://jip.sheerenloo.nl/#/internet/7/3/play');
		expect(linkElement.domain).to.equal('sheerenloo.nl');
	});

	it('should return a domain name with two dots in it', function () {
		linkElement.createURL('https://www.bbc.co.uk/#/page');
		expect(linkElement.domain).to.equal('bbc.co.uk');
	});

});
