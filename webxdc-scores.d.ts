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

interface HighScores {
    /**
     * Initialize the scores API.
     * @param appName the app's name that will be shown in info-messages.
     * @param scoreboard the id of an HTML element where the scoreboard should be injected.
     * @returns promise that resolves when the API is ready to be used.
     */
    init(appName: string, scoreboard?: string): Promise<void>;
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
     * @param force if the new score should override the old score even if it is smaller. False by default.
     */
    setScore(score: number, force?: boolean): void;
    /**
     * Use this method to get data for high score tables.
     * @returns an array of Player objects.
     */
    getHighScores(): Player[];
}

declare global {
  interface Window {
    highscores: HighScores;
  }
}

export { HighScores };
