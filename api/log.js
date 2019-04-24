module.exports = app => {
  this.get = (req, res) => {
    if (!req.admin || !req.params.filename) res.sendStatus(401)

    try {
      app.utils.log.get(req.params.filename)
        .then(log => {
          return res.status(200).send(log)
        })
        .catch(err => {
          console.log(err)
          return res.sendStatus(500)
        })
    } catch (error) {
      console.log(error)
      return res.sendStatus(500)
    }
  }

  return this
}
