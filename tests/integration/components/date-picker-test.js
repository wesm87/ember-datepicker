import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import $ from 'jquery';
import wait from 'ember-test-helpers/wait';

moduleForComponent('date-picker', 'Integration | Component | date picker', {
  integration: true,
});

test('it shows the picker on input focus, then hides it after click outside', async function(assert) {
  assert.expect(3);

  this.render(hbs`
    {{date-picker}}
  `);

  assert.equal(
    $('.pika-single').hasClass('is-hidden'),
    true,
    'date picker is initially hidden',
  );

  this.$('input').click();
  await wait();

  assert.equal(
    $('.pika-single').hasClass('is-hidden'),
    false,
    'date picker is visible',
  );

  document.body.click();
  await wait();

  assert.equal(
    $('.pika-single').hasClass('is-hidden'),
    true,
    'date picker is hidden again',
  );
});
