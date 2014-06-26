QUnit.test("QUnit Setup", function( assert ) {
  expect(1);
  assert.ok( 1 == "1", "Passed!" );
});

QUnit.test("Datepicker Opens and closes", function(assert) {
  expect(3);
  assert.equal($(".pika-single").hasClass('is-hidden'), true);
  $(".datepicker").click();
  assert.equal($(".pika-single").hasClass('is-hidden'), false);
  $("dl").click();
  assert.equal($(".pika-single").hasClass('is-hidden'), true);
});

QUnit.test("Select date", function(assert) {
  expect(2);
  var m = moment('2012-01-01');
  $(".datepicker").val(m.format('YYYY-MM-DD'));
  assert.equal($(".datepicker").val(), '2012-01-01');
  // click in input box
  $(".datepicker").click();
  // artificially change value
  var m = moment('2012-03-04');
  $(".datepicker").val(m.format('YYYY-MM-DD'));
  // close input box
  $("dl").click();
  assert.equal($(".datepicker").val(), '2012-03-04');

  // confirm values change
  // doesn't yet work, because the artificial way of changing the date doesn't
  // call the 'on select' event
  assert.equal($("#formatted").next().text(), m.format('DD/MM/YYYY'));
  assert.equal($("#timestamp").next().text(), m.format('X'));
});
