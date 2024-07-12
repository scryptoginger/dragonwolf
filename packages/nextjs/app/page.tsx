"use client";

import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { ConnectedAddressBalance } from "~~/components/ConnectedAddressBalance";
import { NFT_Cards } from "~~/components/NFT_Cards";
import { Address } from "~~/components/scaffold-eth";

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();

  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10">
        {/* <div className="px-5">
          <div className="flex justify-center items-center space-x-2">
            <p className="my-2 font-medium">Connected Address:</p>
            <Address address={connectedAddress} />
          </div>
        </div> */}

        {/* <ConnectedAddressBalance /> */}
        <NFT_Cards />
      </div>
    </>
  );
};

export default Home;
