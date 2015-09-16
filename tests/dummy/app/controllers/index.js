import Em from 'ember';
export default Em.Controller.extend({
  visible: false,
  date: '2014-02-01',
  formattedDate: function() {
    return window.moment(this.get('date'), 'YYYY-MM-DD').format('DD/MM/YYYY');
  }.property('date'),
  timestamp: function() {
    return window.moment(this.get('date'), 'YYYY-MM-DD').format('X');
  }.property('date'),
  jsDate: new Date(),
  jsUTCString: function() {
    return this.get('jsDate').toUTCString();
  }.property('jsDate'),

  actions: {
    'toggleVisibility': function () {
      this.set('visible', !this.get('visible'));
    }
  }
});
