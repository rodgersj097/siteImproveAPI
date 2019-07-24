var request = require("request"),
  username = "siteimproveservice@worldvision.ca",
  pass = "2dc60ea7badce2c48de72e40de2dc773";
var rp = require("request-promise");
const Issue = require("./models/issue");

const options = function(page){
 var url = `https://api.siteimprove.com/v2/sites/1348684361/seov2/issues?page=${page}&page_size=20` 
  return { 
  url: url,
  auth: {
    user: username,
    pass: pass
  },
  json: true
} 
};



function getIssues(page, incomingIssues) {
  request.get(options(page),(err, res, body) => {
      if (err) {
        console.err(err);
      }
      var currentIssues = body.items; 
      incomingIssues.push(currentIssues)
      var totalPages = body.total_pages 
      console.log(page)
      
      if(page === totalPages){
      console.log(`Going to save page ${page}`);
      
      save(incomingIssues);
      return 
      } 
      page++
      getIssues(page, incomingIssues)

    }
  );
}

async function save(result) {
    var dates = await getCrawlDates() 
  for (var ele of result) {
    var issue = new Issue({
      issue: ele.issue_name,
      category: ele.issue_type,
      gained: ele.seo_points_gained,
      toGain: ele.seo_points_to_gain,
      date: new Date(dates[0])
        .toJSON()
        .slice(0, 10)
        .replace(/-/g, "/")
    });
    console.log(issue)
    issue
      .save()
      .then(() => {
        console.log(save);
      })
      .catch(err => {
        console.log(err);
      });
  }
}

async function getCrawlDates() {
  let data = [];
  await rp({
    url: `https://api.siteimprove.com/v2/sites/1348684361/content/crawl`,
    auth: {
      user: username,
      pass: pass
    },
    headers: {
      "User-Agent": "Request-Promise"
    },
    json: true
  })
    .then(function(body) {
      data.push(body.last_crawl);
      data.push(body.next_crawl);
    })
    .catch(err => {
      console.log(err);
    });
  return data;
}
module.exports = getIssues(1, []) 
