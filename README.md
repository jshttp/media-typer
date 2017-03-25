# media-typer

[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][downloads-url]
[![Node.js Version][node-version-image]][node-version-url]
[![Build Status][travis-image]][travis-url]
[![Test Coverage][coveralls-image]][coveralls-url]

Simple RFC 6838 media type parser.

This module will parse a given media type into it's component parts, like type,
subtype, and suffix. A formatter is also provided to put them back together and
the two can be combined to normalize media types into a canonical form.

If you are looking to parse the string that represents a media type and it's
parameters in HTTP (for example, the `Content-Type` header), use the
[content-type module](https://www.npmjs.com/package/content-type).

## Installation

This is a [Node.js](https://nodejs.org/en/) module available through the
[npm registry](https://www.npmjs.com/). Installation is done using the
[`npm install` command](https://docs.npmjs.com/getting-started/installing-npm-packages-locally):

```sh
$ npm install media-typer
```

## API

<!-- eslint-disable no-unused-vars -->

```js
var typer = require('media-typer')
```

### typer.parse(string)

<!-- eslint-disable no-undef, no-unused-vars -->

```js
var obj = typer.parse('image/svg+xml')
```

Parse a media type string. This will return an object with the following
properties (examples are shown for the string `'image/svg+xml; charset=utf-8'`):

 - `type`: The type of the media type (always lower case). Example: `'image'`

 - `subtype`: The subtype of the media type (always lower case). Example: `'svg'`

 - `suffix`: The suffix of the media type (always lower case). Example: `'xml'`

### typer.format(obj)

<!-- eslint-disable no-undef, no-unused-vars -->

```js
var obj = typer.format({type: 'image', subtype: 'svg', suffix: 'xml'})
```

Format an object into a media type string. This will return a string of the
mime type for the given object. For the properties of the object, see the
documentation for `typer.parse(string)`.

## License

[MIT](LICENSE)

[npm-image]: https://img.shields.io/npm/v/media-typer.svg
[npm-url]: https://npmjs.org/package/media-typer
[node-version-image]: https://img.shields.io/node/v/media-typer.svg
[node-version-url]: https://nodejs.org/en/download/
[travis-image]: https://img.shields.io/travis/jshttp/media-typer.svg
[travis-url]: https://travis-ci.org/jshttp/media-typer
[coveralls-image]: https://img.shields.io/coveralls/jshttp/media-typer.svg
[coveralls-url]: https://coveralls.io/r/jshttp/media-typer
[downloads-image]: https://img.shields.io/npm/dm/media-typer.svg
[downloads-url]: https://npmjs.org/package/media-typer
