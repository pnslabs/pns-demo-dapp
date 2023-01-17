import { useAccount, useDisconnect } from "wagmi";
import Web3 from "web3";
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

export default function Profile({ currentIndex }: { currentIndex: number }) {
  const { isConnected, address } = useAccount();
  const { disconnect } = useDisconnect();
  const phoneNumber = localStorage.getItem("phoneNumber");

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
                <div className="flex items-center gap-6 cursor-pointer">
                  <div className="pink text-lg font-medium">{address}</div>
                  <ArrowIcon />
                </div>
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
          <div className="px-24 flex flex-col gap-4">
            {items.map((item, index) => (
              <Item key={index} item={item} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const Item = ({ item }: { item: any }) => {
  return (
    <div className="flex items-center">
      <div className="w-4/6 flex items-center gap-12">
        <div className="flex items-center gap-2">
          {item.icon}
          <div className="font-bold text-lg text-white">{item.title}</div>
        </div>
        <div
          className={`${item.address ? "pink" : "gray"} text-lg font-medium`}
        >
          {item.address || "Not Set"}
        </div>
      </div>
      <div className="font-bold text-lg red cursor-pointer">
        {item.address ? "Update Address" : "Set Address"}
      </div>
    </div>
  );
};
