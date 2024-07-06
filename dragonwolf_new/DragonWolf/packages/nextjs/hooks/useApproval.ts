// import { sign } from "crypto";
// import { useAccount, useSigner } from "wagmi";

// export default function useApproval(dwContract) {
//   const { address: connectedAddress } = useAccount();
//   const { data: signer } = useSigner();

//   const checkApproval = async () => {
//     if (!signer || !connectedAddress) return;
//     const isApproved = await dwContract.isApprovedForAll(
//       connectedAddress,
//       process.env.NEXT_PUBLIC_FORGE_CONTRACT_ADDRESS,
//     );
//     console.log({ isApproved });
//     if (!isApproved) {
//       const approvalTx = await dwContract.setApprovalForAll(process.env.NEXT_PUBLIC_FORGE_CONTRACT_ADDRESS, true);
//       await approvalTx.wait();
//       console.log("Approval set for all tokens.");
//       alert("Approval set for all tokens - you can now forge NFTs 3 - 6.");
//     }
//   };

//   return { checkApproval };
// }
