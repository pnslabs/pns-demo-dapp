import Image from "next/image";
import Link from "next/link";
import { useAccount, useConnect, useChainId } from "wagmi";
import { ethers } from "ethers";
import { useContext, useEffect, useState } from "react";
import { ChainIdContext } from "../context";

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
  const { chainId, setChainId } = useContext(ChainIdContext);

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

  const switchNetwork = async () => {
    try {
      await windowObj.ethereum?.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x61" }],
      });
    } catch (error: any) {
      // This error code indicates that the chain has not been added to MetaMask.
      if (error.code === 4902) {
        await addWallet();
        await connect({ connector: connectors[0] });
      }
      console.log("error from switch network", error);
    }
  };

  const getChainId = async () => {
    try {
      const network = await provider.getNetwork();
      const chain = network.chainId;
      setChainId(chain);
      return chain;
    } catch (error) {
      console.log("error from get chain id", error);
    }
  };

  const connectMetamask = async () => {
    try {
      if (isConnected && chainId !== 97) {
        return await switchNetwork();
      }
      await connect({ connector: connectors[0] });
    } catch (error) {
      console.log("error from connect metamask", error);
    }
  };

  const hasChainChanged = async () => {
    try {
      windowObj.ethereum?.on("chainChanged", async (chainId: any) => {
        const chain = parseInt(chainId);
        connect({ connector: connectors[0] });
        setChainId(chain);
        if (chain === 97) {
          await connect({ connector: connectors[0] });
        }
      });
    } catch (error) {
      console.log("error from chain changed", error);
    }
  };

  useEffect(() => {
    hasChainChanged();
    getChainId();
  }, []);

  const isActive = isConnected && chainId === 97;
  const addressSlice = `${address?.slice(0, 6)}...${address?.slice(
    address?.length - 4
  )}`;
  return (
    <header className="flex justify-between xl:px-16 px-5 py-4 items-center">
      <Link href="/">
        <Image src="/logo.svg" alt="logo" width={36} height={43} />
      </Link>
      <div className="flex items-center gap-12">
        <Link href="/transfer">
          <div className="font-semibold text-white">Transfer</div>
        </Link>
        <button
          onClick={connectMetamask}
          className="h-16 py-2 gap-4 cursor-pointer px-10 flex justify-center items-center connect"
        >
          <div className={`${isActive ? "active" : "inactive"}`} />

          <div className="text-white">
            {isConnected
              ? chainId === 97
                ? addressSlice
                : "Switch network"
              : "Connect Wallet"}
          </div>
        </button>
      </div>
    </header>
  );
};

export default Header;
