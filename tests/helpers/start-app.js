import Ember from 'ember';
import Application from 'dummy/app';
import Router from 'dummy/router';


if (window._phantom) {
  // Patch since PhantomJS does not implement click() on HTMLElement. In some 
  // cases we need to execute the native click on an element. However, jQuery's 
  // $.fn.click() does not dispatch to the native function on <a> elements, so we
  // can't use it in our implementations: $el[0].click() to correctly dispatch.
  if (!HTMLElement.prototype.click) {
    HTMLElement.prototype.click = function() {
      var ev = document.createEvent('MouseEvent');
      ev.initMouseEvent(
          'click',
          /*bubble*/true, /*cancelable*/true,
          window, null,
          0, 0, 0, 0, /*coordinates*/
          false, false, false, false, /*modifier keys*/
          0/*button=left*/, null
      );
      this.dispatchEvent(ev);
    };
  }
}

export default function startApp(attrs) {
  var App;

  var attributes = Ember.merge({
    // useful Test defaults
    rootElement: '#ember-testing',
    LOG_ACTIVE_GENERATION: false,
    LOG_VIEW_LOOKUPS: false
  }, attrs); // but you can override;

  Router.reopen({
    location: 'none'
  });

  Ember.run(function() {
    App = Application.create(attributes);
    App.setupForTesting();
    App.injectTestHelpers();
  });

  App.reset(); // this shouldn't be needed, i want to be able to "start an app at a specific URL"

  return App;
}
