const fs = require('fs');
const path = require('path');

function jsonReaders(filePath, cb) {
  fs.readFile(filePath, 'utf8', (err, fileData) => {
    if (err) {
      return cb && cb(err);
    }
    try {
      const object = JSON.parse(fileData);
      return cb && cb(null, object);
    } catch (err) {
      return cb && cb(err);
    }
  });
}

function jsonReader(filePath, cb) {
  fs.readFile(path.join(__dirname, '../dup.json'), 'utf8', (err, jsonString) => {
    if (err) {
      console.log(err);
      return;
    }
    try {
        const dup = JSON.parse(jsonString);
        console.log('jsonreader')
        console.log(dup?.paths['/users/{userId}']?.get?.parameters[0].schema.enum); // => "Infinity Loop Drive"
        console.log('jsonreader')
    } catch (err) {
        next(err)
    }
  });
}



// const customer = {
//   name: "Newbie Corp.",
//   order_count: 0,
//   address: "Po Box City"
// };
// const jsonString = JSON.stringify(customer);
// console.log(jsonString);
// => "{"name":"Newbie Co.","address":"Po Box City","order_count":0}"


module.exports = { jsonReader }