const express = require('express');
const app = express();

const loaders = require('./loaders');

const PORT = process.env.PORT || 4001;


async function startServer () {
 // To send app as a prop to an entire directory we need a index.js to handle all the js files in the directory and send the prop to the others
    // app.use(express.static(__dirname + '/public'));
    loaders(app);


    app.listen(PORT, () => {
        console.log(`Server is listening on port :${PORT}`);
    });//

}

startServer();
