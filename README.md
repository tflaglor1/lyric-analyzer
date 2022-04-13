# Lyric Analyzer #
> Project to scrape all song lyrics of an artist and get information about words they use

# Database Schema #

* Artist(**arID**, name)
* Album(**aID**, name, release)
* Song(**sID**, name, lyrics)
* trackNum(*sID*, *aID*, tracknum)
* songartist(*sID*, *aID*)
* albumartist(*aID*, *arID*)
* Stats() tbd