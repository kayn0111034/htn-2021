var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/login', function(req, res, next) {
  res.render('login', {});
});

/** 
 * Bot Stuff
 * 
*/

router.get('/bot', function(req, res, next) {
  res.render('bot', { title: 'Express' });
});

const axios = require('axios');

// View our quick start guide to get your API key and version ID:
// https://www.voiceflow.com/api/dialog-manager#section/Quick-Start
const apiKey = '';
const versionID = '61461ab8d91e7f000678fbd2';

function makeid(length) {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * 
charactersLength));
 }
 return result;
}


const userID = makeid(5); // Unique ID used to track conversation state

console.log(userID)

router.post('/talk', function(req, res, next) {
  async function startInteract() {
    // Start a conversation
    t = req.body.t

    const body = {
      request: {
        type: 'text',
        payload: t,
      },
    };

    const response = await axios({
      method: 'POST',
      baseURL: 'https://general-runtime.voiceflow.com',
      url: `/state/${versionID}/user/${userID}/interact`,
      headers: {
        Authorization: apiKey,
      },
      data: body,
    });
  
    // Log the response
    console.log(response.data);
    res.json(response.data)
  }
  
  startInteract().catch((error) => console.error(error));
});


module.exports = router;
