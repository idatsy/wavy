import React from "react";
import styled from "styled-components";

const Root = styled.div`
  height: 130px;
  background: #f6f6f6;
`;
const FooterContent = styled.div`
  padding-top: 30px;
  padding-bottom: 20px;
  max-width: 960px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;

  a {
    color: #666;
  }
`;

export const AppFooter = () => {
  return (
    <Root>
      <FooterContent>
        <div>&#169; Wavy NFT {new Date().getFullYear()}</div>
        <div>
          <a href="mailto:someone@yoursite.com">contact@email.com</a>{" "}
        </div>
      </FooterContent>
    </Root>
  );
};
