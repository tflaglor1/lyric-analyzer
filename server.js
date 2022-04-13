const express = require('express');
const serverRoutes = require('./src/api/routes');

const app = express();

const port = 3000;

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Lyric Analyzer api");
});

app.use('/api/v1/lyricanalyzer', serverRoutes);

app.listen(port, ()=> console.log(`app listening to port ${port}`));