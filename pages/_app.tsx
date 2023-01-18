import "../styles/globals.css";
import type { AppProps } from "next/app";
import { NotificationProvider } from "web3uikit";
import { registryAbi, resolverAbi } from "../constants";
import Web3 from "web3";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { bscTestnet, localhost } from "wagmi/chains";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import Context from "../context";

export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;

// Wagmi client
const { chains, provider } = configureChains(
  [bscTestnet],
  [
    jsonRpcProvider({
      rpc: () => ({
        http: "https://data-seed-prebsc-2-s3.binance.org:8545/",
        // http: "http://127.0.0.1:8545",
      }),
    }),
  ]
);
const wagmiClient = createClient({
  provider,
  connectors: [new MetaMaskConnector({ chains })],
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig client={wagmiClient}>
      <NotificationProvider>
        <Context>
          <Component {...pageProps} />
        </Context>
      </NotificationProvider>
    </WagmiConfig>
  );
}
