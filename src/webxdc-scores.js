import jsSHA from "jssha";

export const highscores = (() => {
  let players = [],
    _appName = "",
    container = undefined;
  const selfID = new jsSHA("SHA-512", "TEXT", { encoding: "UTF8" })
    .update(window.webxdc.selfAddr)
    .getHash("HEX");
  const maxserialKey = "webxdc-scores.max_serial",
    playersKey = "webxdc-scores.players";

  function h(tag, attributes, ...children) {
    const element = document.createElement(tag);
    if (attributes) {
      Object.entries(attributes).forEach((entry) => {
        element.setAttribute(entry[0], entry[1]);
      });
    }
    element.append(...children);
    return element;
  }

  function getScore(id) {
    return players[id] ? players[id].score : 0;
  }

  function getHighScores() {
    const scores = Object.keys(players)
      .map((id) => {
        return {
          current: id === selfID,
          ...players[id],
        };
      })
      .sort((a, b) => b.score - a.score);

    for (let i = 0; i < scores.length; i++) {
      scores[i].pos = i + 1;
    }

    return scores;
  }

  function updateScoreboard() {
    if (!container) return;

    let table = getHighScores();
    let div = h("div");
    for (let i = 0; i < table.length; i++) {
      const player = table[i];
      const pos = h("span", { class: "row-pos" }, player.pos);
      pos.innerHTML += ".&nbsp;&nbsp;";
      div.appendChild(
        h(
          "div",
          { class: "score-row" + (player.current ? " you" : "") },
          pos,
          h("span", { class: "row-name" }, player.name),
          h("span", { class: "row-score" }, player.score)
        )
      );
    }
    container.innerHTML = div.innerHTML;
  }

  return {
    selfID: selfID,
    init: (appName, scoreboard) => {
      _appName = appName;
      if (scoreboard) {
        container = document.getElementById(scoreboard);
      }
      players = JSON.parse(localStorage.getItem(playersKey) || "{}");
      updateScoreboard();
      return window.webxdc.setUpdateListener((update) => {
        const player = update.payload;
        if (player.force || player.score > getScore(player.id)) {
          players[player.id] = { name: player.name, score: player.score };
        }
        if (update.serial === update.max_serial) {
          localStorage.setItem(playersKey, JSON.stringify(players));
          localStorage.setItem(maxserialKey, update.max_serial);
          updateScoreboard();
        }
      }, parseInt(localStorage.getItem(maxserialKey) || 0));
    },

    getScore: () => {
      return getScore(selfID);
    },

    setScore: function (score, force = false) {
      const old_score = this.getScore();
      if (score > old_score || force) {
        const name = window.webxdc.selfName;
        players[selfID] = { name: name, score: score };
        let info = name + " scored " + score;
        if (_appName) {
          info += " in " + _appName;
        }
        window.webxdc.sendUpdate(
          {
            payload: {
              id: selfID,
              name: name,
              score: score,
              force: force,
            },
            info: info,
          },
          info
        );
      } else {
        console.log(
          "[webxdc-score] Ignoring score: " + score + " <= " + old_score
        );
      }
    },

    getHighScores: getHighScores,
  };
})();

window.highscores = highscores;
