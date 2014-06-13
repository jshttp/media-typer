
var typer = require('..')
var should = require('should')

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

describe('typer.parse(string)', function () {
  it('should parse basic type', function () {
    var type = typer.parse('text/html')
    type.type.should.equal('text')
    type.subtype.should.equal('html')
  })

  it('should parse with suffix', function () {
    var type = typer.parse('image/svg+xml')
    type.type.should.equal('image')
    type.subtype.should.equal('svg')
    type.suffix.should.equal('xml')
  })

  it('should parse parameters', function () {
    var type = typer.parse('text/html; charset=utf-8; foo=bar')
    type.type.should.equal('text')
    type.subtype.should.equal('html')
    type.parameters.should.have.property('charset', 'utf-8')
    type.parameters.should.have.property('foo', 'bar')
  })

  it('should lower-case type', function () {
    var type = typer.parse('IMAGE/SVG+XML')
    type.type.should.equal('image')
    type.subtype.should.equal('svg')
    type.suffix.should.equal('xml')
  })

  it('should lower-case parameter names', function () {
    var type = typer.parse('text/html; Charset=UTF-8')
    type.parameters.should.have.property('charset', 'UTF-8')
  })

  it('should unquote parameter values', function () {
    var type = typer.parse('text/html; charset="UTF-8"')
    type.parameters.should.have.property('charset', 'UTF-8')
  })

  it('should unquote parameter values with escapes', function () {
    var type = typer.parse('text/html; charset = "UT\\F-\\\\\\"8\\""')
    type.parameters.should.have.property('charset', 'UTF-\\"8"')
  })

  it('should handle balanced quotes', function () {
    var type = typer.parse('text/html; param="charset=\\"utf-8\\"; foo=bar"; bar=foo')
    Object.keys(type.parameters).length.should.equal(2)
    type.parameters.should.have.property('param', 'charset="utf-8"; foo=bar')
    type.parameters.should.have.property('bar', 'foo')
  })

  invalidTypes.forEach(function (type) {
    it('should throw on invalid media type ' + type, function () {
      typer.parse.bind(null, type).should.throw(/invalid media type/)
    })
  })

  it('should require argument', function () {
    typer.parse.should.throw(/string.*required/)
  })
})
