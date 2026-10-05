import type { SimpleUser } from "../../../shared/types/User";
import type { SimplePost, Post } from "../../../shared/types/Post";

export interface ClientModel {
    currUser?: SimpleUser;

    /**
     * Public user information retrieved from GET /user/{user_id}.
     *
     * The key is the user's ID.
     */
    cachedUsers: Record<number, SimpleUser>;

    /**
     * Currently opened post.
     */
    currentPost?: Post;

    /**
     * Posts currently displayed on the board.
     */
    board?: SimplePost[];

    /**
     * True once the server has confirmed that we have
     * an authenticated session.
     */
    isAuthenticated: boolean;

    /**
     * True while the initial authentication check is happening.
     *
     * This prevents the application from briefly displaying
     * the login page during startup.
     */
    authLoading: boolean;
}

export const RES_HALLS = [
  "Daniels Hall",
  "Founders Hall",
  "Institute Hall",
  "Messenger Hall",
  "Morgan Hall",
  "Sanford Riley Hall",
  "Stoddard Complex",
  "Ellsworth Apartments",
  "Fuller Apartments",
  "East Hall",
  "Faraday Hall",
  "WPI Townhouses",
  "Cedar House A",
  "Cedar House B",
  "Elbridge House",
  "Fruit House",
  "Hackfeld House",
  "Marston House A",
  "Marston House B",
  "Oak House",
  "Schussler House",
  "Sever House",
  "Trowbridge House",
  "Wachusett House",
  "West House",
  "William House",
  "8 Elbridge House",
  "45 Institute House",
] as const;