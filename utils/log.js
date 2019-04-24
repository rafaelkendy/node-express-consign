const fs = require('fs')
const path = require('path')
const logPath = path.join(__dirname, '../logs')

if (!fs.existsSync(logPath)) fs.mkdirSync(logPath)

module.exports = app => {
  this.save = (filename, text) => {
    return new Promise((resolve, reject) => {
      try {
        let date = `${(new Date()).toJSON().split('T')[0].replace(/-/g, '')}`
        let file = path.join(logPath, `${date}_${filename}.log`)
        let line = `${new Date()} - ${text}\r\n`

        if (fs.existsSync(file)) {
          fs.appendFileSync(file, line)
        } else {
          fs.writeFileSync(file, line)
        }

        resolve()
      } catch (error) {
        reject(error)
      }
    })
  }

  this.get = filename => {
    return new Promise((resolve, reject) => {
      try {
        let file = path.join(logPath, filename + '.log')

        if (fs.existsSync(file)) {
          resolve(fs.readFileSync(file))
        } else {
          resolve('No logs.')
        }
      } catch (error) {
        reject(error)
      }
    })
  }

  return this
}
