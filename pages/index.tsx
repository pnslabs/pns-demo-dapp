import { useEffect, useState } from "react";
import { useMoralis, useWeb3Contract } from "react-moralis";
import { contractAddresses, registryAbi, resolverAbi } from "../constants";
import { useNotification } from "web3uikit";
import { keccak256 } from "../utils";
import Web3 from "web3";
import { ethers } from "ethers";
import Header from "../components/header";
const web3 = new Web3(
  "https://data-seed-prebsc-1-s1.binance.org:8545/" || "ws://localhost:8545"
);

export default function Home() {
  const { enableWeb3, isWeb3Enabled, account } = useMoralis();

  const handleConnectMetamask = () => {
    if (!isWeb3Enabled) {
      enableWeb3();
    }
  };
  console.log(account, isWeb3Enabled);
  return (
    <div className="bg">
      <Header />
      <div className="flex flex-col items-center">
        <div className="flex mt-56 max-w-3xl flex-col justify-center items-center">
          <div className="connect-text">
            Connect your phone number to a wallet address
          </div>
          <div className="flex mt-10 w-full">
            <input className="search px-10" placeholder="Enter phone number" />
            <button className="search-button">Search</button>
          </div>
        </div>
      </div>
    </div>
  );
}
