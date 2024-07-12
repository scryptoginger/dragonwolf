import contractABI from "./contract_ABI.json";
import { Alchemy, Network } from "alchemy-sdk";
import { ethers } from "ethers";

// const { ethers } = require("ethers");

const API_KEY_ID = process.env.NEXT_PUBLIC_INFURA_API_KEY;

//example -- testing API
const settings = {
  apiKey: API_KEY_ID,
  // network: Network.MATIC_AMOY,
  network: Network.maticmum,
};
const alchemy = new Alchemy(settings);
const nfts = alchemy.nft.getNftsForOwner("vitalik.eth");
console.log(`%%%_NFTs...${nfts}`);
alchemy.core.nfts.then(console.log);

// const provider = new AlchemyProvider("maticmum", API_KEY_ID);
debugger;
const provider = new ethers.providers.AlchemyProvider("maticmum", API_KEY_ID);
const contractAddress = "0xC6760c2Fd1809742B4577aAaa4013C92e9Cd89bB";
//const CONTRACT_ABI = contractABI;
const contract = new ethers.Contract(contractAddress, contractABI, provider);

export const main = async () => {
  const name = await contract.name();
  const symbol = await contract.symbol();
  const totalSupply = await contract.totalSupply();

  console.log(`\nReading from ${contractAddress}\n`);
  console.log(`Name: ${name}`);
  console.log(`Symbol: ${symbol}`);
  console.log(`Total Supply: ${totalSupply}\n`);

  const balance = await contract.balanceOf("msg.sender");
  const balance2 = await provider.getBalance("0x52491413aFCff113bbFE8d4814124FBEc1486D27");

  console.log(`Balance Returned: ${balance}`);
  alert(`Balance Returned: ${balance}`);
  alert(`Balance2 Returned: ${balance2}`);
  // console.log(`Balance Formatted: ${ethers.utils.formatEther(balance)}\n`);
};

// main();

// await provider.send("eth_requestAccounts", []);
// const signer = provider.getSigner();
