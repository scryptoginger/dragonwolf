import React from "react";
import Image from "next/image";
import Link from "next/link";
import { hardhat } from "viem/chains";
import { CurrencyDollarIcon, HeartIcon } from "@heroicons/react/24/outline";
import { SwitchTheme } from "~~/components/SwitchTheme";
import { GitHubLogo } from "~~/components/assets/GitHubLogo";
import { HardhatLogo } from "~~/components/assets/HardhatLogo";
import { LinkedInLogo } from "~~/components/assets/LinkedInLogo";
import { ReactLogo } from "~~/components/assets/ReactLogo";
import { ScaffoldEthLogo } from "~~/components/assets/ScaffoldEthLogo";
import { SolidityLogo } from "~~/components/assets/SolidityLogo";
import { TelegramLogo } from "~~/components/assets/TelegramLogo";
import { useTargetNetwork } from "~~/hooks/scaffold-eth/useTargetNetwork";
import { useGlobalState } from "~~/services/store/store";

/**
 * Site footer
 */
export const Footer = () => {
  const nativeCurrencyPrice = useGlobalState(state => state.nativeCurrency.price);
  const { targetNetwork } = useTargetNetwork();
  const isLocalNetwork = targetNetwork.id === hardhat.id;

  return (
    <div className="min-h-0 py-5 px-1 mb-11 lg:mb-0">
      <div>
        <div className="fixed flex justify-between items-center w-full z-10 p-4 bottom-0 left-0 pointer-events-none">
          <div className="flex flex-col md:flex-row gap-2 pointer-events-auto">
            {nativeCurrencyPrice > 0 && (
              <div>
                <div className="btn btn-primary btn-sm font-normal gap-1 cursor-auto">
                  <CurrencyDollarIcon className="h-4 w-4" />
                  <span>{nativeCurrencyPrice.toFixed(2)}</span>
                  {/* <span>{nativeCurrencyPrice}</span> */}
                </div>
              </div>
            )}
            {isLocalNetwork && (
              <>
                {/* <Faucet />
                <Link href="/blockexplorer" passHref className="btn btn-primary btn-sm font-normal gap-1">
                  <MagnifyingGlassIcon className="h-4 w-4" />
                  <span>Block Explorer</span>
                </Link> */}
              </>
            )}
          </div>
          <SwitchTheme className={`pointer-events-auto ${isLocalNetwork ? "self-end md:self-auto" : ""}`} />
        </div>
      </div>
      <div className="w-full">
        <ul className="menu menu-horizontal w-full">
          <div className="flex justify-center items-center gap-2 text-sm w-full">
            <div className="text-center">
              <a href="https://github.com/scryptoginger/dragonwolf" target="_blank" rel="noreferrer" className="link">
                <GitHubLogo className="w-4 h-6" />
              </a>
            </div>
            <span> · </span>
            <div className="text-center">
              <a href="#" target="_blank" rel="noreferrer" className="link">
                Visit on OpenSea
              </a>
            </div>

            {/* LOGO SECTION */}
            <span> · </span>
            <div className="flex justify-center items-center gap-2">
              <p className="m-0 text-center">
                Built with <HeartIcon className="inline-block h-4 w-4" /> using
              </p>
              <a
                className="flex justify-center items-center gap-1"
                href="https://scaffoldeth.io/"
                target="_blank"
                rel="noreferrer"
              >
                <ScaffoldEthLogo className="w-4 h-6" />
              </a>
              <ReactLogo className="w-4 h-6" />
              <HardhatLogo className="w-4 h-6" />
              <SolidityLogo className="w-4 h-6" />
            </div>

            {/* CONTACT ME */}
            <span> · </span>
            <div className="flex justify-center items-center gap-2">
              <p className="m-0 text-center">Contact Me:</p>
              <a
                className="flex justify-center items-center gap-1"
                href="https://t.me/thecryptoginger"
                target="_blank"
                rel="noreferrer"
              >
                <TelegramLogo className="w-4 h-6" />
              </a>
              <a
                className="flex justify-center items-center gap-1"
                href="https://www.linkedin.com/in/keithlutes/"
                target="_blank"
                rel="noreferrer"
              >
                <LinkedInLogo className="w-4 h-6" />
              </a>
            </div>
          </div>
        </ul>
      </div>
    </div>
  );
};
// shout out to TROGDOR the BURNINATOR. https://en.wikifur.com/w/images/thumb/d/d3/Trogdor_Original_Design.png/708px-Trogdor_Original_Design.png
