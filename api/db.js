const mysql = require('mysql')

module.exports = app => {
  let pool = null

  this.connect = () => {
    pool = mysql.createConnection({
      host: app.get('dbHost'),
      port: app.get('dbPort'),
      user: app.get('dbUser'),
      password: app.get('dbPassword'),
      database: app.get('dbDatabase')
    })

    pool.config.queryFormat = function (query, values) {
      if (!values) return query
      return query.replace(/:(\w+)/g, (txt, key) => {
        if (values.hasOwnProperty(key)) {
          return this.escape(values[key])
        }
        return txt
      })
    }
  }

  this.get = () => pool

  this.end = () => { pool.end() }

  return this
}
