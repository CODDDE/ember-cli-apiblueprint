/* eslint-env node */

const mkdirp = require('mkdirp');

module.exports = {
  description: '',
  
  normalizeEntityName: function() {},

  locals(options) {
    // Return custom template variables here.
    debugger
    return options;
    // return {
    //   foo: options.entity.options.foo
    // };
  }

  // afterInstall(options) {
  //   // Perform extra work here.
  // }
};
