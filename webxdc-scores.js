/* webxdc-scores v1.0.1
 */
window.highscores = (() => {
    let players = [],
        _appName = "",
        container = undefined,
        maxserialKey = "webxdc-scores.max_serial",
        playersKey = "webxdc-scores.players";

    function h(tag, attributes, ...children) {
        const element = document.createElement(tag);
        if (attributes) {
            Object.entries(attributes).forEach(entry => {
                element.setAttribute(entry[0], entry[1]);
            });
        }
        element.append(...children);
        return element;
    }
    
    function getScore(addr) {
        return players[addr] ? players[addr].score : 0;
    }

    function getHighScores() {
        const selfAddr = window.webxdc.selfAddr;
        const scores = Object.keys(players).map((addr) => {
            return {
                current: addr === selfAddr,
                ...players[addr],
            };
        }).sort((a, b) => b.score - a.score);

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
            const pos = h("span", {class: "row-pos"}, player.pos);
            pos.innerHTML += ".&nbsp;&nbsp;";
            div.appendChild(
                h("div", {class: "score-row" + (player.current ? " you" : "")},
                  pos,
                  h("span", {class: "row-name"}, player.name),
                  h("span", {class: "row-score"}, player.score),
                 )
            );
        }
        container.innerHTML = div.innerHTML;
    }

    return {
        init: (appName, scoreboard) => {
            _appName = appName;
            if (scoreboard) {
                container = document.getElementById(scoreboard);
            }
            players = JSON.parse(localStorage.getItem(playersKey) || "{}");
            updateScoreboard();
            return window.webxdc.setUpdateListener((update) => {
                const player = update.payload;
                if (player.force || player.score > getScore(player.addr)) {
                    players[player.addr] = {name: player.name, score: player.score};
                }
                if (update.serial === update.max_serial) {
                    localStorage.setItem(playersKey, JSON.stringify(players));
                    localStorage.setItem(maxserialKey, update.max_serial);
                    updateScoreboard();
                }
            }, parseInt(localStorage.getItem(maxserialKey) || 0));
        },

        getScore: () => {
            return getScore(window.webxdc.selfAddr);
        },

        setScore: (score, force = false) => {
            const addr = window.webxdc.selfAddr;
            const old_score = getScore(addr);
            if (score > old_score || force) {
                const name = window.webxdc.selfName;
                players[addr] = {name: name, score: score};
                let info = name + " scored " + score;
                if (_appName) {
                    info += " in " + _appName;
                }
                window.webxdc.sendUpdate(
                    {
                        payload: {
                            addr: addr,
                            name: name,
                            score: score,
                            force: force,
                        },
                        info: info,
                    },
                    info
                );
            } else {
                console.log("[webxdc-score] Ignoring score: " + score + " <= " + old_score);
            }
        },

        getHighScores: getHighScores,
    };
})();
