import { gql } from 'apollo-server-express'

export default gql`
  extend type Query {
    posts: [Object]
  }


  type Post {
    userId: Int
    id: Int
    title: String
    body: String
  }
`
