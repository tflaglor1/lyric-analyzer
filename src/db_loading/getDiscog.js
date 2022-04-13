const SpotifyWebApi = require('spotify-web-api-node');
const qs = require('qs');
const axios = require('axios');
require('dotenv').config({path: __dirname + '/../../.env'});
const pool = require('../api/db-connection');
const queries = require('../api/queries');

let clientId = process.env.CLIENT_ID;

let clientSecret = process.env.CLIENT_SECRET;
const auth_token = Buffer.from(`${clientId}:${clientSecret}`, 'utf-8').toString('base64');

// sets up spotifyApi with clientId and clientSecret
let spotifyApi = new SpotifyWebApi({
    clientId: clientId,
    clientSecret: clientSecret,
});

/**
 * Gets access token from Spotify, which is needed for API requests
 * @returns the data token
 */
async function getAuth(){
    try{
        const token_url = 'https://accounts.spotify.com/api/token';
        const data = qs.stringify({'grant_type':'client_credentials'});

        const response = await axios.post(token_url, data, {
            headers: {
                'Authorization': `Basic ${auth_token}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })

        return response.data.access_token;
    }catch(error){
        console.log(error);
    }
}

/**
 * Gets all albums from and artist and removes duplicates
 * @param {String} artist_id
 */
async function getAlbums(artist_id){
    // 50 is limit on Spotify API
    let data = await spotifyApi.getArtistAlbums(artist_id, {limit: 50, album_type: 'album', market: 'US'});

    const items = data.body.items
    let albums = new Map();
    items.forEach(item => albums.set(item.name, item.id));
    // go through duplicates and take the longer album, and usually since chronological, explicit is the first
    // so grab first album, going to get deluxe albums and take out identical tracks later
    let prevAlbum
    // deletes duplicates
    for(let [key, value] of albums){
        if(value === prevAlbum){
            albums.delete(key);
        }
        prevAlbum = value;
    }

    for(let [key, value] of albums){
        release = await (await spotifyApi.getAlbum(value)).body.release_date;     
        // adds info to db
        await addAlbumToDB(value, key, release, artist_id)   
    }

    return albums;
    
}

/**
 * Gets all tracks from an Album and their id
 * @param {String} albumID 
 * @returns Map<Track Name, ID>
 */
async function getTracksFromAlbum(albumID){
    // 50 is max limit I think
    let data = await spotifyApi.getAlbumTracks(albumID, {limit: 50});
    const items = data.body.items;
    let album_tracks = new Map();

    for(track of items){
        album_tracks.set(track.name, track.id);
    }
    return album_tracks;
}

/**
 * Returns all tracks from all of artist's albums
 * @param {Map<Album Name, ID>} discog 
 * @returns Map<Track Name, ID> of all tracks
 */
async function getAllTracksFromDiscog(albums){
    let tracks = new Map();
    for(let [key, value] of albums){
        album_tracks = await getTracksFromAlbum(value);
        tracks = new Map([...tracks, ...album_tracks]); // combines map and stops duplicates
    }
    return tracks;
}

/**
 * Adds to artist table in DB
 * @param {String} artistID 
 */
async function addArtistToDB(artistID){
    artistName = await (await spotifyApi.getArtist(artistID)).body.name;
    
    pool.query(queries.addArtist,[artistID, artistName ] ,(error, results)=>{
        if(error){
            console.log(error, results);
        }
    })
}

/**
 * adds to album table and albumartist tbale
 * @param {String} albumID 
 * @param {String} name 
 * @param {String} release 
 * @param {String} artistID 
 */
async function addAlbumToDB(albumID, name, release, artistID){
    // adds to album
    pool.query(queries.addAlbum, [albumID, name, release], (error, results)=>{
        if(error){
            console.log(error);
        }
    });

    // adds to albumartist
    pool.query(queries.addAlbumArtist, [albumID, artistID], (error, results)=>{
        if(error){
            console.log(error);
        }
    })
}

/**
 * add to song table and songartist
 * @param {*} tracks 
 * @param {*} artistName 
 * @param {*} artistID 
 */
async function addTracksToDB(tracks, artistName, artistID){
    for(let[key, value] of tracks){
        // gets lyrics
        const lyric_link = `https://api.lyrics.ovh/v1/${artistName}/${key}`;
        let lyrics;
        await axios.get(lyric_link).then((response)=>{
            if(response.data.error === 'No lyrics found'){
                console.log('error');
            }else{
                lyrics = response.data.lyrics;
            }
        }).catch((err) => {
            console.log(`no lyrics found for ${key}`);
            lyrics = null;
       });
            console.log(lyrics);

        // add to song table
        pool.query(queries.addSong, [value, key, null, lyrics], (error, results)=>{
            if(error){
                console.log(error, results);
            }
        });
        
        // add to songartist table
        pool.query(queries.addSongArtist, [value, artistID], (error, results)=>{
            if(error){
                console.log(error, results);
            }
        });
    }
}

// tests

/*
(async () =>{
    let access_code = await getAuth();
    spotifyApi.setAccessToken(access_code);
    console.log(spotifyApi.getAccessToken());

    let artistName = 'Kanye West';
    let artistID = '5K4W6rqBFWDnAN6FQUkS6x';
    
    // add artist to DB
    await addArtistToDB(artistID);
    // add albums
    let albums = await getAlbums(artistID); // for testing
    //console.log(albums)
    
    //let tracks = await getTracksFromAlbum('2Wiyo7LzdeBCsVZiRA6vVZ');
    //await addTracksToDB(tracks, artistName, artistID);
    //console.log(tracks);
    //let all_tracks = await getAllTracksFromDiscog(albums) 
   // console.log(all_tracks);
})();
*/
