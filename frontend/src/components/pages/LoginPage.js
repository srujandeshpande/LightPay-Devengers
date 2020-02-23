import React, { useState } from "react";
import {
  Button,
  Form,
  Grid,
  Header,
  Segment,
  Dropdown
} from "semantic-ui-react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginAction } from "../../store/actions/user";
import { changeDBAction } from "../../store/actions/database";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const history = useHistory();
  const dispatch = useDispatch();
  const database = useSelector(state => state.database);
  const [db, setDb] = useState(database || "");

  const onSubmit = () => {
    const credentials = {
      user_name: username
    };
    dispatch(
      loginAction(credentials, database, () => {
        history.push("/home");
      })
    );
  };

  const databaseOptions = [
    { key: 1, text: "LightPay", value: "lightpay" },
    { key: 2, text: "Bank", value: "bank" },
    { key: 3, text: "Bank2", value: "bank2" }
  ];

  const changeDatabase = (e, { value }) => {
    setDb(value);
    dispatch(changeDBAction(value));
  };

  return (
    <Grid textAlign="center" style={{ height: "100vh" }} verticalAlign="middle">
      <Grid.Column style={{ maxWidth: 450 }}>
        <Header as="h2" textAlign="center">
          Log-in to your account
        </Header>
        <Form size="large" onSubmit={onSubmit}>
          <Segment stacked>
            <Form.Dropdown
              value={db}
              control={Dropdown}
              options={databaseOptions}
              onChange={changeDatabase}
            />
            <Form.Input
              fluid
              icon="user"
              iconPosition="left"
              placeholder="Username"
              value={username}
              onChange={e => setUsername(e.target.value)}
            />
            <Form.Input
              fluid
              icon="lock"
              iconPosition="left"
              placeholder="Password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            <Button primary fluid size="large">
              Login
            </Button>
          </Segment>
        </Form>
      </Grid.Column>
    </Grid>
  );
};

export default LoginPage;
