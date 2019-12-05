'use strict'

const Joi = require('./utils/joi')

const mfsChmod = {
  method: 'POST',
  path: '/api/v0/files/chmod',
  async handler (request, h) {
    const {
      ipfs
    } = request.server.app
    const {
      arg,
      mode,
      recursive,
      codec,
      hashAlg,
      flush,
      shardSplitThreshold
    } = request.query

    await ipfs.files.chmod(arg, mode, {
      recursive,
      format: codec,
      hashAlg,
      flush,
      shardSplitThreshold
    })

    return h.response()
  },
  options: {
    validate: {
      options: {
        allowUnknown: true,
        stripUnknown: true
      },
      query: Joi.object().keys({
        arg: Joi.string(),
        mode: Joi.octalNumber(),
        recursive: Joi.boolean().default(false),
        flush: Joi.boolean().default(true),
        codec: Joi.string().default('dag-pb'),
        hashAlg: Joi.string().default('sha2-256'),
        shardSplitThreshold: Joi.number().integer().min(0).default(1000)
      })
    }
  }
}

module.exports = mfsChmod
