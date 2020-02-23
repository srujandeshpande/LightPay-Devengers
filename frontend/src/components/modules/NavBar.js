import React from "react";
import { Menu, Container } from "semantic-ui-react";
import { useHistory, Link } from "react-router-dom";
import { logoutAction } from "../../store/actions/user";
import { useDispatch, useSelector } from "react-redux";

function NavBar() {
  const history = useHistory();
  const dispatch = useDispatch();
  const database = useSelector(state => state.database);

  return (
    <div>
      <Menu borderless>
        <Container text>
          <Menu.Item header as={Link} to="/home">
            {(database === "lightpay" && "LightPay") ||
              (database === "bank" && "Bank1") ||
              "Bank2"}
          </Menu.Item>
          <Menu.Menu position="right">
            <Menu.Item as={Link} to="/investments">
              Investments
            </Menu.Item>
            <Menu.Item
              onClick={() =>
                dispatch(
                  logoutAction(() => {
                    history.push("/");
                  })
                )
              }
            >
              Logout
            </Menu.Item>
          </Menu.Menu>
        </Container>
      </Menu>
    </div>
  );
}

export default NavBar;
