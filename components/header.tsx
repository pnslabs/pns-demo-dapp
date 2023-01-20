import Image from "next/image";
import Link from "next/link";
import { useAccount, useConnect } from "wagmi";

const Header = () => {
  const { isConnected, address } = useAccount();
  const { connect, connectors } = useConnect();

  return (
    <header className="flex justify-between xl:px-16 px-5 py-4 items-center">
      <Link href="/">
        <Image src="/logo.svg" alt="logo" width={36} height={43} />
      </Link>
      <div className="flex items-center gap-12">
        <Link href="/transfer">
          <div className="font-semibold text-white">Transfer</div>
        </Link>
        {isConnected && (
          <Link href="/profile">
            <div className="font-semibold text-white cursor-pointer">
              My Account
            </div>
          </Link>
        )}
        {connectors.map((connector) => (
          <button
            key={connector.id}
            onClick={() => connect({ connector })}
            className="h-16 py-2 gap-4 cursor-pointer px-10 flex justify-center items-center connect"
          >
            <div className={`${isConnected ? "active" : "inactive"}`} />
            <div className="text-white">
              {!isConnected
                ? "Connect Wallet"
                : `${address?.slice(0, 6)}...${address?.slice(
                    address?.length - 4
                  )}`}
            </div>
          </button>
        ))}
      </div>
    </header>
  );
};

export default Header;
