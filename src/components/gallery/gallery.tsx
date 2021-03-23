import React from "react";
import styled from "styled-components";
import { NFT } from "../../types";
import { NftCard } from "../nft-card";

const Root = styled.div`
  flex: 1;
  h1 {
    font-family: "Abril Fatface", cursive;
    font-size: 45px;
    margin: 0;
    color: #292633;
  }
  h2 {
    color: #292633;
  }
`;

const HeroBackground = styled.div`
  background: #efefef;
  height: 400px;
  background: linear-gradient(-45deg, #ee7752, #e73c7e, #986dcf, #23d5ab);
  background-size: 400% 400%;
  animation: gradient 15s ease infinite;
  @keyframes gradient {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }
`;

const HeroContent = styled.div`
  padding-top: 90px;
  padding-bottom: 70px;
  padding-left: 20px;
  max-width: 960px;
  margin: 0 auto;
`;

const CardContainer = styled.div`
  padding-top: 10px;
  padding-bottom: 150px;
  max-width: 960px;
  margin: 0 auto;
  margin-top: -150px;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
`;

interface Props {
  showModal: () => void;
  loggedIn: boolean;
  accountAddress: string | null;
  nftList: NFT[];
  title: string;
  subtitle?: string;
}

export const Gallery: React.FC<Props> = ({
  showModal,
  loggedIn,
  accountAddress,
  nftList,
  title,
  subtitle,
}) => {
  // split list into chunks of 3
  const chunkedList = nftList.reduce((resultArray: NFT[][], item, index) => {
    const chunkIndex = Math.floor(index / 3);
    if (!resultArray[chunkIndex]) {
      resultArray[chunkIndex] = []; // start a new chunk
    }
    resultArray[chunkIndex].push(item);
    return resultArray;
  }, []);

  return (
    <Root>
      <HeroBackground>
        <HeroContent>
          <h1>{title}</h1>
          {subtitle && <h2>{subtitle}</h2>}
        </HeroContent>
      </HeroBackground>
      {chunkedList?.map((list, j) => {
        return (
          <CardContainer key={j}>
            {list.map((nft, i) => {
              return (
                <NftCard
                  key={`${i}_${nft.tokenId}`}
                  tokenAddress={nft.tokenAddress}
                  tokenId={nft.tokenId}
                  loggedIn={loggedIn}
                  showModal={showModal}
                  accountAddress={accountAddress}
                />
              );
            })}
          </CardContainer>
        );
      })}
    </Root>
  );
};
