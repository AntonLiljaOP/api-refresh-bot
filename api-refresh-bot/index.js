/**
 * This is the main entrypoint to your Probot app
 * @param {import('probot').Probot} app
 */

const {Octokit} = require("@octokit/rest");
const fetch = require("node-fetch");
const _ = require('lodash');


module.exports = (app) => {
  // Your code here
  app.log.info("Yay, the app was loaded!");

  app.on("issues.reopened", async (context) => {
    const octokit = new Octokit();

    const params = context.repo({path: 'open-api.json'});

    const { data } = await octokit.request("GET /repos/{owner}/{repo}/contents/{path}",params);

    //var result = await context.repo.getContents(params);
    var contents = Buffer.from(data.content, 'base64');
    var localAPIspec = JSON.parse(contents.toString());
    var apiUrl = localAPIspec.servers[0].url;

    console.log(localAPIspec.servers[0].url);
    await fetch(apiUrl)
      .then((response)=> response.json())
      .then((remoteAPIspec) => {
        console.log(_.isEqual(remoteAPIspec, localAPIspec));
        console.log(remoteAPIspec);
      })
    
    //console.log('contents of the file', contents);


    const issueComment = context.issue({
      body: "Thanks for opening this issue!",
    });

    return content.octokit.pulls.create(context.pullRequest({
      base: "master",
      head: "api-refresh-bot",
      body:{

      }
    }))
    return context.octokit.issues.createComment(issueComment);
  });

  // For more information on building apps:
  // https://probot.github.io/docs/

  // To get your app running against GitHub, see:
  // https://probot.github.io/docs/development/
};
