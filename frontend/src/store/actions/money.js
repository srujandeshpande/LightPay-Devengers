import axios from "../../axios";
import axios1 from "../../axios/bankAxios";
import axios2 from "../../axios/bankAxios2";
import {
  SEND_MONEY_SUCCESS,
  FETCH_INV_SUCCESS,
  WITHDRAW_MONEY_SUCCESS
} from "../types";

const moneySent = balance => ({
  type: SEND_MONEY_SUCCESS,
  balance
});

const invMoneyFetched = (money, investments) => ({
  type: FETCH_INV_SUCCESS,
  money,
  investments
});

const moneyWithdrawn = money => ({
  type: WITHDRAW_MONEY_SUCCESS,
  money
});

export const sendMoneyAction = (content, callback) => dispatch => {
  axios
    .post("/sendmoney", { ...content })
    .then(res => {
      let data = res.data;
      if (data.new_invest) {
        data = {
          invest_amt: data.new_invest,
          avaiable_bal: data.remaining_bal
        };
      } else {
        data = {
          avaiable_bal: data.remaining_bal
        };
      }
      dispatch(moneySent(data));
      callback(res);
    })
    .catch(err => {
      callback(null, err);
    });
};

export const fetchInvMoneyAction = (params, callback) => dispatch => {
  axios
    .get("/investedmoney", { params })
    .then(res => {
      const { total_investment, investments } = res.data;
      dispatch(invMoneyFetched(total_investment, investments));
      callback(res);
    })
    .catch(err => {
      callback(null, err);
    });
};

export const withdrawAction = (content, callback) => dispatch => {
  axios1
    .post("/withdrawal", { ...content })
    .then(res => {
      let data = res.data;
      dispatch(moneyWithdrawn(data));
      callback(res);
    })
    .catch(err => {
      callback(null, err);
    });
};

export const withdraw2Action = (content, callback) => dispatch => {
  axios2
    .post("/withdrawal", { ...content })
    .then(res => {
      let data = res.data;
      dispatch(moneyWithdrawn(data));
      callback(res);
    })
    .catch(err => {
      callback(null, err);
    });
};
