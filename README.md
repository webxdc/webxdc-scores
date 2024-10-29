# webxdc-scores

Library to facilitate the process of creating score-based webxdc games.

## Install

```
npm install git+https://github.com/webxdc/webxdc-scores.git
```

## Usage

Import webxdc-scores lib (`webxdc.js` also needs to be included) in your `index.html`:

```html
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width" />
    <script src="webxdc.js"></script>

    <script type="module">
      import "webxdc-scores";
      // you can use window.highscores here
    </script>
  </head>
  <body>
    ...
  </body>
</html>
```

## Usage without modules

Include webxdc-scores lib (together with `webxdc.js`) in your `index.html`:

```html
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width" />

    <script src="webxdc.js"></script>
    <script src="./node_modules/webxdc-scores/dist/webxdc-scores.umd.js"></script>
  </head>
  <body>
    ...
  </body>
</html>
```

Then you will have an scores API via `window.highscores` object, check `dist/webxdc-scores.d.ts` file for documentation of the available API.

> **⚠️ NOTE:** If you pass the scoreboard parameter to `window.highscores.init()` you need to include `dist/webxdc-scores.css` in your `index.html`, edit it to adapt the scoreboard style to your app.

For a full example check the `index.html` file included in this repository.
