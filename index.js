/* eslint-env node */
'use strict';

module.exports = {
  name: 'ember-cli-datepicker',
  //add this to enable live reload when in developing.
  //isDevelopingAddon: function() {
  //  return true;
  //},
  options: {
    nodeAssets: {
      'pikaday': {
        vendor: [
          'pikaday.js',
          'css/pikaday.css'
        ]
      }
    }
  },

  included() {
    this.import('vendor/pikaday/pikaday.js');
    this.import('vendor/pikaday/css/pikaday.css');
  }
};
