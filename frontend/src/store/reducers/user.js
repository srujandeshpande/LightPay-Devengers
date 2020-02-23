import {
  USER_LOGGED_IN,
  USER_LOGGED_OUT,
  SEND_MONEY_SUCCESS,
  FETCH_INV_SUCCESS,
  WITHDRAW_MONEY_SUCCESS
} from "../types";

export default function user(state = {}, action = {}) {
  switch (action.type) {
    case USER_LOGGED_IN:
      return action.user;
    case USER_LOGGED_OUT:
      return {};
    case SEND_MONEY_SUCCESS:
      return { ...state, ...action.balance };
    case FETCH_INV_SUCCESS:
      return { ...state, invest_amt: action.money };
    case WITHDRAW_MONEY_SUCCESS:
      return { ...state, avaiable_bal: action.money.amount };
    default:
      return state;
  }
}
