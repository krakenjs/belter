belter
------

[![build status][build-badge]][build]
[![code coverage][coverage-badge]][coverage]
[![npm version][version-badge]][package]
[![apache license][license-badge]][license]

[build-badge]: https://img.shields.io/github/workflow/status/krakenjs/belter/build?logo=github&style=flat-square
[build]: https://github.com/krakenjs/belter/actions?query=workflow%3Abuild
[coverage-badge]: https://img.shields.io/codecov/c/github/krakenjs/belter.svg?style=flat-square
[coverage]: https://codecov.io/github/krakenjs/belter/
[version-badge]: https://img.shields.io/npm/v/belter.svg?style=flat-square
[package]: https://www.npmjs.com/package/belter
[license-badge]: https://img.shields.io/npm/l/belter.svg?style=flat-square
[license]: https://github.com/krakenjs/belter/blob/master/LICENSE

Miscellaneous browser utils and tools.

Quick Start
-----------

#### Getting Started

- Fork the module
- Run setup: `npm run setup`
- Start editing code in `./src` and writing tests in `./tests`
- `npm run build`

#### Building

```bash
npm run build
```

#### Tests

- Edit tests in `./test/tests`
- Run the tests:

  ```bash
  npm run test
  ```

#### Testing with different/multiple browsers

```bash
npm run karma -- --browser=PhantomJS
npm run karma -- --browser=Chrome
npm run karma -- --browser=Safari
npm run karma -- --browser=Firefox
npm run karma -- --browser=PhantomJS,Chrome,Safari,Firefox
```

#### Keeping the browser open after tests

```bash
npm run karma -- --browser=Chrome --keep-open
```

#### Publishing

- Publish your code: `npm run release` to add a patch
  - Or `npm run release:path`, `npm run release:minor`, `npm run release:major`