import { UserInputError } from 'apollo-server-express'
import { fromNow, toUnix } from '../lib'

// please put all blocking (promise) virtuals in model file
export const createVirtuals = (schema, commonName) => {
  schema.virtual('key').get(function () {
    return `${commonName.toLowerCase()}_${this._id}`
  })

  schema.virtual('createdAtAgo').get(function () {
    return fromNow(this.createdAt)
  })

  schema.virtual('updatedAtAgo').get(function () {
    return fromNow(this.updatedAt)
  })

  schema.virtual('createdAtUnix').get(function () {
    return toUnix(this.createdAt)
  })

  schema.virtual('updatedAtUnix').get(function () {
    return toUnix(this.updatedAt)
  })

  return schema
}

export const createStatics = (schema, commonName) => {
  schema.statics.ensureEnabed = async function (options) {
    // const worktowards = { ...options, enabled: true }

    const notExists = await this.where(options).countDocuments() === 0
    if (notExists) throw new UserInputError(`${commonName} does not exist`)

    const notEnabled = await this.where({ ...options, enabled: true }).countDocuments() === 0
    if (notEnabled) throw new UserInputError(`${commonName} is not enabled`)
  }

  schema.statics.returnCount = async function (options) {
    return this.where(options).countDocuments(options) || 0
  }

  return schema
}

export const commonToCoreSchemas = {
  name: {
    type: String,
    trim: true,
    sparse: true
  },
  note: {
    type: String,
    trim: true
  },
  imageURL: {
    type: String,
    trim: true
  },
  enabled: {
    type: Boolean,
    default: true,
    sparse: true
  },
  archived: {
    type: Boolean,
    default: false,
    sparse: true
  },
  order: {
    type: Number
  }
}
