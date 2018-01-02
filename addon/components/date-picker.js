import TextField from '@ember/component/text-field';
import { computed, observer } from '@ember/object';
import { isBlank, isEmpty } from '@ember/utils';
import moment from 'moment';

const isNil = val => val == null;

const is = (Ctor, val) =>
  !isNil(val) && (val.constructor === Ctor || val instanceof Ctor);

const toInt = val => parseInt(val, 10);

const parseRange = val => {
  const isArrayVal = is(Array, val);
  const isStringVal = is(String, val);

  if (!isArrayVal && !isStringVal) {
    return [];
  }

  const range = isArrayVal ? val : val.split(',');

  return range.map(toInt);
};

const getPickerOptions = instance => {
  const $el = instance.$();
  const formElement = $el[0];

  const pickerOptions = {
    field: formElement,
    yearRange: instance.get('_yearRange'),
    clearInvalidInput: true,
    /**
     * After the Pikaday component was closed, read the selected value
     * from the input field (remember we're extending TextField!).
     *
     * If that value is empty or no valid date, depend on `allowBlank` if
     * the `date` binding will be set to `null` or to the current date.
     *
     * Format the "outgoing" date with respect to the given `format`.
     */
    onClose: () => {
      const value = instance.get('value');
      const format = instance.get('format');
      const isUtc = instance.get('utc');
      const allowBlank = instance.get('allowBlank');

      // use `moment` or `moment.utc` depending on `utc` flag
      const momentFunction = isUtc ? moment.utc : moment;

      let d = momentFunction(value, format);

      // has there been a valid date or any value at all?
      if (!d.isValid() || !value) {
        if (allowBlank) {
          // allowBlank means `null` is ok, so use that
          return instance.set('date', null);
        }

        // "fallback" to current date
        d = moment();
      }

      instance._setControllerDate(d);
    },
  };

  const pickerOptionsKeys = [
    'bound',
    'position',
    'reposition',
    'format',
    'firstDay',
    'minDate',
    'maxDate',
    'showWeekNumber',
    'isRTL',
    'i18n',
    'yearSuffix',
    'disableWeekends',
    'disableDayFn',
    'showMonthAfterYear',
    'numberOfMonths',
    'mainCalendar',
  ];

  pickerOptionsKeys.forEach(key => {
    const value = instance.get(key);

    if (!isEmpty(value)) {
      pickerOptions[key] = value;
    }
  });

  return pickerOptions;
};

export default TextField.extend({
  /**
   * Component settings defaults
   */
  valueFormat: 'X', // expect unix timestamp format from data binding
  format: 'YYYY-MM-DD', // the format to display in the text field
  allowBlank: false, // whether `null` input/result is acceptable
  utc: false, // whether the input value is meant as a UTC date
  date: null,
  _picker: null,

  yearRange: computed(() => {
    const cy = moment().year();

    return `${cy - 3}, ${cy + 4}`;
  }),

  // A private method which returns the year range in absolute terms
  _yearRange: computed('yearRange', () => {
    const yearRange = parseRange(this.get('yearRange'));
    const [year1] = yearRange;

    // assume we're in absolute form if the start year > 1000
    if (toInt(year1) > 1000) {
      return yearRange;
    }

    // relative form must be updated to absolute form
    const cy = moment().year();
    const absoluteRange = yearRange.map(val => cy + toInt(val));

    return absoluteRange;
  }),

  /**
   * Setup Pikaday element after component was inserted.
   */
  didInsertElement() {
    const pickerOptions = getPickerOptions(this);
    const picker = new window.Pikaday(pickerOptions);

    // store Pikaday element for later access
    this.set('_picker', picker);

    // initially sync Pikaday with external `date` value
    this.setDate();
  },

  /**
   * Set the date on the controller.
   */
  _setControllerDate(d) {
    // update date value with user selected date with consistent format
    if (this.get('valueFormat') === 'date') {
      d = d.toDate();
    } else if (this.get('valueFormat') === 'moment') {
      // just set date as a moment object
    } else {
      d = d.format(this.get('valueFormat'));
    }

    this.set('date', d);
  },

  /**
   * Propper teardown to remove Pickady from the dom when the component gets
   * destroyed.
   */
  willDestroyElement() {
    this.get('_picker').destroy();
    this._super();
  },

  /**
   * Update Pikaday's displayed date after bound `date` changed and also after
   * the initial `didInsertElement`.
   *
   * Depending on the format in `valueFormat`, serialize date object from plain
   * JS Date or from specified string format.
   *
   * If no `date` is set in the data source, it depends on `allowBlank` whether
   * "new Date()" is used or an invalid date will force Pikaday to clear the
   * input element shown on the page.
   */
  setDate: observer('date', () => {
    const $el = this.$();
    const currentDate = this.get('date');
    const valueFormat = this.get('valueFormat');
    const allowBlank = this.get('allowBlank');

    let d = null;

    if (!isBlank(currentDate)) {
      // serialize moment.js date either from plain date object or string
      if (valueFormat === 'date') {
        d = moment(currentDate);
      } else if (valueFormat === 'moment') {
        d = currentDate;
      } else {
        d = moment(currentDate, valueFormat);
      }
    } else {
      // no date was found in data source. Either respect that or set it to now
      if (allowBlank) {
        // creates an "Invalid Date" object, which will clear the input field
        d = moment(null);
        // pickaday does not update the input value correctly when the date is set back to null
        $el.val('');
      } else {
        d = moment();
        // also set the controllers date here. If the controller passes in a
        // null date, it is assumed that todays date should be used
        this._setControllerDate(d);
      }
    }

    this.get('_picker').setDate(d.format());
  }),

  /**
   * Update Pikaday's minDate after bound `minDate` changed and also after
   * the initial `didInsertElement`.
   */
  setMinDate: observer('minDate', () => {
    const minDate = this.get('minDate');

    if (!isBlank(minDate)) {
      this.get('_picker').setMinDate(minDate);
    }
  }),

  /**
   * Update Pikaday's maxDate after bound `maxDate` changed and also after
   * the initial `didInsertElement`.
   */
  setMaxDate: observer('maxDate', () => {
    const maxDate = this.get('maxDate');

    if (!isBlank(maxDate)) {
      this.get('_picker').setMaxDate(maxDate);
    }
  }),
});
