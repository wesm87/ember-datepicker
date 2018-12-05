import TextField from '@ember/component/text-field';
import $ from 'jquery';
import { computed, observer } from '@ember/object';
import { isBlank, isEmpty } from '@ember/utils';
//import moment from 'moment';

/*global moment*/
export default TextField.extend({
  /**
   * Component settings defaults
   */
  valueFormat: 'X', // expect unix timestamp format from data binding
  format: 'YYYY-MM-DD', // the format to display in the text field
  allowBlank: false, // whether `null` input/result is acceptable
  utc: false, // whether the input value is meant as a UTC date
  date: null,
  oldtz: 'utc',
  tz: 'utc', //timezone

  yearRange: computed(function() {
    const cy = moment().year();

    return `${cy - 3},${cy + 4}`;
  }),

  //will be called by pickaday to display the value in textfield.
  toString: function(d, format) {
    return moment(d).format(format);
  },
  // A private method which returns the year range in absolute terms
  _yearRange: computed('yearRange', function() {
    var yr = this.get('yearRange');
    if (!$.isArray(yr)) {
      yr = yr.split(',');
    }
    // assume we're in absolute form if the start year > 1000
    if (parseInt(yr[0], 10) > 1000) {
      return yr;
    }
    // relative form must be updated to absolute form
    var cy = window.moment().year();
    return [cy + parseInt(yr[0], 10), cy + parseInt(yr[1], 10)];
  }),

  _picker: null,

  /**
   * Setup Pikaday element after component was inserted.
   */
  didInsertElement() {
    var formElement = this.$()[0],
      that = this,
      pickerOptions = {
        field: formElement,
        yearRange: that.get('_yearRange'),
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
        onClose: function() {
          // use `moment` or `moment.utc` depending on `utc` flag
          var momentFunction = that.get('utc')
              ? window.moment.utc
              : window.moment;
          //since value is the one in input field, so it should be formated with 'format'.
          var d = momentFunction(that.get('value'), that.get('format'));

          // has there been a valid date or any value at all?
          if (!d.isValid() || !that.get('value')) {
            if (that.get('allowBlank')) {
              // allowBlank means `null` is ok, so use that
              return that.set('date', null);
            } else {
              // "fallback" to current date
              d = window.moment();
            }
          }

          that._setControllerDate(d);
        }
      },
      picker = null;

    [
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
      'toString'
    ].forEach(f => {
      if (!isEmpty(that.get(f))) {
        pickerOptions[f] = this.get(f);
      }
    });

    picker = new window.Pikaday(pickerOptions);

    // store Pikaday element for later access
    this.set('_picker', picker);

    // initially sync Pikaday with external `date` value
    this.setDate();
  },
  /**
   * Set the date on the controller.
   */
  _setControllerDate: function(d) {
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
  willDestroyElement: function() {
    this.get('_picker').destroy();
    this._super();
  },

  convertDate: function(d) {
    if (this.get('oldtz') != this.get('tz')) {
      this.set('oldtz', this.get('tz'));
      return moment.tz(d.valueOf(), this.get('oldtz')).tz(this.get('tz'));
    } else {
      return d;
    }
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
  setDate: observer('date','tz', function() {
    var d = null;
    if (!isBlank(this.get('date'))) {
      // serialize moment.js date either from plain date object or string
      if (this.get('valueFormat') === 'date') {
        d = window.moment(this.get('date'));
      } else if (this.get('valueFormat') === 'moment') {
        d = this.get('date');
      } else {
        d = window.moment(this.get('date'), this.get('valueFormat'));
      }
    } else {
      // no date was found in data source. Either respect that or set it to now
      if (this.get('allowBlank')) {
        // creates an "Invalid Date" object, which will clear the input field
        d = window.moment(null);
        // pickaday does not update the input value correctly when the date is set back to null
        this.$().val('');
      } else {
        d = window.moment();
        // also set the controllers date here. If the controller passes in a
        // null date, it is assumed that todays date should be used
        this._setControllerDate(d);
      }
    }
    d = this.convertDate(d);
    this.get('_picker').setDate(d.format(this.get('format')));
  }),
  /**
   * Update Pikaday's minDate after bound `minDate` changed and also after
   * the initial `didInsertElement`.
   */
  setMinDate: observer('minDate', function() {
    if (!isBlank(this.get('minDate'))) {
      this.get('_picker').setMinDate(this.get('minDate'));
    }
  }),
  /**
   * Update Pikaday's maxDate after bound `maxDate` changed and also after
   * the initial `didInsertElement`.
   */
  setMaxDate: observer('maxDate', function() {
    if (!isBlank(this.get('maxDate'))) {
      this.get('_picker').setMaxDate(this.get('maxDate'));
    }
  })
});
