const { failOnError, withScales, draw50By50Square, drawSquare } = require('../helpers');

module.exports = {
  tags: ['components', 'daylighting-controls'],
  setUp: (browser) => {
    withScales(failOnError(browser))
      .waitForElementVisible('.modal .new-floorplan', 5000)
      .setFlagOnError()
      .click('.modal .new-floorplan')
      .getScales() // assigns to client.xScale, client.yScale.
      // unfortunately, it does so asyncronously, so we have to use .perform()
      // if we want to access them.
      .perform(draw50By50Square)
      .click('#library-type-select option[value="daylighting_control_definitions"]')
      .click('#library-new-object')
      .click('.tools [data-tool="Place Component"]')
      .perform((client, done) => {
        client
        .moveToElement('#grid svg', client.xScale(-40), client.yScale(40))
        .mouseButtonClick();

        done();
      });
  },
  'modifying edge preserves daylighting controls': (browser) => {
    browser
      .click('.tools [data-tool="Rectangle"]')
      .perform(drawSquare(-10, 50, 10, 10))
      .assert.elementCount('.daylighting-control', 1)
      .checkForErrors()
      .end();
  },
  'splitting edge preserves daylighting controls': (browser) => {
    browser
      .click('.tools [data-tool="Rectangle"]')
      .click('#selections .add-sub-selection')
      .perform(drawSquare(-10, 50, 10, 10))
      .assert.elementCount('.daylighting-control', 1)
      .checkForErrors()
      .end();
  },
  'covering daylighting control removes it': (browser) => {
    browser
      .click('.tools [data-tool="Rectangle"]')
      .click('#selections .add-sub-selection')
      .perform(drawSquare(-45, 35, 30, 30))
      .assert.elementCount('.daylighting-control', 0)
      .checkForErrors()
      .end();
  },
  'moving space preserves daylighting controls': (browser) => {
    browser
      .click('.tools [data-tool="Select"]')
      .perform((client, done) => {
        client
        .moveToElement('#grid svg', client.xScale(-25), client.yScale(25))
        .pause(10)
        .mouseButtonDown(0)
        .moveToElement('#grid svg', client.xScale(-30), client.yScale(25))
        .mouseButtonUp(0);

        done();
      })
      .assert.elementCount('.daylighting-control', 1)
      .checkForErrors()
      .end();
  },

};