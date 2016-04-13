# GeniBlocks

GeniBlocks is a collection of small, modular React components that can be
used as building blocks for genetics-based applications.

As much as possible, the views are designed to be "dumb," stateless views
that render entirely based on their properties, and output events that an
outside container or application can handle. As such, most of the views
can be written as [Stateless functional components](https://facebook.github.io/react/blog/2015/10/07/react-v0.14.html#stateless-functional-components).

Many views take a [Biologica.js](https://github.com/concord-consortium/biologica.js)
organism as a property.

## Development Setup

    npm install
    bower install
    gulp

in a separate shell/console:

    live-server public

and navigate to http://localhost:8080/

### Deploy Examples to gh-pages

    gulp deploy

## Structure

The code is written in ES2015 and JSX, which is transformed using Babel. We use
browserify to build `app.js` into the global object `GeniBlocks`.

This project aims to be a lightweight library for consumption by other applications.
Its built products are therefore simply `dist/app.js` and `dist/app.css`, and we
do not bundle up React or Biologica.js with the product.

Demos and tests are created in `/examples`, and are built into `/public`, along
with duplicates of the built scripts, css, and the vendor libraries (React and
biologica.js), allowing `/public` to be a secondary, stand-alone build product for
development and deploying demos.

## Code Linting

Run `npm run lint` to lint from the command line.

If you are using Sublime, install the `SublimeLinter` and `SublimeLinter-contrib-es6`
packages, using https://packagecontrol.io/

(You will also probably want ES6 syntax highlighting, so install `Babel` as well.)

## Code Testing

Run `npm test` to run unit tests from the command line.

## Resources

* [Demo site](http://concord-consortium.github.io/geniblocks/)
* [Geniverse](geniverse-lab.concord.org)
* [Biologica.js](https://github.com/concord-consortium/biologica.js)

## License

MIT License. See full text at license.md.

