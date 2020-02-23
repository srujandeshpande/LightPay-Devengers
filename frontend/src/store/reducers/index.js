import { combineReducers } from "redux";
import user from "./user";
import investments from "./investments";
import database from "./database";

export default combineReducers({
  user,
  investments,
  database
});
