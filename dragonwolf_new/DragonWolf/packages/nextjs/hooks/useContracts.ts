// import { useReadContract, useWriteContract, usePrepareTransactionRequest } from "wagmi";
// import { contractABI } from "~~/utils/contract_ABI.json";
// import { forgeContractABI } from "~~/utils/forge_contract_ABI.json";

// export default function useContracts() {
//   const { data: dwReadContract } = useReadContract({
//     address: process.env.NEXT_PUBLIC_DW_CONTRACT_ADDRESS as `0x${string}` | undefined,
//     abi: contractABI,
//     functionName: "balanceOf",
//   });

//   const { config: forgeConfig } = usePrepareTransactionRequest({
//     address: process.env.NEXT_PUBLIC_FORGE_CONTRACT_ADDRESS,
//     abi: forgeContractABI,
//     functionName: "forge",
//   });

//   const { write: forgeWrite } = useWriteContract(forgeConfig);

//   return { dwReadContract, forgeWrite };
// }
