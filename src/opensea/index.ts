import { OpenSeaPort, Network } from "opensea-js";
import { web3client } from "../web3";

export const seaport = new OpenSeaPort(web3client.currentProvider, {
  networkName: Network.Main,
});
