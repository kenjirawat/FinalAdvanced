var express = require('express')
var app = express()
var bodyParser = require('body-parser')
var request = require('request')
var token = 'EAAIjdgMvXHwBAIt9GA0h5T1uWgbUpkZA26AlXDCkQZARnu90dELkCLFkCFRrU2sjKoqF02PDHKxV3EBufyKfFmrDgCdUPfXXOz2KpAZBDFkf6CbglLLdTkQ2IubtEydidFG143mLjweSjPckGq3lJzKkSYFDS0mbQLRseM7ZAAZDZD'
function sendTextMessage (sender, text) {
  messageData = {
    text: text
  }
  request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: {access_token: token},
    method: 'POST',
    json: {
      recipient: {id: sender},
      message: messageData,
    }
  }, function (error, response, body) {
    if (error) {
      console.log('Error sending message: ', error)
    } else if (response.body.error) {
      console.log('Error: ', response.body.error)
    }
  })
}

app.use(bodyParser.json())
app.get('/', function (req, res) {
  res.send('Hell Hello')
})
app.get('/webhook', function (req, res) {
  if (req.query['hub.verify_token'] === '1234') {
    res.send(req.query['hub.challenge'])
  } else {
    res.send('Error, wrong validation token')
  }
})
app.post('/webhook/', function (req, res) {
  messaging_events = req.body.entry[0].messaging
  for (var i = 0; i < messaging_events.length; i++) {
    var event = req.body.entry[0].messaging[i]
    var sender = event.sender.id
    if (event.message && event.message.text) {
      var text = event.message.text
      console.log(text)
      if('hi'===text){
        sendTextMessage(sender,'สวัสดี')
      }
      else if ('youtube'=== text) {
        sendTextMessage(sender,'https://www.youtube.com/')
      }else sendTextMessage(sender,'คุณถามว่า '+text)
    // Handle a text message from this sender
    }
  }
  res.sendStatus(200)
})

app.set('port', (process.env.PORT || 5000))
app.listen(app.get('port'), function () {
  console.log('Example app listen on port' + app.get('port' + '!'))
})
