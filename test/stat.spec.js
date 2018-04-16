/* eslint-env mocha */
'use strict'

const chai = require('chai')
chai.use(require('dirty-chai'))
const expect = chai.expect
const fs = require('fs')
const path = require('path')

const {
  createMfs,
  EMPTY_DIRECTORY_HASH
} = require('./fixtures')

describe('stat', function () {
  this.timeout(30000)

  let mfs
  let smallFile
  let largeFile

  before(() => {
    return Promise.all([
      createMfs(),
      fs.readFile(path.join(__dirname, 'fixtures', 'small-file.txt')),
      fs.readFile(path.join(__dirname, 'fixtures', 'large-file.jpg'))
    ])
      .then(([instance, smallFileBuffer, largeFileBuffer]) => {
        mfs = instance
        smallFile = smallFileBuffer
        largeFile = largeFileBuffer
      })
  })

  after((done) => {
    mfs.node.stop(done)
  })

  it('refuses to stat files with an empty path', () => {
    return mfs.stat('')
      .then(() => expect.fail('No error was thrown for an empty path'))
      .catch(error => {
        expect(error.message).to.contain('paths must not be empty')
      })
  })

  it('refuses to lists files with an invalid path', () => {
    return mfs.stat('not-valid')
      .then(() => expect.fail('No error was thrown for an empty path'))
      .catch(error => {
        expect(error.message).to.contain('paths must start with a leading /')
      })
  })

  it('fails to stat non-existent file', () => {
    return mfs.stat('/i-do-not-exist')
      .then(() => expect.fail('No error was thrown for a non-existent file'))
      .catch(error => {
        expect(error.message).to.contain('file does not exist')
      })
  })

  it('stats an empty directory', () => {
    const path = '/empty-directory'

    return mfs.mkdir('/empty-directory')
      .then(() => mfs.stat(path))
      .then(stats => {
        expect(stats.size).to.equal(0)
        expect(stats.cumulativeSize).to.equal(4)
        expect(stats.childBlocks).to.equal(0)
        expect(stats.type).to.equal('directory')
      })
  })

  it('returns only a hash', () => {
    const path = '/empty-directory'

    return mfs.mkdir('/empty-directory')
      .then(() => mfs.stat(path, {
        hash: true
      }))
      .then(stats => {
        expect(Object.keys(stats).length).to.equal(1)
        expect(stats.hash).to.equal(EMPTY_DIRECTORY_HASH)
      })
  })

  it('returns only the size', () => {
    const path = '/empty-directory'

    return mfs.mkdir('/empty-directory')
      .then(() => mfs.stat(path, {
        size: true
      }))
      .then(stats => {
        expect(Object.keys(stats).length).to.equal(1)
        expect(stats.size).to.equal(4) // protobuf size?!
      })
  })

  it.skip('computes how much of the DAG is local', () => {

  })

  it('stats a small file', () => {
    const filePath = '/stat/small-file.txt'

    return mfs.write(filePath, smallFile, {
      parents: true
    })
      .then(() => mfs.stat(filePath))
      .then((stats) => {
        expect(stats.size).to.equal(smallFile.length)
        expect(stats.cumulativeSize).to.equal(21)
        expect(stats.childBlocks).to.equal(0)
        expect(stats.type).to.equal('file')
      })
  })

  it('stats a large file', () => {
    const filePath = '/stat/large-file.txt'

    return mfs.write(filePath, largeFile, {
      parents: true
    })
      .then(() => mfs.stat(filePath))
      .then((stats) => {
        expect(stats.size).to.equal(largeFile.length)
        expect(stats.cumulativeSize).to.equal(490800)
        expect(stats.childBlocks).to.equal(2)
        expect(stats.type).to.equal('file')
      })
  })
})
