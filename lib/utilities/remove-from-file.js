'use strict'
const fs = require('fs-extra');
const RSVP = require('rsvp');
const existsSync = require('exists-sync');

const Promise = RSVP.Promise;
const writeFile = RSVP.denodeify(fs.outputFile);

function removefromFile(fullPath, contentToRemove){
  let originalContents = '';
  
  if (existsSync(fullPath)) {
    originalContents = fs.readFileSync(fullPath, { encoding: 'utf8' });
  }

  let contentsToWrite = originalContents;
  let contentIsPresent = originalContents.indexOf(contentToRemove) > -1;
  
  
  if (contentIsPresent) {
    contentsToWrite = contentsToWrite.replace(contentToRemove, '');
  }
  
  let returnValue = {
    path: fullPath,
    originalContents,
    contents: contentsToWrite,
    removed: false,
  };
  
  if (contentsToWrite !== originalContents) {
    returnValue.removed = true;
    
    return writeFile(fullPath, contentsToWrite)
      .then(() => returnValue);

  } else {
    return Promise.resolve(returnValue);
  }
 
}

module.exports = removefromFile;