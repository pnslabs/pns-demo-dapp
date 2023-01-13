import { useEffect, useState } from "react";
import { useMoralis, useWeb3Contract } from "react-moralis";
import { contractAddresses, registryAbi, resolverAbi } from "../constants";
import { useNotification } from "web3uikit";
import { keccak256 } from "../utils";
import Web3 from "web3";
import { ethers } from "ethers";
import Header from "../components/header";
import { BnbIcon } from "../public/icon";

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

export default function Detail() {
  const { enableWeb3, isWeb3Enabled, account, deactivateWeb3 } = useMoralis();
  const [currentIndex, setCurrentIndex] = useState(1);

  const handleDisconnect = () => {
    deactivateWeb3();
  };
  console.log(account, isWeb3Enabled);
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
        <div className="detail-bg py-10 px-20">
          <div className="flex justify-between">
            <div className="green">+971 54 754 6254</div>
            <div className="detail-box py-5 px-7">
              <div className="flex items-center justify-between">
                <div className="fees">Fees</div>
                <BnbIcon />
              </div>
              <div className="mt-1">
                <div className="flex items-center gap-4">
                  <div>
                    <div className="text text-sm">Registration Cost</div>
                    <div className="mt-0.5 text text-sm font-extralight">
                      10 usd ~ 0.02 BNB
                    </div>
                  </div>
                  <div className="border-l border-left pl-4 h-8">
                    <div className="text text-sm">Valid for 1 Year</div>
                  </div>
                </div>
                <div className="mt-5">
                  <div className="text text-sm">Renewal Cost</div>
                  <div className="mt-0.5 text font-extralight text-sm">
                    5 usd ~ 0.01 BNB
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-16 flex gap-16 w-full">
            {item.map((item) => (
              <div key={item.num} className="flex items-center gap-7">
                <div
                  className={`h-10 gap-5 w-10 rounded-full border flex justify-center items-center ${
                    item.num === currentIndex
                      ? "border-green-500"
                      : "border-white"
                  }`}
                >
                  <div className="text-white text-2xl">{item.num}</div>
                </div>
                <div className="font-bold text-xl text-white">
                  <div>{item.title}</div>
                  <div className="mt-7 w-64 text-base font-semibold">
                    {item.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-end mt-20">
            <button className="complete-btn">
              {currentIndex === 1
                ? "Verify Phone Number"
                : "Complete Registration"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
