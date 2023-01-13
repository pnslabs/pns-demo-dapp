import { useEffect, useState } from "react";
import { useMoralis, useWeb3Contract } from "react-moralis";
import { contractAddresses, registryAbi, resolverAbi } from "../constants";
import { useNotification } from "web3uikit";
import { keccak256 } from "../utils";
import Web3 from "web3";
import { ethers } from "ethers";
import Header from "../components/header";
import Detail from "../components/detail";
const web3 = new Web3(
  "https://data-seed-prebsc-1-s1.binance.org:8545/" || "ws://localhost:8545"
);

export default function Home() {
  const { enableWeb3, isWeb3Enabled, account } = useMoralis();
  const [showDetail, setShowDetail] = useState(false);
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const handleNext = () => {
    setLoading(true);
    setTimeout(() => {
      setShowDetail(true);
      setLoading(false);
    }, 2000);
  };
  return (
    <>
      {showDetail ? (
        <Detail />
      ) : (
        <div className="bg">
          <Header />
          <div className="flex flex-col items-center">
            <div className="flex mt-56 max-w-3xl flex-col justify-center items-center">
              <div className="connect-text">
                Connect your phone number to a wallet address
              </div>
              <div className="flex mt-10 w-full">
                <input
                  onClick={(e: any) => setPhone(e.target.value)}
                  className="search px-10"
                  placeholder="Enter phone number"
                />
                <button onClick={handleNext} className="search-button">
                  {loading ? (
                    <div className="flex items-center justify-center my-2">
                      <div className="animate-spin">C</div>
                    </div>
                  ) : (
                    <div>Search</div>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
