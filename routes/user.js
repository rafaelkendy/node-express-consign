module.exports = app => {
  app.post('/user', app.api.user.insert)
  // app.put('/user/:admin?', app.api.user.update)
}
