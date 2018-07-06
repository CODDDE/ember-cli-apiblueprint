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
If you are new to ember-cli we, suggest you to breafily read its (guide)[http://ember-cli.com] but ember related information is not
needed to work with api-blueprints. To create a new project:

1. Install ember-cli globally: `npm install -g ember-cli`
2. create a new project: `ember new my-awesome-docs`

Inside your project folder, install the addon:

 ```sh
 $ ember install ember-cli-apiblueprint
 ```

The command will execute the default addon blueprint, creating the basic file structure, as detailed below. If it is not
automatically created, try explicitely execute the blueprint running `ember generate ember-cli-apiblueprints`.

```sh
├─┬ project-root
  └─┬ api-blueprints
    └─┬ api-models
    └─┬ api-groups
    └─┬ utils
      ├── 403-response.apib
      ├── 404-array-response.apib
      ├── 404-response.apib
      ├── 409-response.apib
      └── 422-response.apib
  └── index.apib
```

- *api-models* folder will contain one filer per resource created vía the `api-model` blueprint, containing the data structures used in the definition of content for API requests / responses. More details in following sections.
- *api-goups* folder will contain one folder per resource generated vía de `api-model` blueprint, representing an APIBluprint endpints group. More details in the following sections.
- *utils* folder contains some standard response as per the JSONAPI specification.

Intalling the addon on your project will create a a new `api-blueprints` folder under the project root with the foll
It will create a new folder called `api-blueprints` under your project directory.
Inside that folder, (after you generate your first `api-model`) you will find two folders: `api-groups` and `api-models`.

The `api-groups` folder will contain the endpoints where to make requests and information about your models and also the same for its relationships and in the `api-models`
folder you will find the model definitions (type, attrs, relationships).

Inside these folders, some `.apib` files (a high-level API description language for web APIs) will be generated containing this data.

## ember-cli blueprints

### `api-model`

This blueprint is used for the generation of the datastructures needed for the representation of one JSONAPI resource, alongside with the base endpoints used to perform CRUD operation over the newly created resource.

#### Create a resource

```sh
$ ember generate api-model blogPost
```

The execution of the blueprint will create the following files:

<small><strong>Note:</strong> only relevant parts of the file structure is shown for brevity</small>
```sh
├─┬ project-root
  └─┬ api-blueprints
    └─┬ api-models
      └── blog-post.apib
    └─┬ api-groups
      └─┬ blog-post
        └── blog-post.apib
  └── index.apib
```
`api-groups/blog-post.apib` file containing the APIBlueprint description of standard JSONAPI calls for the the endpoint `/blog-post` covering the HTTP methods GET, POST, PATCH, DELETE for both a single *blogPost* resource as well as a collection of them.

`api-models/blog-post.apib` file containing the data structures used to describe the resource. In order to add resource attributes, localize the `SoftClassAttributes` structure, which will contain a default *name* attribute.



#### Delete a resource

```sh
$ ember destroy api-model blogPost
```

The execution of this blueprint will remove all previously created files and folder.

**Note**: in order to properly remove all related code, the blueprint must be executed with the exact set of options used during creation.


### `api-belongsto`

This blueprint is used for the generation of the endpoints used to interact with a *to-one* relationship between two JSONAPI resources. Additionaly, the data structures of the related resources will be updated with the information needed in order to represent the relationship on JSONAPI documents.

**Note** in order for this blueprint to properly work related resources must be already present in the project.

#### Create a *to-one* relationship

For the creation of the code used in the following example, we'll assume that both *blogPost* and *postComment* resources have been created.


```sh
$ ember generate api-belongsto post --to=blogComment
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
