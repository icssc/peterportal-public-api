# How to Contribute

## Setup

If you're wondering how to contribute to open source project and this is your first time, you're at the right place.

1. First, you'll want to fork the repository to your own account. You can do that by clicking the fork button in the top right of our [repository](https://github.com/icssc/peterportal-public-api).
2. Clone the forked respository to your local machine. Click the green **Code** button, and copy the URL. Open up a terminal on your local computer to where you want the repository to be and enter:

   ```
   git clone PASTED_URL_HERE
   ```

   It should look like this:

   ```
   git clone https://github.com/your-username/peterportal-public-api.git
   ```

3. Navigate to the respository by entering

   ```
   cd peterportal-public-api
   ```

4. Add the project repository as the "upstream" remote. You can do that by entering this command:

   ```
   git remote add upstream https://github.com/icssc/peterportal-public-api.git
   ```

5. Use `git remote -v` to check that you have 2 remotes. An origin that points to your forked repository on your account, and upstream that points to this project repository.

6. Update your repo with the latest changes by running:

   ```
   git pull upstream master
   ```

7. Create a new branch that you will work on. You will usually name the branch something related to the issue you are solving (i.e. `doc-fix`).

   ```
   git checkout -b BRANCH_NAME
   ```

8. Make some changes and commits. Once you're done push your changes to your fork.

   ```
   git push origin BRANCH_NAME
   ```

9. Once you've made all the changes you need, you can create a pull request. Open your forked repository and switch to the branch you were working on. Click the **New Pull Request** button.

10. Fill out the Pull Request template including details about your changes. Once you're done, create the pull request. Eventually a project maintainer will review the PR. New changes might be requested, in which case you can make new commits for them. Once the pull request is approved, it will be merged, and your changes will be added to the project's master branch.

11. You have officially made a contribution to our project. Thank you! Once the changes go through, you can delete the old branch, and update your local respository and push the update to your forked respository.

    ```
    git pull upstream master
    git push origin master
    ```

12. Now, you are ready to make even more contributions!

## Repo Overview

| Folder/File | Purpose                                 |
| ----------- | --------------------------------------- |
| /cache      | Houses the local data cache             |
| /db         | Houses grades data cache                |
| /docs       | Markdown files for documentation        |
| /docs-site  | Built HTML files for documentation      |
| /graphql    | GraphQL schema files                    |
| /helpers    | Helper methods for both APIs            |
| /public     | Assets to be accessible via Public URL  |
| /rest       | Contains the routes of our REST API     |
| /tests      | Jest test files                         |
| /utils      | Utilities for data changes              |
| app.js      | Configuration for Express               |
| mkdocs.yml  | Configuration for MkDocs                |
| server.js   | Starting server locally for development |

## Additional Resources

- <https://www.dataschool.io/how-to-contribute-on-github/>
- <https://opensource.guide/how-to-contribute/>
- <https://github.com/freeCodeCamp/how-to-contribute-to-open-source>
