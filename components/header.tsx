import { useMoralis } from "react-moralis";

const Header = () => {
  const { enableWeb3, isWeb3Enabled, account } = useMoralis();

  const handleConnectMetamask = () => {
    if (!isWeb3Enabled) {
      enableWeb3();
    }
  };
  return (
    <header className="flex justify-between xl:px-10 px-5 py-4 items-center">
      <div></div>
      <div className="flex items-center gap-12">
        {isWeb3Enabled && (
          <div className="font-semibold text-white cursor-pointer">
            My Account
          </div>
        )}
        <div
          onClick={handleConnectMetamask}
          className="h-16 py-2 cursor-pointer px-10 flex justify-center items-center connect"
        >
          <div className="text-white">
            {!isWeb3Enabled
              ? "Connect Wallet"
              : `${account?.slice(0, 6)}...${account?.slice(
                  account?.length - 4
                )}`}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
