const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const app = require('./app');

// Connect to MongoDB
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

mongoose.connect(DB).then((con) => console.log('Connected to MongoDB...'));

//Start server
const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Server listening on port: ${port}...`);
});
