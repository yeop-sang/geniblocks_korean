import expect from 'expect';
import t from '../../src/code/utilities/translate';

describe("Translation", function() {

  it("should return the original string if we don't have a key", function() {
    let input           = "Hello",
        expectedOutput  = input;

    expect(t(input)).toEqual(expectedOutput);
  });

  it("should return a translated string if we do have a key", function() {
    let input           = "~ALERT.TITLE.GOOD_WORK",
        expectedOutput  = "Good work!";

    expect(t(input)).toEqual(expectedOutput);
  });

  it("should return the original string if request a non-existant language", function() {
    let input           = "~ALERT.TITLE.GOOD_WORK",
        expectedOutput  = input;

    expect(t(input, "elvish")).toEqual(expectedOutput);
  });

  it("should accept an array and fill in the parts with raw strings", function() {
    let input           = ["${0}, ${1}!", "Hello", "world"],
        expectedOutput  = "Hello, world!";

    expect(t(input)).toEqual(expectedOutput);
  });

  it("should accept an array and fill in the parts with translatable strings", function() {
    let input           = ["${0}!!", "~ALERT.TITLE.GOOD_WORK"],
        expectedOutput  = "Good work!!!";

    expect(t(input)).toEqual(expectedOutput);
  });

  it("should be able to reuse variables", function() {
    let input           = ["${0}, ${1}! I said ${0}!", "Hello", "world"],
        expectedOutput  = "Hello, world! I said Hello!";

    expect(t(input)).toEqual(expectedOutput);
  });

  it("should show an error if it includes an undefined variable", function() {
    let input           = ["${0} ${1}", "Hi there"],
        expectedOutput  = "Hi there ** TRANSLATION ERROR **";

    expect(t(input)).toEqual(expectedOutput);
  });

});
