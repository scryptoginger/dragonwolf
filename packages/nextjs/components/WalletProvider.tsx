import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { walletActions } from 'viem';
import { useAccount } from 'wagmi';

interface WalletContextProps {
  address: string;
  setAddress: (address: string) => void;
}

// const WalletContext = createContext(null);
const WalletContext = createContext<WalletContextProps | undefined>(undefined);

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const [address, setAddress] = useState<string | null>(null);
// const { address } = useAccount();
// const [walletAddress, setAddress] = useState<string | null>(null);

// useEffect(() => setAddress(address), [address]);

  return (
    <WalletContext.Provider value={{ address, setAddress }}>
      {children}
    </WalletContext.Provider>
  );
};

// export const useWallet = () => {
//   const context = useContext(WalletContext);
//   if (!context) {
//     throw new Error('useWallet must be used within a WalletProvider');
//   }
//   return context;
// };
