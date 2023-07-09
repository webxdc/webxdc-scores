# webxdc-scores

Library to facilitate the process of creating score-based webxdc games.

## Usage

Copy the `dist/webxdc-scores.umd.js` file to your project's folder, then include it (together with `webxdc.js`) in your `index.html`:

```html
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width" />

    <script src="webxdc.js"></script>
    <script src="./webxdc-scores.umd.js"></script>
  </head>
  <body>
    ...
  </body>
</html>
```

Then you will have an scores API via `window.highscores` object, check `webxdc-scores.d.ts` file for documentation of the available API.

> **⚠️ NOTE:** If you use `window.highscores.getScoreboard()` you need to include `webxdc-scores.css` in your `index.html`, edit it to adapt the scoreboard style to your app.

For a full example check the `index.html` file included in this repository.
