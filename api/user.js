const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

module.exports = app => {
  this.insert = (req, res) => {
    if (![1, 2].includes(req.user_role_id)) res.sendStatus(401)
    else {
      bcrypt.hash(req.body.user_password, app.get('saltRounds'), (err, hash) => {
        if (err) {
          console.log(err)
          res.sendStatus(500)
        } else {
          app.api.db.connect()

          let datetime = (new Date()).toJSON().split('T')
          let date = datetime[0]
          let time = datetime[1].substring(0, 8)
          let user = {
            'user_id': app.utils.misc.getId(),
            'user_company_id': req.body.user_company_id,
            'user_name': req.body.user_name,
            'user_username': req.body.user_username,
            'user_password': hash,
            'user_email': req.body.user_email,
            'user_role_id': req.body.user_role_id,
            'user_status': 1,
            'user_created': `${ date } ${ time }`
          }

          let query = `INSERT INTO users
                      (user_id, user_company_id, user_name, user_username, user_password, user_email, user_role_id, user_status, user_created)
                     VALUES
                      (:user_id, :user_company_id, :user_name, :user_username, :user_password, :user_email, :user_role_id, :user_status, :user_created)`

          app.api.db.get().query(query, user, (err, row) => {
            if (err) {
              console.log(err)
              if (err.code === 'ER_DUP_ENTRY') res.status(400).send('Duplicate entry')
              else res.sendStatus(500)
            } else {
              jwt.sign({
                user_id: row.insertId,
                user_company_id: req.body.user_company_id,
                user_name: req.body.user_name,
                user_username: req.body.user_username,
                user_email: req.body.user_email,
                user_role_id: req.body.user_role_id
              }, app.get('secret'), { expiresIn: app.get('tokenDuration') }, (err, activationCode) => {
                if (err) res.sendStatus(500)
                if (activationCode) res.status(201).send(activationCode)
                else res.sendStatus(500)
              })
            }
            app.api.db.end()
          })
        }
      })
    }
  }

  return this
}
