# ember-cli-apiblueprint

This README outlines the details of collaborating on this Ember addon.

## Installation

* `git clone <repository-url>` this repository
* `cd ember-cli-apiblueprint`
* `npm install`

## Running

* `ember serve`
* Visit your app at [http://localhost:4200](http://localhost:4200).

## Running Tests

* `npm test` (Runs `ember try:each` to test your addon against multiple Ember versions)
* `ember test`
* `ember test --server`

## Building

* `ember build`

For more information on using ember-cli, visit [https://ember-cli.com/](https://ember-cli.com/).

## Bugs
- aglio crashes if an included fiel is not present, causing broccoli to crash
  - surraund with try-catch and reject the promise?
- relationship should be wrapped in `data` obejcts
- use dasherized names for properties in data structures
- dasherized property names are not correctly compiled within data structures

### Considering for implementation
- search apiblueprint specs for "constant"
- add "required-on-create" && "optional-on-create" (aka "roc"&"ooc")
  - roc:
    - belongsTo should not create POST DELETE methods on the relationship endpoint, nor clear on PATCH
    - hasMany should not allow clear on PATCH
- singularize namesm when needed
- use ember inflector for pluralization
- add a `readOnly` section for attributes (not included in PATCHes)
- add `readOnly` options in relationships (ex: hasmany<->belogsto obj only associated through their post)
- enclose .apib files into `index` folder in order to create a "page" index folder
  - add "page" blueprint to create multiple api pages
- make api-model interactive
  - enable option for *nested* resources (ex: `/me/{useid}/posts`)
- belongsto & hasmany blueprints (should this be interactive?)
  - refactor to common code
  - enable option for *nested* resources (ex: `/me/{useid}/posts`)
  - Option to create a *link related* relationship.
    - If nested resource, the nested URL should be used
  - enable option to choose the name of the relationship, default to model name as for now
