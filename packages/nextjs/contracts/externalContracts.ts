import contractABI from "../utils/contract_ABI.json";
import forge_contractABI from "../utils/forge_contract_ABI.json";
import { Abi } from "abitype";
import { GenericContractsDeclaration } from "~~/utils/scaffold-eth/contract";

const externalContracts = {
  80002: {
    DragonWolf: {
      address: "0x09443e82fca088e0D40eccA2F0c0BFA7c8725B8d",
      abi: contractABI as Abi,
    },
    DragonWolf_Forge: {
      address: "0xc14319f323f8f34d289c6aa2cbdf8600a556e580",
      abi: forge_contractABI as Abi,
    },
  },
} as const;

export default externalContracts satisfies GenericContractsDeclaration;
