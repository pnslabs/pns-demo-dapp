import { ethers } from "ethers";

export function encryptPhone(data: any) {
  return ethers?.utils?.keccak256(ethers?.utils?.toUtf8Bytes(data || ""));
}

export const removePlusSign = (str: string) => {
  const string = str || "";
  return string?.split("+")[1];
};
