# Contributing

PeterPortal API is an open source project, [hosted on Github](https://github.com/icssc-projects/peterportal-public-api), created by the ICS Student Council Projects Committee at UCI. We welcome anyone to contribute to our project and improve our API.

Our goal is to encourage more students and developers to create applications beneficial to the UCI community. 

## Want to get Involved?

We would love for you to help us out! You can look to contribute to this open source project on GitHub. Our repository can be found [here](https://github.com/icssc-projects/peterportal-public-api). 

If your looking to join our team and be even more involved, ICS Student Council recruits students at the beginning of every year to their committees. For more information, please visit <https://studentcouncil.ics.uci.edu/>.

## New to Open Source? 

If you're wondering how to contribute to open source project, you're at the right place. 

1. First, you'll want to (fork the repository)[https://guides.github.com/activities/forking/] to your own account.
2. Clone the respository to your local machine. Click the green *Code* button, and copy the URL. Open up a terminal on your local computer to where you want the repository to be and enter: 

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
    git remote add upstream https://github.com/icssc-projects/peterportal-public-api.git
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

9. Once you've made all the changes you need, you can create a pull request. Open your forked repository and switch to the branch you were working on. Click the *New Pull Request* button. 

10. Fill out the Pull Request template including details about your changes. Once you're done, Create the pull request. Eventually a project maintainer will review the PR. New changes might be requested, in which case you can make new commits for them. Once the pull request is approved, it will be merged, and your changes will be added to the project's master branch. 

11. Once the changes go through, you can delete the old branch, and update your local respository and push the update to your forked respository.
    ```
    git pull upstream master
    git push origin master
    ```

12. Now, you are ready to make another contribution to our project. 

## Repo Overview

| Folder | Purpose |
| ----------- | ----------- |
| /cache | Houses the local data cache |
| /db | Houses grades data cache |
| /docs | Markdown files for documentation |
| /docs-site | Built HTML files for documentation |
| /graphql | GraphQL schema files |
| /public | Assets to be accessible via Public URL |
| /rest | Contains the routes of our REST API |
| /test | Jest test files  |
| /utils | Utilities for server maintenance |



## Documentation

**🤔 Documentation for the documentation. How do you contribute to the documentation?**

The documentation you see right now is created via [MkDocs](https://www.mkdocs.org/). We use a specific extension called [Material for MkDocs](https://squidfunk.github.io/mkdocs-material/) which is what makes this site look pretty.

For Graph static documentation, we use [graphdoc](https://github.com/2fd/graphdoc). While it is a little buggy, it's the best tool I'm aware of that automatically generates static documentation. To update it, you will need two shells open.


!!! example "Shell 1"
    In the first shell, install dependencies and start the server.

    ``` bash
    npm install
    npm start
    ```

    That's it, leave it alone. We need the server to be on because graphdoc will be using the live GraphQL endpoint

!!! example "Shell 2"

    In the next shell, run this command:

    === "Windows"

        ```
        graphdoc -e http://localhost:8080/graphql -o .\graphql\docs --force
        ```

    === "macOS/Linux"

        ```
        graphdoc -e http://localhost:8080/graphql -o graphql/docs --force
        ```

    This specifies the endpoint for GraphQL to use and forces an update on existing documentation files.

### Writing Documentation

**📝 Writing documentation is simple with MkDocs.**

1. Checkout the `docs` branch. All edits to documentation should be made within this branch
2. Make your changes to the markdown (`.md`) files within [`/docs`](https://github.com/icssc-projects/peterportal-public-api/tree/master/docs). You can add or delete files as you so choose.
3. Create a pull request to `master`. Once your pull request is merged with `master`, the documentation site will be automatically rebuilt.

??? info "How is the docs site updated?"
    All documentation site files are built within `/docs-site`.

    A Github Action, [`/.github/workflows/docs.yml`](https://github.com/icssc-projects/peterportal-public-api/blob/master/.github/workflows/docs.yml) automatically rebuilds the site on every push to master. `docs.yml` calls `mkdocs`, a python package, to build the site and automatically commit the new changes.


### Designing Documentation

**✨ Make your documentation user-friendly.**

**👀 Preview your changes live.**

🐍 Our documentation website is made through [Material for MkDocs](https://squidfunk.github.io/mkdocs-material/), a python package.

To setup `mkdocs-material`, see their [cool instructions](https://squidfunk.github.io/mkdocs-material/getting-started/).


Configure documentation site settings in [`/mkdocs.yml`](https://github.com/icssc-projects/peterportal-public-api/blob/master/mkdocs.yml).
