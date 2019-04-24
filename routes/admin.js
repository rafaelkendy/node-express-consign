module.exports = app => {
  app.get('/git/pull', app.api.git.pull)
  app.get('/log/:filename', app.api.log.get)
}
