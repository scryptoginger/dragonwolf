import { wagmiConnectors } from "./wagmiConnectors";
import { Chain, createClient, http } from "viem";
import { hardhat, mainnet } from "viem/chains";
import { createConfig } from "wagmi";
import scaffoldConfig from "~~/scaffold.config";
import { getAlchemyHttpUrl } from "~~/utils/scaffold-eth";

const { targetNetworks } = scaffoldConfig;

// We always want to have mainnet enabled (ENS resolution, ETH price, etc). But only once.
export const enabledChains = targetNetworks.find((network: Chain) => network.id === 1)
  ? targetNetworks
  : ([...targetNetworks, mainnet] as const);

export const wagmiConfig = createConfig({
  chains: enabledChains,
  connectors: wagmiConnectors,
  ssr: true,
  client({ chain }) {
    return createClient({
      chain,
      transport: http(getAlchemyHttpUrl(chain.id)),
      ...(chain.id !== (hardhat as Chain).id
        ? {
            pollingInterval: scaffoldConfig.pollingInterval,
          }
        : {}),
    });
  },
});

// "use client";

// import React, { ReactNode } from "react";
// import { wagmiConnectors } from "./wagmiConnectors";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { createWeb3Modal, defaultWagmiConfig } from "@web3modal/wagmi";
// import { Chain, createClient, http } from "viem";
// import { hardhat, mainnet, polygonAmoy } from "viem/chains";
// import { cookieStorage, createStorage } from "wagmi";
// import { createConfig } from "wagmi";
// import { State, WagmiProvider } from "wagmi";
// import scaffoldConfig from "~~/scaffold.config";
// import { getAlchemyHttpUrl } from "~~/utils/scaffold-eth";

// const queryClient = new QueryClient();
// const { targetNetworks } = scaffoldConfig;
// // Your WalletConnect Cloud project ID
// export const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID;
// if (!projectId) throw new Error("Missing WalletConnect project ID");

// // We always want to have mainnet enabled (ENS resolution, ETH price, etc). But only once.
// export const enabledChains = targetNetworks.find((network: Chain) => network.id === 1)
//   ? targetNetworks
//   : ([...targetNetworks, mainnet] as const);

// export const wagmiConfig = defaultWagmiConfig({
//   chains: enabledChains,
//   connectors: wagmiConnectors,
//   ssr: true,
//   client({ chain }) {
//     return createClient({
//       chain,
//       transport: http(getAlchemyHttpUrl(chain.id)),
//       ...(chain.id !== (hardhat as Chain).id
//         ? {
//             pollingInterval: scaffoldConfig.pollingInterval,
//           }
//         : {}),
//     });
//   },
// });

// /**
//  *  this here, instead of config/index.tsx, from the walletconnect.com documentation.
//  *  https://docs.walletconnect.com/appkit/next/core/installation#wagmi-config
//  *
//  *  This file is already here and in case there are other connectors for this file, I don't want to break those.
//  *  Also, if any future documentation says I need to add the above-mentioned file, I can refer to this file instead.
//  */

// // Create a metadata object
// const metadata = {
//   name: "DragonWolf",
//   description: "(empty description string)",
//   url: "", // origin must match your domain & subdomain
//   icons: ["https://avatars.githubusercontent.com/u/37784886"],
// };

// // Create wagmiConfig
// const chains: Chain[] = [
//   { ...polygonAmoy, network: "polygon" },
//   { ...mainnet, network: "mainnet" },
// ];

// // export const wagmiConfig2 = defaultWagmiConfig({
// //   chains,
// //   projectId,
// //   metadata,
// //   ssr: true,
// //   storage: createStorage({ storage: cookieStorage }),
// // });

// // Create modal
// createWeb3Modal({
//   wagmiConfig: wagmiConfig,
//   projectId,
//   chains,
//   enableAnalytics: true, // Optional - defaults to your Cloud configuration
// });

// // export function Web3Modal({ children }) {
// //   return <WagmiConfig config={wagmiConfig}>{children}</WagmiConfig>;
// // }
// export default function Web3ModalProvider({ children, initialState }: { children: ReactNode; initialState?: State }) {
//   return (
//     <WagmiProvider config={config} initialState={initialState}>
//       <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
//     </WagmiProvider>
//   );
// }
