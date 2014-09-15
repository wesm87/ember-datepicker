import Em from 'ember';

export default Em.TextField.extend({
  /**
   * Component settings defaults
   */
  valueFormat: 'X',           // expect unix timestamp format from data binding
  outputFormat: 'YYYY-MM-DD', // the format to display in the text field
  numberOfMonths: 1,          // the "width" of date picker
  allowBlank: false,          // wheter `null` input/result is acceptable
  yearRange: function() {
    var cy = window.moment().year();
    return [cy-3, cy+4];
  }.property(),               // default yearRange from -3 to +4 years

  _picker: null,
  
  /**
   * Setup Pikaday element after component was inserted.
   */
  didInsertElement: function(){
    var formElement = this.$()[0],
        that = this,
        picker = new window.Pikaday({
          field: formElement,
          format: that.get('outputFormat'),
          yearRange: that.get('yearRange'),
          numberOfMonths: that.get('numberOfMonths'),
          clearInvalidInput: true,
          /**
           * After the Pikaday component was closed, read the selected value
           * from the input field (remember we're extending Ember.TextField!).
           *
           * If that value is empty or no valid date, depend on `allowBlank` if
           * the `date` binding will be set to `null` or to the current date.
           *
           * Format the "outgoing" date with respect to the given`outputFormat`.
           */
          onClose: function() {
            var d = window.moment(that.get('value'), that.get('outputFormat'));

            // has there been a valid date or any value at all?
            if (!d.isValid() || !that.get('value')) {
              if (that.get('allowBlank')) {
                // allowBlank means `null` is ok, so use that
                return that.set('date', null);
              } else {
                // "fallback" to current date
                d = window.moment();
              }
            }

            // update date value with user selected date with consistent format
            if (that.get('valueFormat') === 'date') {
              d = d.toDate();
            } else {
              d = d.format(that.get('valueFormat'));
            }

            that.set('date', d);
          }
        });

    // store Pikaday element for later access
    this.set("_picker", picker);

    // initially sync Pikaday with external `date` value
    this.setDate();
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
  setDate: function() {
    var d = null;
    if (!Em.isBlank(this.get('date'))) {
      // serialize moment.js date either from plain date object or string
      if (this.get('valueFormat') === 'date') {
        d = window.moment(this.get('date'));
      } else {
        d = window.moment(this.get('date'), this.get("valueFormat"));
      }
    } else {
      // no date was found in data source. Either respect that or set it to now
      if (this.get('allowBlank')) {
        // creates an "Invalid Date" object, which will clear the input field
        d = window.moment(null);
      } else {
        d = window.moment();
      }
    }
    this.get('_picker').setDate(d.format(this.get('outputformat')));
  }.observes('date')
});
