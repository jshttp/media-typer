
var assert = require('assert')
var typer = require('..')

var invalidTypes = [
  ' ',
  'null',
  'undefined',
  '/',
  'text/;plain',
  'text/"plain"',
  'text/p£ain',
  'text/(plain)',
  'text/@plain',
  'text/plain,wrong',
]

describe('typer.format(obj)', function () {
  it('should format basic type', function () {
    var str = typer.format({type: 'text', subtype: 'html'})
    assert.equal(str, 'text/html')
  })

  it('should format type with suffix', function () {
    var str = typer.format({type: 'image', subtype: 'svg', suffix: 'xml'})
    assert.equal(str, 'image/svg+xml')
  })

  it('should format type with parameter', function () {
    var str = typer.format({
      type: 'text',
      subtype: 'html',
      parameters: {charset: 'utf-8'}
    })
    assert.equal(str, 'text/html; charset=utf-8')
  })

  it('should format type with parameter that needs quotes', function () {
    var str = typer.format({
      type: 'text',
      subtype: 'html',
      parameters: {foo: 'bar or "baz"'}
    })
    assert.equal(str, 'text/html; foo="bar or \\"baz\\""')
  })

  it('should format type with parameter with empty value', function () {
    var str = typer.format({
      type: 'text',
      subtype: 'html',
      parameters: {foo: ''}
    })
    assert.equal(str, 'text/html; foo=""')
  })

  it('should format type with multiple parameters', function () {
    var str = typer.format({
      type: 'text',
      subtype: 'html',
      parameters: {charset: 'utf-8', foo: 'bar', bar: 'baz'}
    })
    assert.equal(str, 'text/html; bar=baz; charset=utf-8; foo=bar')
  })

  it('should require argument', function () {
    assert.throws(typer.format.bind(null), /obj.*required/)
  })

  it('should reject non-objects', function () {
    assert.throws(typer.format.bind(null, 7), /obj.*required/)
  })

  it('should require type', function () {
    assert.throws(typer.format.bind(null, {}), /invalid type/)
  })

  it('should reject invalid type', function () {
    assert.throws(typer.format.bind(null, {type: 'text/'}), /invalid type/)
  })

  it('should require subtype', function () {
    assert.throws(typer.format.bind(null, {type: 'text'}), /invalid subtype/)
  })

  it('should reject invalid subtype', function () {
    var obj = {type: 'text', subtype: 'html/'}
    assert.throws(typer.format.bind(null, obj), /invalid subtype/)
  })

  it('should reject invalid suffix', function () {
    var obj = {type: 'image', subtype: 'svg', suffix: 'xml\\'}
    assert.throws(typer.format.bind(null, obj), /invalid suffix/)
  })

  it('should reject invalid parameter name', function () {
    var obj = {type: 'image', subtype: 'svg', parameters: {'foo/': 'bar'}}
    assert.throws(typer.format.bind(null, obj), /invalid parameter name/)
  })

  it('should reject invalid parameter value', function () {
    var obj = {type: 'image', subtype: 'svg', parameters: {'foo': 'bar\u0000'}}
    assert.throws(typer.format.bind(null, obj), /invalid parameter value/)
  })
})

describe('typer.parse(string)', function () {
  it('should parse basic type', function () {
    var type = typer.parse('text/html')
    assert.equal(type.type, 'text')
    assert.equal(type.subtype, 'html')
  })

  it('should parse with suffix', function () {
    var type = typer.parse('image/svg+xml')
    assert.equal(type.type, 'image')
    assert.equal(type.subtype, 'svg')
    assert.equal(type.suffix, 'xml')
  })

  it('should parse parameters', function () {
    var type = typer.parse('text/html; charset=utf-8; foo=bar')
    assert.equal(type.type, 'text')
    assert.equal(type.subtype, 'html')
    assert.deepEqual(type.parameters, {
      charset: 'utf-8',
      foo: 'bar'
    })
  })

  it('should parse parameters with extra LWS', function () {
    var type = typer.parse('text/html ; charset=utf-8 ; foo=bar')
    assert.equal(type.type, 'text')
    assert.equal(type.subtype, 'html')
    assert.deepEqual(type.parameters, {
      charset: 'utf-8',
      foo: 'bar'
    })
  })

  it('should lower-case type', function () {
    var type = typer.parse('IMAGE/SVG+XML')
    assert.equal(type.type, 'image')
    assert.equal(type.subtype, 'svg')
    assert.equal(type.suffix, 'xml')
  })

  it('should lower-case parameter names', function () {
    var type = typer.parse('text/html; Charset=UTF-8')
    assert.deepEqual(type.parameters, {
      charset: 'UTF-8'
    })
  })

  it('should unquote parameter values', function () {
    var type = typer.parse('text/html; charset="UTF-8"')
    assert.deepEqual(type.parameters, {
      charset: 'UTF-8'
    })
  })

  it('should unquote parameter values with escapes', function () {
    var type = typer.parse('text/html; charset = "UT\\F-\\\\\\"8\\""')
    assert.deepEqual(type.parameters, {
      charset: 'UTF-\\"8"'
    })
  })

  it('should handle balanced quotes', function () {
    var type = typer.parse('text/html; param="charset=\\"utf-8\\"; foo=bar"; bar=foo')
    assert.deepEqual(type.parameters, {
      param: 'charset="utf-8"; foo=bar',
      bar: 'foo'
    })
  })

  invalidTypes.forEach(function (type) {
    it('should throw on invalid media type ' + type, function () {
      assert.throws(typer.parse.bind(null, type), /invalid media type/)
    })
  })

  it('should throw on invalid parameter format', function () {
    assert.throws(typer.parse.bind(null, 'text/plain; foo="bar'), /invalid parameter format/)
    assert.throws(typer.parse.bind(null, 'text/plain; profile=http://localhost; foo=bar'), /invalid parameter format/)
    assert.throws(typer.parse.bind(null, 'text/plain; profile=http://localhost'), /invalid parameter format/)
  })

  it('should require argument', function () {
    assert.throws(typer.parse.bind(null), /string.*required/)
  })

  it('should reject non-strings', function () {
    assert.throws(typer.parse.bind(null, 7), /string.*required/)
  })
})
