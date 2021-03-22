import { notification } from "antd";
import { OpenSeaAsset } from "opensea-js/lib/types";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { seaport } from "../../opensea";
import { CardDisplay } from "./card-display";
import { LoadingOutlined } from "@ant-design/icons";

const Card = styled.div`
  box-shadow: 0 14px 28px rgba(90, 90, 90, 0.1),
    0 10px 10px rgba(90, 90, 90, 0.1);
  background: white;
  padding: 20px;
  margin: 20px;
  height: 400px;
  min-width: 280px;
  border-radius: 8px;

  &:hover {
    box-shadow: 0 14px 28px rgba(0, 0, 0, 0.1), 0 10px 10px rgba(0, 0, 0, 0.1);
  }
`;

const Loading = styled.div`
  padding-top: 120px;
  text-align: center;
`;

const LoadingText = styled.div`
  padding-top: 9px;
`;

interface Props {
  tokenAddress: string;
  tokenId: number;
  loggedIn: boolean;
  showModal: () => void;
  accountAddress: string | null;
}

export const NftCard: React.FC<Props> = ({
  tokenAddress,
  tokenId,
  loggedIn,
  showModal,
  accountAddress,
}) => {
  const [cardInfo, setCardInfo] = useState<OpenSeaAsset | null>(null);
  const [buttonIsLoading, setButtonIsLoading] = useState<boolean>(false);
  useEffect(() => {
    const fetchAsset = async () => {
      try {
        const asset: OpenSeaAsset = await seaport.api.getAsset({
          tokenAddress,
          tokenId,
        });
        console.log(asset);
        setCardInfo(asset);
      } catch (e) {
        console.log(e.message);
        if (e.message.includes("Request was throttled")) {
          // backoff and wait 2s
          setTimeout(fetchAsset, 2000);
        }
      }
    };
    fetchAsset();
  }, [tokenAddress, tokenId]);

  const handleClick = async () => {
    setButtonIsLoading(true);
    if (!loggedIn) {
      showModal();
      setButtonIsLoading(false);
      return;
    }

    if (!accountAddress) {
      notification.error({
        message: "Error making offer",
        description: "No account detected. Please try refreshing your window",
      });
      setButtonIsLoading(false);
      return;
    }

    if (!cardInfo && cardInfo!.orders) {
      notification.error({
        message: "Error making offer",
        description: "Error getting card info",
      });
      setButtonIsLoading(false);
      return;
    }
    const price = (cardInfo!.orders![0].basePrice.c as any) / 10000;

    try {
      const offer = await seaport.createBuyOrder({
        asset: {
          tokenId: tokenId.toString(),
          tokenAddress,
        },
        accountAddress: accountAddress!,
        // Value of the offer, in units of the payment token (or wrapped ETH if none is specified):
        startAmount: price,
      });

      notification.info({
        message: "Order placed",
        description: offer.createdTime,
      });
      setButtonIsLoading(false);
    } catch (e) {
      notification.error({
        message: "Error making offer",
        description: e.message,
      });
      setButtonIsLoading(false);
    }
  };

  return (
    <Card>
      {cardInfo ? (
        <CardDisplay
          handleClick={handleClick}
          cardInfo={cardInfo}
          buttonIsLoading={buttonIsLoading}
        />
      ) : (
        <Loading>
          <LoadingOutlined style={{ fontSize: 24 }} spin />
          <LoadingText>Loading...</LoadingText>
        </Loading>
      )}
    </Card>
  );
};
