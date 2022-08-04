import mysql from 'mysql2/promise'

import { validateLogContextInput } from '../validation'

const { MAIN_DB_HOST: host, MAIN_DB_USERNAME: user, MAIN_DB_PASSWORD: password, MAIN_DB_NAME } = process.env

export const mysqlQuery = async args => {
  if (!args) throw new Error('mysqlQuery requires `args`')

  const { query, params = [] } = args
  if (!query) throw new Error('mysqlQuery requires `query`')

  try {
    const connection = await mysql.createConnection({
      host,
      user,
      password
    })

    const result = await connection.execute(query, params)

    connection.end()

    return result
  } catch (err) {
    throw new Error(err)
  }
}

export const returnTable = () => '`' + MAIN_DB_NAME + '`.' + 'log'

export const logContext = async input => {
  try {
    await validateLogContextInput.validateAsync(input, { abortEarly: false })

    const { description } = input

    const query = `
      INSERT INTO
      ${returnTable('log')}
      (description)
      VALUES
      ('${description}')
    `

    const params = []

    return mysqlQuery({ host, query, params })
  } catch (err) {
    console.error('logContext err', err)
    throw new Error(err)
  }
}
