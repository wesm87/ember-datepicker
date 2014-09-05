#Ember CLI Datepicker

## Description
This component is an Ember CLI add-on and uses moment.js along with pickaday
to create an extensible ember component.

## Installation
npm install ember-cli-datepicker --save-dev

##Basic Usage

  {{date-picker date=mydate valueFormat='YYYY-MM-DD'}}

## Options
When calling the the datepicker, the following options are available:

### General Options

#### date
Type: `String or Date1

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

The number of months to display in the datepicker component
