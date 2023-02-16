import Image from "next/image";
import Link from "next/link";
import { useAccount, useConnect, useChainId } from "wagmi";
import { ethers } from "ethers";
import { useEffect, useState } from "react";

const params = [
  {
    chainId: "0x61", // 97 in decimal
    chainName: "BSC Testnet",
    rpcUrls: ["https://data-seed-prebsc-1-s1.binance.org:8545"],
    nativeCurrency: {
      name: "Binance Coin",
      symbol: "BNB",
      decimals: 18,
    },
    blockExplorerUrls: ["https://explorer.binance.org/smart-testnet"],
  },
];

const Header = () => {
  const { isConnected, address } = useAccount();
  const { connect, connectors } = useConnect();
  const [chainId, setChainId] = useState(0);

  const windowObj = typeof window !== "undefined" ? (window as any) : null;
  const provider: any = windowObj
    ? new ethers.providers.Web3Provider(windowObj?.ethereum)
    : null;

  const addWallet = async () => {
    try {
      await windowObj.ethereum?.request({
        method: "wallet_addEthereumChain",
        params,
      });
    } catch (error) {
      console.log("error from add wallet", error);
    }
  };

  const switchNetwork = async (connector?: any) => {
    try {
      await windowObj.ethereum?.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x61" }],
      });
      await getChainId();
    } catch (error: any) {
      // This error code indicates that the chain has not been added to MetaMask.
      if (error.code === 4902) {
        await addWallet();
        if (connector) {
          await connect({ connector });
        }
        await getChainId();
      }
      console.log("error from switch network", error);
    }
  };

  const getChainId = async () => {
    try {
      const network = await provider.getNetwork();
      const chain = network.chainId;
      console.log(chain);
      setChainId(chain);
      return chain;
    } catch (error) {
      console.log("error from get chain id", error);
    }
  };

  const connectMetamask = async (connector: any) => {
    try {
      if (isConnected && chainId !== 97) {
        switchNetwork(connector);
      }
      await connect({ connector });
      await getChainId();
    } catch (error) {
      console.log("error from connect metamask", error);
    }
  };

  const hasChainChanged = async () => {
    try {
      windowObj.ethereum?.on("chainChanged", async (chainId: any) => {
        console.log("chain changed", chainId);
        await getChainId();
      });
    } catch (error) {
      console.log("error from chain changed", error);
    }
  };

  useEffect(() => {
    hasChainChanged();
  }, []);

  const isActive = isConnected && chainId === 97;
  return (
    <header className="flex justify-between xl:px-16 px-5 py-4 items-center">
      <Link href="/">
        <Image src="/logo.svg" alt="logo" width={36} height={43} />
      </Link>
      <div className="flex items-center gap-12">
        <Link href="/transfer">
          <div className="font-semibold text-white">Transfer</div>
        </Link>
        {connectors.map((connector) => (
          <button
            key={connector.id}
            onClick={() => connectMetamask(connector)}
            className="h-16 py-2 gap-4 cursor-pointer px-10 flex justify-center items-center connect"
          >
            <div className={`${isActive ? "active" : "inactive"}`} />
            <div className="text-white">
              {chainId === 97
                ? !isConnected
                  ? "Connect Wallet"
                  : `${address?.slice(0, 6)}...${address?.slice(
                      address?.length - 4
                    )}`
                : isConnected
                ? "Wrong Network"
                : "Connect Wallet"}
            </div>
          </button>
        ))}
      </div>
    </header>
  );
};

export default Header;
