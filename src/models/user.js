import { Schema } from 'mongoose'
import { connectDatabase } from '../lib'
import { createVirtuals, createStatics, commonToCoreSchemas } from './common'

const commonName = 'User'

const userSchema = new Schema(
  {
    ...commonToCoreSchemas,
    googleUserId: {
      type: String,
      trim: true,
      unique: true
    }
  },
  {
    timestamps: true,
    toObject: { virtuals: true }
  }
)

createVirtuals(userSchema, commonName)
createStatics(userSchema, commonName)

const User = connectDatabase().model(commonName, userSchema, 'user')

export default User
