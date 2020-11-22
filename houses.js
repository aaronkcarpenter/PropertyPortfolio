const request = require('request-promise');
const cheerio = require('cheerio');
const ObjectsToCsv = require('objects-to-csv');

async function houses() {
  const results = await request.get('http://iswdataclient.azurewebsites.net/webSearchLegal.aspx?dbkey=harrisontax&stype=legal&sdata=dplx&time=202011221241004#top');

  const $ = await cheerio.load(results);
  const scrapedRows = [];

  const result2 = $("#dvPrimary > table > tbody > tr").each((i, ele) => {

    if (i === 0) return true;
    const tds = $(ele).find('td');
    const details = $(tds[0]).text();
    const propertyId = $(tds[1]).text();
    const geographicId = $(tds[2]).text();
    const ownerName = $(tds[3]).text();
    const address = $(tds[4]).text();
    const propertyType = $(tds[5]).text();
    const marketValue = $(tds[6]).text();
    const scrapedRow = {
      details, propertyId,
      geographicId, ownerName,
      address, propertyType,
      marketValue
    }
    scrapedRows.push(scrapedRow);

    (async function createCsvFile(data) {
      const csv = new ObjectsToCsv(scrapedRows);

      await csv.toDisk('./homes.csv');
    })();
  });
}

houses();