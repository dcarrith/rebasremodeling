---
name: github-pages-deployer
description: Packages up the site and deploys it to GitHub Pages automatically by merging into the main branch. Also sets up and runs simple Vitest unit tests to serve as a basis for future test development. Use when the user asks to deploy to GitHub Pages, or package up the site for deployment to GH Pages using GitHub Actions.
license: Complete terms in LICENSE.txt
---

# GitHub Pages Deployer

This skill packages up the project (e.g. `rebasremodels.com` site) and sets up a GitHub Action to deploy it automatically to GitHub Pages. It also provides a test setup script to add basic component testing.

## Prerequisites
- The project is a Node.js web application (e.g. Vite + React).
- The user is using a GitHub repository where they have enabled or will enable GitHub Pages.
- The default branch is `main`.

## Usage

When a user asks to package up the site and deploy it to GitHub pages automatically by merging into the main branch, follow these steps:

### 1. Setup and Run Tests
First, install the testing dependencies and ensure the application passes a basic smoke test.

1. Execute the `scripts/setup_tests.sh` script to install `vitest`, testing utilities, and create basic test files.
2. Run the newly added test via `npx vitest run` to ensure it passes.

### 2. Configure GitHub Actions Deployment
Setup the GitHub Actions workflow to build and deploy the app to GitHub Pages.

1. Create a `.github/workflows/` directory in the project's root if it doesn't already exist.
2. The skill includes a GitHub Pages deployment workflow in `assets/deploy.yml`. 
3. Use your tools to read `assets/deploy.yml` and write its contents to `.github/workflows/deploy.yml` in the user's project.
4. If testing is requested as part of the CI pipeline, add an `npx vitest run` step into the `deploy.yml` right before the `Build` step.

### 3. Commit and Merge
1. Create a branch (or push directly if the user specifies) containing the new `.github/` folder, `vitest.config.ts`, `tests/`, and changes to `package.json`.
2. Push the changes to the origin.
3. If not already on `main`, merge the branch into `main` and push, to trigger the GitHub Action deployment workflow.

### 4. Verification
- Use your tools or `gh` CLI (if available) to verify that the GitHub Actions workflow runs successfully.
- Inform the user that the site will now automatically deploy whenever changes are merged to `main`.
