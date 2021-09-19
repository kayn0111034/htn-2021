var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/login', function(req, res, next) {
  res.render('login', {});
});

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

router.post('/login', function(req, res, next) {
  res.redirect('/bot?uid=' + makeid(5));
});

/** 
 * Bot Stuff
 * 
*/


const axios = require('axios');

// View our quick start guide to get your API key and version ID:
// https://www.voiceflow.com/api/dialog-manager#section/Quick-Start
const apiKey = 'VF.614627eb076dfd001b7ffbc9.0BNVQb9cCBQYjiZDMhPnU1o1notZzW29IwIO3pjg5X';
const versionID = '61461ab8d91e7f000678fbd2';


router.get('/bot', function(req, res, next) {
  res.render('bot', { title: 'Express' });
});

router.post('/talk', function(req, res, next) {
  async function startInteract() {
    // Start a conversation
    t = req.body.t
    uid = req.body.uid

    console.log(t, uid)

    const body = {
      request: {
        type: 'text',
        payload: t,
      },
    };

    const response = await axios({
      method: 'POST',
      baseURL: 'https://general-runtime.voiceflow.com',
      url: `/state/${versionID}/user/${uid}/interact`,
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
