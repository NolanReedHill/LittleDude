const path = require('path');

module.exports = {
    entry: './Dude/static/scripts/submitQuery.js', // Entry file
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, './Dude/static/dist'), // Output directory
    },
    mode: 'development', // Change to 'production' for deployment
};