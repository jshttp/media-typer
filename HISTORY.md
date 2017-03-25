unreleased
==========

  * Remove parameter handling, which is outside RFC 6838 scope
  * Remove `parse(req)` and `parse(res)` signatures
    - Use the `content-type` module for content type parsing
  * perf: use a class for object creation

0.3.0 / 2014-09-07
==================

  * Support Node.js 0.6
  * Throw error when parameter format invalid on parse

0.2.0 / 2014-06-18
==================

  * Add `typer.format()` to format media types

0.1.0 / 2014-06-17
==================

  * Accept `req` as argument to `parse`
  * Accept `res` as argument to `parse`
  * Parse media type with extra LWS between type and first parameter

0.0.0 / 2014-06-13
==================

  * Initial implementation
