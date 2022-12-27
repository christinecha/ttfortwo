var Airtable = require('airtable');
var base = new Airtable({ apiKey: 'patoiOG0fn7SzerCr.485ad628036c75bde485625e0cb838e4ff3391f83449f8d59087cb2919f6adf0' }).base('app6T9v0vS5vnqzv5');

base('All Clubs').select({
  // Selecting the first 3 records in Clubs:
  maxRecords: 3,
  view: "Clubs"
}).eachPage(function page(records, fetchNextPage) {
  // This function (`page`) will get called for each page of records.

  records.forEach(function (record) {
    console.log('Retrieved', record.get('Name'));
  });

  // To fetch the next page of records, call `fetchNextPage`.
  // If there are more records, `page` will get called again.
  // If there are no more records, `done` will get called.
  fetchNextPage();

}, function done(err) {
  if (err) { console.error(err); return; }
});