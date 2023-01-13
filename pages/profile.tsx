import { useState } from "react";
import { useMoralis } from "react-moralis";
import Web3 from "web3";
import Header from "../components/header";

const web3 = new Web3(
  "https://data-seed-prebsc-1-s1.binance.org:8545/" || "ws://localhost:8545"
);

const item = [
  {
    title: "Verify Phone Number",
    desc: "You’ll be prompted to enter an OTP that’ll be sent to you mobile number",
    num: 1,
  },
  {
    title: "Complete Registration",
    desc: "Click on “Complete Registration” to confirm the registration of your phone number on PNS",
    num: 2,
  },
];

export default function Profile({ currentIndex }: { currentIndex: number }) {
  const { isWeb3Enabled, account, deactivateWeb3 } = useMoralis();

  const handleDisconnect = () => {
    deactivateWeb3();
  };
  return (
    <div className="bg">
      <Header />
      {isWeb3Enabled && (
        <div className="absolute bottom-10 left-10">
          <div className="flex flex-col items-center justify-center">
            <div className="text-white font-bold text-sm">{`${account?.slice(
              0,
              6
            )}...${account?.slice(account?.length - 4)}`}</div>
            <button onClick={handleDisconnect} className="disconnect mt-3">
              Disconnect
            </button>
          </div>
        </div>
      )}
      <div className="flex relative justify-end mt-10 xl:px-10 px-5">
        <div className="detail-bg py-10 px-20"></div>
      </div>
    </div>
  );
}
