import { createContext, useState } from "react";

export const PhoneNumberContext = createContext<any>(null);

function Context({ children }: { children: any }) {
  const [phone, setPhone] = useState("");

  return (
    <PhoneNumberContext.Provider value={{ phone, setPhone }}>
      {children}
    </PhoneNumberContext.Provider>
  );
}

export default Context;
