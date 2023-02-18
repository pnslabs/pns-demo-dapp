import "../styles/globals.css";
import type { AppProps } from "next/app";
import { NotificationProvider } from "web3uikit";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { bscTestnet } from "wagmi/chains";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import { ChainContext, CountryContext, PhoneContext } from "../context";

export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;

const { chains, provider } = configureChains(
  [bscTestnet],
  [
    jsonRpcProvider({
      rpc: () => ({
        http: "https://data-seed-prebsc-2-s3.binance.org:8545/",
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
        <PhoneContext>
          <CountryContext>
            <ChainContext>
              <Component {...pageProps} />
            </ChainContext>
          </CountryContext>
        </PhoneContext>
      </NotificationProvider>
    </WagmiConfig>
  );
}
