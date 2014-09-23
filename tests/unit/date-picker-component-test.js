/* global moment */
import Ember from "ember";
import startApp from '../helpers/start-app';
import { test, moduleForComponent } from 'ember-qunit';

var App, component;

moduleForComponent('date-picker', 'ember-cli-datepicker component', {
  setup: function() {
    App = startApp();
  },
  teardown: function() {
    Ember.run(App, 'destroy');
    // clear up component (this should be done by ember-qunit soon!)
    if (component) {
      Ember.run(component, 'destroy');
      component = null;
    }
  }
});

/**
 * Test initially displayed date with default and custon `outputFormat` and also
 * with the `allowBlank` option
 */
test("it displays today's date with default format when no date is set", function() {
  component = this.subject();
  var formattedDate = moment().format(component.get('outputFormat'));

  equal(this.$().val(), formattedDate, "displays date");
});

test("it displays today's date with custom `outputFormat` when no date is set", function() {
  component = this.subject({
    outputFormat: 'DD.MM.YY'
  });
  var formattedDate = moment().format('DD.MM.YY');

  equal(this.$().val(), formattedDate, "displays date with custom format");
});

test("it displays nothing when no date is set and `allowBlank: true`", function() {
  component = this.subject({
    allowBlank: true
  });

  equal(this.$().val(), "", "input is empty");
});


/**
 * Test whether opening and closing the date picker affects the bound date value
 * with and without `allowBlank`
 */
test("it sets bound date after open + close", function() {
  component = this.subject();

  this.$();
  equal(component.get('date'), null, "has no initial date");

  // simulate open + close of picker
  component.get('_picker').show();
  component.get('_picker').hide();

  ok(component.get('date'), "has a date");
});

test("it does not set bound date after open + close when `allowBlank: true`", function() {
  component = this.subject({
    allowBlank: true
  });

  // initial render
  this.$();
  equal(component.get('date'), null, "has no initial date");

  // simulate open + close of picker
  component.get('_picker').show();
  component.get('_picker').hide();

  equal(component.get('date'), null, "still has no date");
});


/**
 * Misc
 */
test("it shows date picker after click on input field", function() {
  component = this.subject();

  // initial render
  this.$();

  equal($('.pika-single').hasClass('is-hidden'), true, "date picker is initially hidden");

  click(this.$());

  andThen(function() {
    equal($('.pika-single').hasClass('is-hidden'), false, "date picker is shown");
  });
});

test("it updates displayed value when bound date changes", function() {
  component = this.subject();

  // initial render
  this.$();

  component.set('date', moment("2000-01-01").format('X'));

  equal(this.$().val(), "2000-01-01", "displays new date");
});


/**
 * Test custom `outputFormat` with complex format and custom `valueFormat` with
 * custom string format and "date" format which causes the output of a real
 * JS Date object
 */
test("it respects `outputFormat` when parsing date value", function() {
  component = this.subject({
    outputFormat: 'dddd, MMMM Do YYYY'
  });
  var formattedDate = moment("2000-01-01").format('dddd, MMMM Do YYYY');

  fillIn(this.$(), formattedDate);

  andThen(function() {
    // simulate open + close of picker
    component.get('_picker').show();
    component.get('_picker').hide();
    equal(component.get('date'), moment("2000-01-01").format('X'), "sets correct date");
  });
});

test("it respects `valueFormat: 'date'` when setting date value", function() {
  component = this.subject({
    valueFormat: 'date'
  });

  fillIn(this.$(), "2000-01-01");

  andThen(function() {
    // simulate open + close of picker
    component.get('_picker').show();
    component.get('_picker').hide();

    equal(component.get('date').toString(), moment("2000-01-01").toDate().toString(), "sets correct date");
  });
});

test("it respects `valueFormat` when setting date value", function() {
  component = this.subject({
    valueFormat: 'dddd, MMMM Do YYYY'
  });

  fillIn(this.$(), "2000-01-01");

  andThen(function() {
    // simulate open + close of picker
    component.get('_picker').show();
    component.get('_picker').hide();

    equal(component.get('date'), moment("2000-01-01").format('dddd, MMMM Do YYYY'), "sets currect date");
  });
});

/**
 * Test `utc` option that creates date objects in UTC mode.
 */
test("it creates UTC timestamp when `utc: true`", function() {
  component = this.subject();

  fillIn(this.$(), "2000-01-01");

  andThen(function() {
    // simulate open + close of picker
    component.get('_picker').show();
    component.get('_picker').hide();

    // actual UTC unix timestamp of "2000-01-01, 00:00:00"
    var unixTimestamp2000 = 946684800;

    // without utc = true, expect timestamp that differs from UTC unix timestamp
    // by the current timezoneOffset in seconds
    equal(component.get('date'), unixTimestamp2000 + (new Date()).getTimezoneOffset()*60,
      "outputs timestamp that differs by timezoneOffset when utc = false");

    component.set('utc', true);

    // simulate open + close of picker
    component.get('_picker').show();
    component.get('_picker').hide();

    equal(component.get('date'), unixTimestamp2000,
      "outputs exact timestamp of date when utc = true");
  });
});

test("it creates UTC date object when `utc: true`", function() {
  component = this.subject({
    valueFormat: 'date'
  });

  fillIn(this.$(), "2000-01-01");

  andThen(function() {
    // simulate open + close of picker
    component.get('_picker').show();
    component.get('_picker').hide();

    equal(component.get('date').toISOString(), moment("2000-01-01").toDate().toISOString(),
      "outputs regular date that equals locally generated date when utc = false");

    component.set('utc', true);

    // simulate open + close of picker again
    component.get('_picker').show();
    component.get('_picker').hide();

    equal(component.get('date').toISOString(), "2000-01-01T00:00:00.000Z",
      "outputs regular date that equals utc date when utc = true");
  });
});
