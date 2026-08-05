# Contributing

`@nrfcloud/lambda-helpers` is a published library: it provides helper functions
for AWS Lambda functions used in nRF Cloud and is published to
[NPM](https://www.npmjs.com/package/@nrfcloud/lambda-helpers).

## Development setup

1. Ensure you
   [have GitHub push access](https://nordicsemi.atlassian.net/wiki/spaces/MFLT/pages/1727136233/Nordic+Engineering+Tools+Setup+go+eng-tools#nRFCloud-Organization).
1. Get your environment set up by running `npm ci`
1. Make your changes locally in a git clone of the repo in your own branch.
1. As you go, commit along the way so that you get type checking, testing, etc.
   to run.

## Testing

1. Run `npx tsc` to type-check the project.
1. Run `npm test` to run the unit tests.

## Building the NPM package

The package is published as compiled JavaScript with type declarations in the
`npm/` folder, which is created by the `prepublishOnly` hook:

1. [`.npm/compile.ts`](.npm/compile.ts) transpiles the TypeScript sources using
   [`@swc/core`](https://www.npmjs.com/package/@swc/core) and rewrites the `.ts`
   import specifiers to `.js`.
1. [TypeScript 7](https://www.npmjs.com/package/typescript) emits the type
   declarations, using [`.npm/tsconfig.npm.json`](.npm/tsconfig.npm.json).

Run `npm run prepublishOnly` to build it locally.

## Releasing a new version

1. Finally, create a commit that packages up all the changes.
1. Use [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/)
   (e.g. `fix:`, `feat:`, etc.) to prefix the title.
1. Reference any applicable Jira tickets (e.g. `NPE-123`) in the commit message.
1. Push your branch and create a pull request.
1. Get the code reviewed.
1. Once approved and CI passes, rebase or squash away!
1. [`semantic-release` in the Test&Release workflow](.github/workflows/test-and-release.yaml)
   takes care of creating a new GitHub release and publishing the package to
   [NPM](https://www.npmjs.com/package/@nrfcloud/lambda-helpers).

Now that you have a new version of `@nrfcloud/lambda-helpers` published, you can
bump the dependency in the projects that consume it.
