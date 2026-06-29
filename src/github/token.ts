#!/usr/bin/env bun

import * as core from "@actions/core";

export async function setupGitHubToken(): Promise<string> {
  try {
    // Explicit token provided via `github_token` action input
    const providedToken = process.env.OVERRIDE_GITHUB_TOKEN;
    if (providedToken) {
      console.log("Using provided github_token for authentication");
      core.setOutput("GITHUB_TOKEN", providedToken);
      return providedToken;
    }

    // Gitea supplies the workflow token as DEFAULT_WORKFLOW_TOKEN (see action.yml)
    const workflowToken = process.env.DEFAULT_WORKFLOW_TOKEN;
    if (workflowToken) {
      console.log("Using workflow token for authentication");
      core.setOutput("GITHUB_TOKEN", workflowToken);
      return workflowToken;
    }

    throw new Error(
      "No token available. Please provide a `github_token` in the `with` section of the action in your workflow yml file, or ensure the workflow has access to the default token.",
    );
  } catch (error) {
    core.setFailed(
      `Failed to setup GitHub token: ${error}\n\nPlease provide a \`github_token\` in the \`with\` section of the action in your workflow yml file, or ensure the workflow has access to the default token.`,
    );
    process.exit(1);
  }
}
