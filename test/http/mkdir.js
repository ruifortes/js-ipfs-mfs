/* eslint-env mocha */
'use strict'

const expect = require('../helpers/chai')
const http = require('../helpers/http')
const sinon = require('sinon')

function defaultOptions (modification = {}) {
  const options = {
    parents: false,
    cidVersion: 0,
    format: 'dag-pb',
    hashAlg: 'sha2-256',
    flush: true,
    shardSplitThreshold: 1000,
    mode: undefined,
    mtime: undefined
  }

  Object.keys(modification).forEach(key => {
    options[key] = modification[key]
  })

  return options
}

describe('mkdir', () => {
  const path = '/foo'
  let ipfs

  beforeEach(() => {
    ipfs = {
      files: {
        mkdir: sinon.stub()
      }
    }
  })

  it('should make a directory', async () => {
    await http({
      method: 'POST',
      url: `/api/v0/files/mkdir?arg=${path}`
    }, { ipfs })

    expect(ipfs.files.mkdir.callCount).to.equal(1)
    expect(ipfs.files.mkdir.getCall(0).args).to.deep.equal([
      path,
      defaultOptions()
    ])
  })

  it('should make a directory with parents', async () => {
    await http({
      method: 'POST',
      url: `/api/v0/files/mkdir?arg=${path}&parents=true`
    }, { ipfs })

    expect(ipfs.files.mkdir.callCount).to.equal(1)
    expect(ipfs.files.mkdir.getCall(0).args).to.deep.equal([
      path,
      defaultOptions({
        parents: true
      })
    ])
  })

  it('should make a directory with a different cid version', async () => {
    await http({
      method: 'POST',
      url: `/api/v0/files/mkdir?arg=${path}&cidVersion=1`
    }, { ipfs })

    expect(ipfs.files.mkdir.callCount).to.equal(1)
    expect(ipfs.files.mkdir.getCall(0).args).to.deep.equal([
      path,
      defaultOptions({
        cidVersion: 1
      })
    ])
  })

  it('should make a directory with a different codec', async () => {
    await http({
      method: 'POST',
      url: `/api/v0/files/mkdir?arg=${path}&format=dag-cbor`
    }, { ipfs })

    expect(ipfs.files.mkdir.callCount).to.equal(1)
    expect(ipfs.files.mkdir.getCall(0).args).to.deep.equal([
      path,
      defaultOptions({
        format: 'dag-cbor'
      })
    ])
  })

  it('should make a directory with a different hash algorithm', async () => {
    await http({
      method: 'POST',
      url: `/api/v0/files/mkdir?arg=${path}&hashAlg=sha3-256`
    }, { ipfs })

    expect(ipfs.files.mkdir.callCount).to.equal(1)
    expect(ipfs.files.mkdir.getCall(0).args).to.deep.equal([
      path,
      defaultOptions({
        hashAlg: 'sha3-256'
      })
    ])
  })

  it('should make a directory without flushing', async () => {
    await http({
      method: 'POST',
      url: `/api/v0/files/mkdir?arg=${path}&flush=false`
    }, { ipfs })

    expect(ipfs.files.mkdir.callCount).to.equal(1)
    expect(ipfs.files.mkdir.getCall(0).args).to.deep.equal([
      path,
      defaultOptions({
        flush: false
      })
    ])
  })

  it('should make a directory a different shard split threshold', async () => {
    await http({
      method: 'POST',
      url: `/api/v0/files/mkdir?arg=${path}&shardSplitThreshold=10`
    }, { ipfs })

    expect(ipfs.files.mkdir.callCount).to.equal(1)
    expect(ipfs.files.mkdir.getCall(0).args).to.deep.equal([
      path,
      defaultOptions({
        shardSplitThreshold: 10
      })
    ])
  })

  it('should make a directory a different mode', async () => {
    const mode = '0513'
    await http({
      method: 'POST',
      url: `/api/v0/files/mkdir?arg=${path}&mode=${mode}`
    }, { ipfs })

    expect(ipfs.files.mkdir.callCount).to.equal(1)
    expect(ipfs.files.mkdir.getCall(0).args).to.deep.equal([
      path,
      defaultOptions({
        mode: parseInt(mode, 8)
      })
    ])
  })

  it('should make a directory a different mtime', async () => {
    await http({
      method: 'POST',
      url: `/api/v0/files/mkdir?arg=${path}&mtime=5`
    }, { ipfs })

    expect(ipfs.files.mkdir.callCount).to.equal(1)
    expect(ipfs.files.mkdir.getCall(0).args).to.deep.equal([
      path,
      defaultOptions({
        mtime: 5
      })
    ])
  })
})
