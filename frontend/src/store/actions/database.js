import { DB_CHANGED } from "../types";

export const changeDBAction = db => dispatch => {
  dispatch({ type: DB_CHANGED, db });
};
