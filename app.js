require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:
app.get('/', (req, res, next) =>{
    res.render('index')
})

app.get('/artist-search', (req, res, next) => {
    spotifyApi
        .searchArtists(req.query.artists)
            .then(data => {
                let artist = data.body.artists.items;
                // console.log('The received data from the API: ', data.body.artists.items);
                res.render('artist-search',{artist});
    })
            .catch(err => console.log('Error getting artist ', err));
});

app.get('/albums/:artistId', (req, res, next) => {
    // .getArtistAlbums() code goes here
    spotifyApi
        .getArtistAlbums(req.params.artistId)
        .then(data => {
            let album = data.body.items;
            // console.log(data.body.items)
            // console.log('Album:', album);
            res.render('albums',{album})
  })
        .catch(err => console.log('Error getting artist: ', err));
});

app.get('/tracks/:albumId', (req,res, next) => {
    spotifyApi.getAlbumTracks(req.params.albumId)
        .then(data => {

        let track = data.body.items;
        // console.log('Album Track:', track);
        res.render('tracks', { track })

    })
        .catch(err => console.log('Error:', err));
});

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));