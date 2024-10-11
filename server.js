const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

process.on('uncaughtException', (err) => {
  console.log(err.name, err.message);
  console.log('UNCAUGHT EXCEPTION! 🔥🔥 Server is shutting down...');

  process.exit(1);
});

const app = require('./app');

// Connect to MongoDB
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

mongoose.connect(DB).then((con) => console.log('Connected to MongoDB...'));

//Start server
const port = process.env.PORT || 8000;

const server = app.listen(port, () => {
  console.log(`Server listening on port: ${port}...`);
});

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('UNHANDLED REJECTION! 🔥🔥 Server is shutting down...');
  server.close(() => {
    process.exit(1);
  });
});
