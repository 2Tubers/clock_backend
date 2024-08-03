import express from 'express';
import axios from 'axios';
import bodyParser from "body-parser"; 
import cors from 'cors';
import env from 'dotenv';
const app = express();
env.config();

const PORT=process.env.PORT || 5000
const BASE_URL=process.env.BASE_URL;
app.use(cors());
  // Function to search for a track by name
  var songPreviewUrl="";
  
   
  async function searchTrack(songName) {
      try {
          // Spotify API credentials
          const clientId=process.env.client_Id;
          const clientSecret=process.env.client_Secret;
          
          
          // Request access token
          const body={
              grant_type:'client_credentials',
              client_id:clientId,
              client_secret:clientSecret  
          };
          const authResponse=await axios.post('https://accounts.spotify.com/api/token',
          body,
          {
              headers: {
                  'Content-Type': 'application/x-www-form-urlencoded'
              }
          }
          );
          
          const accessToken = authResponse.data.access_token;
          // console.log('Access Token:', accessToken);
  
          // Search for track using the songName
          const searchResponse = await axios.get('https://api.spotify.com/v1/search', {
              params: {
                  q: songName,
                  type: 'track'
              },
              headers: {
                  'Authorization': `Bearer ${accessToken}`
              }
          });
  
          //Get the song preview using the trackId
          const trackId=searchResponse.data.tracks.items[0].id;
  
        const songPreview = await axios.get(`https://api.spotify.com/v1/tracks/${trackId}`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        });
        
       songPreviewUrl=songPreview.data.preview_url;
     
        console.log(songPreviewUrl);
          return songPreviewUrl;
      } catch (error) {
          console.error('Error:', error.message);
          return null;
      }
  }

// searchTrack("tennu le");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post(`${BASE_URL}`, async (req, res) => {
  try {
    const response = await searchTrack(req.body.name);
    // console.log(response);
    res.send(response);
  } catch (error) {
    console.error('Error occurred:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});





  