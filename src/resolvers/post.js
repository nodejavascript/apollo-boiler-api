import fetch from 'node-fetch'
console.log('fetch'.fetch)
// investigate and use ESM if possible

export default {
  Query: {
    posts: async (root, args, { req, res }, info) => {
      const uri = 'https://www.scalablepath.com/api/test/test-posts'
      const response = await fetch(uri)
      return response.json()
    }
  }
}
