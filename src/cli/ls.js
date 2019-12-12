'use strict'

const all = require('it-all')
const {
  print,
  asBoolean
} = require('./utils')
const {
  FILE_SEPARATOR
} = require('../core/utils/constants')

module.exports = {
  command: 'ls [path]',

  describe: 'List mfs directories',

  builder: {
    long: {
      alias: 'l',
      type: 'boolean',
      default: false,
      coerce: asBoolean,
      describe: 'Use long listing format.'
    },
    sort: {
      alias: 's',
      type: 'boolean',
      default: true,
      coerce: asBoolean,
      describe: 'Sort entries by name'
    },
    'cid-base': {
      default: 'base58btc',
      describe: 'CID base to use.'
    }
  },

  handler (argv) {
    const {
      path,
      getIpfs,
      long,
      sort,
      cidBase
    } = argv

    argv.resolve((async () => {
      const ipfs = await getIpfs()

      const printListing = file => {
        if (long) {
          print(`${file.name}\t${file.cid.toString(cidBase)}\t${file.size}`)
        } else {
          print(file.name)
        }
      }

      // https://github.com/ipfs/go-ipfs/issues/5181
      if (sort) {
        let files = await all(ipfs.files.ls(path || FILE_SEPARATOR))

        files = files.sort((a, b) => {
          return a.name.localeCompare(b.name)
        })

        files.forEach(printListing)
        return
      }

      for await (const file of ipfs.files.ls(path)) {
        printListing(file)
      }
    })())
  }
}
