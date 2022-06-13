//@ts-check

type Player = {
  /** the player's name */
  name: string;
  /** the player's position in the scoreboard */
  pos: string;
  /** the player's high score */
  score: number;
  /** true if this player is the current/self player, false otherwise. */
  current: boolean;
};

interface WebxdcScores {
    /**
     * Initialize the scores API.
     * @param appName the app's name that will be shown in info-messages.
     * @returns promise that resolves when the API is ready to be used.
     */
    init(appName: string): Promise<void>;
    /**
     * Use this method to get the high score of the current player.
     * @returns the current player's high score.
     */
    getScore(): number;
    /**
     * Use this method to set the high score of the current player.
     * The new score is ignored if it is not greater than the player's high score and
     * "force" is False.
     * If the new score is not ignored, an info-message will be sent in the form:
     * "PlayerName scored newScore in appName"
     * @param score the new high score.
     * @param force if the new score should override the old score even if it is smaller.
     */
    setScore(score: number, force: boolean): void;
    /**
     * Use this method to get data for high score tables.
     * This method will return scores for the current player, plus their closest
     * neighbors on each side. Will also return the top three players if the current
     * player and their neighbors are not among them.
     * @returns an array of Player objects.
     */
    getHighScores(): Player[];
    /**
     * Use this method to get the HTML markup of the scoreboard.
     * @returns an string containing the HTML markup of the scoreboard.
     */
    getScoreboard(): string;
}

////////// ANCHOR: global
declare global {
  interface Window {
    webxdc_scores: WebxdcScores<any>;
  }
}
////////// ANCHOR_END: global

export { WebxdcScores };
