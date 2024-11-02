//@ts-check

type Player<T> = {
  /** The player's name */
  name: string;
  /** The player's position in the scoreboard */
  pos: string;
  /** The player's high score */
  score: T;
  /** true if this player is the current/self player, false otherwise. */
  current: boolean;
};

type InitOptions<T> = {
  /** Generator of new highscores messages.
      If not provided, (name, score, board) => `${name} scored ${score}` is used
  */
  getAnnouncement?: (name: string, score: T, scoreboard?: string) => string;
  /** A function that determines the order of the scores. It should return a number where:
      - A negative value indicates that score1 < score2.
      - A positive value indicates that score1 > score2.
      - Zero indicates that score1 == score2.
  */
  compareScores?: (score1: T, score2: T, scoreboard?: string) => number;
  /** callback that will be called when the high scores changed for a scoreboard */
  onHighscoresChanged?: (scoreboard?: string) => void;
};

interface HighScores<T> {
  /**
   * Initialize the scores API. This MUST be called before start using the API.
   * @returns promise that resolves when the API is ready to be used.
   */
  init(options?: InitOptions<T>): Promise<void>;
  /**
   * Use this method to get the high score of the current player.
   * @param scoreboard if provided, get the score from this scoreboard. Otherwise the default scoreboard is used.
   * @returns the current player's high score.
   */
  getScore(scoreboard?: string): T;
  /**
   * Use this method to set the high score of the current player.
   * The new score is ignored if it is not greater than the player's high score and
   * "force" is False.
   * If the new score is not ignored, an info-message will be sent in the form:
   * "PlayerName scored newScore in appName"
   * @param score the new high score.
   * @param force if the new score should override the old score even if it is smaller. False by default.
   * @param scoreboard the scoreboard this score belongs to. Use it if your game can have more than one scoreboard.
   */
  setScore(score: T, force?: boolean, scoreboard?: string): void;
  /**
   * Get the sorted list of high scores.
   * @param scoreboard if provided, get scores from this scoreboard. Otherwise the default scoreboard is used.
   * @returns an array of Player objects.
   */
  getHighScores(scoreboard?: string): Player<T>[];
  /**
   * Utility to generate a scoreboard in HTML. If you use this you need to include dist/webxdc-scores.css file or provide your own styling for the generated scoreboard.
   * @param scoreboard if provided, this scoreboard is the one that will be rendered. Otherwise the default scoreboard is rendered.
   * @returns a div HTMLElement with the scoreboard rows inside.
   */
  renderScoreboard(scoreboard?: string): HTMLElement;
  /** The current player's own ID.
   */
  selfID: string;
}

declare global {
  interface Window {
    highscores: HighScores<any>;
  }
}

export { HighScores };
