import { Router } from 'express'
import { return4ByteKey, returnTable, mysqlQuery } from '../lib'

export default Router().get('/', async (req, res) => {
  // can put promises here

  const password = return4ByteKey()

  const query = `
    SELECT * FROM

    ${returnTable('log')}
  `

  const params = []

  const [rows] = await mysqlQuery({ query, params })

  return res.status(200).render('root', { password, logs: JSON.stringify(rows) })
})
