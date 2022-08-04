import { User } from '../models'
import { validateQueryUserInput, validateUpdateProfileInput } from '../validation'
import { returnTrustedUser, findDocuments, findDocument, updateDocument } from '../logic'

export default {
  Query: {
    users: async (root, args, { req, res }, info) => findDocuments(User),
    user: async (root, args, { req, res }, info) => {
      const { queryUserInput } = args

      await validateQueryUserInput.validateAsync(queryUserInput, { abortEarly: false })

      const { userId: _id } = queryUserInput
      return findDocument(User, { _id })
    },
    me: async (root, args, { req, res }, info) => returnTrustedUser(req),
    profile: async (root, args, { req, res }, info) => {
      const user = await returnTrustedUser(req)

      return user
    }
  },
  Mutation: {
    updateProfile: async (root, args, { req, res }, info) => {
      const { updateProfileInput } = args

      await validateUpdateProfileInput.validateAsync(updateProfileInput, { abortEarly: false })

      const { _id } = await returnTrustedUser(req)

      return updateDocument(User, _id, updateProfileInput)
    }
  }
}
