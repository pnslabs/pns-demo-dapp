import Web3 from "web3";
const web3 = new Web3(
  "https://data-seed-prebsc-1-s1.binance.org:8545/" || "ws://localhost:8545"
);

export const keccak256 = (...args: any) => {
  args = args.map((arg: any) => {
    if (typeof arg === "string") {
      if (arg.substring(0, 2) === "0x") {
        return arg.slice(2);
      } else {
        return web3.utils.toHex(arg).slice(2);
      }
    }

    if (typeof arg === "number") {
      return web3.utils.leftPad(arg.toString(16), 64, 0);
    } else {
      return "";
    }
  });

  args = args.join("");

  return web3.utils.soliditySha3(args);
};
