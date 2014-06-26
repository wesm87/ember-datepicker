(function() {
  Em.DatePickerComponent = Em.TextField.extend({
    isUnix: true,
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
          }),
          dd = that.get('date');
      if (this.get('isUnix') && !Em.isBlank(dd)) {
        picker.setDate(moment.unix(dd).format(that.get('format')));
      } else {
        picker.setDate(moment(dd).format(that.get('format')));
      }
      this.set("_picker", picker);
    }
  });

  Em.Handlebars.helper('date-picker', Em.DatePickerComponent);
})();
