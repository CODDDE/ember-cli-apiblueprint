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
<small><strong>Note:</strong> only relevant parts of the file structure is shown for brevity</small>

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

**Note** in order for this blueprint to properly work, related resources must be already present in the project.

#### Create a *to-one* relationship
<small>For the creation of the code used in the following example, we'll assume that both *blogPost* and *postComment* resources have already been created.</small>

```sh
$ ember generate api-belongsto post --to=blog-comment --modeltype=blog-post
```

The execution of the blueprint will create the following files:

```sh
├─┬ project-root
  └─┬ api-blueprints
    └─┬ api-groups
      └─┬ blog-comment
        ├─┬ relationships
          └── post.apib
        └── blog-comment.apib
```
<small><strong>Note:</strong> only relevant parts of the file structure is shown for brevity</small>

The *relationships* folder is created and a new file identified with the name of the relationship (`post.api`) is created to describe the standard endpoints and operations available for the newly create relationship. Besides, the *api-groups/blog-comment/blog-coment.apib* file is updated to include the new calls into the resource APIBlueprint group.

Additionally, the *api-models/blog-comment.apib* file is updated to reflect the presence of the new relationship in the data structure representing the blogComment resource.

The *api-belongsto* blueprints accepts the following parameters and options:

*ember generate api-belongsto relationshipName --to=targetResource --modeltype=relationshipResourceType --required*

| Param / option   | Accepted values | Description |
| -------- | ------- | --- |
| *relationshipName* | string | **Required** Custom name of the relationship |
| *to* | resource name | **Required** The resource that will be updated with the new relationship |
| *required* | no value is needed | **Optional** If present, the relationship will be added into the *resourceName*RequiredRelationships data structure. *Note* that, if the relationship is optional it will not be included in the example body for a creation request of the target resource |


#### Delete a *to-one* relationship

```sh
$ ember destroy api-belongsto post --to=blog-comment --modeltype=blog-post
```

The execution of this blueprint will remove all previously created files and folder.

**Note**: in order to properly remove all related code, the blueprint must be executed with the exact set of options used during creation.


### `api-hasmany`

This blueprint is used for the generation of the endpoints used to interact with a *to-many* relationship between two JSONAPI resources. Additionaly, the data structures of the related resources will be updated with the information needed in order to represent the relationship on JSONAPI documents.

**Note** in order for this blueprint to properly work, related resources must be already present in the project.

#### Create a *to-many* relationship
<small>For the creation of the code used in the following example, we'll assume that both *blogPost* and *postComment* resources have already been created.</small>

```sh
$ ember generate api-hasmany comment --to=blog-post --modeltype=blog-comment
```

The execution of the blueprint will create the following files:

```sh
├─┬ project-root
  └─┬ api-blueprints
    └─┬ api-groups
      └─┬ blog-post
        ├─┬ relationships
          └── comments.apib
        └── blog-post.apib
```
<small><strong>Note:</strong> only relevant parts of the file structure is shown for brevity</small>

The *relationships* folder is created and a new file identified with the pluralized name of the relationship (`comments.api`) is created to describe the standard endpoints and operations available for the newly create relationship. Besides, the *api-groups/blog-post/blog-post.apib* file is updated to include the new calls into the resource APIBlueprint group.

Additionally, the *api-models/blog-post.apib* file is updated to reflect the presence of the new relationship in the data structure representing the blogPost resource.

The *api-hasmany* blueprints accepts the following parameters and options:

*ember generate api-hasmany relationshipName --to=targetResource --modeltype=relationshipResourceType --required --linked*

| Param / option   | Accepted values | Description |
| -------- | ------- | --- |
| *relationshipName* | string | **Required** Custom name of the relationship. *Note* that the provided value will be automatically pluralized. |
| *to* | resource name | **Required** The resource that will be updated with the new relationship |
| *required* | no value is needed | **Optional** If present, the relationship will be added into the *resourceName*RequiredRelationships data structure. *Note* that, if the relationship is optional it will not be included in the example body for a creation request of the target resource |
| *linked* | no value is needed | **Optional** If present, the relationship will be represented as a *links object* instead of a *resource object* as described in [JSONAPI specifications](http://jsonapi.org/format/#document-resource-object-relationships) |



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

After building your project, the compiled HTML documentation can be found under the `dist/api-docs` folder
in a single `index.html` file.


## Contribute

See our [contribution guide](./CONTRIBUTING.md).
