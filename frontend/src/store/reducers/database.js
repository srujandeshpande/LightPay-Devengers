import { DB_CHANGED } from "../types";

export default function database(state = "lightpay", action = {}) {
  switch (action.type) {
    case DB_CHANGED:
      return action.db;
    default:
      return state;
  }
}
