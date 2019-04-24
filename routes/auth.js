module.exports = app => {
  let api = app.api.auth
  app.post('/authenticate/:admin?', api.authenticate)
  app.use('/*', api.verify)
}
