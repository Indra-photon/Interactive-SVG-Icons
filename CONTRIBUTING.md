# Avoron Contributing Guide

Please be sure to read this guide thoroughly before contributing as it will lessen the chances of any issues arising during the process.


## How to Contribute


### Check Before Doing Anything

It's important that you look through any open issues or pull requests in the repo before attempting to submit a new issue or work on a change, regardless of the complexity. This will help avoid any duplicates from being made, as well as prevent more than one person working on the same thing at the same time.

If your proposal already exists in an open issue or PR, but you feel there are details missing, comment on the issue/PR to let those involved know of those missing details.

### Being Assigned an Issue

If you would like to work on an existing issue in the repo:

1) Find an issue that is not currently assigned to anyone.

2) Self assign an issue of your choice and start working.


### Creating an Issue

1. Create a new issue and **read the issue template in its entirety and fill out all applicable sections**. If you aren't sure how to create an issue, you can read the GitHub documentation on [creating an issue from a repository](https://docs.github.com/en/issues/tracking-your-work-with-issues/creating-an-issue#creating-an-issue-from-a-repository).

### Setting Up Your Local Clone

Before you begin working on anything, make sure you follow these steps in order to set up a clone on your local machine:

1. Clone this repo to your local machine with one of the commands below.

    ```bash
    # If you have SSH set up with Git:
    git clone git@github.com:Dev-Sisyphus/Photography-Website.git
    # Otherwise for HTTPS:
    git clone https://github.com/Dev-Sisyphus/Photography-Website.git

2. `cd` into the directory of your local clone.
  

### Working on an Issue

Once you have the repo cloned, you can begin working on your issue:

1. Create a new branch, replacing the `<your branch name>` with an actual branch name that briefly explains the purpose of the branch in some way:

 *Follow this naming convention upon creating a branch. For bug fix branch your branch name should follow this convention `fix/your-branch-name` and for feature branch follow this convention `feat/your-branch-name`.*

    ```bash
    git checkout -b <your branch name>

    # Some examples:
    git checkout -b fix/hero-section-typo
    git checkout -b feat/develop-call-to-action-btn
    ```

2. Add commits as you work on your issue, replacing the `<your commit message>` text with your actual commit message:

   ```bash
   git add .
   git commit -m "<your commit message>"

   # An example:
   git commit -m "Update hero text typo at home page"
   ```

3. Sync your work with the origin remote every so often. replacing the `<your branch name>` with the branch you've been working on locally:

   ```bash
   git checkout main
   git fetch origin
   git merge origin/main
   git checkout <your branch name> #The branch you are working on.
   git merge main
   ```

4. Push your branch to the repo, replacing the `<your branch name>` with the branch you've been working on locally:

    ```bash
    git push origin <your branch name>

    # An example:
    git push origin fix/hero-section-typo
    ```
    note* to get the updated codebase from git
    git switch main
    git pull

### Opening a Pull Request

1. After pushing your changes, go to the repo on GitHub and click the "Compare & pull request" button. If you have multiples of this button, be sure you click the one for the correct branch.
   * If you don't see this button, you can click the branch dropdown menu and then select the branch you just pushed from your local clone:

      ![GitHub branch dropdown menu](https://user-images.githubusercontent.com/70952936/150646139-bc080c64-db57-4776-8db1-6525b7b47be2.jpg)

   * Once you have switched to the correct branch on GitHub, click the "Contribute" dropdown and then click the "Open pull request" button.

2. **Read the PR template in its entirety before filling it out and submitting a PR**. Not filling out the template correctly will delay a PR getting merged.

3. At this point a maintainer will either leave general comments, request changes, or approve and merge your PR