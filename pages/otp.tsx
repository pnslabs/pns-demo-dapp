import { useState } from "react";
import Detail from "../components/detail";
import Header from "../components/header";
import OtpComponent from "../components/OtpComponent";

const Otp = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [otp, setOtp] = useState("1234");
  const [showDetail, setShowDetail] = useState(false);
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
                  onClick={() => setShowDetail(true)}
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
