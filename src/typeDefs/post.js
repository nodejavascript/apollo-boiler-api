import { gql } from 'apollo-server-express'

export default gql`
  extend type Query {
    posts (title: String): [Post]
  }


  type Post {
    userId: Int
    id: Int
    title: String
    body: String
  }
`
