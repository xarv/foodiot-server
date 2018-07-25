const Docs = require('express-api-doc');
const app = require('./app'); // your app.js
const docs = new Docs(app);
docs.generate({
  path:     './build/docs.html',
});