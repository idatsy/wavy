import { Button } from "antd";
import { OpenSeaAsset } from "opensea-js/lib/types";
import React from "react";
import styled from "styled-components";

const Root = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  text-align: center;
`;

const ImageContainer = styled.div`
  img {
    margin: 0 auto;
  }
`;

const InfoContainer = styled.div``;

const Name = styled.div`
  font-family: "Abril Fatface", cursive;
  font-size: 20px;
`;

const Contract = styled.div`
  font-size: 10px;
  padding-bottom: 8px;
`;

interface Props {
  cardInfo: OpenSeaAsset;
  handleClick: () => void;
  buttonIsLoading: boolean;
}
export const CardDisplay: React.FC<Props> = ({
  cardInfo,
  handleClick,
  buttonIsLoading,
}) => {
  const { imageUrl, name, assetContract, orders, imageUrlOriginal } = cardInfo;
  return (
    <Root>
      <ImageContainer>
        <a href={imageUrlOriginal} target="_blank" rel="noreferrer">
          <img src={imageUrl} alt={name} />
        </a>
      </ImageContainer>
      <InfoContainer>
        <Name>{name}</Name>
        <Contract> {assetContract.name}</Contract>

        <Button onClick={handleClick} type="primary" loading={buttonIsLoading}>
          Buy for Ξ {orders && (orders[0].basePrice.c as any) / 10000}
        </Button>
      </InfoContainer>
    </Root>
  );
};
