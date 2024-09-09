const app = require('./app');

//Start server
const port = 3000;

app.listen(port, () => {
  console.log(`Server listening on port: ${port}...`);
});
