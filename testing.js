let api_key = process.env.TOKEN;
const MusicBrainzApi = require('musicbrainz-api').MusicBrainzApi;

const mbApi = new MusicBrainzApi({
  appName: 'lyric-analyzer',
  appVersion: '0.1.0',
  appContactInfo: 'tflaglor1@gmail.com'
});

async function test(){

    const result = await mbApi.searchArtist('Death Grips');
    const id = result.artists[0].id // get ID, pray that first is correct I guess? Or when website show search results
    // and the one selected will be the correct ID
    //console.log(result); // in result there is similarity score
    //const work = await mbApi.getArtist(id, ['releases']);
    /*const releases = work.releases;
    let release_list = [];
    for(release_temp of releases){
        if(release_temp.status === 'Official'){
            release_list.push(release_temp.title);
        }
    }
    console.log(release_list); */

    const release_group = await mbApi.getArtist(id, ['release-groups']);
    let release_list = [];
    //console.log(Object.keys(release_group));
    //console.log(release_group['release-groups'])
    for(release_temp of release_group['release-groups']){
        if(release_temp['primary-type'] === 'Album'){
            release_list.push(release_temp.title);
        }
    }
    console.log(release_list);

}


// const axios = require('axios');
// let url = 'api.genius.com/';

// axios.get(url+'songs/378195').then(function(resonse){
//     console.log(resonse);
// }).catch(function(error){
//     console.log(error);
// });


(async () =>{
    await test();
})();

