import React, { Fragment, useEffect } from "react";
import { Container, Header, Segment, Statistic } from "semantic-ui-react";
import { useSelector, useDispatch } from "react-redux";
import NavBar from "../modules/NavBar";
import { fetchInvMoneyAction } from "../../store/actions/money";

function InvestmentsPage() {
  const user = useSelector(state => state.user);
  const investments = useSelector(state => state.investments);
  const dispatch = useDispatch();
  const path = { user_id: user._id };

  useEffect(() => {
    dispatch(fetchInvMoneyAction(path, () => {}));
    /* eslint-disable-next-line */
  }, []);

  return (
    <div>
      <Fragment>
        <NavBar />
        <Container text textAlign="center" style={{ margin: "1rem auto" }}>
          <Header as="h2">Investments</Header>
          <Segment>
            <Statistic
              label="Investment Amount"
              value={user.invest_amt.toLocaleString("en-IN", {
                maximumFractionDigits: 2,
                style: "currency",
                currency: "INR"
              })}
            />
          </Segment>
          <br />
          <br />
          {investments.map((inv, index) => (
            <Segment key={index}>
              <strong>Date: </strong> {inv.date} &nbsp;&nbsp;&nbsp;
              <strong>Invested Amount: </strong> {inv.amount}
            </Segment>
          ))}
        </Container>
      </Fragment>
    </div>
  );
}

export default InvestmentsPage;
