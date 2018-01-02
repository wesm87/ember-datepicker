'use strict';

module.exports = {
  name: 'ember-cli-datepicker',

  options: {
    nodeAssets: {
      pikaday: {
        vendor: ['pikaday.js', 'css/pikaday.css'],
      },
    },
  },

  included() {
    this.import('vendor/pikaday/pikaday.js');
    this.import('vendor/pikaday/css/pikaday.css');
  },
};
