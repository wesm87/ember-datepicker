'use strict';

module.exports = {
  name: require('./package').name,

  included() {
    this._super.included.apply(this, arguments);
    this.import('node_modules/pikaday/pikaday.js');
    this.import('node_modules/pikaday/css/pikaday.css');
  },
};
