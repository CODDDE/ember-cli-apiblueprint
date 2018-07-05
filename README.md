# ember-cli-apiblueprint

This addon is aimed at the generatation of a [JSONAPI](www.jsonapi.org) compliant API interface documentation file,
written in [Apiblueprint](https://apiblueprint.org/) syntax. It provides a set of *ember-cli blueprints* that can be
used to easily generate standard endpoint groups, more complex calls and detailed description is left up to you.

## Table of contents

- [Introduction](#introduction)
- [Installation](#installation)
- Blueprints
  - [api-model](#api-model)
  - [api-belongsto](#api-belongsto)
  - [api-hasmany](#api-hasmany)
- [Generate documentation](#generate-documentation)
- [Contribute](#contribute)


## Introduction

The addon provides a set of blueprints easying the creation of a JSONAPI compliant API interface. The resulting documentation project
will be located under the `api-blueprints` folder and is structured following the concepts of *model*, *group* and *relationship*.

"Model" correspondes to the JSONAPI concept of *resourcce* while "group" represents a collection of endpoints as per the APIBlueprint
specification. "Relationship" includes either the *to-one* as well as the *to-many* relationships described in the JSONAPI specification.

## Installation

The project is shipped as an ember-cli addon, thus an ember-cli project is required in order to use this addon.
If you are new to ember-cli we suggest you to breafily read its (guide)[http://ember-cli.com] but ember-related information is not
needed to work with api-blueprints. To create a new project:

1. Install ember-cli globally: `npm install -g ember-cli`
2. create a new project: `ember new my-awesome-docs`

Inside your project folder, install the addon:

 ```sh
 $ ember install ember-cli-apiblueprint
 ```

The command will execute the default addon blueprint, creating the basic file structure, as detailed below. If it is not
automatically created, try explicitely execute the blue print with `ember generate ember-cli-apiblueprints`.

```sh
├─┬ project-root
  └─┬ app
  └─┬ api-blueprints
    └─┬ api-groups
    └─┬ api-models
    └─┬ utils
  ├── index.apib
  └── date-selector.json
```

 
Intalling the addon on your project will create a a new `api-blueprints` folder under the project root with the foll
It will create a new folder called `api-blueprints` under your project directory.
Inside that folder, (after you generate your first `api-model`) you will find two folders: `api-groups` and `api-models`.

The `api-groups` folder will contain the endpoints where to make requests and information about your models and also the same for its relationships and in the `api-models`
folder you will find the model definitions (type, attrs, relationships).

Inside these folders, some `.apib` files (a high-level API description language for web APIs) will be generated containing this data.

## ember-cli blueprints

### `api-model`

Usage:

```sh
$ ember (generate|g / destroy|d) api-model modelName
```

---

E.G: generate the api-models for called `blog`, `post` and `comment`
```sh
  $ ember g api-model blog

  $ ember g api-model post

  $ ember g api-model comment
```  

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

This means that you will have to add the rest of the attributes for the generated api-models, as the `api-model` blueprint will only generate a basic model.

---

### `api-belongsto`

This blueprint generates the `belongsTo` relationship for a model.

**NOTE** Before using this blueprint you need to have your two `api-models` generated

Usage:
```sh
$ ember (generate|g / destroy|d) api-belongsto relationshipName --to=modelToAddRelationship [--modeltype=realModelName] [--required]
```


Where:

* `relationshipName` is the name of the relationship that you want to add
* `modelToAddRelationship` is the model that will be updated with this new relationship
* `realModelName` (optional), in case that the `relationshipName` is different from the generated `api-model` name.
* `required` (optional), using the required modifier will add into this model's `POST` API endpoint the needed relationship as shown below

---

E.G:
```sh
$ ember g api-belongsto post --to=comment
```

**Basic relationship**

As they're not required this will be the API definition

```js
"data": {
    ...,
    "relationships": {}
  }
```

E.G:
```sh
$ ember g api-belongsto post --to=comment --required
```

**Required relationship**

```js
"data": {
    ...,
    "relationships": {
      "post": {
        "data": {
          "id": 1,
          "type": "posts"
        }
      }
    }
  }
```

This means that a new `relationshipName.apib` file will be added in the `api-groups/modelToAddRelationship/relationships` folder, in this case
a new `post.apib` will be added in the `api-groups/comment/relationships` folder.

This would be the generated endpoint to get the `post` of a `comment`:
`/comments/{id}/relationships/post` that MUST return a unique object

---

### `api-hasmany`

This blueprint generates the `hasMany` relationship for a model.

**NOTE** Before using this blueprint you need to have your two `api-models` generated

Usage:

```sh
$ ember (generate|g / destroy|d) api-hasmany relationshipName --to=modelToAddRelationship [--modeltype=realModelName] [--linked]
```

Where:

* `relationshipName` is the name of the relationship that you want to add. **NOTE** the `relationshipName` will be pluralized by default, but you can set a value of `comments` and it won't be pluralized (as it already is pluralized)
* `modelToAddRelationship` is the model that will be updated with this new relationship
* `realModelName` (optional), in case that the `relationshipName` is different from the generated `api-model` name.
* `linked`, when using `--linked` the relatioship will be treated as a `link-related` one.
* `required` (optional), using the required modifier will add into this model's `POST` API endpoint the needed relationship as shown below

---

E.G:
```sh
$ ember g api-hasmany comment --to=post
```

   **Basic relationship**

   As they're not required this will be the API definition

```js
 "data": {
   ...,
   "relationships": {}
 }
```

E.G:
```sh
$ ember g api-hasmany comment --to=post --required
```

   **Required relationship**

```js
 "data": {
   ...,
   "relationships": {
     "comments": {
        "data": [
          {
            "id": 1,
            "type": "comments"
          }
        ]
      }
    }
 }
```

E.G:
```sh
$ ember g api-hasmany comment --to=post --linked
```

   **Link related relationship**

```js
"data": {
 ...,
 "relationships": {
   "comments": {
      "links": {
        "related": "/api/v1/posts/1/relationships/comments"
      }
    }
  }
}
```

This means that a new `relationshipName.apib` file will be added in the `api-groups/modelToAddRelationship/relationships` folder, in this case
a new `comments.apib` will be added in the `api-groups/post/relationships` folder.

This would be the generated endpoint to get the `comments` of a `post`:
`/post/{id}/relationships/comments` that MUST return an array

---

## Generate documentation

You can either execute

```sh
$ ember serve
```
HTML compiled output is then accesible at `localhost:4200/api-docs/index.html`.

or

```sh
$ ember build
```

After building your project, the compiled HTML docuemntation can be found under the `dist/api-docs` folder
in a single `index.html` file.


## Contribute

See our [contribution guide](./CONTRIBUTING.md).
