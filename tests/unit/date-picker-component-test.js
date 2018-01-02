import moment from 'moment';
import { test, moduleForComponent } from 'ember-qunit';
import { fillIn } from 'ember-native-dom-helpers';

moduleForComponent('date-picker', {
  integration: false,
});

/**
 * Test initially displayed date with default and custon `format` and also
 * with the `allowBlank` option
 */
test("it displays today's date with default format when no date is set", function(assert) {
  assert.expect(1);

  const component = this.subject();
  const formattedDate = moment().format(component.get('format'));

  assert.equal(this.$().val(), formattedDate, 'displays date');
});

test("it displays today's date with custom `format` when no date is set", function(assert) {
  assert.expect(1);

  this.subject({
    format: 'DD.MM.YY',
  });

  const formattedDate = moment().format('DD.MM.YY');

  assert.equal(
    this.$().val(),
    formattedDate,
    'displays date with custom format',
  );
});

test('it displays nothing when no date is set and `allowBlank: true`', function(assert) {
  assert.expect(1);

  this.subject({
    allowBlank: true,
  });

  assert.equal(this.$().val(), '', 'input is empty');
});

/**
 * Test whether opening and closing the date picker affects the bound date value
 * with and without `allowBlank`
 */
test('it sets bound date after open + close', function(assert) {
  assert.expect(2);

  const component = this.subject({
    allowBlank: false,
  });

  // initial render
  this.$();

  const todaysDate = moment().format(component.get('valueFormat'));

  assert.equal(component.get('date'), todaysDate, 'has initial date of today');

  // simulate open + close of picker
  component.get('_picker').show();
  component.get('_picker').hide();

  assert.ok(component.get('date'), 'has a date');
});

test('it does not set bound date after open + close when `allowBlank: true`', function(assert) {
  assert.expect(2);

  const component = this.subject({
    allowBlank: true,
  });

  // initial render
  this.$();

  assert.equal(component.get('date'), null, 'has no initial date');

  // simulate open + close of picker
  component.get('_picker').show();
  component.get('_picker').hide();

  assert.equal(component.get('date'), null, 'still has no date');
});

test('it updates displayed value when bound date changes', function(assert) {
  assert.expect(1);

  const component = this.subject();

  // initial render
  this.$();

  component.set('date', moment('2000-01-01').format('X'));

  assert.equal(this.$().val(), '2000-01-01', 'displays new date');
});

test('it updates displayed value to nothing when date is unset after having a previous value and `allowBlank: true`', function(assert) {
  assert.expect(2);

  const component = this.subject({
    allowBlank: true,
  });

  // initial render
  this.$();

  component.set('date', moment('2000-01-01').format('X'));

  assert.equal(this.$().val(), '2000-01-01', 'displays new date');

  component.set('date', null);

  assert.equal(this.$().val(), '', 'input is empty');
});

/**
 * Test custom `format` with complex format and custom `valueFormat` with
 * custom string format and "date" format which causes the output of a real
 * JS Date object
 */
test('it respects `format` when parsing date value', async function(assert) {
  assert.expect(1);

  const component = this.subject({
    format: 'dddd, MMMM Do YYYY',
  });
  const formattedDate = moment('2000-01-01').format('dddd, MMMM Do YYYY');

  // initial render
  this.$();

  await fillIn('input', formattedDate);

  // simulate open + close of picker
  component.get('_picker').show();
  component.get('_picker').hide();
  assert.equal(
    component.get('date'),
    moment('2000-01-01').format('X'),
    'sets correct date',
  );
});

test("it respects `valueFormat: 'date'` when setting date value", async function(assert) {
  assert.expect(1);

  const component = this.subject({
    valueFormat: 'date',
  });

  // initial render
  this.$();

  await fillIn('input', '2000-01-01');

  // simulate open + close of picker
  component.get('_picker').show();
  component.get('_picker').hide();

  assert.equal(
    component.get('date').toString(),
    moment('2000-01-01')
      .toDate()
      .toString(),
    'sets correct date',
  );
});

test("it respects `valueFormat: 'moment'` when setting date value", async function(assert) {
  assert.expect(1);

  const component = this.subject({
    valueFormat: 'moment',
  });

  // initial render
  this.$();

  await fillIn('input', '2000-01-01');

  // simulate open + close of picker
  component.get('_picker').show();
  component.get('_picker').hide();

  assert.equal(
    component.get('date').format(),
    moment('2000-01-01').format(),
    'sets correct moment object',
  );
});

test('it respects `valueFormat` when setting date value', async function(assert) {
  assert.expect(1);

  const component = this.subject({
    valueFormat: 'dddd, MMMM Do YYYY',
  });

  // initial render
  this.$();

  await fillIn('input', '2000-01-01');

  // simulate open + close of picker
  component.get('_picker').show();
  component.get('_picker').hide();

  assert.equal(
    component.get('date'),
    moment('2000-01-01').format('dddd, MMMM Do YYYY'),
    'sets currect date',
  );
});

/**
 * Test `utc` option that creates date objects in UTC mode.
 */
test('it creates UTC timestamp when `utc: true`', async function(assert) {
  assert.expect(2);

  const component = this.subject();

  // initial render
  this.$();

  await fillIn('input', '2000-01-01');

  // simulate open + close of picker
  component.get('_picker').show();
  component.get('_picker').hide();

  // actual UTC unix timestamp of "2000-01-01, 00:00:00"
  const unixTimestamp2000 = 946684800;

  // without utc = true, assert.expect timestamp that differs from UTC unix timestamp
  // by the current timezoneOffset in seconds
  assert.equal(
    component.get('date'),
    unixTimestamp2000 + new Date().getTimezoneOffset() * 60,
    'outputs timestamp that differs by timezoneOffset when utc = false',
  );

  component.set('utc', true);

  // simulate open + close of picker
  component.get('_picker').show();
  component.get('_picker').hide();

  assert.equal(
    component.get('date'),
    unixTimestamp2000,
    'outputs exact timestamp of date when utc = true',
  );
});

test('it creates UTC date object when `utc: true`', async function(assert) {
  assert.expect(2);

  const component = this.subject({
    valueFormat: 'date',
  });

  // initial render
  this.$();

  await fillIn('input', '2000-01-01');

  // simulate open + close of picker
  component.get('_picker').show();
  component.get('_picker').hide();

  assert.equal(
    component.get('date').toISOString(),
    moment('2000-01-01')
      .toDate()
      .toISOString(),
    'outputs regular date that equals locally generated date when utc = false',
  );

  component.set('utc', true);

  // simulate open + close of picker again
  component.get('_picker').show();
  component.get('_picker').hide();

  assert.equal(
    component.get('date').toISOString(),
    '2000-01-01T00:00:00.000Z',
    'outputs regular date that equals utc date when utc = true',
  );
});

/**
 * Test `yearRange` for both string and array
 */
test('it sets correct year range for relative string', function(assert) {
  assert.expect(2);

  const component = this.subject({
    yearRange: '-2, 3',
  });

  const cy = window.moment().year();

  const [year1, year2] = component.get('_yearRange');

  assert.equal(year1, cy - 2, 'start date');
  assert.equal(year2, cy + 3, 'end date');
});

test('it sets correct year range for absolute string', function(assert) {
  assert.expect(2);

  const component = this.subject({
    yearRange: '2000, 2020',
  });

  const [year1, year2] = component.get('_yearRange');

  assert.equal(year1, 2000, 'start date');
  assert.equal(year2, 2020, 'end date');
});

test('it sets correct year range for relative array', function(assert) {
  assert.expect(2);

  const component = this.subject({
    yearRange: ['-2', 3],
  });

  const cy = window.moment().year();

  const [year1, year2] = component.get('_yearRange');

  assert.equal(year1, cy - 2, 'start date');
  assert.equal(year2, cy + 3, 'end date');
});

test('it sets correct year range for absolute array', function(assert) {
  assert.expect(2);

  const component = this.subject({
    yearRange: [2000, '2020'],
  });

  const [year1, year2] = component.get('_yearRange');

  assert.equal(year1, 2000, 'start date');
  assert.equal(year2, 2020, 'end date');
});
