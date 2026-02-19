require("dotenv").config();
const express = require("express");
const axios = require("axios");
const { Octokit } = require("@octokit/rest");

const app = express();
app.use(express.json());

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN
});

app.post("/webhook", async (req, res) => {
  try {
    const payload = req.body;

    if (payload.action !== "opened" && payload.action !== "synchronize") {
      return res.status(200).send("Ignored");
    }

    const pr = payload.pull_request;
    const owner = payload.repository.owner.login;
    const repo = payload.repository.name;
    const prNumber = pr.number;

    const title = pr.title;
    const description = pr.body;

    // Get diff from GitHub
    const diffResponse = await axios.get(pr.diff_url, {
      headers: {
        Authorization: `token ${process.env.GITHUB_TOKEN}`
      }
    });

    const diff = diffResponse.data;

    // Send to Python LLM service
    const reviewResponse = await axios.post(
      "http://localhost:8000/review",
      { title, description, diff }
    );

    const { score, review } = reviewResponse.data;

    const commentBody = `
### 🤖 AI Code Review

**Score:** ${score}/10

**Review:**
${review}
`;

    // Post comment to PR
    await octokit.issues.createComment({
      owner,
      repo,
      issue_number: prNumber,
      body: commentBody
    });

    res.status(200).send("Review posted");

  } catch (error) {
    console.error(error);
    res.status(500).send("Error processing PR");
  }
});

app.listen(3000, () => {
  console.log("Node worker running on port 3000");
});
