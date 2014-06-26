/**
 * Displays a text field with the date in correct format. On click it opens
 * the calendar widget.
 */
Em.DatePickerComponent = Em.TextField.extend({
  format: 'YYYY-MM-DD',
  defaultDate: function() {  // must be a moment value
    return moment().format(this.get('format'));
  }.property(),
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
          format: that.get('format'),
          yearRange: that.get('yearRange'),
          numberOfMonths: that.get('numberOfMonths'),
          onSelect: function() {
            that.set('date', moment(that.get('value')));
          }
        });
    picker.setDate(that.get('defaultDate'));
    this.set("_picker", picker);
  }
});

Em.Handlebars.helper('date-picker', Em.DatePickerComponent);
