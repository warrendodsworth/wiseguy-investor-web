const express = require('express');
const path = require('path');
const server = express();

const port = process.env.PORT || 3000;

const rootPath = path.join(__dirname, 'dist');

// set vd path
var virtualDirPath = '/vd/';

// dist
server.use(virtualDirPath, express.static(path.join(__dirname, 'dist')));
// node_modules
server.use(virtualDirPath + 'node_modules', express.static(path.join(__dirname, 'node_modules')));

// Setup a route at the index of our app
server.get(virtualDirPath + '*', (req, res) => {
  return res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
});

server.listen(port, () => {
  console.log(`Listening on ${port}`);
});
