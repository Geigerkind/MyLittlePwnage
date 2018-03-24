const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
  entry: {
    app: './lib/index.js',
  },
  output: {
    filename: '[name].bundle.[hash].js',
    path: path.resolve(__dirname, 'docs')
  },
  plugins: [
    new CleanWebpackPlugin(['docs']),
    new HtmlWebpackPlugin({
      inject: false,
      template: require('html-webpack-template'),
      title: 'MyLittlePwnage',
      headHtmlSnippet: `
        <script async src="https://www.googletagmanager.com/gtag/js?id=UA-107735472-2"></script>
      <script>
          window.dataLayer = window.dataLayer || [];
          function gtag() { dataLayer.push(arguments); }
          gtag('js', new Date());

          window.GA_TRACKING_ID = 'UA-107735472-2';

          gtag('config', window.GA_TRACKING_ID);
      </script>

      <style>
      body{
    color: #e1f2f5;
    line-height: 1.4;
    font-size: 14px;
    font-family: Arial !important;
    background-color: rgba(0,0,0,.81);
    margin: 0;
    padding: 0;
}

header{
    background:rgba(0,0,0,.51);

    position: absolute;
    top: 0;
    width: 100%;
    height: 50px;
    box-shadow: rgba(255,255,255,.1) 0 1px 0,rgba(0,0,0,.8) 0 1px 7px 0;

}

header div{
    float: left;
    height: 50px;
    padding: 5px 10px 0 10px;
    cursor: pointer;
}

main{
    margin-top: 50px;
    width: 100%;
    min-height: 300px;
    text-align: center;
}

section{
    width: 100%;
    min-height: 300px;
    box-shadow: rgba(255,255,255,.1) 0 1px 0,rgba(0,0,0,.8) 0 2px 3px 0;
    padding-bottom: 200px;
    padding-top: 100px;
}

.button{
    background-color: rgba(0,0,0,.51);
    
    height: 50px;
    min-width: 100px;
    max-width: 300px;
    border-radius: 3px 3px 3px 3px;
    font-size: 24px;
    line-height: 50px;
    margin: 10px auto;

    box-shadow: rgba(255,255,255,.1) 0 1px 0,rgba(0,0,0,.8) 0 1px 7px 0 inset;
}

input{
    background-color: rgba(0,0,0,.51);
    box-shadow: rgba(255,255,255,.1) 0 1px 0,rgba(0,0,0,.8) 0 1px 7px 0 inset;
    width: 280px;
    height: 50px;

    border: 1px solid #ccc;
    font-size: 18px;
    padding: 0 10px 0 10px;
    color: #e1f2f5;
    margin-top: 10px;
}

.button:hover{
    cursor: pointer;
}

h1{
	font-size: 28px;
	font-style: normal;
	font-variant: normal;
	font-weight: 400;
    line-height: 28px;

    max-width: 300px;
    min-width: 100px;
    margin: 30px auto;
    margin-bottom: 50px;
}

footer{
    height: 50px;
    width: 100%;
    text-align: center;
    padding-top: 25px;
    line-height: 35px;
    font-size: 18px;
}

footer a{
    margin: 0 10px 0 10px;
}

a:active, a:visited, a:link{
    text-decoration: none;
    color: #e1f2f5;
}

a:hover{
    text-decoration: none;
    color: #f28f45;
}

table{
    width: 300px;
    border-spacing: 0;
    font-size: 16px;

    margin: -20px auto;
    margin-bottom: 10px;

    box-shadow: rgba(255,255,255,.1) 0 1px 0,rgba(0,0,0,.8) 0 1px 7px 0 inset;
}

section:nth-child(2)
{
    padding-top: 200px;
    padding-bottom: 0px;
}

table tr{
    width: 100px;
    height: 30px;
}

table thead{
    background-color:rgba(0,0,0,.5);
}

table tr:nth-child(even){
    background-color:rgba(0,0,0,.3);
}
table tr:nth-child(odd){
    background-color:rgba(0,0,0,.05);
}

.container{
    width: 300px;
    margin: 0 auto;
}

.container h1{
    margin-bottom: 5px;
}

#mode-button{
    font-size: 20px;
}

#title{
    line-height: 40px;
    font-size: 24px;
}</style>
      `,
      bodyHtmlSnippet: `
       <header>
        <div>
            <a href="javascript:void(0);">
                <img height="40" width="40" title="MyLittlePwnage" />
            </a>
        </div>
        <div id="title">MyLittlePwnage</div>
    </header>
    <main>
        <section>
            <img height="200" width="200"/>
            <h1>Ready to pwn?</h1>
            <div class="button">Singleplayer</div>
            <div class="button">Multiplayer</div>
            <div class="button" id="mode-button">Mode: Number => Password</div>
        </section>
    </main>
    <footer>
        <a href="javascript:void(0);">Imprint</a>
    </footer>
      `,
      meta: [
        {
          name: 'description',
          content: 'Guess the amount of times a password was pwned!'
        }, {
          name: 'viewport',
          content: "width=device-width, initial-scale=1"
        }
      ],
      lang: 'en-US',
      inlineManifestWebpackName: 'webpackManifest',

      //  hash: true
    }),
  ],
  resolve: {
    extensions: ['.js', '.json', '.ts', '.tsx'],
  },
  module: {
    rules: [
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          'file-loader',
          {
            loader: 'image-webpack-loader',
            options: {
              bypassOnDebug: true,
            },
          },
        ]
      },
      { 
        test: /\.tsx?$/, 
        loader:'ts-loader'
      }
    ]
  },
  
};