const path = require('path')
module.exports = {
    entry: './src/js/solar.js',
    output:{
        filename: 'solar.js',
        path: path.resolve(__dirname, 'dist')
    },
    module:{
        rules:[
            {
                test: /\.(png|jpg|gif)$/i,
                type: 'asset/inline'
            },
            {
                test: /\.css$/i,
                use: ["css-loader"],
              },
              {
                test: /\.(png|svg|jpg|jpeg|gif|ogg|mp3|wav)$/i,
                type: 'asset/resource',
              },
        ]
    },
    mode: "development"
}