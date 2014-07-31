'use strict';

var path = require('path');
var fs   = require('fs');

function EmberCLIDatepicker(project) {
  this.project = project;
  this.name    = 'Ember CLI Date Picker';
}

function unwatchedTree(dir) {
  return {
    read:    function() { return dir; },
    cleanup: function() { }
  };
}

EmberCLIDatepicker.prototype.treeFor = function treeFor(name) {
  var treePath =  path.join('node_modules', 'ember-cli-datepicker', name + '-addon');

  if (fs.existsSync(treePath)) {
    return unwatchedTree(treePath);
  }
};

EmberCLIDatepicker.prototype.included = function included(app) {
  this.app = app;

  this.app.import('vendor/ember-cli-datepicker/js/moment.js');
  this.app.import('vendor/ember-cli-datepicker/js/pikaday.js');
  this.app.import('vendor/ember-cli-datepicker/styles/pikaday.css');
};

module.exports = EmberCLIDatepicker;
