import { createContext, useState } from "react";

export const PhoneNumberContext = createContext<any>(null);
export const CountryCtx = createContext<any>(null);
export const ChainIdContext = createContext<any>(null);

export function PhoneContext({ children }: { children: any }) {
  const [phone, setPhone] = useState("");

  return (
    <PhoneNumberContext.Provider value={{ phone, setPhone }}>
      {children}
    </PhoneNumberContext.Provider>
  );
}

export function CountryContext({ children }: { children: any }) {
  const [country, setCountry] = useState("");

  return (
    <CountryCtx.Provider value={{ country, setCountry }}>
      {children}
    </CountryCtx.Provider>
  );
}

export function ChainContext({ children }: { children: any }) {
  const [chainId, setChainId] = useState(0);

  return (
    <ChainIdContext.Provider value={{ chainId, setChainId }}>
      {children}
    </ChainIdContext.Provider>
  );
}
