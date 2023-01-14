import "../styles/globals.css";
import type { AppProps } from "next/app";
import { MoralisProvider } from "react-moralis";
import { NotificationProvider } from "web3uikit";
import { registryAbi, resolverAbi } from "../constants";
import Web3 from "web3";

const registryAddress = "0x9d5a1f5Fde036f1b10E8Ff5BEC938D8b26a4c4bB";
const resolverAddress = "0x6b1714EAC8968A01daA22f3Ff4BCf2FD03F66F66";

export const web3 = new Web3(
  "https://data-seed-prebsc-1-s1.binance.org:8545/" || "ws://localhost:8545"
);
export const contract = new web3.eth.Contract(registryAbi.abi, registryAddress);
export default function App({ Component, pageProps }: AppProps) {
  return (
    <MoralisProvider initializeOnMount={false}>
      <NotificationProvider>
        <Component {...pageProps} />
      </NotificationProvider>
    </MoralisProvider>
  );
}
