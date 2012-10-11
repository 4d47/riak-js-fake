
var
  assert = require('assert'),
  riakjs = require('./riak-js-fake.js'),
  client

describe('riak-js-fake', function() {

  beforeEach(function() {
    client = riakjs.getClient()
  })

  describe('#save()', function() {

    it("should save on non-existant key", function(done) {
      client.save('bucket', 'key', 'foo', {}, function() {
        assert.ok(true)
        done()
      })
    })

    it("should save with existant key", function(done) {
      client.save('bucket', 'key', 'bar', {}, function() {
        assert.ok(true)
        done()
      })
    })

    it("should not save references", function(done) {
      var data = { name: 'bob' }
      client.save('bucket', 'a', data, {}, function() {
        data.name = 'mike'
        client.get('bucket', 'a', function(error, data) {
          assert.equal(data.name, 'bob')
          done()
        })
      })
    })
  })

  describe('#exists()', function() {

    it("should return falsy with non-existant key", function(done) {
      client.exists('bucket', 'non', function(error, data) {
        assert.equal(!!data, false)
        done()
      })
    })

    it("should return truy with existant key", function(done) {
      client.save('bucket', 'key', 'foo', {}, function() {
        client.exists('bucket', 'key', function(error, data) {
          assert.equal(!!data, true)
          done()
        })
      })
    })
  })

  describe('#get()', function() {

    it("should be able to get saved data", function(done) {
      client.save('bucket', 'key', 'foo', {}, function() {
        client.get('bucket', 'key', function(error, data) {
          assert.equal(data, 'foo')
          done()
        })
      })
    })
  })

  describe('#remove()', function() {

    it("should not bother about deleting non-existant keys", function(done) {
      client.remove('bucket', 'asdf', function() {
        done()
      })
    })

    it("should effectively remove key from bucket", function(done) {
      client.save('bucket', 'key', 'foo', {}, function() {
        client.remove('bucket', 'key', function() {
          client.exists('bucket', 'key', function(error, data) {
            assert.equal(!!data, false)
            done()
          })
        })
      })
    })
  })

  describe('multiple clients', function() {

    it("should not interact with each other", function(done) {
      client.save('bucket', 'a', true, {}, function() {
        riakjs.getClient().exists('bucket', 'a', function(error, data) {
          assert.equal(!!data, false)
          done()
        })
      })
    })
  })
})

