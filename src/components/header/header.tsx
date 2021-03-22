import React from "react";
import { Menu } from "antd";
import styled from "styled-components";
import { Link } from "react-router-dom";

const Root = styled.div``;
const HeaderContents = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Logo = styled.div`
  font-family: "Abril Fatface", cursive;
  text-align: center;
  margin-left: 30px;
  font-size: 24px;
  padding-top: 5px;
  color: #292633;
`;

interface Props {
  showModal: () => void;
  loggedIn: boolean;
}

export const AppHeader: React.FC<Props> = ({ showModal, loggedIn }) => {
  return (
    <Root>
      <HeaderContents>
        <Logo>Logo</Logo>
        <Menu mode="horizontal" defaultSelectedKeys={["1"]}>
          <Menu.Item key="1">
            <Link to="/">Home</Link>
          </Menu.Item>
          <Menu.Item key="2">
            <Link to="/gallery">Gallery</Link>
          </Menu.Item>
          <Menu.Item key="3" onClick={showModal}>
            {loggedIn ? "Sign out" : "Sign in"}
          </Menu.Item>
        </Menu>
      </HeaderContents>
    </Root>
  );
};
