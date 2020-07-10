# Ember CLI Datepicker

## Description

This component is an Ember CLI addon and uses moment.js along with pickaday
to create an extensible Ember component. This is still a work in progress.
Pull requests are welcome.

## Installation

```sh
# Install the addon and include it in your project
$ ember install ember-cli-datepicker
```

## Basic Usage

```handlebars
<DatePicker @date={{someDate}} @valueFormat="YYYY-MM-DD">
```

## Demo

Clone this repo and run the app:

```sh
# Install ember-cli globally
$ yarn global add ember-cli

# Clone the repo
$ git clone https://github.com/wesm87/ember-datepicker

# Move into the ember-datepicker directory
$ cd ember-datepicker

# Install dependencies
$ yarn

# Fire up the local server
$ ember serve
```

## Options

When calling the datepicker, the following options are available:

### General Options

#### date

Type: `String | Date`

This variable will be changed when the user changes the date. It will be updated
using the `valueFormat` specified.

#### valueFormat

Type: `String`  
Default: `'X'`

This is the format in which the date is passed back to the controller.

Must be one of the following:
* [A valid moment.js format](http://momentjs.com/docs/#/parsing/string-format/)
* 'date' to be recognised as a Javascript Date object.
* 'moment' to be recognised as a Momentjs object.

#### format

Type: `String`  
Default: `'YYYY-MM-DD'`

This is the format in which the date is displayed in the input box.

Must be [a valid moment.js format](http://momentjs.com/docs/#/parsing/string-format/).

#### yearRange

Type: `String | Array<Number>`  
Default: `'-3, 4'`

This range of years to be displayed. It is either in the form of a relative
range (the first option goes from the current year back 3 years, and forward
4 years), or it can be defined in absolute terms. The value may also be an
array.  Here are some examples of valid inputs.

    yearRange: '-3, 4'
    yearRange: '2010, 2016'
    yearRange: [-2, 8]
    yearRange: [2000, 2020]

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

#### utc

Type: `Boolean`  
Default: `false`

Per default, the created `date` value will obtain the computer's timezone and
therefore not have UTC midnight as its time and will be a few hours off instead.

For example, when your timezone is 8 hours ahead of UTC: Creating a date object
from the input `'2000-01-01'` will result in `'1999-12-31T16:00:00.000Z'`,
because when your computer has the time of 00:00:00 on Jan 1st 2000, UTC time is
still in 1999. This is technically correct, but may not be what you want.

If you want to have easy-to-compare date strings in your JSON, set `utc` to
`true` and you will get `'2000-01-01T00:00:00.000Z'` as expected.
