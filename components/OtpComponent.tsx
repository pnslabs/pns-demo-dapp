import OtpInput from "react-otp-input";
import styled from "styled-components";

const OtpWrapper = styled.div`
  margin-bottom: 32px;

  .inputStyle {
    width: 64px;
    min-width: 64px;
    height: 58px;
    background: #0f0923;
    border: 1px solid #f8c6c6;
    border-radius: 12px;
    color: #ffffff;
    font-weight: 700;
    font-size: 25px;
  }
  .errorStyle {
    background: #fff7f7;
    border: 1px solid #ff4747;
    color: #ff4747;
  }
  .focusStyle {
    background: #0f0923;
    color: #ffffff;
  }
  .noDisplay {
    opacity: 0;
  }
`;

export const OtpComponent = ({
  otp,
  setOtp,
  error,
  loading,
}: {
  otp: string;
  setOtp: (value: string) => void;
  error: string;
  loading: boolean;
}) => {
  const handleChange = async (otp: any) => {
    setOtp(otp);
  };

  return (
    <>
      <OtpWrapper>
        <OtpInput
          value={otp}
          onChange={handleChange}
          numInputs={6}
          separator={<span className="noDisplay">{"-"}</span>}
          hasErrored={error?.length! > 0 && !loading && otp.length === 6}
          shouldAutoFocus
          inputStyle="inputStyle"
          errorStyle="errorStyle"
          focusStyle="focusStyle"
          isInputNum={true}
          className="grid justify-between lg:justify-center xl:justify-between grid-cols-6 lg:gap-4 xl:gap-7"
        />
      </OtpWrapper>
      {loading && (
        <div className="flex items-center justify-center my-2">
          <div className="animate-spin">C</div>
        </div>
      )}
    </>
  );
};

export default OtpComponent;
