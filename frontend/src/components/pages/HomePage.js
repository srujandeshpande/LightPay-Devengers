import React, { Fragment, useState, useEffect } from "react";
import {
  Container,
  Segment,
  Statistic,
  Button,
  Modal,
  Icon,
  Form,
  Checkbox
} from "semantic-ui-react";
import { useSelector, useDispatch } from "react-redux";
import NavBar from "../modules/NavBar";
import { sendMoneyAction } from "../../store/actions/money";

function HomePage() {
  const user = useSelector(state => state.user);
  const [openModal1, setOpenModal1] = useState(false);
  const [openModal2, setOpenModal2] = useState(false);
  const [amount, setAmount] = useState(0);
  const [isInvest, setIsInvest] = useState(false);
  const [invAmount, setInvAmount] = useState(0);
  const dispatch = useDispatch();

  const onSubmit = () => {
    const content = {
      sender_id: user._id,
      reciver_id: "5e515237ba673173ab7ae94b",
      amount: amount,
      invet_status: isInvest ? 1 : 0,
      invest_amount: invAmount
    };
    dispatch(
      sendMoneyAction(content, () => {
        setAmount(0);
        setIsInvest(false);
        setInvAmount(0);
        setOpenModal1(false);
      })
    );
  };

  useEffect(() => {
    if (amount % 1 !== 0) {
      setInvAmount(amount % 1);
      setIsInvest(true);
    } else {
      setInvAmount(0);
    }
  }, [amount]);

  return (
    <Fragment>
      <NavBar />
      <Container text textAlign="center" style={{ margin: "1rem auto" }}>
        <Segment>
          <Statistic
            label="Amount"
            value={user.avaiable_bal.toLocaleString("en-IN", {
              maximumFractionDigits: 2,
              style: "currency",
              currency: "INR"
            })}
          />
          <br />
          <Statistic
            label="Investment Amount"
            value={user.invest_amt.toLocaleString("en-IN", {
              maximumFractionDigits: 2,
              style: "currency",
              currency: "INR"
            })}
          />
        </Segment>
        <Modal
          trigger={
            <Button primary onClick={() => setOpenModal1(true)}>
              Send Money
            </Button>
          }
          open={openModal1}
          onClose={() => setOpenModal1(false)}
          size="small"
        >
          <Modal.Content image>
            <Modal.Description>
              <Form size="large">
                <Form.Input
                  fluid
                  icon="user"
                  iconPosition="left"
                  placeholder="Username"
                  value="5e515237ba673173ab7ae94b"
                  disabled
                  label="Pay to"
                />
                <Form.Input
                  fluid
                  icon="money bill alternate outline"
                  iconPosition="left"
                  placeholder="Amount"
                  type="number"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                />
                <Form.Field
                  control={Checkbox}
                  checked={isInvest}
                  onChange={() => setIsInvest(state => !state)}
                  label="invest ?"
                />
                {isInvest && (
                  <Form.Input
                    fluid
                    placeholder="Invest Amount"
                    type="number"
                    value={invAmount}
                    onChange={e => setInvAmount(e.target.value)}
                  />
                )}
                <p>
                  Amount to deduct:{" "}
                  {parseFloat(invAmount, 10) + parseFloat(amount, 10)}
                </p>
                <p>Amount will invest: {invAmount}</p>
              </Form>
            </Modal.Description>
          </Modal.Content>
          <Modal.Actions>
            <Button color="green" onClick={onSubmit} inverted>
              <Icon name="checkmark" /> Send
            </Button>
          </Modal.Actions>
        </Modal>
        <Modal
          trigger={
            <Button secondary onClick={() => setOpenModal2(true)}>
              User Info
            </Button>
          }
          open={openModal2}
          onClose={() => setOpenModal2(false)}
          size="tiny"
        >
          <Modal.Content image>
            <Modal.Description>
              <strong>Username: </strong> {user.user_name} <br />
              <strong>Available Balance: </strong> {user.avaiable_bal} <br />
              <strong>Bank Id: </strong> {user.band_id} <br />
              <strong>Bank Name: </strong> {user.bank_name} <br />
              <strong>Invest Amount: </strong> {user.invest_amt} <br />
              <strong>Last Investor Id: </strong> {user.last_invester_id} <br />
              <strong>Last Transaction Id: </strong> {user.last_transaction_id}{" "}
              <br />
            </Modal.Description>
          </Modal.Content>
        </Modal>
      </Container>
    </Fragment>
  );
}

export default HomePage;
