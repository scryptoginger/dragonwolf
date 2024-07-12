// import { forgingRequirements } from "./forgingRequirements";
// import { checkApproval } from "../hooks/useApproval";
// import { BigNumber } from "ethers";

// export const checkAndForgeToken = async (
//   DW_contractAddress,
//   forge_contractAddress,
//   connectedAddress,
//   signer,
//   tokenToForgeId,
//   burnAmount,
// ) => {
//   const burnIds = forgingRequirements[tokenToForgeId];

//   try {
//     if (
//       !signer ||
//       !connectedAddress ||
//       !forge_contractAddress ||
//       burnIds.length === 0 ||
//       !tokenToForgeId ||
//       !burnAmount
//     ) {
//       console.error("Missing required parameters for forging.");
//       return;
//     }

//     const balances = await Promise.all(burnIds.map(id => DW_contractAddress.balanceOf(connectedAddress, id)));
//     const hasSufficientBalance = balances.every((balance: BigNumber) => balance.gte(burnAmount));

//     if (!hasSufficientBalance) {
//       console.error("Insufficient balance to forge token.");
//       alert("Insufficient balance to forge token.");
//       return;
//     }

//     if (
//       !confirm(
//         `To forge token ${tokenToForgeId} you will burn ${burnAmount} of tokens ${burnIds.join(
//           ", ",
//         )}. Are you sure you want to proceed?`,
//       )
//     ) {
//       return;
//     }

//     await checkApproval(DW_contractAddress, connectedAddress, forge_contractAddress);
//     const forgeTx = await forge_contractAddress.forge(burnIds, burnAmount, tokenToForgeId);
//     await forgeTx.wait();
//     console.log(`Token ${tokenToForgeId} forged.`);
//     alert(`Token ${tokenToForgeId} forged.`);
//   } catch (error: any) {
//     console.error("Error forging token:", error);
//     alert("Error forging token. " + error.message);
//   }
// };
