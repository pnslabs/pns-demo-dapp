import { useContext, useEffect, useState } from "react";
import Detail from "../components/detail";
import Header from "../components/header";
import OtpComponent from "../components/OtpComponent";
import { fetchSigner } from "@wagmi/core";
import { ethers } from "ethers";
import { encryptPhone } from "../utils";
import { useNotification } from "web3uikit";
import { CountryCtx, PhoneNumberContext } from "../context";
import axios from "axios";

const Otp = () => {
  const dispatch = useNotification();
  const { phone: phoneNumber } = useContext(PhoneNumberContext);
  const { country } = useContext(CountryCtx);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [otp, setOtp] = useState("");
  const [showDetail, setShowDetail] = useState(false);

  const phoneHash = encryptPhone(phoneNumber);

  const handleNewNotification = (type: any, message: string, title: string) => {
    dispatch({
      type,
      message,
      title,
      position: "topL",
    });
  };
  const getOtp = () => {
    const url = `${process.env.NEXT_PUBLIC_SERVER_URL}/otp`;
    axios.post(url, { phoneNumber, country });
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

      const url = `${process.env.NEXT_PUBLIC_SERVER_URL}/signature/verify`;
      await axios.post(url, { phoneNumber, otp, signature, hashedMessage });

      handleNewNotification(
        "success",
        "Phone number verified successfully!",
        "Notification"
      );
      setLoading(false);

      setShowDetail(true);
    } catch (error) {
      console.log(error);
      handleNewNotification(
        "error",
        "An error occurred. Please try again!",
        "Notification"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getOtp();
  }, []);

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
                  Enter Verification Code sent to {phoneNumber}
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
                  disabled={loading || otp?.length < 6}
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
