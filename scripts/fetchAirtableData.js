var { AIRTABLE_API_TOKEN } = process.env

var Airtable = require('airtable');
var path = require('path')
var fs = require('fs')
var base = new Airtable({ apiKey: AIRTABLE_API_TOKEN }).base('app6T9v0vS5vnqzv5');

const tableConfigs = [
  {
    filename: 'clubs',
    name: 'Table Tennis Clubs',
    view: 'Clubs',
    fieldsToProps: {
      "Name": "name",
      "Country": "country",
      "Region": "region",
      "Metro Area": "metro",
      "Distinction": "distinction",
      "Type": "type",
      "Tags": "tags",
      "Slug": "id",
      "Address": "address",
      "Website": "url",
      "lat": "lat",
      "lng": "lng",
      "Closed": "closed"
    }

  }
]

tableConfigs.forEach(config => {
  const tableData = {}

  base(config.name).select({ view: config.view }).eachPage((records, fetchNextPage) => {
    console.log(`Found ${records.length} records...`)

    try {

      records.forEach((record) => {
        const data = {}

        Object.entries(config.fieldsToProps).forEach(([field, key]) => {
          const value = record.get(field)

          if (key === config.fieldsToProps['Distinction']) {
            if (value?.includes("★")) data[key] = value
            return;
          }

          data[key] = value
        })

        tableData[record.id] = data
      });
    } catch (e) {
      console.log('Could not complete page:', e)
      throw e
    }

    try {
      fetchNextPage();
    } catch (e) { console.log('Could not fetch next page:', e) }
  }, (err) => {
    if (err) { console.error(err); return; }

    console.log("Writing to file...")
    const generatedPath = path.resolve(__dirname, '../generated')
    const generatedClubsPath = path.resolve(generatedPath, `./${config.filename}.json`)

    try {
      fs.mkdirSync(generatedPath)
    } catch { }
    fs.writeFileSync(generatedClubsPath, JSON.stringify(tableData, null, 2))
  })
})
