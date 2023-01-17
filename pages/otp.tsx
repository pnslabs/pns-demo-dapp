import { useState } from "react";
import Detail from "../components/detail";
import Header from "../components/header";
import OtpComponent from "../components/OtpComponent";
import {
  prepareWriteContract,
  waitForTransaction,
  writeContract,
  fetchSigner,
} from "@wagmi/core";
import { registryAddress, registryAbi } from "../constants";
import { ethers } from "ethers";
import { keccak256 } from "../utils";
import { useNotification } from "web3uikit";

const Otp = () => {
  const dispatch = useNotification();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [otp, setOtp] = useState("1234");
  const [showDetail, setShowDetail] = useState(false);

  const phoneNumber = localStorage.getItem("phoneNumber");
  const phoneHash = keccak256(phoneNumber);

  const handleNewNotification = (type: any, message: string, title: string) => {
    dispatch({
      type,
      message,
      title,
      position: "topL",
    });
  };

  const verifyRecord = async () => {
    try {
      const message = ethers.utils.solidityPack(
        ["bytes32", "uint256"],
        [phoneHash, otp]
      );

      const hashedMessage = ethers.utils.keccak256(message);

      setLoading(true);
      const signer = await fetchSigner();
      const signature = await signer!.signMessage(
        ethers.utils.arrayify(hashedMessage)
      );

      const config = await prepareWriteContract({
        address: registryAddress,
        abi: registryAbi.abi,
        functionName: "verifyPhone",
        args: [phoneHash, hashedMessage, true, signature],
      });

      const data = await writeContract(config);

      await waitForTransaction({
        hash: data?.hash,
      });

      handleNewNotification(
        "success",
        "Phone number verified successfully!",
        "Notification"
      );

      setShowDetail(true);
    } catch (error) {
      handleNewNotification(
        "error",
        "An error occurred. Please try again!",
        "Notification"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {showDetail ? (
        <Detail currentIndex={1} />
      ) : (
        <div className="blue-bg">
          <Header />
          <div className="mt-32 flex justify-center items-center">
            <div className="otp-box p-11 flex flex-col justify-center items-center">
              <div className="w-96 flex flex-col justify-center items-center">
                <div className="font-bold mb-10 text-white text-2xl text-center">
                  Enter Verification Code sent to your phone number
                </div>
                <OtpComponent
                  otp={otp}
                  setOtp={setOtp}
                  error={error}
                  loading={loading}
                />
                <button
                  onClick={() => verifyRecord()}
                  className="complete-btn mt-7"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center justify-center my-2">
                      <div className="animate-spin">C</div>
                    </div>
                  ) : (
                    <div>Verify OTP</div>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Otp;
