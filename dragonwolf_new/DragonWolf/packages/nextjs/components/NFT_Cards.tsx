"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import contractABI from "../utils/contract_ABI.json";
import forgeContractABI from "../utils/forge_contract_ABI.json";
import { JsonRpcProvider, ethers } from "ethers";
import { useAccount, usePrepareContractWrite, useReadContract, useWriteContract } from "wagmi";
import { metadata } from "~~/app/layout";
import { Address } from "~~/components/scaffold-eth";
import { AddressProps } from "~~/components/scaffold-eth/Address";

const bafyImgLink = "https://ipfs.io/ipfs/bafybeichdpu3ded2ccgfznlki6djbtjcly47ho5ftyhi4doimbdfxnp4xe/";
const DW_CONTRACT_ADDRESS = "0x09443e82fca088e0D40eccA2F0c0BFA7c8725B8d";
const FORGE_CONTRACT_ADDRESS = "0xc14319f323F8F34d289c6AA2cbDf8600A556e580";
const providerUrl = "https://polygon-amoy.drpc.org";
const chainName = "amoy";
const chainId = 80002;
const network = new ethers.Network(chainName, chainId);
const provider = new ethers.JsonRpcProvider(providerUrl, network, { staticNetwork: network });
const privateKey = process.env.NEXT_PUBLIC_DEPLOYER_PRIVATE_KEY || ""; // Provide a default value if DEPLOYER_PRIVATE_KEY is undefined
const wallet = new ethers.Wallet(privateKey, provider);
const contract = new ethers.Contract(DW_CONTRACT_ADDRESS, contractABI, wallet);
const contractSigner = new ethers.Contract(DW_CONTRACT_ADDRESS, contractABI, wallet).connect(wallet);
const forgingRequirements: { [key: number]: number[] } = {
  3: [0, 1], // To forge token 3, burn one each of tokens 0 and 1
  4: [1, 2], // To forge token 4, burn one each of tokens 1 and 2
  5: [0, 2], // To forge token 5, burn one each of tokens 0 and 2
  6: [0, 1, 2], // To forge token 6, burn one each of tokens 0, 1, and 2
};

export function NFT_Cards() {
  const [balances, setBalances] = useState<number[]>([]);
  const { address: connectedAddress } = useAccount();

  const dwContract = new ethers.Contract(DW_CONTRACT_ADDRESS, contractABI, wallet);
  const forgeContract = new ethers.Contract(FORGE_CONTRACT_ADDRESS, forgeContractABI, wallet);

  const fetchBalances = async () => {
    if (!connectedAddress) return;

    try {
      const tokenIds = [0, 1, 2, 3, 4, 5, 6];
      const balancePromises = tokenIds.map(tokenId => dwContract.balanceOf(connectedAddress, tokenId));
      const fetchedBalances = await Promise.all(balancePromises);
      setBalances(fetchedBalances.map((b: bigint) => Number(b)));
    } catch (error) {
      console.error("Error fetching contract data:", error);
    }
  };

  const checkApproval = async () => {
    //   if (!contractSigner || !connectedAddress) return;
    //  const isApproved = await dw_contract.isApprovedForAll(connectedAddress, forge_contractAddress);
    if (!dwContract || !connectedAddress) return;
    const isApproved = await dwContract.isApprovedForAll(connectedAddress, FORGE_CONTRACT_ADDRESS);
    console.log({ isApproved });
    if (!isApproved) {
      const approvalTx = await dwContract.setApprovalForAll(FORGE_CONTRACT_ADDRESS, true);
      await approvalTx.wait();
      console.log("Approval set for all tokens.");
      alert("Approval set for all tokens. You can now forge NFTs 3 - 6.");
    }
  };

  const checkAndForgeToken = async (burnIds: number[], tokenToForgeId: number, burnAmount: number) => {
    const tokensToBurn = forgingRequirements[tokenToForgeId];

    try {
      if (
        !tokenId ||
        !dwContract ||
        !contractSigner ||
        !connectedAddress ||
        !forgeContract ||
        burnIds.length === 0 ||
        !tokenToForgeId ||
        !burnAmount
      ) {
        console.error("Missing required data for token forging.");
        return;
      } //end of if statement

      const balances = await Promise.all(burnIds.map(id => dwContract.balanceOf(connectedAddress, id)));

      //const balances = await Promise.all(burnIds.map(id => dwContract.balanceOf(connectedAddress, id)));
      const hasSufficientTokens = balances.every((balance: bigint) => balance >= BigInt(burnAmount));

      if (!hasSufficientTokens) {
        console.error("Insufficient tokens to forge.");
        alert(
          "Insufficient tokens to forge. Please review the forging guide and make sure your account has the correct tokens (0-2) for forging and try again.",
        );
        return;
      } //end of if statement

      if (
        !confirm(
          `To forge token ${tokenId} you will burn ${burnAmount} of tokens ${burnIds.join(
            //`To forge token ${tokenToForgeId} you will burn ${burnAmount} of tokens ${tokensToBurn.join(
            ", ",
          )}. Are you sure you want to proceed?`,
        )
      ) {
        return;
      }

      await checkApproval();
      const forgeTx = await forgeContract.forge(burnIds, burnAmount, tokenId);
      // const forgeTx = await forge_contract.forge(burnIds, burnAmount, tokenToForgeId);
      await forgeTx.wait();
      console.log("Token forged successfully.");
      alert("Token forged successfully.");
    } catch (error: any) {
      console.error("Error forging token:", error);
      alert("Token forging failed. Please try again. " + error.message);
    }
  };

  const handleClick = async event => {
    const tokenAction = event.currentTarget.getAttribute("data-value");
    const tokenId = parseInt(event.currentTarget.getAttribute("data-tokenid"));

    switch (tokenAction) {
      case "mint":
        // Call minting code
        const mintQty = prompt("Enter the quantity of tokens to mint:");
        if (mintQty) {
          const connectedAddress = await wallet.getAddress();
          try {
            const tx = await contract.mint(connectedAddress, tokenId, mintQty);
            await tx.wait();
            // wallet.sendTransaction(mintedToken);
            console.log(`Minted token ${tokenId}: ${tx}`);
            debugger;
          } catch (error) {
            console.error("Error minting token:", error);
          }
        }
        break;
      case "trade":
        // Call trading code
        break;
      case "forge":
        // Call forging code
        await checkAndForgeToken(tokenId);
        //checkAndForgeToken(forgingRequirements[tokenId], tokenId, 1);
        break;
      default:
        // Default case: burn
        console.log("TROGDOR STRIKES AGAIN!!!");
        break;
    }
  };

  useEffect(() => {
    fetchBalances();
  }, [connectedAddress]);

  if (!connectedAddress) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-center text-lg font-bold">
          Please connect your wallet to view and interact with the Dragon-Wolf Collection.
        </p>
      </div>
    );
  }

  // useEffect(() => {
  //   (async function initWalletConnect() {
  //     if (!connectedAddress) {
  //       console.error("No wallet address found.");
  //       return;
  //     }
  // const { status } = useConnect({
  //   config: {
  //     connectors: new injectedConnector(),
  //     chains: [Network.Polygon],
  //     storage: {},
  //     state: {},
  //     setState: () => {},
  //     onConnect: () => {},
  //     onDisconnect: () => {},
  //   },
  // });
  //     // const { disconnect } = useDisconnect();
  //     // const client = await Client.init({
  //     //   projectId: "YOUR_PROJECT_ID",
  //     //   metadata: {
  //     //     name: "DragonWolf Collection",
  //     //     description: "A fun collection of a mashup between wolves and dragons.",
  //     //     url: "http://localhost:3000",
  //     //     icons: ["https://your-website/logo.svg"],
  //     //   },
  //     // });

  //     // const provider = new WalletConnectProvider({
  //     //   client,
  //     //   chainId: 80002, // polygonAmoy Chain ID
  //     // });

  //     try {
  //       await provider.enable();
  //       const web3Provider = new ethers.providers.Web3Provider(provider);
  //       const contractSigner = web3Provider.getSigner();
  //       const contract = new ethers.Contract(DW_contractAddress, contractABI, contractSigner);

  //       const tokenIds = [0, 1, 2, 3, 4, 5, 6];
  //       const balancePromises: Promise<BigNumber>[] = tokenIds.map(tokenId =>
  //         contract.balanceOf(connectedAddress, tokenId),
  //       );
  //       const fetchedBalances = await Promise.all(balancePromises);

  //       setBalances(fetchedBalances.map((b: { toString: () => string }) => parseInt(b.toString(), 10)));

  //       // Testing
  //       for (const tokenId of tokenIds) {
  //         const tokenQty = await contract.balanceOf(connectedAddress, tokenId);
  //         console.log({ tokenQty });
  //       }

  //       const tokenName = await contract.name();
  //       console.log({ tokenName });
  //     } catch (error) {
  //       console.error("Error fetching contract data:", error);
  //     }
  //   })();
  // }, [connectedAddress]);

  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5">
          <h1 className="text-center">
            <span className="block text-4xl font-bold">Dragon-Wolf Collection</span>
          </h1>
          <div className="flex justify-center items-center space-x-2">
            <p className="text-center text-lg">A fun collection of a mashup between wolves and dragons.</p>
          </div>

          <div className="px-5">
            <div className="flex justify-center items-center space-x-2">
              <p className="my-2 font-medium">Connected Address:</p>
              <Address address={connectedAddress} />
            </div>
            <div className="text-center mt-4">
              <p className="text-sm text-gray-500">
                This site is still a work in progress. If something is broken or not working (yet), feel free to DM me
                at any of my links in the Footer.
              </p>
            </div>
          </div>
        </div>

        <div className="flex-grow bg-base-300 w-full mt-1 px-8 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 justify-items-center">
            {balances.map((balance, index) => (
              <div key={index} className="flex flex-col bg-base-100 px-5 py-5 rounded-3xl">
                <Link
                  href={`${bafyImgLink}${index}`}
                  passHref
                  className="link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src={`${bafyImgLink}${index}`} alt={`NFT_${index} image`} className="mx-auto" />
                </Link>
                <div className="flex justify-between items-center">
                  <div>Dragon-Wolf #{index}</div>
                  <div>Qty: {balance}</div>
                </div>
                <p className="no-underline">
                  {index === 0
                    ? "A majestic Alpha male dragonwolf overlooking his pack as night approaches."
                    : index === 1
                    ? "A majestic and shy female dragonwolf looking curious and wary."
                    : index === 2
                    ? "A friendly female dragonwolf who looks soft and inviting. Pay close attention to the wings."
                    : index === 3
                    ? "A dangerous and powerful Alpha female, matriarch of her pack. Claws that could rival those of Smaug."
                    : index === 4
                    ? "A beautiful female with a crown-like set of horns. The red snout is particularly interesting."
                    : index === 5
                    ? "A dangerous and aggressive protector of his pack. Truly an apex predator."
                    : "The rare, beautiful and hypnotizing White Wolfdragon. The author's personal favorite."}
                </p>
                <div className="flex nft-actions justify-between">
                  {index < 3 ? (
                    <>
                      <button onClick={handleClick} data-tokenid={index} data-value="mint" className="btn btn-success">
                        Mint
                      </button>
                      <button onClick={handleClick} data-tokenid={index} data-value="trade" className="btn btn-neutral">
                        Trade
                      </button>
                      <button onClick={handleClick} data-tokenid={index} data-value="burn" className="btn btn-error">
                        Burn
                      </button>
                    </>
                  ) : (
                    <>
                      <button onClick={handleClick} data-tokenid={index} data-value="forge" className="btn btn-warning">
                        Forge
                      </button>
                      <button onClick={handleClick} data-tokenid={index} data-value="burn" className="btn btn-error">
                        Burn
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

const handleClick = (event: { currentTarget: { getAttribute: (arg0: string) => any } }) => {
  const tokenAction = event.currentTarget.getAttribute("data-value");
  const tokenId = event.currentTarget.getAttribute("data-tokenid");
  switch (tokenAction) {
    case "mint":
      //call minting code
      break;
    case "trade":
      break;
    case "forge":
      break;
    default: //burninating
      console.log("TROGDOR STRIKES AGAIN!!!");
      break;
  }

  // debugger;
  // main();
};
async function getContractData() {}
// async function readContractData() {
//   // Placeholder for contract data fetching logic
// }
export const main = async () => {
  // try {
  //   const nftURI = await contract.tokenURI(6);
  //   console.log("TokenURI:", nftURI);
  // } catch (error) {
  //   console.error("Error fetching contract data:", error);
  // }

  // debugger;
  try {
    const balance2 = await contract.balanceOf("0x52491413aFCff113bbFE8d4814124FBEc1486D27", 0);
    // console.log(`Balance Returned: ${balance2}`);
    // alert(`Balance2 Returned: ${balance2}`);
    return balance2;
  } catch (error) {
    console.error("Error fetching contract data:", error);
  }
};
