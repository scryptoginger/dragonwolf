"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import contractABI from "../utils/contract_ABI.json";
import forgeContractABI from "../utils/forge_contract_ABI.json";
import { ethers } from "ethers";
import { useAccount, useWriteContract } from "wagmi";
import { Address } from "~~/components/scaffold-eth";
// import { AddressProps } from "~~/components/scaffold-eth/Address";
import { useTransactor } from "~~/hooks/scaffold-eth";

// import { writeContract } from "@wagmi/core";

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
const dwContract = new ethers.Contract(DW_CONTRACT_ADDRESS, contractABI, wallet);
const forgeContract = new ethers.Contract(FORGE_CONTRACT_ADDRESS, forgeContractABI, wallet);
const contractSigner = forgeContract.connect(wallet);
const forgingRequirements: { [key: number]: number[] } = {
  3: [0, 1], // To forge token 3, burn one each of tokens 0 and 1
  4: [1, 2], // To forge token 4, burn one each of tokens 1 and 2
  5: [0, 2], // To forge token 5, burn one each of tokens 0 and 2
  6: [0, 1, 2], // To forge token 6, burn one each of tokens 0, 1, and 2
};

export function NFT_Cards() {
  const [balances, setBalances] = useState<number[]>([]);
  const { address: connectedAddress } = useAccount();
  // const [selectedTokenId, setSelectedTokenId] = useState<number | null>(0);

  const fetchBalances = useCallback(async () => {
    if (!connectedAddress) return;

    try {
      const tokenIds = [0, 1, 2, 3, 4, 5, 6];
      const balancePromises = tokenIds.map(tokenId => forgeContract.balanceOf(connectedAddress, tokenId));
      const fetchedBalances = await Promise.all(balancePromises);
      setBalances(fetchedBalances.map((b: bigint) => Number(b)));
    } catch (error: any) {
      console.error("Error fetching contract data:", error.message);
    }
  }, [connectedAddress]);

  useEffect(() => {
    fetchBalances();
  }, [connectedAddress, fetchBalances]);

  const checkApproval = async () => {
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

  const { writeContractAsync } = useWriteContract();
  const writeTx = useTransactor();

  /* HANDLE MINTING */
  const handleMint = async (tokenId: number, mintQty: number) => {
    const writeContractAsyncWithParams = () =>
      writeContractAsync({
        address: FORGE_CONTRACT_ADDRESS,
        abi: contractABI,
        functionName: "mint",
        args: [connectedAddress, tokenId, mintQty],
        maxFeePerBlobGas: BigInt(0),
        blobs: [],
      });

    try {
      // from wagmi
      await writeTx(writeContractAsyncWithParams);
      await fetchBalances();
      console.log(`Minted token ${tokenId}: ${writeTx}`);
      alert("Token minted successfully.");
    } catch (error: any) {
      console.error("Error minting token:", error.message);
      alert("Token minting failed. Please try again. " + error.message);
    }
  };

  /* HANDLE TRADING */
  const handleTrade = async (tokenIds: number[], receive_tokenId: number[], tradeQty: number[]) => {
    try {
      await forgeContract.trade(tokenIds, receive_tokenId, tradeQty);
      await fetchBalances();
      console.log("Tokens traded successfully.");
      alert("Tokens traded successfully.");
    } catch (error: any) {
      console.error("Error trading tokens:", error.message);
      alert("Token trading failed. Please try again. " + error.message);
    }
  };

  /* HANDLE FORGING */
  const checkAndForgeToken = async (burnIds: number[], tokenToForgeId: number, burnAmount: number) => {
    try {
      if (
        // TODO: review these items -- do I need to verify all of them?
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

      const balances = await Promise.all(burnIds.map(id => forgeContract.balanceOf(connectedAddress, id)));
      const hasSufficientTokens = balances.every((balance: bigint) => balance >= BigInt(burnAmount));

      if (!hasSufficientTokens) {
        console.error("Insufficient tokens to forge.");
        alert(
          "Insufficient tokens to forge. Please review the forging guide and make sure your account has the correct tokens (0-2) for forging and try again.",
        ); //TODO: add a thing to show the user which tokens (0-2) they need to forge the chosen/clicked forgeable token
        return;
      } //end of if statement

      if (
        !confirm(
          `To forge token ${tokenToForgeId} you will burn ${burnAmount} of tokens ${burnIds.join(
            " & ",
          )}. Are you sure you want to proceed?`,
        )
      ) {
        return;
      }

      await checkApproval();
      const forgeTx = await forgeContract.forge(burnIds, burnAmount, tokenToForgeId);
      await forgeTx.wait();
      await fetchBalances();
      console.log("Token forged successfully.");
      alert("Token forged successfully.");
    } catch (error: any) {
      if (error.response && error.response.status === 400) {
        console.warn("Received a 400 error, but the operation might still be successful.");
        alert("Token forged successfully, but received a warning: " + error.message);
      } else {
        console.error("Error forging token:", error.message);
        alert("Token forging failed. Please try again. " + error.message);
      }
    }
  };

  const handleClick = async event => {
    const tokenAction = event.currentTarget.getAttribute("data-value");
    const tokenId = parseInt(event.currentTarget.getAttribute("data-tokenid"));

    switch (tokenAction) {
      case "mint": // MINTING
        if (tokenId >= 3) return alert("You cannot mint this token - it must be forged."); //this code should never run because the UI will never allow minting of tokens 3-6

        const mintQty = prompt("Enter the quantity of tokens to mint:");
        if (mintQty) {
          await handleMint(tokenId, parseInt(mintQty));
        }
        break;

      case "trade": // TRADING
        const getTokenIdInput: string =
          prompt(
            "Enter the ID of the token you want to receive (0-2):\n(note that this will default to Dragon-Wolf #0 if left blank)",
          ) || "0";
        debugger;
        const tradeQtyInput = prompt("Enter the quantity of tokens to trade (both to give and receive):");

        if (getTokenIdInput && tradeQtyInput) {
          const give_tokenId = [tokenId];
          const receive_tokenId = [parseInt(getTokenIdInput)];
          const tradeQty = [Number(tradeQtyInput)];
          try {
            await handleTrade(give_tokenId, receive_tokenId, tradeQty);
          } catch (error: any) {
            console.error("Error trading tokens:", error.message);
            alert("Token trading failed. Please try again. " + error.message);
          }
        }
        break;

      case "forge": // FORGING
        alert(
          `To FORGE token ${tokenId} you must burn tokens ${forgingRequirements[tokenId].join(
            " & ",
          )}. Click OK to proceed.`,
        );

        const forgeQty = prompt("Enter the quantity of tokens to forge / burn:");
        if (forgeQty) {
          await checkAndForgeToken(forgingRequirements[tokenId], tokenId, parseInt(forgeQty));
        }
        break;

      default: // BURNINATING
        const burnQty = prompt(
          "How many tokens do you want to burn? Please note that manually burning tokens has no benefit and you will not receive anything in return.",
        );
        if (burnQty) {
          try {
            await forgeContract.burn(burnQty);
            await fetchBalances();
            alert(`Successfully burned ${burnQty} of Dragon-Wolf #${tokenId}.`);
            console.log("🔥 🔥 🔥 🔥  TROGDOR STRIKES AGAIN!!!  🔥 🔥 🔥 🔥");
          } catch (error: any) {
            console.error("Error burning tokens:", error.message);
            alert("Token burning failed. Please try again. " + error.message);
          }
        }
        break;
    }
  };

  //check whether an address is connected and display message to User
  if (!connectedAddress) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-center text-lg font-bold">
          Please connect your wallet to view and interact with the Dragon-Wolf Collection.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5">
          <h1 className="text-center">
            <span className="block text-4xl font-bold">DragonWolf Collection</span>
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
