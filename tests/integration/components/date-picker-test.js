import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, find, waitFor, click } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | date-picker', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    await render(hbs`<DatePicker />`);

    assert.equal(this.element.textContent.trim(), '');
  });

  test('it shows the picker on input focus, then hides it after click outside', async function (assert) {
    assert.expect(3);

    await render(hbs`<DatePicker />`);
    await waitFor('.pika-single', { timeout: 2500 });

    assert.equal(
      find('.pika-single').classList.contains('is-hidden'),
      true,
      'date picker is initially hidden',
    );

    const inputElement = this.element.querySelector('input');

    await click(inputElement);

    assert.equal(
      find('.pika-single').classList.contains('is-hidden'),
      false,
      'date picker is visible',
    );

    await click(document.body);

    assert.equal(
      find('.pika-single').classList.contains('is-hidden'),
      true,
      'date picker is hidden again',
    );
  });
});
