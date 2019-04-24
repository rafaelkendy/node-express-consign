const fs = require('fs')
const path = require('path')
const readline = require('readline')
const { google } = require('googleapis')
const { OAuth2Client } = require('google-auth-library')
const localpath = path.join(__dirname, '../../../.credentials/')

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly', 'https://www.googleapis.com/auth/spreadsheets', 'https://www.googleapis.com/auth/gmail.send']
const TOKEN_PATH = path.join(localpath, 'tokenFeed.json')

function authorize (credentials, callback) {
  let clientSecret = credentials.web.client_secret
  let clientId = credentials.web.client_id
  let redirectUrl = credentials.web.redirect_uris[0]
  let oauth2Client = new OAuth2Client(clientId, clientSecret, redirectUrl)

  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) {
      getNewToken(oauth2Client, callback)
    } else {
      oauth2Client.credentials = JSON.parse(token)
      callback(oauth2Client)
    }
  })
}

function getNewToken (oauth2Client, callback) {
  let authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES
  })
  console.log('Authorize this app by visiting this url: ', authUrl)
  let rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })
  rl.question('Enter the code from that page here: ', code => {
    rl.close()
    oauth2Client.getToken(code, (err, token) => {
      if (err) {
        console.log('Error while trying to retrieve access token', err)
        return
      }
      oauth2Client.credentials = token
      storeToken(token)
      callback(oauth2Client)
    })
  })
}

function storeToken (token) {
  try {
    fs.mkdirSync(localpath)
  } catch (err) {
    if (err.code !== 'EEXIST') {
      throw err
    }
  }
  fs.writeFile(TOKEN_PATH, JSON.stringify(token))
}

module.exports = app => {
  this.sheets = {
    update: (spreadsheetId, range, resource) => {
      return new Promise((resolve, reject) => {
        authorize(app.get('google'), oauth2Client => {
          try {
            let sheets = google.sheets('v4')
            sheets.spreadsheets.batchUpdate({
              auth: oauth2Client,
              spreadsheetId,
              resource: {
                requests: [
                  {
                    updateCells: {
                      range,
                      fields: 'userEnteredValue'
                    }
                  }, {
                    updateCells: {
                      range,
                      fields: 'userEnteredValue',
                      rows: resource
                    }
                  }
                ]
              }
            }, (err, response) => {
              if (err) reject(err)
              if (response) resolve(response)
            })
          } catch (error) {
            reject(error)
          }
        })
      })
    }
  }

  return this
}
