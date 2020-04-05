const express = require('express');
const path = require('path');
const app = express();

const port = process.env.PORT || 3000;

const rootPath = path.join(__dirname, 'dist');

// set vd path
let vd = '/vd/';

app.use(vd, express.static(path.join(__dirname, 'dist')));
app.use(vd + 'node_modules', express.static(path.join(__dirname, 'node_modules')));
app.get(vd, (req, res) => res.sendFile(path.resolve(__dirname, 'dist', 'index.html')));

app.listen(port, () => {
  console.log(`Listening on ${port}`);
});
