import { useState } from "react";
import Header from "./header";
import { BnbIcon } from "../public/icon";
import { useRouter } from "next/router";
import { useAccount, useDisconnect } from "wagmi";
import { registryAddress, registryAbi } from "../constants";
import {
  prepareWriteContract,
  waitForTransaction,
  writeContract,
} from "@wagmi/core";
import { keccak256 } from "../utils";
import { useNotification } from "web3uikit";

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

export default function Detail({ currentIndex }: { currentIndex?: number }) {
  const router = useRouter();
  const dispatch = useNotification();

  const phoneNumber = localStorage.getItem("phoneNumber");
  const phoneHash = keccak256(phoneNumber);
  const { isConnected, address } = useAccount();
  const { disconnect } = useDisconnect();

  const [loading, setLoading] = useState(false);

  const handleDisconnect = () => {
    localStorage.removeItem("phoneNumber");
    disconnect();
  };

  const handleNewNotification = (type: any, message: string, title: string) => {
    dispatch({
      type,
      message,
      title,
      position: "topL",
    });
  };

  const createRecord = async () => {
    try {
      setLoading(true);
      const config = await prepareWriteContract({
        address: registryAddress,
        abi: registryAbi.abi,
        functionName: "setPhoneRecord",
        args: [phoneHash, address, "ETH"],
      });
      const data = await writeContract(config);
      console.log(data.hash);

      await waitForTransaction({
        hash: data?.hash,
      });
      router.push("/profile");
      handleNewNotification("success", "Phone record created!", "Notification");
    } catch (error) {
      handleNewNotification(
        "error",
        "An error occurred! Please try again later",
        "Notification"
      );
    } finally {
      setLoading(false);
    }
  };
  const handleNext = () => {
    if (currentIndex === 1) {
      createRecord();
    } else {
      router.push("/otp");
    }
  };
  return (
    <div className="bg">
      <Header />
      {isConnected && (
        <div className="absolute bottom-10 left-10">
          <div className="flex flex-col items-center justify-center">
            <div className="flex items-center gap-2">
              <div className="active" />
              <div className="text-white font-bold text-sm">{`${address?.slice(
                0,
                6
              )}...${address?.slice(address?.length - 4)}`}</div>
            </div>
            <button onClick={handleDisconnect} className="disconnect mt-3">
              Disconnect
            </button>
          </div>
        </div>
      )}
      <div className="flex relative justify-end mt-10 xl:px-16 px-5">
        <div className="detail-bg py-10 px-20">
          <div className="flex justify-between">
            <div className="green">{phoneNumber}</div>
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
            <button onClick={handleNext} className="complete-btn">
              {loading ? (
                <div className="flex items-center justify-center my-2">
                  <div className="animate-spin">C</div>
                </div>
              ) : (
                <div>
                  {currentIndex === 1
                    ? "Complete Registration"
                    : "Verify Phone Number"}
                </div>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
