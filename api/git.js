const git = require('simple-git')

module.exports = app => {
  this.pull = (req, res) => {
    if (!req.admin) res.sendStatus(401)

    git()
      .pull()
      .tags((err, tags) => {
        if (err) res.sendStatus(500)
        else {
          console.log('Latest available tag: %s', tags.latest)
          res.sendStatus(200)
        }
      })
  }

  return this
}
