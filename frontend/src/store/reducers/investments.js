import { FETCH_INV_SUCCESS } from "../types";

export default function investments(state = [], action = {}) {
  switch (action.type) {
    case FETCH_INV_SUCCESS:
      return action.investments;
    default:
      return state;
  }
}
