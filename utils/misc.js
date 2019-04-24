module.exports = app => {
  this.getId = () => {
    let timestamp = (new Date().getTime() / 1000 | 0).toString(16)
    return timestamp + 'xxxxxxxxxxxxxxxx'.replace(/[x]/g, () => (Math.random() * 16 | 0).toString(16)).toLowerCase()
  }

  this.replaceSpecialChars = str => {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  }

  return this
}
