import Em from 'ember';

export default Em.TextField.extend({
  valueFormat: 'X',  // by default expect a unix timestamp
  outputFormat: 'YYYY-MM-DD', // the format to display in the text field
  runningDate: window.moment(),
  yearRange: function() {
    var cy = window.moment().year();
    return [cy-3, cy+4];
  }.property(),
  numberOfMonths: 1,
  _picker: null,
  didInsertElement: function(){
    var formElement = this.$()[0],
        that = this,
        picker = new window.Pikaday({
          field: formElement,
          format: that.get('outputFormat'),
          yearRange: that.get('yearRange'),
          numberOfMonths: that.get('numberOfMonths'),
          onClose: function() {
            // update date value with user selected date. Keeps format 
            // consistent
            var d = window.moment(that.get('value'), that.get('outputFormat'))
                                  .format(that.get('valueFormat'));
            that.set('date', d);
          }
        });
    this.set("_picker", picker);
    this.setDate();
  },
  setDate: function() {
    // setting date in widget
    var d = window.moment();
    if (!Em.isBlank(this.get('date'))) {
      d = window.moment(this.get('date'), this.get("valueFormat"));
    }
    this.get('_picker').setDate(d.format(this.get('outputformat')));
  }
});
