

describe('Popup scripts: UI interaction', function () {

    beforeEach(
	    specHelper.simpleDataSet
    );

	it('should remove a route after clicking the remove button twice', function () {
        var configuredRoutes = document.querySelectorAll('form.route.active, form.route.passive');
        var routeCount = configuredRoutes.length;
        var targetForm = configuredRoutes[routeCount - 1];
        var removeButton = targetForm.elements.remove;

        try {
            var clickEvent = new MouseEvent('click', {
                'view': window,
                'bubbles': true,
                'cancelable': true
            });
        }
        catch (e) {
            var clickEvent = document.createEvent('MouseEvent');
            clickEvent.initMouseEvent('click', true, true, null);
        }

        removeButton.dispatchEvent(clickEvent);
        removeButton.dispatchEvent(clickEvent);

        var formsAfter = document.querySelectorAll('form.route.active, form.route.passive');

        expect(routeCount - 1 == formsAfter.length).to.be.true;
    });



});