// Copyright (c) 2025 NTT InfraNet
const tap = require('tap')
const { getPage, getTotalPages, hasNext, hasPrev } = require('./pagination')

tap.test('pagination/getPage', async t => {
  t.equal(getPage(0, 10), 0)
  t.equal(getPage(5, 10), 0)
  t.equal(getPage(10, 10), 1)
  t.equal(getPage(20, 10), 2)
})

tap.test('pagination/getTotalPages', async t => {
  t.equal(getTotalPages(0, 10), 0)
  t.equal(getTotalPages(1, 10), 1)
  t.equal(getTotalPages(10, 10), 1)
  t.equal(getTotalPages(11, 10), 2)
  t.equal(getTotalPages(20, 10), 2)
  t.equal(getTotalPages(21, 10), 3)
})

tap.test('pagination/hasNext', async t => {
  t.notOk(hasNext(0, 10, 0))
  t.notOk(hasNext(0, 10, 1))
  t.ok(hasNext(0, 10, 11))
  t.notOk(hasNext(10, 10, 20))
  t.ok(hasNext(10, 10, 21))
})

tap.test('pagination/hasPrev', async t => {
  t.notOk(hasPrev(0, 10))
  t.notOk(hasPrev(1, 10))
  t.ok(hasPrev(10, 10))
  t.ok(hasPrev(20, 10))
  t.ok(hasPrev(21, 10))
})
