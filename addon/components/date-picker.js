import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { getOwner } from '@ember/application';
import { guidFor } from '@ember/object/internals';
import { isBlank, isEmpty } from '@ember/utils';
import moment from 'moment';

export default class DatePicker extends Component {
  _picker = null;
  containerId = `date-picker-container-${guidFor(this)}`;
  inputId = `date-picker-input-${guidFor(this)}`;

  @tracked minDate;
  @tracked maxDate;

  // Expect unix timestamp format from data binding
  valueFormat = 'X';

  // The format to display in the text field
  format = 'YYYY-MM-DD';

  // Whether `null` input date / result is allowed
  @tracked allowBlank = false;

  // Whether the input date should be considered a UTC date
  utc = false;

  // The input date
  @tracked date = null;

  // The allowed year range
  @tracked yearRange = [moment().year() - 3, moment().year() + 4];

  // @TODO figure out a better way to make the integration tests work
  get env() {
    const { environment } = getOwner(this).resolveRegistration(
      'config:environment',
    );

    return environment;
  }

  // The allowed year range as an array of integers
  get yearRangePair() {
    const yearRange = Array.isArray(this.yearRange)
      ? this.yearRange
      : this.yearRange.split(',');

    const startYear = parseInt(yearRange[0], 10);
    const endYear = parseInt(yearRange[1], 10);

    // assume we're in absolute form if the start year > 1000
    if (startYear > 1000) {
      return yearRange;
    }

    // relative form must be updated to absolute form
    const currentYear = moment().year();

    return [currentYear + startYear, currentYear + endYear];
  }

  /**
   * Setup Pikaday element after component was inserted.
   */
  @action
  setupDatepicker(element) {
    const container =
      this.env === 'test' ? document.getElementById(this.containerId) : null;

    const pickerOptions = {
      container,
      field: element,
      yearRange: this.yearRangePair,
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
        // use `moment` or `moment.utc` depending on `utc` flag
        const momentFn = this.utc ? moment.utc : moment;
        let date = momentFn(this.value, this.format);

        // has there been a valid date or any value at all?
        if (!date.isValid() || !this.value) {
          if (this.allowBlank) {
            // allowBlank means `null` is ok, so use that
            this.date = null;
            return null;
          }

          // "fallback" to current date
          date = momentFn();
        }

        this.date = this._serializeDate(date);
      },
    };

    const pickerOptionKeys = [
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

    pickerOptionKeys.forEach(key => {
      const value = this[key] ?? this.args[key];

      if (!isEmpty(value)) {
        pickerOptions[key] = value;
      }
    });

    this._picker = new window.Pikaday(pickerOptions);
    this.setDate();
  }

  // moment -> date value
  _serializeDate(date) {
    switch (this.valueFormat) {
      case 'date': {
        return date.toDate();
      }
      case 'moment': {
        return date;
      }
      default: {
        return date.format(this.valueFormat);
      }
    }
  }

  // date value -> moment
  _unserializeDate(date) {
    switch (this.valueFormat) {
      case 'date': {
        return moment(date);
      }
      case 'moment': {
        return date;
      }
      default: {
        return moment(date, this.valueFormat);
      }
    }
  }

  /**
   * Propper teardown to remove Pickady from the dom when the component gets
   * destroyed.
   */
  willDestroy() {
    if (this._picker) {
      this._picker.destroy();
    }
  }

  get _pickerDate() {
    if (!isBlank(this.date)) {
      // serialize moment.js date either from plain date object or string
      return this._unserializeDate(this.date);
    }

    // no date was found in data source. Either respect that or set it to now
    if (this.allowBlank) {
      return null;
    }

    const date = moment();
    // also set the controllers date here. If the controller passes in a
    // null date, it is assumed that todays date should be used
    this.date = this._serializeDate(date);

    return date;
  }

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
  setDate() {
    this._picker.setDate(this._pickerDate);
  }

  /**
   * Update Pikaday's minDate after bound `minDate` changed and also after
   * the initial `didInsertElement`.
   */
  setMinDate() {
    if (!isBlank(this.minDate)) {
      this._picker.setMinDate(this.minDate);
    }
  }

  /**
   * Update Pikaday's maxDate after bound `maxDate` changed and also after
   * the initial `didInsertElement`.
   */
  setMaxDate() {
    if (!isBlank(this.maxDate)) {
      this._picker.setMaxDate(this.maxDate);
    }
  }
}
