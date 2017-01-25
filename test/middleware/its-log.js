import Immutable from 'seamless-immutable';
import expect from 'expect';
import { cloneDeep } from 'lodash';
import { changePropertyValues, makeMutable } from '../../src/code/middleware/its-log';

describe("ITS Log - makeMutable()", function() {

  it("should return the original value in the case of null", function() {
    let input           = null,
        expectedOutput  = input;

    expect(makeMutable(input)).toEqual(expectedOutput);
  });

  it("should return the original value in the case of undefined", function() {
    let input           = undefined,
        expectedOutput  = input;

    expect(makeMutable(input)).toEqual(expectedOutput);
  });

  it("should return a mutable array when passed an immutable array", function() {
    let input           = Immutable([]),
        output          = makeMutable(input),
        expectedOutput  = input;
    expect(output).toEqual(expectedOutput);
    expect(output.push(1)).toEqual(1);
    expect(output).toEqual([1]);
  });

  it("should return a mutable object when passed an immutable object", function() {
    let input           = Immutable({}),
        output          = makeMutable(input),
        expectedOutput  = input;
    expect(output).toEqual(expectedOutput);
    output.prop = 1;
    expect(output.prop).toEqual(1);
    expect(output).toEqual({ prop: 1 });
  });

});

describe("ITS Log - changePropertyValues()", function() {

  const changeSexToString = sex => sex === 0 ? "male" : "female";

  it("should return the original value in the case of null", function() {
    let input           = null,
        expectedOutput  = cloneDeep(input);

    changePropertyValues(input, 'sex', changeSexToString);
    expect(input).toEqual(expectedOutput);
  });

  it("should return the original value in the case of undefined", function() {
    let input           = undefined,
        expectedOutput  = cloneDeep(input);

    changePropertyValues(input, 'sex', changeSexToString);
    expect(input).toEqual(expectedOutput);
  });

  it("should return the original value in the case of numbers", function() {
    let input           = 1,
        expectedOutput  = cloneDeep(input);

    changePropertyValues(input, 'sex', changeSexToString);
    expect(input).toEqual(expectedOutput);
  });

  it("should return the original value in the case of strings", function() {
    let input           = "string",
        expectedOutput  = cloneDeep(input);

    changePropertyValues(input, 'sex', changeSexToString);
    expect(input).toEqual(expectedOutput);
  });

  it("should return the original value in the case of booleans", function() {
    let input           = true,
        expectedOutput  = cloneDeep(input);

    changePropertyValues(input, 'sex', changeSexToString);
    expect(input).toEqual(expectedOutput);
  });

  it("should return the original value in the case of objects without 'sex'", function() {
    let input           = {
                            foo: null,
                            bar: undefined,
                            baz: 1,
                            roo: "string",
                            more: true
                          },
        expectedOutput  = cloneDeep(input);

    changePropertyValues(input, 'sex', changeSexToString);
    expect(input).toEqual(expectedOutput);
  });

  it("should convert male 'sex' properties to strings", function() {
    let input           = { sex: 0 },
        expectedOutput  = { sex: "male" };

    changePropertyValues(input, 'sex', changeSexToString);
    expect(input).toEqual(expectedOutput);
  });

  it("should convert female 'sex' properties to strings", function() {
    let input           = { sex: 1 },
        expectedOutput  = { sex: "female" };

    changePropertyValues(input, 'sex', changeSexToString);
    expect(input).toEqual(expectedOutput);
  });

  it("should convert nested 'sex' properties to strings", function() {
    let input           = { male: { sex: 0 }, female: { sex: 1 } },
        expectedOutput  = { male: { sex: "male" }, female: { sex: "female" } };

    changePropertyValues(input, 'sex', changeSexToString);
    expect(input).toEqual(expectedOutput);
  });

  it("should convert 'sex' properties in array objects to strings", function() {
    let input           = [ { sex: 0 }, { sex: 1 } ],
        expectedOutput  = [ { sex: "male" }, { sex: "female" } ];

    changePropertyValues(input, 'sex', changeSexToString);
    expect(input).toEqual(expectedOutput);
  });


});
