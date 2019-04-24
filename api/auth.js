const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

module.exports = app => {
  this.verify = (req, res, next) => {
    let token = req.headers['x-access-token']
    if (token) {
      jwt.verify(token, app.get('secret'), (err, decoded) => {
        if (err) res.sendStatus(401)
        else {
          app.api.db.connect()

          let table = decoded.admin ? 'admin' : 'user'
          let user = {
            id: decoded.user_id,
            username: decoded.user_username,
            email: decoded.user_email
          }

          let query = `SELECT *
                       FROM ${ table }s
                       WHERE ${ table }_id = :id
                        AND ${ table }_username = :username
                        AND ${ table }_email = :email
                        AND ${ table }_status = 1`

          app.api.db.get().query(query, user, (err, row) => {
            if (err) res.sendStatus(500)
            if (row.length > 0) {
              req.user_role_id = decoded.admin ? 1 : row[0].user_role_id
              req.admin = decoded.admin
              next()
            } else {
              res.sendStatus(401)
            }
            app.api.db.end()
          })
        }
      })
    } else {
      return res.sendStatus(401)
    }
  }

  this.authenticate = (req, res) => {
    app.api.db.connect()

    let table = req.params.admin ? 'admin' : 'user'

    let user = {
      username: req.body.username
    }

    let query = `SELECT *
                  FROM ${ table }s
                  WHERE ${ table }_username = :username
                    AND ${ table }_status = 1
                  LIMIT 1`

    app.api.db.get().query(query, user, (err, row) => {
      if (err) res.sendStatus(500)
      if (row.length > 0) {
        bcrypt.compare(req.body.password, row[0][table + '_password'], (err, result) => {
          if (err) res.sendStatus(401)
          if (result) {
            jwt.sign({
              user_id: row[0][table + '_id'],
              user_company_id: row[0][table + '_company_id'],
              user_name: row[0][table + '_name'],
              user_username: row[0][table + '_username'],
              user_email: row[0][table + '_email'],
              user_role_id: row[0][table + '_role_id'],
              admin: req.params.admin
            }, app.get('secret'), { expiresIn: app.get('tokenDuration') }, (err, token) => {
              if (err) res.sendStatus(500)
              if (token) res.status(200).send({ token })
            })
          } else {
            res.sendStatus(401)
          }
        })
      } else {
        res.sendStatus(401)
      }

      app.api.db.end()
    })
  }

  return this
}
