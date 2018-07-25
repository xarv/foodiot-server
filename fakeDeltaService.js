
setInterval( () => {
    fetch('http://104.215.195.176/bowls/1/delta/-10')
    .then( (result) => {
        console.log(result);
    } )
    .catch( err => {
        console.log(err);
    })
}, 5000);