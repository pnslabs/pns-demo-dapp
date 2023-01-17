import { useState } from "react";
import Detail from "../components/detail";
import Header from "../components/header";
import OtpComponent from "../components/OtpComponent";
import {
  prepareWriteContract,
  waitForTransaction,
  writeContract,
  readContract,
  signMessage,
  fetchSigner,
} from "@wagmi/core";
import {
  registryAddress,
  resolverAddress,
  registryAbi,
  resolverAbi,
} from "../constants";
import { ethers } from "ethers";
import { keccak256 } from "../utils";

const Otp = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [otp, setOtp] = useState("1234");
  const [showDetail, setShowDetail] = useState(false);

  const phoneNumber = localStorage.getItem("phoneNumber");
  const phoneHash = keccak256(phoneNumber);

  const message = ethers.utils.solidityPack(
    ["bytes32", "uint256"],
    [phoneHash, otp],
  );

  const hashedMessage = ethers.utils.keccak256(message);
  console.log(hashedMessage, "here");

  const verifyRecord = async () => {
    const signer = await fetchSigner();
    const signature = await signer.signMessage(
      ethers.utils.arrayify(hashedMessage),
    );
    console.log(signature, "signature");
    const config = await prepareWriteContract({
      address: registryAddress,
      abi: registryAbi.abi,
      functionName: "verifyPhone",
      args: [phoneHash, hashedMessage, true, signature],
    });
    const data = await writeContract(config);
    console.log(data.hash);

    const txResult = await waitForTransaction({
      hash: data?.hash,
    });
    console.log(txResult, "transaction result for verification");
    const verificationRecordData = await readContract({
      address: registryAddress,
      abi: registryAbi.abi,
      functionName: "getVerificationRecord",
      args: [phoneHash],
    });
    console.log(verificationRecordData, "verification record data");
    setShowDetail(true);
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
                >
                  Verify OTP
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
