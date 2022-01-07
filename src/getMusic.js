const MusicBrainzApi = require('musicbrainz-api').MusicBrainzApi;
const xml2js = require('xml2js');
const axios = require('axios');

const mbApi = new MusicBrainzApi({
    appName: 'lyric-analyzer',
    appVersion: '0.1.0',
    appContactInfo: 'tflaglor1@gmail.com'
  });

/**
 * 
 * @param {String} artist Artist Name
 * @returns {List} All albums in discography
 */
async function getDiscog(artist){

    const result = await mbApi.searchArtist(artist);
    const id = result.artists[0].id // get ID, pray that first is correct, Or when website show search results
    // and the one selected will be the correct ID
    //TODO make search bar that shows all results and then the user picks the correct result, maybe show a few options
    //of like most popular songs/albums so people can verify

    const release_group = await mbApi.getArtist(id, ['release-groups']);
    let release_map = new Map();
    for(release_temp of release_group['release-groups']){
        if(release_temp['primary-type'] === 'Album'){
            release_map.set(release_temp.title, release_temp.id);
        }
    }

    //TODO filter out secondary types so Live doesn't show up, or bootleg stuff
    return release_map;
}

async function getSongsFromAlbum(album){
    let release = await mbApi.getReleaseGroup(album, ['releases']);
    release = release.releases[0].id;
    let release_response = await mbApi.getRelease('6d541211-c604-4344-a799-11adfea40c9d', ['recordings']);
    //let media = release_response.media;
    let url = 'https://musicbrainz.org/ws/2/release/6d541211-c604-4344-a799-11adfea40c9d?inc=recordings';
    // gets all tracks ^^

    console.log(release_response)
}

(async ()=>{
    //let discog = await getDiscog("Adele"); 
    //console.log(discog);
    await getSongsFromAlbum('d8a99910-33c2-481d-9b96-085ece5545f6'); // 30 release
})();