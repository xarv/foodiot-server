const fetch = require('node-fetch')

setInterval( () => {
    fetch('http://104.215.195.176/bowls/1/delta/-10', { method: "POST" })
    .then( (result) => {
        result.text().then(result => {
            console.log(result);
        })
    } )
    .catch( err => {
        console.log(err);
    })
}, 5000);