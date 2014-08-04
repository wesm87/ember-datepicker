import Em from 'ember';
import moment from 'vendor/ember-cli-datepicker/js/moment';
export default Em.Controller.extend({
  date: '2014-02-01',
  formattedDate: function() {
    return moment(this.get('date'), 'YYYY-MM-DD').format('DD/MM/YYYY');
  }.property('date'),
  timestamp: function() {
    return moment(this.get('date'), 'YYYY-MM-DD').format('X');
  }.property('date')
});
