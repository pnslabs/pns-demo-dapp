import { useEffect, useState } from "react";
import { useMoralis, useWeb3Contract } from "react-moralis";
import { contractAddresses, registryAbi, resolverAbi } from "../constants";
import { useNotification } from "web3uikit";
import { keccak256 } from "../utils";
import Web3 from "web3";
import { ethers } from "ethers";
const web3 = new Web3(
  "https://data-seed-prebsc-1-s1.binance.org:8545/" || "ws://localhost:8545"
);

const registryAddress = "0x9d5a1f5Fde036f1b10E8Ff5BEC938D8b26a4c4bB";
const resolverAddress = "0x6b1714EAC8968A01daA22f3Ff4BCf2FD03F66F66";

export default function Home() {
  const { enableWeb3, isWeb3Enabled } = useMoralis();
  const [step, setStep] = useState(0);
  const [phone, setPhone] = useState("");

  const handleNext = () => {
    setStep(step + 1);
  };
  const steps = [
    <Phone key={1} next={handleNext} phone={phone} setPhone={setPhone} />,
    <Record key={2} next={handleNext} phone={phone} />,
  ];

  useEffect(() => {
    if (
      !isWeb3Enabled &&
      typeof window !== "undefined" &&
      window.localStorage.getItem("connected")
    ) {
      enableWeb3();
      // enableWeb3({provider: window.localStorage.getItem("connected")}) // add walletconnect
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isWeb3Enabled]);
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="border rounded w-full lg:w-3/4 xl:w-2/4 p-5 shadow-lg">
        {steps[step]}
      </div>
    </div>
  );
}

const Phone = ({
  next,
  phone,
  setPhone,
}: {
  next: () => void;
  phone: string;
  setPhone: (e: string) => void;
}) => {
  const { chainId: chainIdHex } = useMoralis();
  const chainId = parseInt(chainIdHex!);

  const [loading, setLoading] = useState(false);
  const [phoneBtn, setPhoneBtn] = useState("Check");
  const [isAvailable, setIsAvailable] = useState(false);

  const phoneHash = keccak256(phone);

  let contract = new web3.eth.Contract(registryAbi.abi, registryAddress);

  const handlePhoneSubmit = async () => {
    if (phoneBtn === "Next") {
      next();
      return;
    } else {
      setLoading(true);
      const result = await contract.methods.recordExists(phoneHash).call();
      setIsAvailable(!result);
      setPhoneBtn(!result ? "Next" : "Check");
      setLoading(false);
    }
  };
  return (
    <div>
      <label className="block text-gray-700 text-sm font-bold mb-2">
        Phone number
      </label>
      <input
        placeholder="08130813007"
        name="phone"
        className="border rounded p-3 w-full"
        onChange={(e) => setPhone(e.target.value)}
        value={phone}
      />
      {phoneBtn === "Next" && (
        <div
          className={`mt-1.5 ${
            isAvailable ? "text-green-600" : "text-red-500"
          }`}
        >
          {isAvailable ? "Available" : "Not Available"}
        </div>
      )}
      <button
        onClick={handlePhoneSubmit}
        className="bg-blue-700 text-white py-2 px-5 mt-3 w-full rounded"
        disabled={loading}
      >
        {loading ? "Loading..." : phoneBtn}
      </button>
    </div>
  );
};

const supportedChains = ["54"];

const Record = ({ next, phone }: { next: () => void; phone: string }) => {
  const {
    enableWeb3,
    isWeb3Enabled,
    isWeb3EnableLoading,
    account,
    Moralis,
    deactivateWeb3,
    chainId: chainIdHex,
  } = useMoralis();
  const chainId = parseInt(chainIdHex!);

  const dispatch = useNotification();
  const phoneHash = keccak256(phone);

  let contract = new web3.eth.Contract(registryAbi.abi, registryAddress);

  const [loading, setLoading] = useState(false);

  const handleNewNotification = (type: any, message: string, title: string) => {
    dispatch({
      type,
      message,
      title,
      position: "topR",
    });
  };

  console.log(phoneHash);

  const handleSubmit = async () => {
    // try {
    console.log("sssss", account);
    setLoading(true);
    const otp = "123456";
    let message = ethers.utils.solidityPack(
      ["bytes32", "uint256"],
      [phoneHash, otp]
    );
    const status = true;
    const hashedMessage = ethers.utils.keccak256(message);
    const signature = await web3.eth.sign(hashedMessage, account!);
    await contract.methods
      .verifyPhone(phoneHash, hashedMessage, status, signature)
      .send({ from: account });
    console.log("phone verified");
    // const result = await contract.methods
    //   .setPhoneRecord(phoneHash, account, "BSC Testnet")
    //   .send({
    //     from: account,
    //   });
    handleNewNotification(
      "success",
      "Record successfully created!",
      "Notification"
    );
    setLoading(false);
    // console.log(result);
    // } catch (err) {
    //   console.log(err);
    //   setLoading(false);
    //   handleNewNotification("error", "Record creation failed!", "Notification");
    // }
  };

  const handleConnect = async () => {
    await enableWeb3();
    if (typeof window !== "undefined") {
      window.localStorage.setItem("connected", "injected");
    }
  };

  useEffect(() => {
    Moralis.onAccountChanged((account: any) => {
      if (account == null) {
        window.localStorage.removeItem("connected");
        deactivateWeb3();
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div>
      <h2>{phone} is available for record creation</h2>
      {isWeb3Enabled ? (
        <div>
          {/* <div>
            {!supportedChains.includes(parseInt(chainId!).toString()) && (
              <div>{`Please switch to a supported chainId. The supported Chain Ids are: ${supportedChains}`}</div>
            )}
          </div> */}
          {account && (
            <div className="py-2">
              Connected to {account.slice(0, 6)}...
              {account.slice(account.length - 4)}
            </div>
          )}
          <button
            onClick={handleSubmit}
            className="bg-blue-700 text-white py-2 px-5 mt-3 w-full rounded"
            disabled={loading}
          >
            Create Record
          </button>
        </div>
      ) : (
        <button
          onClick={handleConnect}
          className="bg-blue-700 text-white py-2 px-5 mt-3 w-full rounded"
          disabled={isWeb3EnableLoading}
        >
          Please connect your wallet
        </button>
      )}
    </div>
  );
};
