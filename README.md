# Lyric Analyzer #
> Project to scrape all song lyrics of an artist and get information about words they use

# Config #
create .env with info
```
CLIENT_ID=''
CLIENT_SECRET=''
DB_PASS=''
```
To start api
```
npm start
```

# Database Schema #

* Artist(**arID**, name)
* Album(**aID**, name, release)
* Song(**sID**, name, lyrics)
* trackNum(*sID*, *aID*, tracknum)
* songartist(*sID*, *aID*)
* albumartist(*aID*, *arID*)
* Stats() tbd

![database schema](/Lyric-Analyzer-schema.png)

