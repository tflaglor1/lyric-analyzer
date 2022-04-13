
const getAllSongs = "SELECT * FROM song";

const addArtist = "INSERT INTO artist VALUES($1, $2)";

const addAlbum = "INSERT INTO album VALUES($1, $2, $3)";

const addSongArtist = "INSERT INTO songartist VALUES($1, $2)";

const addSong = "INSERT INTO song VALUES($1, $2, $3, $4)";

const addAlbumArtist = "INSERT INTO albumartist VALUES($1, $2)";

module.exports={
    getAllSongs,
    addArtist,
    addAlbum,
    addSongArtist,
    addSong,
    addAlbumArtist
}