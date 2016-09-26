/*
 * Set up jsdom and load BioLogical globally as a precursor for all tests.
 * See http://stackoverflow.com/a/32999208 and
 *     https://github.com/facebook/react/issues/5046#issuecomment-146222515
 * for details of why it's necessary to set up jsdom in a separate file
 * which is '--require'd on the mocha command line so that the dom is ready
 * when required by the other tests.
 *
 * We take this opportunity to load BioLogica globally for all tests as well.
 */
import fs from 'fs';
import vm from 'vm';
import jsdom from 'jsdom';

// Make libraries available to all tests (http://stackoverflow.com/a/31290131)
import {assert} from 'chai';
import {mount,shallow} from 'enzyme';
import React from 'react';
import chai from 'chai';
// import chaiImmutable from 'chai-immutable';

// chai.use(chaiImmutable);

global.assert = assert;
global.chai = chai;
global.mount = mount;
global.shallow = shallow;
global.React = React;

function execScript(path, context) {
  context = context || {};
  var data = fs.readFileSync(path, 'utf8');
  data = data.replace(/window\./g, '');
  vm.runInNewContext(data, context, path);
  return context;
}

if (typeof document === 'undefined') {
  global.document = jsdom.jsdom('<!doctype html><html><body></body></html>');
  global.window = document.defaultView;
  global.navigator = global.window.navigator;

  execScript('./bower_components/biologica.js/dist/biologica.js', global);
}
