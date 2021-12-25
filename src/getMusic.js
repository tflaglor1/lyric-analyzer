const MusicBrainzApi = require('musicbrainz-api').MusicBrainzApi;

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
    let release_list = [];
    for(release_temp of release_group['release-groups']){
        if(release_temp['primary-type'] === 'Album'){
            release_list.push(release_temp.title);
        }
    }
    return release_list;
}

(async ()=>{
    let discog = await getDiscog("Adele"); 
    console.log(discog);
})();