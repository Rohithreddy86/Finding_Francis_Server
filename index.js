const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');

// create express app
const app = express();
app.use(cors());
console.log(process.env.PORT);

const port = process.env.PORT || 9000;

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// define a simple route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Finding Francis Server. Go to /metadata for getting database metadata.' });
});

require('./app/routes/metadata.routes')(app);

// listen for requests
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
