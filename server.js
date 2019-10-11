const express = require('express')
const PORT = process.env.PORT || 8081
const app = express();

app.use(express.static('docs'));
app.listen(PORT, () => console.log(`Listening on ${ PORT }`));
