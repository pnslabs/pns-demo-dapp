import Image from "next/image";
import Link from "next/link";
import { useMoralis } from "react-moralis";

const Header = () => {
  const { enableWeb3, isWeb3Enabled, account } = useMoralis();

  const handleConnectMetamask = () => {
    if (!isWeb3Enabled) {
      enableWeb3();
    }
  };
  return (
    <header className="flex justify-between xl:px-16 px-5 py-4 items-center">
      <Link href="/">
        <Image src="/logo.svg" alt="logo" width={36} height={43} />
      </Link>
      <div className="flex items-center gap-12">
        {isWeb3Enabled && (
          <Link href="/profile">
            <div className="font-semibold text-white cursor-pointer">
              My Account
            </div>
          </Link>
        )}
        <button
          onClick={handleConnectMetamask}
          className="h-16 py-2 gap-4 cursor-pointer px-10 flex justify-center items-center connect"
        >
          <div className={`${isWeb3Enabled ? "active" : "inactive"}`} />
          <div className="text-white">
            {!isWeb3Enabled
              ? "Connect Wallet"
              : `${account?.slice(0, 6)}...${account?.slice(
                  account?.length - 4
                )}`}
          </div>
        </button>
      </div>
    </header>
  );
};

export default Header;
