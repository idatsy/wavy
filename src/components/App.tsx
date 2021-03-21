import React, { useEffect, useState } from "react";
import {
  GoogleLogin,
  GoogleLoginResponse,
  GoogleLoginResponseOffline,
  GoogleLogout,
} from "react-google-login";
import { AppHeader } from "./header";
import styled from "styled-components";
import Modal from "antd/lib/modal/Modal";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Gallery } from "./gallery";
import Web3 from "web3";
import { notification } from "antd";
import { AppFooter } from "./footer";
import { GALLERY_NFTS, SHOWCASE_NFTS } from "../nft-items";

const CLIENT_ID =
  "181331400120-nch2h7c8b7ca3ks2pnsia3jkjgvefk0e.apps.googleusercontent.com";

const Root = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

function App() {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [accountAddress, setAccountAddress] = useState<string | null>(null);
  const [googleUser, setGoogleUser] = useState<GoogleLoginResponse | null>(
    null
  );

  useEffect(() => {
    const enableEthereum = async (
      callback: (w: Web3) => void,
      onError: (e: string) => void
    ) => {
      window.addEventListener("load", async () => {
        // Wait for loading completion to avoid race conditions with web3 injection timing.
        // @ts-ignore
        const windowEth = window.ethereum;
        // @ts-ignore
        const windowWeb3 = window.web3;

        if (windowEth) {
          const web3 = new Web3(windowEth);

          try {
            // Request account access if needed
            await windowEth.enable();
            // Acccounts now exposed
            callback(web3);
          } catch (error) {
            onError(error);
          }
        }
        // Legacy dapp browsers...
        else if (windowWeb3) {
          // Use Mist/MetaMask's provider.
          const web3 = windowWeb3;
          callback(web3);
        }
        // Fallback to localhost; use dev console port by default...
        else {
          const provider = new Web3.providers.HttpProvider(
            "http://mainnet.infura.io/ws/v3/b0f0d58b5f004a39a331e73519a9a0bf"
          );
          const web3 = new Web3(provider);
          console.log("No web3 instance injected, using Local web3.");
          callback(web3);
        }
      });
    };
    enableEthereum(
      async (client) => {
        console.log("Web3 client enabled");
        const accounts = await client.eth.getAccounts();

        if (!accounts.length) {
          notification.error({
            message: "Web3 error",
            description: "No eth accounts detected",
          });
          return;
        }
        const add = accounts[0];
        setAccountAddress(add);
        console.log(add);
      },
      (e: string) => {
        notification.error({
          message: "Web3 error",
          description: e,
        });
        return;
      }
    );
  }, []);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const onLoginSuccess = (
    res: GoogleLoginResponse | GoogleLoginResponseOffline
  ) => {
    if (res.code) {
      setGoogleUser(null);
      return;
    }
    const response = res as GoogleLoginResponse;
    setGoogleUser(response);
  };
  const onLogoutSuccess = () => {
    notification.info({
      message: "Logged out",
    });
  };

  const onFailure = (res: any) => {
    notification.error({
      message: "Google auth error",
      description: `${res}`,
    });
  };
  return (
    <Router>
      <Root>
        <AppHeader showModal={showModal} loggedIn={googleUser !== null} />
        <Switch>
          <Route path="/gallery">
            <Gallery
              accountAddress={accountAddress}
              showModal={showModal}
              loggedIn={googleUser !== null}
              nftList={GALLERY_NFTS}
              title={"Gallery"}
            />
          </Route>
          <Route path="/">
            <Gallery
              accountAddress={accountAddress}
              showModal={showModal}
              loggedIn={googleUser !== null}
              nftList={SHOWCASE_NFTS}
              title={"Hero title lorem"}
              subtitle={"Subtitle dolor sit amet lorem ipsum"}
            />
          </Route>
        </Switch>
        <AppFooter />

        <Modal
          title="Sign in options"
          visible={isModalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          {googleUser ? (
            <GoogleLogout
              clientId={CLIENT_ID}
              buttonText="Logout"
              onLogoutSuccess={onLogoutSuccess}
            />
          ) : (
            <GoogleLogin
              clientId={CLIENT_ID}
              buttonText="Login"
              onSuccess={onLoginSuccess}
              onFailure={onFailure}
              cookiePolicy={"single_host_origin"}
              style={{ marginTop: "100px" }}
              isSignedIn={true}
            />
          )}
        </Modal>
      </Root>
    </Router>
  );
}

export default App;
