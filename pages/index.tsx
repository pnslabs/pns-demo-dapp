import { useContext, useState } from "react";
import { registryAddress, registryAbi } from "../constants";
import { useAccount, useChainId } from "wagmi";
import { readContract } from "@wagmi/core";
import { useNotification } from "web3uikit";
import { encryptPhone, removePlusSign } from "../utils";
import Header from "../components/header";
import Detail from "../components/detail";
import { useRouter } from "next/router";
import { PhoneNumberContext } from "../context";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";

export default function Home() {
  const { isConnected, address } = useAccount();
  const dispatch = useNotification();
  const router = useRouter();
  const chainId = useChainId();
  const { phone, setPhone } = useContext(PhoneNumberContext);

  const [showDetail, setShowDetail] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleNewNotification = (type: any, message: string, title: string) => {
    dispatch({
      type,
      message,
      title,
      position: "topL",
    });
  };

  const phoneHash = encryptPhone(phone);

  const handleNext = async () => {
    try {
      if (!isConnected) {
        handleNewNotification(
          "info",
          "Please connect metamask!",
          "Notification"
        );
      } else {
        if (chainId !== 97) {
          return handleNewNotification(
            "info",
            "Please connect to BSC Testnet!",
            "Notification"
          );
        }
        setLoading(true);
        const info = await readContract({
          address: registryAddress,
          abi: registryAbi.abi,
          functionName: "getRecord",
          args: [phoneHash],
        });
        console.log(info);
        if (!info?.exists) {
          handleNewNotification(
            "success",
            "Phone number available!",
            "Notification"
          );
          setShowDetail(true);
        } else {
          if (address === info?.owner) {
            router.push("/profile");
          } else {
            handleNewNotification(
              "info",
              "Phone number already taken!",
              "Notification"
            );
          }
        }
        setLoading(false);
      }
    } catch (e: any) {
      console.log(e?.errorArgs);
      if (e?.errorArgs[0] === "phone record not found") {
        setShowDetail(true);
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
                <PhoneInput
                  placeholder="Enter phone number"
                  value={phone}
                  onChange={(value) => setPhone(value)}
                  className="search"
                  onCountryChange={(e) => console.log(e)}
                />
                <button
                  disabled={loading || phone?.length < 11}
                  onClick={handleNext}
                  className="search-button"
                >
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
