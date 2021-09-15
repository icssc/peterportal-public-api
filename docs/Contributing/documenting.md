
## Documentation

**🤔 Documentation for the documentation. How do you contribute to the documentation?**

The documentation you see right now is created via [MkDocs](https://www.mkdocs.org/). We use a specific extension called [Material for MkDocs](https://squidfunk.github.io/mkdocs-material/) which is what makes this site look pretty.

To setup `mkdocs-material`, see their [cool instructions](https://squidfunk.github.io/mkdocs-material/getting-started/).

For GraphQL documentation, the playground generates the documentation for us automatically.

### Writing Documentation

**📝 Writing documentation is simple with MkDocs.**

1. Open up the project, and navigate to the [`/docs`](https://github.com/icssc-projects/peterportal-public-api/tree/master/docs) folder.
2. Make your changes to the markdown (`.md`) files within this folder.
3. Create a pull request to `master`. Once your pull request is merged with `master`, the documentation site will be automatically rebuilt.

??? info "How is the docs site updated?"
    All documentation site files are built to `/docs-site`.

    The docs are run through a CI pipeline through [CircleCI](https://circleci.com/), that will automatically build the documentation into the `/docs-site` folder. This build is run through a command by the MkDocs python package.


### Designing Documentation

**✨ Make your documentation user-friendly.**

**👀 Preview your changes live.**

Preview your changes with `mkdocs serve`, and see the generated documentation locally with `mkdocs build -d docs-site`. 

Configure documentation site settings in [`/mkdocs.yml`](https://github.com/icssc-projects/peterportal-public-api/blob/master/mkdocs.yml).

