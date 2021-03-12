const express = require('express');
const cors = require('cors');
const axios = require('axios');

const TWITCH_CLIENT_ID = 't38mskatp9y6xiyl6m2x8j8a9ovbnx';
const TWITCH_CLIENT_SECRET = '3yzu4fyb4j7yepls3jht56b5o956ur';

const app = express();

app.use(cors());
app.use(express.json());

app.post('/oauth/twitch', async (req, res) => {
  try {
    const { code } = req.body;
    
    if (!code) {
      return res.status(400).json({ error: 'Authorization Code não informado' });
    }

    const getAccessToken = await axios({
      method: 'post',
      url: 'https://id.twitch.tv/oauth2/token',
      params: {
        client_id: TWITCH_CLIENT_ID,
        client_secret: TWITCH_CLIENT_SECRET,
        code,
        grant_type: 'authorization_code',
        redirect_uri: 'http://localhost:5500/frontend/home.html'
      }
    });
    // console.log(getAccessToken.data);

    const { access_token } = getAccessToken.data;
    const getUser = await axios({
      method: 'get',
      url: 'https://api.twitch.tv/helix/users',
      headers: {
        Authorization: `Bearer ${access_token}`,
        'Client-Id': TWITCH_CLIENT_ID
      }
    });
    console.log(getUser.data);
  } catch (error) {
    res.sendStatus(500);
  }

  res.send();
})

app.listen(3000, () => {
  console.log(`Server running`);
});