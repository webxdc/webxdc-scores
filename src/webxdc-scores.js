import jsSHA from "jssha";

export const highscores = (() => {
  let scoreboards = {},
    _getAnnouncement = (name, score) => `${name} scored ${score}`,
    _compareScores = (score1, score2) => score1 - score2,
    _onHighscoresChanged = () => {};
  const maxserialKey = "_webxdc-scores_.max_serial",
    scoreboardsKey = "_webxdc-scores_.scoreboards";

  const h = (tag, attributes, ...children) => {
    const element = document.createElement(tag);
    if (attributes) {
      Object.entries(attributes).forEach((entry) => {
        element.setAttribute(entry[0], entry[1]);
      });
    }
    element.append(...children);
    return element;
  };

  const getScore = (id, scoreboard) => {
    const players = scoreboards[scoreboard] || {};
    return players[id] ? players[id].score : 0;
  };

  return {
    selfID: new jsSHA("SHA-512", "TEXT", { encoding: "UTF8" })
      .update(window.webxdc.selfAddr)
      .getHash("HEX"),
    init: function ({
      getAnnouncement,
      compareScores,
      onHighscoresChanged,
    } = {}) {
      if (getAnnouncement) {
        _getAnnouncement = getAnnouncement;
      }

      if (compareScores) {
        _compareScores = compareScores;
      }

      if (onHighscoresChanged) {
        _onHighscoresChanged = onHighscoresChanged;
      }

      scoreboards = JSON.parse(localStorage.getItem(scoreboardsKey) || "{}");
      for (const scoreboard of Object.keys(scoreboards)) {
        _onHighscoresChanged(scoreboard);
      }

      return window.webxdc.setUpdateListener(
        (update) => {
          const player = update.payload;
          const board = player.scoreboard;
          if (
            player.force ||
            _compareScores(player.score, getScore(player.id, board), board) > 0
          ) {
            if (scoreboards[board] === undefined) {
              scoreboards[board] = {};
            }
            scoreboards[board][player.id] = {
              name: player.name,
              score: player.score,
            };
          }
          if (update.serial === update.max_serial) {
            localStorage.setItem(scoreboardsKey, JSON.stringify(scoreboards));
            localStorage.setItem(maxserialKey, update.max_serial);
            _onHighscoresChanged(board);
          }
        },
        parseInt(localStorage.getItem(maxserialKey) || 0),
      );
    },

    getScore: function (scoreboard) {
      return getScore(this.selfID, scoreboard);
    },

    setScore: function (score, force = false, scoreboard = undefined) {
      const oldScore = this.getScore(scoreboard);
      const selfID = this.selfID;
      if (force || _compareScores(score, oldScore, scoreboard) > 0) {
        if (scoreboards[scoreboard] === undefined) {
          scoreboards[scoreboard] = {};
        }
        const name = window.webxdc.selfName;
        scoreboards[scoreboard][selfID] = { name: name, score: score };
        const info = _getAnnouncement(name, score, scoreboard);
        window.webxdc.sendUpdate(
          {
            payload: {
              id: selfID,
              name,
              score,
              force,
              scoreboard,
            },
            info,
          },
          "",
        );
      } else {
        console.log(`[webxdc-score] Ignoring score: ${score} <= ${oldScore}`);
      }
    },

    getHighScores: function (scoreboard) {
      const players = scoreboards[scoreboard] || {};
      const selfID = this.selfID;
      const scores = Object.keys(players)
        .map((id) => {
          return {
            current: id === selfID,
            ...players[id],
          };
        })
        .sort((a, b) => _compareScores(b.score, a.score, scoreboard));

      for (let i = 0; i < scores.length; i++) {
        scores[i].pos = i + 1;
      }

      return scores;
    },

    renderScoreboard: function (scoreboard) {
      let table = this.getHighScores(scoreboard);
      let div = h("div");
      for (const player of table) {
        const pos = h("span", { class: "row-pos" }, player.pos);
        pos.innerHTML += ".&nbsp;&nbsp;";
        div.appendChild(
          h(
            "div",
            { class: "score-row" + (player.current ? " you" : "") },
            pos,
            h("span", { class: "row-name" }, player.name),
            h("span", { class: "row-score" }, player.score),
          ),
        );
      }
      return div;
    },
  };
})();

window.highscores = highscores;
