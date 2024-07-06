"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { InheritanceTooltip } from "./InheritanceTooltip";
import { Abi, AbiFunction } from "abitype";
import { Address } from "viem";
import { useReadContract } from "wagmi";
import {
  ContractInput,
  displayTxResult,
  getFunctionInputKey,
  getInitialFormState,
  getParsedContractFunctionArgs,
  transformAbiFunction,
} from "~~/app/debug/_components/contract";
import { useTargetNetwork } from "~~/hooks/scaffold-eth/useTargetNetwork";
import { getParsedError, notification } from "~~/utils/scaffold-eth";

type ReadOnlyFunctionFormProps = {
  contractAddress: Address;
  abiFunction: AbiFunction;
  inheritedFrom?: string;
  abi: Abi;
};

export const ReadOnlyFunctionForm = ({
  contractAddress,
  abiFunction,
  inheritedFrom,
  abi,
}: ReadOnlyFunctionFormProps) => {
  const [form, setForm] = useState<Record<string, any>>(() => getInitialFormState(abiFunction));
  const [result, setResult] = useState<unknown>();
  const { targetNetwork } = useTargetNetwork();
  const [isBrave, setIsBrave] = useState<boolean>(false);

  const { isFetching, refetch, error } = useReadContract({
    address: contractAddress,
    functionName: abiFunction.name,
    abi: abi,
    args: getParsedContractFunctionArgs(form),
    chainId: targetNetwork.id,
    query: {
      enabled: false,
      retry: false,
    },
  });

  useEffect(() => {
    if (error) {
      const parsedError = getParsedError(error);
      notification.error(parsedError);
    }
  }, [error]);

  const transformedFunction = transformAbiFunction(abiFunction);
  const inputElements = transformedFunction.inputs.map((input, inputIndex) => {
    const key = getFunctionInputKey(abiFunction.name, input, inputIndex);
    return (
      <ContractInput
        key={key}
        setForm={updatedFormValue => {
          setResult(undefined);
          setForm(updatedFormValue);
        }}
        form={form}
        stateObjectKey={key}
        paramType={input}
      />
    );
  });

  const convertIpfsUrl = (url: string): string => {
    return url.replace("ipfs://", "https://ipfs.io/ipfs/");
  };

  const isBraveBrowser = async (): Promise<boolean> => {
    const isBrave = (navigator as any).brave && (await (navigator as any).brave.isBrave());
    return isBrave;
  };

  //todo: change this to fetch the image hash from somewhere instead of using a magic string
  const imgHash = "bafybeichdpu3ded2ccgfznlki6djbtjcly47ho5ftyhi4doimbdfxnp4xe";

  useEffect(() => {
    const checkBraveBrowser = async () => {
      const brave = await isBraveBrowser();
      setIsBrave(brave);
    };
    checkBraveBrowser();
  }, []);

  // const txResult = displayTxResult(result).toString();
  // const convertedUrl = convertIpfsUrl(txResult);
  // const txUrl = new URL(txResult);
  // const convertedTxUrl = new URL(convertedUrl);

  return (
    <div className="flex flex-col gap-3 py-5 first:pt-0 last:pb-1">
      <p className="font-medium my-0 break-words">
        {abiFunction.name}
        <InheritanceTooltip inheritedFrom={inheritedFrom} />
      </p>
      {inputElements}
      <div className="flex justify-between gap-2 flex-wrap">
        <div className="flex-grow w-4/5">
          {result !== null && result !== undefined && (
            <div className="bg-secondary rounded-3xl text-sm px-4 py-1.5 break-words">
              <p className="font-bold m-0 mb-1">Result:</p>
              <pre className="whitespace-pre-wrap break-words">
                {/* TODO: move these links into a separate component and add logic to show the results as 'metadata' and 'img URL' using imgHash above */}
                {isBrave ? (
                  <Link
                    className="link link-neutral"
                    // href={txUrl.href}
                    href={displayTxResult(result).toString()}
                    passHref
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {displayTxResult(result).toString()}
                    {/* {txUrl.href} */}
                  </Link>
                ) : (
                  <Link
                    className="link link-neutral"
                    href={convertIpfsUrl(displayTxResult(result).toString())}
                    // href={convertedTxUrl.href}
                    passHref
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {convertIpfsUrl(displayTxResult(result).toString())}
                    {/* {convertedTxUrl.href} */}
                  </Link>
                )}
              </pre>
            </div>
          )}
        </div>
        <button
          className="btn btn-secondary btn-sm"
          onClick={async () => {
            const { data } = await refetch();
            setResult(data);
          }}
          disabled={isFetching}
        >
          {isFetching && <span className="loading loading-spinner loading-xs"></span>}
          Read 📡
        </button>
      </div>
    </div>
  );
};
