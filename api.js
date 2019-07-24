var request = require("request"),
  username = "siteimproveservice@worldvision.ca",
  pass = "2dc60ea7badce2c48de72e40de2dc773";
var rp = require("request-promise");
const Issue = require("./models/issue");
const options = {
  url: `https://api.siteimprove.com/v2/sites/1348684361/content/crawl`,
  auth: {
    user: username,
    pass: pass
  },
  json: true
};

function getIssues() {
  request.get(
    {
      url: `https://api.siteimprove.com/v2/sites/1348684361/seov2/issues?page=1&page_size=10`,
      auth: {
        user: username,
        pass: pass
      },
      json: true
    },
    (err, res, body) => {
      if (err) {
        console.err(err);
      }

      console.log(body.items);
      save(body.items);
    }
  );
}

async function save(result) {
  for (var ele of result) {
    var issue = new Issue({
      issue: ele.issue_name,
      category: ele.issue_type,
      gained: ele.seo_points_gained,
      toGain: ele.seo_points_to_gain,
      date: new Date()
        .toJSON()
        .slice(0, 10)
        .replace(/-/g, "/")
    });

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
async function getChange() {
  var dates = await getCrawlDates();
  var lastWeekFormatted = new Date(dates[0]);
  lastWeekFormatted.setHours(00);
  lastWeekFormatted.setSeconds(00);
  lastWeekFormatted.toISOString();

  var thisWeekFormatted = new Date(dates[1]);
  thisWeekFormatted.setHours(00);
  thisWeekFormatted.setSeconds(00);
  thisWeekFormatted.toISOString();

  var lastWeekIssues = [];
  var thisWeekIssues = [];

  Issue.find({ date: { $gte: lastWeekFormatted } })
    .then(issues => {
      lastWeekIssues.push(issues);
      console.log(lastWeekIssues);
    })
    .catch(err => console.log(err));

  Issue.find({ date: { $gte: thisWeekFormatted } })
    .then(issues => thisWeekIssues.push(issues))
    .catch(err => console.log(err));

  //console.log(lastWeekIssues, thisWeekIssues);
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

function menu() {
  console.log("pulling issues from API andsaving in database");
  //getIssues();
  console.log("Getting difference between crawl");
  getChange();
}

module.exports = menu();
