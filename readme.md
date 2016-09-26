# GeniBlocks
[![Build Status](https://travis-ci.org/concord-consortium/geniblocks.svg?branch=master)](https://travis-ci.org/concord-consortium/geniblocks)

This repo contains the React-based "Geniverse-2.0" project, as well as an
independent collection of small, modular React components ("GeniBlocks")
that can be used as building blocks for other genetics-based applications.

### GeniBlocks components

The GeniBlocks components are a collection of "dumb" stateless views
that render entirely based on their properties, and output events that an
outside container or application can handle. As such, most of the views
can be written as [Stateless functional components](https://facebook.github.io/react/blog/2015/10/07/react-v0.14.html#stateless-functional-components).

Many views take a [Biologica.js](https://github.com/concord-consortium/biologica.js)
organism as a property.

The components are used by Geniverse-2.0, but are also built as their to /dist
as their own independent React component library. The examples in /public/examples
all use the GeniBlocks library this way.

## Development Setup

    npm install
    bower install
    gulp                  # or its alias 'npm run build:watch'

or to build without watching:

    gulp clean-and-build  # or its alias 'npm run build'

in a separate shell/console:

    npm run gv2           # or its alias 'live-server public/gv2'

which will launch a browser tab pointing to the gv2 app at http://localhost:8080/, or

    npm run examples      # or its alias `live-server public/examples`

which will launch a browser tab pointing to the examples page.

### Deploy Examples to gh-pages

    gulp deploy           # or its alias 'npm run deploy'

## Structure

The code is written in ES2015+ and JSX, which is transformed using Babel. We use
browserify to build `geniblocks.js` into the global object `GeniBlocks`.

This project aims to be a lightweight library for consumption by other applications.
Its built products are therefore simply `dist/geniblocks.js` and `dist/geniblocks.css`,
and we do not bundle React or Biologica.js with the library. The `GV2` sample application
is currently built along with the `GeniBlocks` lib and is installed into the `/public`
folder along with the other examples as described below. Eventually, it will presumably
become a separate project in its own right but for now it's convenient to keep them together.

Demos and tests are created in `/examples`, and are built into `/public`, along
with duplicates of the built scripts, css, and the vendor libraries (React and
biologica.js), allowing `/public` to be a secondary, stand-alone build product for
development and deploying demos.

## Code Linting

Run `npm run lint` to lint from the command line.

If you are using Sublime, install the `SublimeLinter` and `SublimeLinter-contrib-es6`
packages, using https://packagecontrol.io/

(You will also probably want ES6 syntax highlighting, so install the `Babel` package as well.)

## Code Testing

Run `npm test` to run unit tests from the command line.

## Using Redux DevTools

See [https://github.com/zalmoxisus/redux-devtools-extension](https://github.com/zalmoxisus/redux-devtools-extension).

1. Install Chrome extension from [Chrome Web Store](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd)
2. While in GV2 app, open Developer Console and select "Redux" tab (may need to restart console to see this)
3. Or click the DevTools icon (greenish atom) to open tools in separate window

Now you can see a list of actions and state changes, a history slider, have the ability to export and import state and history, and fire actions directly from the tool panel.

## Resources

* [GeniBlocks Examples](http://concord-consortium.github.io/geniblocks/examples)
* [GV2 Prototype](http://concord-consortium.github.io/geniblocks/gv2/)
* [Geniverse Demo](http://demo.geniverse.concord.org)
* [Geniverse Lab](https://geniverse-lab.concord.org)
* [Biologica.js](http://github.com/concord-consortium/biologica.js)

## License

MIT License. See full text at license.md.

