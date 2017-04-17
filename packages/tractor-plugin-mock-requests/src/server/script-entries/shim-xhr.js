/* globals window */

// Dependencies:
import FakeXMLHttpRequest from 'fake-xml-http-request';

window.__tractor__ = (function tractorMockRequests (tractor) {
    var originalXHR = window.XMLHttpRequest;
    var originalOpen = originalXHR.prototype.open;
    originalXHR.prototype.open = function (method, url) {
        var mock = tractor.getMatchingMock(method, url);
        if (!mock || mock.passthrough) {
            return originalOpen.apply(this, arguments);
        } else {
            var fake = new FakeXMLHttpRequest();

            var real = this;
            Object.setPrototypeOf(real, FakeXMLHttpRequest.prototype);

            real.send = function () {
                copyEvents(real, fake);
                FakeXMLHttpRequest.prototype.send.apply(this, arguments);
                fake.send.apply(fake, arguments);
                FakeXMLHttpRequest.prototype.respond.call(this, mock.status, mock.headers, mock.body);
                fake.respond.apply(fake, arguments);
            }

            copyEvents(real, fake);
            FakeXMLHttpRequest.prototype.open.apply(this, arguments);
            fake.open.apply(fake, arguments);
        }
    };

    return tractor;

    function copyEvents (real, fake) {
        var events = ['abort', 'error', 'load', 'loadend', 'loadstart', 'progress', 'readystatechange', 'timeout'];
        events.forEach(function (event) {
            var eventKey = 'on' + event;
            var handler = real[eventKey];
            if (typeof handler === 'function') {
                fake[eventKey] = handler.bind(real);
            }
        });
    }
})(window.__tractor__);
