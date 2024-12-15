# Notes

Looks like I've imported some functions from FDB version 2 and I'm trying to convert them to the new format.

match.js is a good example where we have $distinct and $count that aren't quite there yet.

update.js - Looks like we were debugging something, probably failing tests? It's passing all except "By query with nested $in".

OK - so the good news is that I obviously set up all the unit tests! So we just need to get them passing.
1st Oct 2024

Also I wrote myself an interesting note in build.js:

ROB: When we call a gate operation we pass an empty path but it needs
to be the path to the data - do a step through with the tests to see
what's breaking... we're bringing match.js back up to speed after
doing a fantastic job rationalising the queryToPipeline() call but it
needs to handle paths correctly AND it needs to handle $in correctly...
which I suspect means we need a new type of genericOperation() like
genericArrayOperation() or whatever. X