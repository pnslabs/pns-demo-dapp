import { useState } from "react";
import { registryAddress, registryAbi } from "../constants";
import { useAccount } from "wagmi";
import {
  readContract,
  prepareSendTransaction,
  sendTransaction,
  waitForTransaction,
} from "@wagmi/core";
import { useNotification } from "web3uikit";
import { keccak256, removePlusSign } from "../utils";
import Header from "../components/header";
import { ethers } from "ethers";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";

export default function Transfer() {
  const { isConnected } = useAccount();
  const dispatch = useNotification();
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const handleNewNotification = (type: any, message: string, title: string) => {
    dispatch({
      type,
      message,
      title,
      position: "topL",
    });
  };

  const phoneHash = keccak256(removePlusSign(phone));

  const handleNext = async () => {
    try {
      if (!isConnected) {
        handleNewNotification(
          "info",
          "Please connect metamask!",
          "Notification"
        );
      } else {
        setLoading(true);
        const info = await readContract({
          address: registryAddress,
          abi: registryAbi.abi,
          functionName: "getResolver",
          args: [phoneHash],
        });
        console.log(info);

        const response: any = info?.find((resp: any) => resp.label === "BNB");
        console.log(response?.wallet!);
        if (response) {
          const config = await prepareSendTransaction({
            request: {
              to: response?.wallet!,
              value: ethers.utils.parseEther(amount),
            },
          });
          const data = await sendTransaction(config);

          await waitForTransaction({
            hash: data?.hash,
          });

          setAmount("");
          setPhone("");

          handleNewNotification(
            "success",
            "Sent successfully!",
            "Notification"
          );
        } else {
          handleNewNotification(
            "info",
            "Could not resolve phone number to BNB address",
            "Notification"
          );
        }
      }
    } catch (e: any) {
      console.log(e);
      if (e?.errorArgs?.[0] === "phone record not found") {
        // setShowDetail(true);
      }
      handleNewNotification(
        "info",
        "Could not resolve phone number to BNB address",
        "Notification"
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <div className="bg">
        <Header />
        <div className="flex flex-col items-center">
          <div className="flex mt-56 max-w-3xl flex-col justify-center items-center">
            <div className="connect-text">Transfer funds to a phone number</div>
            <div className="flex mt-10 flex-col gap-5 w-full">
              <PhoneInput
                placeholder="Enter phone number"
                value={phone}
                onChange={(value) => setPhone(value!)}
                className="search"
              />
              <input
                onChange={(e: any) => setAmount(e.target.value)}
                value={amount}
                className="send px-10"
                placeholder="Enter amount"
              />
              <button
                disabled={!amount || !phone || loading}
                onClick={handleNext}
                className="send-button"
              >
                {loading ? (
                  <div className="flex items-center justify-center my-2">
                    <div className="animate-spin">C</div>
                  </div>
                ) : (
                  <div>Send</div>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
