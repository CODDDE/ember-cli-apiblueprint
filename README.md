# ember-cli-apiblueprint

This README outlines the details of collaborating on this Ember addon.

## Installation

 * `open the directory where you want this addon to be installed`
 * `ember install ember-cli-apiblueprint`

## How to use it

* `api-model`

Usage: `ember (generate/destroy/g/d) api-model modelName`

E.G: generate the api-models for called `blog`, `post` and `comment`

  `ember g api-model blog`
  `ember g api-model post`
  `ember g api-model comment`

The `api-model` blueprint will generate a basic api blueprint with this syntax:

```
## Post
+ id: 1 (number, required) - unique ID
+ type: post (string, required)
+ attributes (PostAttributes, required)
+ relationships (PostRelationships, required)

## PostAttributes (object)
+ name (string) - attribute example

## PostRelationships (object)



## PostType (object)
+ id: 1 (number, required) - unique ID
+ type: post (string, required)
```

 * `api-belongsto`

This blueprint generates the `belongsTo` relationship for a model
**NOTE** Before using this blueprint you need to have your two `api-models` generated

Usage: `ember (generate/destroy/g/d) api-belongsto relationshipName --to=modelToAddRelationship [--modelName=realModelName]`
Where:
* `relationshipName` is the name of the relationship that you want to add
* `modelToAddRelationship` is the model that will be updated with this new relationship
* `readModelName` (optional), in case that the `relationshipName` is different from the  generated `api-model` name.

E.G: `ember g api-belongsto post --to=comment`

This means that a new `relationshipName.apib` file will be added in the `api-groups/modelToAddRelationship/relationships` folder, in this case
a new `comment.apib` will be added in the `api-groups/post/relationships` folder.

This would be the generated endpoint to get the `post` of a `comment`:
`/comments/{id}/relationships/post` that MUST return a unique object

* `api-hasmany`

This blueprint generates the `hasMany` relationship for a model
**NOTE** Before using this blueprint you need to have your two `api-models` generated

Usage: `ember (generate/destroy/g/d) api-hasmany relationshipName --to=modelToAddRelationship [--modelName=realModelName]`

Where:
* `relationshipName` is the name of the relationship that you want to add
* `modelToAddRelationship` is the model that will be updated with this new relationship
* `readModelName` (optional), in case that the `relationshipName` is different from the  generated `api-model` name.

E.G: `ember g api-hasmany post --to=blog`

This means that a new `relationshipName.apib` file will be added in the `api-groups/modelToAddRelationship/relationships` folder, in this case
a new `comment.apib` will be added in the `api-groups/post/relationships` folder.

This would be the generated endpoint to get the `posts` of a `blog`:
`/blog/{id}/relationships/posts` that MUST return an array

## Generate the API file

* `ember build`

After building your app, you will see a message in the console like this:

`Built project successfully. Stored in "dist/".`

The API file, `index.html`, will be generated under the `dist/api-docs` folder

## Running Tests

* `npm test` (Runs `ember try:each` to test your addon against multiple Ember versions)
* `ember test`
* `ember test --server`

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

## Contributing

See our [contribution guide](./CONTRIBUTING.md).
