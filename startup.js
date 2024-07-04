const app = require('./app');
const PORT = 3000;

async function init() {
  app.listen(PORT, () => {
    console.log(`Express server started on port ${PORT}.`);
  });
}

init();
