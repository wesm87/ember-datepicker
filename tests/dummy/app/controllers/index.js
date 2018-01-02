import { Controller, computed } from 'ember';

export default Controller.extend({
  date: '2014-02-01',
  jsDate: new Date(),
  formattedDate: computed('date', () => {
    return window.moment(this.get('date'), 'YYYY-MM-DD').format('DD/MM/YYYY');
  }),
  timestamp: computed('date', () => {
    return window.moment(this.get('date'), 'YYYY-MM-DD').format('X');
  }),
  jsUTCString: computed('jsDate', () => {
    return this.get('jsDate').toUTCString();
  }),
});
