## Contributing

If you would like to contribute, you can fork the project, edit, and make a pull request.
Provide a good description for your pull request - what does it add, why is that needed etc...

## Tests

Sadly, no tests yet, but we'd happly accept contribution in that field! :-)

### Currently under consideration
- enable option for *nested* resources (ex: `/me/{useid}/posts`)
- enable option for *nested* resources (ex: `/me/{useid}/posts`)
  - Option to create a *link related* relationship.
    - If nested resource, the nested URL should be used
- add "required-on-create" && "optional-on-create" (aka "roc"&"ooc")
  - roc:
    - belongsTo should not create POST DELETE methods on the relationship endpoint, nor clear on PATCH
    - hasMany should not allow clear on PATCH
  
  This is meant to represent situations where an specific related object cna be compulsory for the creation of a resource, or rather can be optionally passed to the server on creation. This would allow to clean up POST calls from unneeded data.
- singularize namesm when needed
- use ember inflector for pluralization
- add a `readOnly` section for attributes (not included in PATCHes)
- add `readOnly` options in relationships (ex: hasmany<->belogsto obj only associated through their post)
- enclose .apib files into `index` folder in order to create a "page" index folder
  - add "page" blueprint to create multiple api pages
- make api-model interactive

- belongsto & hasmany blueprints (should this be interactive?)
- refactor to common code
- search apiblueprint specs for "constant"