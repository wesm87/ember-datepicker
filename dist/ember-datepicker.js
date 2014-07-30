/*! ember-datepicker 2014-07-30 */
(function() {
/**
 * Displays a text field with the date in correct format. On click it opens
 * the calendar widget.
 */
Em.DatePickerComponent = Em.TextField.extend({
  valueFormat: 'X',  // by default expect a unix timestamp
  outputFormat: 'YYYY-MM-DD', // the format to display in the text field
  runningDate: moment(),
  yearRange: function() {
    var cy = moment().year();
    return [cy-3, cy+4];
  }.property(),
  numberOfMonths: 1,
  _picker: null,
  didInsertElement: function(){
    var formElement = this.$()[0],
        that = this,
        picker = new Pikaday({
          field: formElement,
          format: that.get('outputFormat'),
          yearRange: that.get('yearRange'),
          numberOfMonths: that.get('numberOfMonths'),
          onClose: function() {
            // update date value with user selected date. Keeps format 
            // consistent
            var d = moment(that.get('value'), that.get('outputFormat'))
                           .format(that.get('valueFormat'));
            that.set('date', d);
          }
        });
    this.set("_picker", picker);
    this.setDate();
  },
  setDate: function() {
    // setting date in widget
    var d = moment();
    if (!Em.isBlank(this.get('date'))) {
      d = moment(this.get('date'), this.get("valueFormat"));
    }
    this.get('_picker').setDate(d.format(this.get('outputformat')));
  }
});

Em.Handlebars.helper('date-picker', Em.DatePickerComponent);
})();