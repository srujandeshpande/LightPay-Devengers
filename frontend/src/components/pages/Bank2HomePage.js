import React, { Fragment, useState } from "react";
import {
  Container,
  Segment,
  Statistic,
  Button,
  Modal,
  Icon,
  Form
} from "semantic-ui-react";
import { useSelector, useDispatch } from "react-redux";
import NavBar from "../modules/NavBar";
import { withdraw2Action } from "../../store/actions/money";

function HomePage() {
  const user = useSelector(state => state.user);
  const [openModal1, setOpenModal1] = useState(false);
  const [openModal2, setOpenModal2] = useState(false);
  const [amount, setAmount] = useState(0);
  const dispatch = useDispatch();

  const onSubmit = () => {
    const content = {
      user_id: user.user_id,
      amount: amount
    };
    dispatch(
      withdraw2Action(content, () => {
        setAmount(0);
        setOpenModal1(false);
      })
    );
  };

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
        </Segment>
        <Modal
          trigger={
            <Button primary onClick={() => setOpenModal1(true)}>
              Withdraw
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
                  icon="money bill alternate outline"
                  iconPosition="left"
                  placeholder="Amount"
                  type="number"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                />
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
              <strong>Last Sync: </strong> {user.last_sync} <br />
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
