/*
Server-side rendering prevents the client from viewing sensitive user information.
Necessary user information (first name, last name, picture, id) is passed
to the initial state of the app on the client side, if the user is logged in.

Note:
- The entry React components (Provider, App) are injected into the page.
- The initialState of the app is saved in window.__INITIAL_STATE__.

http://redux.js.org/docs/recipes/ServerRendering.html

*/

const renderFullPage = function(html, initialState) {
  return `
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <title>Welcome to Scenic.Ninja</title>
        <meta name="description" content="Find beautiful places near your current location." />

        <!-- Schema.org markup for Google+ -->
        <meta itemprop="name" content="Scenic.Ninja">
        <meta itemprop="description" content="Find beautiful places near your current location.">
        <meta itemprop="image" content="http://i.imgur.com/chV68Am.png">

        <!-- Twitter Card data -->
        <meta name="twitter:card" content="product">
        <meta name="twitter:title" content="Scenic.Ninja">
        <meta name="twitter:description" content="Find beautiful places near your current location.">
        <meta name="twitter:image" content="http://i.imgur.com/chV68Am.png">

        <!-- Open Graph data -->
        <meta property="og:title" content="Find Beautiful Places Near You" />
        <meta property="og:url" content="http://www.scenic.ninja/" />
        <meta property="og:image" content="http://i.imgur.com/chV68Am.png" />
        <meta property="og:description" content="Scenic.Ninja uses the Google Places API and your current location to find beautiful places around you." />
        <meta property="og:site_name" content="Scenic.Ninja" />

        <link rel="stylesheet" href="./css/app.css" media="screen" title="no title" charset="utf-8" />
        <link rel="stylesheet" href="./css/simple-line-icons.css" media="screen" title="no title" charset="utf-8" />
        <link rel="stylesheet" href="./css/simple-grid.css" media="screen" title="no title" charset="utf-8" />
        <link rel="stylesheet" href="./css/animate.css" media="screen" title="no title" charset="utf-8" />
        <link href="https://fonts.googleapis.com/css?family=Signika:700,400,600" rel="stylesheet" type="text/css" />
        <script src="https://maps.googleapis.com/maps/api/js"></script>
      </head>
      <body>
        <div id="app">${html}</div>
        <script>
          window.__INITIAL_STATE__ = ${JSON.stringify(initialState)}
        </script>
        <script src="bundle.js"></script>
      </body>
    </html>
    `;
};

export default renderFullPage;
