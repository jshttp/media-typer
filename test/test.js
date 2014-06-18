
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

describe('typer.format(obj)', function () {
  it('should format basic type', function () {
    var str = typer.format({type: 'text', subtype: 'html'})
    str.should.equal('text/html')
  })

  it('should format type with suffix', function () {
    var str = typer.format({type: 'image', subtype: 'svg', suffix: 'xml'})
    str.should.equal('image/svg+xml')
  })

  it('should format type with parameter', function () {
    var str = typer.format({
      type: 'text',
      subtype: 'html',
      parameters: {charset: 'utf-8'}
    })
    str.should.equal('text/html; charset=utf-8')
  })

  it('should format type with parameter that needs quotes', function () {
    var str = typer.format({
      type: 'text',
      subtype: 'html',
      parameters: {foo: 'bar or "baz"'}
    })
    str.should.equal('text/html; foo="bar or \\"baz\\""')
  })

  it('should format type with parameter with empty value', function () {
    var str = typer.format({
      type: 'text',
      subtype: 'html',
      parameters: {foo: ''}
    })
    str.should.equal('text/html; foo=""')
  })

  it('should format type with multiple parameters', function () {
    var str = typer.format({
      type: 'text',
      subtype: 'html',
      parameters: {charset: 'utf-8', foo: 'bar', bar: 'baz'}
    })
    str.should.equal('text/html; bar=baz; charset=utf-8; foo=bar')
  })

  it('should require argument', function () {
    typer.format.should.throw(/obj.*required/)
  })

  it('should reject non-objects', function () {
    typer.format.bind(null, 7).should.throw(/obj.*required/)
  })

  it('should require type', function () {
    typer.format.bind(null, {}).should.throw(/invalid type/)
  })

  it('should reject invalid type', function () {
    typer.format.bind(null, {type: 'text/'}).should.throw(/invalid type/)
  })

  it('should require subtype', function () {
    typer.format.bind(null, {type: 'text'}).should.throw(/invalid subtype/)
  })

  it('should reject invalid subtype', function () {
    typer.format.bind(null, {type: 'text', subtype: 'html/'}).should.throw(/invalid subtype/)
  })

  it('should reject invalid suffix', function () {
    var obj = {type: 'image', subtype: 'svg', suffix: 'xml\\'}
    typer.format.bind(null, obj).should.throw(/invalid suffix/)
  })

  it('should reject invalid parameter name', function () {
    var obj = {type: 'image', subtype: 'svg', parameters: {'foo/': 'bar'}}
    typer.format.bind(null, obj).should.throw(/invalid parameter name/)
  })

  it('should reject invalid parameter value', function () {
    var obj = {type: 'image', subtype: 'svg', parameters: {'foo': 'bar\u0000'}}
    typer.format.bind(null, obj).should.throw(/invalid parameter value/)
  })
})

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

  it('should parse parameters with extra LWS', function () {
    var type = typer.parse('text/html ; charset=utf-8 ; foo=bar')
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

  it('should reject non-strings', function () {
    typer.parse.bind(null, 7).should.throw(/string.*required/)
  })
})

describe('typer.parse(req)', function () {
  it('should parse content-type header', function () {
    var req = {headers: {'content-type': 'text/html'}}
    var type = typer.parse(req)
    type.type.should.equal('text')
    type.subtype.should.equal('html')
  })

  it('should reject objects without headers property', function () {
    typer.parse.bind(null, {}).should.throw(/string.*required/)
  })

  it('should reject missing content-type', function () {
    var req = {headers: {}}
    typer.parse.bind(null, req).should.throw(/string.*required/)
  })
})

describe('typer.parse(res)', function () {
  it('should parse content-type header', function () {
    var res = {getHeader: function(){ return 'text/html'}}
    var type = typer.parse(res)
    type.type.should.equal('text')
    type.subtype.should.equal('html')
  })

  it('should reject objects without getHeader method', function () {
    typer.parse.bind(null, {}).should.throw(/string.*required/)
  })

  it('should reject missing content-type', function () {
    var res = {getHeader: function(){}}
    typer.parse.bind(null, res).should.throw(/string.*required/)
  })
})
