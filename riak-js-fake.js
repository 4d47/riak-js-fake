
/**
 * Fake version of the riak-js HttpClient.
 * It does not fake everything and anything,
 * only as much as i needed.
 */
exports.getClient = function() {

  var buckets = {}
  return {
    get:
      function(bucket, key, cb) {
        var error, data, meta
        if (buckets[bucket] && buckets[bucket][key]) {
          data = clone(buckets[bucket][key])
        }
        else {
          error = data = { statusCode: 404, notFound: true }
        }
        cb(error, data, meta)
      },
    exists:
      function(bucket, key, cb) {
        cb(undefined, buckets[bucket] && buckets[bucket][key])
      },
    save:
      function(bucket, key, data, meta, cb) {
        if(!buckets[bucket]) {
          buckets[bucket] = { }
        }
        buckets[bucket][key] = clone(data)
        cb()
      },
    remove:
      function(bucket, key, cb) {
        if(buckets[bucket]) {
          delete buckets[bucket][key]
        }
        cb()
      }
  }
}

function clone(a) {
  return JSON.parse(JSON.stringify(a))
}

