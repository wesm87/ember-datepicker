#Ember CLI Datepicker [![Build Status](https://travis-ci.org/gevious/ember-datepicker.svg)](https://travis-ci.org/gevious/ember-datepicker)

## Description
This component is an Ember CLI add-on and uses moment.js along with pickaday
to create an extensible ember component.

## Installation
npm install ember-cli-datepicker --save-dev
ember g ember-cli-datepicker

## Basic Usage

  {{date-picker date=mydate valueFormat='YYYY-MM-DD'}}

## Demo
Check out the demo on [github pages](http://gevious.github.io/ember-datepicker/ "Ember-datepicker Demo").
Alternatively you can clone this repo and run the app

    sudo npm install -g ember-cli
    git clone git@github.com:gevious/ember-datepicker
    cd ember-datepicker
    npm install; bower install
    ember serve

## Options
When calling the the datepicker, the following options are available:

### General Options

#### date
Type: `String` or `Date`

This variable will be changed when the user changes the date. It will be
updated using the `valueFormat` specified.

#### valueFormat
Type: `String`
Default: `X`

This is the format in which the date is passed back to the controller.

This format must be one of the momentjs defined formats, or be set to 'date' to
be recognised as a Javascript Date object.

#### outputFormat
Type: `String`
Default: `YYYY-MM-DD`

This is the format in which the date is displayed in the input box.

#### yearRange
Type: `Array`
Default: `-3 years to 4 years`

This range is an array of 2 numbers, both absolute references.  For example, to
have an absolute year range from 2000 to 2010 would need the following
definition:

    yearRange: [2000, 2010]

#### numberOfMonths
Type: `Number`
Default: `1`

The number of months to display in the datepicker component.

#### allowBlank
Type: `Boolean`
Default: `false`

Can be set to allow blank dates (`date = null`). By default, `null` values will
be replaced by the current date on initial render and every time the datepicker
is closed. With this option, `date` may stay `null`.
