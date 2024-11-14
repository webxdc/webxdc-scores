# Highscores

Library to facilitate the process of creating score-based webxdc games.
It can handle multiple scoreboards at the same time.

## Install

```
npm install @webxdc/highscores
```

## Usage

Quick overview of the API:

```js
import "@webxdc/highscores";

// always do this first, only use the API after init() finishes
await window.highscores.init();

// get current player's highscore
const score = window.highscores.getScore();
console.log(`your score: ${score}`);

// this will cause an announcement in chat only if it's a new highscore
window.highscores.setScore(score + 100);

const scoreboard = window.highscores.getHighScores();
scoreboard.forEach((player) => {
  console.log(`${player.pos}. ${player.name} - ${player.score}`);
});
```

The `webxdc.js` lib also needs to be included in your `index.html`:

```html
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width" />
    <script src="webxdc.js"></script>
    <script type="module">
      import "@webxdc/highscores";
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
    <script src="./node_modules/@webxdc/highscores/dist/webxdc-scores.umd.js"></script>
  </head>
  <body>
    ...
  </body>
</html>
```

Then you can access the API via `window.highscores` object, check [dist/highscores.d.ts](https://github.com/webxdc/highscores/blob/main/dist/highscores.d.ts) file for documentation of the available API.

For a full example check the [example/index.html](https://github.com/webxdc/highscores/blob/main/example/index.html) file.
