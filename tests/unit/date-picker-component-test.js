/* global moment */
import Ember from "ember";
import { test, moduleForComponent } from 'ember-qunit';

moduleForComponent('date-picker');


test("it displays today's date with default format when no date is set", function() {
  var component = this.subject(),
      formattedDate = moment().format(component.get('outputFormat'));

  equal(this.$().val(), formattedDate);
});

test("it displays today's date with custom format when no date is set", function() {
  var component = this.subject(),
      formattedDate = moment().format('DD.MM.YY');

  component.set('outputFormat', 'DD.MM.YY');

  equal(this.$().val(), formattedDate);
});

test("it displays nothing when no date is set and allowBlank=true", function() {
  var component = this.subject();

  component.set('allowBlank', true);

  equal(this.$().val(), '');
});

test("it sets bound date after open + close", function() {
  var component = this.subject();

  equal(component.get('date'), null);

  // simulate open + close of picker
  this.$().click();
  $('body').click();

  ok(component.get('date'));
});

test("it does not set bound date after open + close when allowBlank=true", function() {
  var component = this.subject();

  component.set('allowBlank', true);

  equal(component.get('date'), null);

  // simulate open + close of picker
  this.$().click();
  $('body').click();

  equal(component.get('date'), null);
});