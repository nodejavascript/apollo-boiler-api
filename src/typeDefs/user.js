import { gql } from 'apollo-server-express'
import { commonToCoreQueries, commonToCoreMutations } from './common'

export default gql`
  extend type Query {
    users: [User] @admin
    user (queryUserInput: QueryUserInput!): User @admin
    me: Me @authenticated
    profile: User @authenticated
  }

  extend type Mutation {
    updateProfile (updateProfileInput: UpdateProfileInput!):  User @authenticated
  }

  type Me {
    ${commonToCoreQueries}
    googleUserId: String
  }

  input QueryUserInput {
    userId: ID
  }

  input UpdateProfileInput {
    ${commonToCoreMutations}
  }

  type User {
    ${commonToCoreQueries}
    googleUserId: String
  }

`
