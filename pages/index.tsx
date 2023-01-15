import { useEffect, useState } from "react";
import { registryAddress, registryAbi, resolverAbi } from "../constants";
import { useAccount } from "wagmi";
import { readContract } from "@wagmi/core";
import { useNotification } from "web3uikit";
import { keccak256 } from "../utils";
import Web3 from "web3";
import ethers from "ethers";
import Header from "../components/header";
import Detail from "../components/detail";

export default function Home() {
  const { isConnected, address } = useAccount();
  const dispatch = useNotification();

  const [showDetail, setShowDetail] = useState(false);
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const handleNewNotification = (type: any, message: string, title: string) => {
    dispatch({
      type,
      message,
      title,
      position: "topL",
    });
  };

  const phoneHash = keccak256(phone);

  const handleNext = async () => {
    console.log(phoneHash);
    if (!isConnected) {
      handleNewNotification("info", "Please connect metamask!", "Notification");
    } else {
      setLoading(true);
      const data = await readContract({
        address: registryAddress,
        abi: registryAbi.abi,
        functionName: "recordExists",
        args: [phoneHash],
      });
      if (!data) {
        handleNewNotification(
          "success",
          "Phone number available!",
          "Notification"
        );
        localStorage.setItem("phoneNumber", phone);
        setShowDetail(true);
      } else {
        handleNewNotification(
          "info",
          "Phone number already taken!",
          "Notification"
        );
      }
      setLoading(false);
    }
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
                  onChange={(e: any) => setPhone(e.target.value)}
                  value={phone}
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
