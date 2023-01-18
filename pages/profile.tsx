import { useContext, useEffect, useState } from "react";
import { useAccount, useDisconnect } from "wagmi";
import {
  readContract,
  prepareWriteContract,
  waitForTransaction,
  writeContract,
} from "@wagmi/core";
import { registryAddress, registryAbi } from "../constants";
import Header from "../components/header";
import {
  ArrowIcon,
  BtcIcon,
  ClockIcon,
  EthIcon,
  LockIcon,
  RefreshIcon,
  SolIcon,
} from "../public/icon";
import { keccak256 } from "../utils";
import { useNotification } from "web3uikit";
import { PhoneNumberContext } from "../context";

export default function Profile({ currentIndex }: { currentIndex: number }) {
  const { isConnected, address } = useAccount();
  const { disconnect } = useDisconnect();
  const { phone: phoneNumber } = useContext(PhoneNumberContext);

  const [data, setData] = useState<any>({});
  const [resolver, setResolver] = useState<any>([]);

  const phoneHash = keccak256(phoneNumber);

  const handleDisconnect = () => {
    disconnect();
  };

  const items = [
    {
      title: "ETH",
      address: address,
      icon: <EthIcon />,
    },
    {
      title: "BTC",
      address: "",
      icon: <BtcIcon />,
    },
    {
      title: "SOL",
      address: "",
      icon: <SolIcon />,
    },
  ];

  const getInfo = async () => {
    if (isConnected) {
      const info = await readContract({
        address: registryAddress,
        abi: registryAbi.abi,
        functionName: "getRecord",
        args: [phoneHash],
      });
      setData({
        owner: info?.owner,
        expirationTime: info?.expirationTime,
        isExpired: info?.isExpired,
        isInGracePeriod: info?.isInGracePeriod,
        phoneHash: info?.phoneHash,
      });
    }
  };

  const getResolvers = async () => {
    if (data?.phoneHash && resolver?.length === 0 && isConnected) {
      const info = await readContract({
        address: registryAddress,
        abi: registryAbi.abi,
        functionName: "getResolver",
        args: [data?.phoneHash],
      });
      setResolver(info);
    }
  };

  useEffect(() => {
    getInfo();
  }, [isConnected]);

  useEffect(() => {
    getResolvers();
  }, [data]);

  return (
    <div className="bg">
      <Header />
      {isConnected && (
        <div className="absolute bottom-10 left-10">
          <div className="flex flex-col items-center justify-center">
            <div className="text-white font-bold text-sm">{`${address?.slice(
              0,
              6
            )}...${address?.slice(address?.length - 4)}`}</div>
            <button onClick={handleDisconnect} className="disconnect mt-3">
              Disconnect
            </button>
          </div>
        </div>
      )}
      <div className="flex relative justify-end mt-10 xl:px-16 px-5">
        <div className="detail-bg">
          <div className="py-7 px-24 border-bottom pink font-bold text-2xl">
            {phoneNumber}
          </div>
          <div className="py-14 px-24 border-bottom pink font-bold text-2xl">
            <div className="flex items-center gap-8">
              <div>
                <div className="flex items-center gap-3">
                  <LockIcon />
                  <div className="font-bold text-lg text-white">CONTROLLER</div>
                </div>
                <div className="flex items-center gap-3 mt-3">
                  <ClockIcon />
                  <div className="font-bold text-lg text-white">
                    EXPIRATION DATE
                  </div>
                </div>
              </div>
              <div>
                {data?.owner ? (
                  <div className="flex items-center gap-6 cursor-pointer">
                    <div className="pink text-lg font-medium">
                      {data?.owner}
                    </div>
                    <ArrowIcon />
                  </div>
                ) : (
                  <div className="animate-pulse">
                    <div className="h-4 bg-slate-700 rounded col-span-2"></div>
                  </div>
                )}
                <div className="text-lg font-medium yellow mt-3">
                  12th January 2022
                </div>
              </div>
            </div>
          </div>
          <div className="pt-10 pb-5 px-24">
            <div className="pb-10 border-bottom flex items-center gap-3">
              <RefreshIcon />
              <div className="font-bold text-lg text-white">
                Resolver Records
              </div>
            </div>
          </div>
          {resolver?.length > 0 ? (
            <div className="px-24 flex flex-col gap-4">
              {items.map((item, index) => (
                <Item
                  phoneHash={data?.phoneHash}
                  key={index}
                  item={item}
                  resolver={resolver}
                />
              ))}
            </div>
          ) : (
            <div className="animate-pulse px-24 flex flex-col gap-5">
              {[1, 2, 3].map((item) => (
                <div key={item} className="flex-1 space-y-6 py-1">
                  <div className="space-y-3">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="h-4 bg-slate-700 rounded col-span-2"></div>
                      <div className="h-4 bg-slate-700 rounded col-span-1"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const Item = ({
  item,
  resolver,
  phoneHash,
}: {
  item: any;
  resolver: any;
  phoneHash: string;
}) => {
  const dispatch = useNotification();

  const [data, setData] = useState<any>({});
  const [address, setAddress] = useState<string>("");
  const [showInput, setShowInput] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const handleNewNotification = (type: any, message: string, title: string) => {
    dispatch({
      type,
      message,
      title,
      position: "topL",
    });
  };

  const handleSetAddress = async () => {
    try {
      setLoading(true);
      const config = await prepareWriteContract({
        address: registryAddress,
        abi: registryAbi.abi,
        functionName: "linkPhoneToWallet",
        args: [phoneHash, address, item.title],
      });

      const data = await writeContract(config);

      const txt = await waitForTransaction({
        hash: data?.hash,
      });
      console.log(txt);
      setData({
        wallet: address,
      });
      handleNewNotification(
        "success",
        "Address linked successfully!",
        "Notification"
      );
    } catch (error) {
      console.log(error);
      handleNewNotification(
        "error",
        "An error occurred. Please try again!",
        "Notification"
      );
    } finally {
      setShowInput(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    const response = resolver?.find((resp: any) => resp.label === item.title);
    setData(response);
    setAddress(response?.wallet);
  }, [resolver]);
  return (
    <div className="flex items-center">
      <div className="w-4/6 flex items-center gap-12">
        <div className="flex items-center gap-2">
          {item.icon}
          <div className="font-bold text-lg text-white">{item.title}</div>
        </div>
        <div
          className={`${data?.wallet ? "pink" : "gray"} text-lg font-medium`}
        >
          {data?.wallet || "Not Set"}
        </div>
      </div>
      <div className="font-bold text-lg red cursor-pointer">
        {!showInput ? (
          <div onClick={() => setShowInput(!showInput)}>
            {data?.wallet ? "Update Address" : "Set Address"}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            {!loading && <button onClick={() => setShowInput(false)}>x</button>}
            <input
              onChange={(e: any) => setAddress(e.target.value)}
              className="rounded p-2 text-xs w-64"
              value={data?.wallet}
            />
            <button onClick={handleSetAddress} className="pl-3 text-xs">
              {loading ? (
                <div className="flex items-center justify-center my-2">
                  <div className="animate-spin">C</div>
                </div>
              ) : (
                <div>{data?.wallet ? "Update" : "Add"}</div>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
