"use client";

import type { NextPage } from "next";
import { NFT_Cards } from "~~/components/NFT_Cards";

const Home: NextPage = () => {
  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10">
        <NFT_Cards />
      </div>
    </>
  );
};

export default Home;
