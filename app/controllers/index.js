import Em from 'ember';
export default Em.Controller.extend({
  date: '2014-02-01',
  formattedDate: function() {
    return window.moment(this.get('date'), 'YYYY-MM-DD').format('DD/MM/YYYY');
  }.property('date'),
  timestamp: function() {
    return window.moment(this.get('date'), 'YYYY-MM-DD').format('X');
  }.property('date')
});
