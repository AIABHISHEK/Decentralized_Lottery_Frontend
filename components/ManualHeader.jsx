import React, { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";

function ManualHeader() {
  const {
    enableWeb3,
    account,
    isWeb3Enabled,
    Moralis,
    deactivateWeb3,
    isWeb3EnableLoading,
  } = useMoralis();

  //programmactically enabling web3

  useEffect(() => {
    if (isWeb3Enabled) return;
    if (window.localStorage.getItem("connected")) {
      enableWeb3();
    }
    //enableWeb3();
  }, []);
  useEffect(() => {
    Moralis.onAccountChanged((account) => {
      console.log("account changed", account);
      if (account == null) {
        window.localStorage.removeItem("connected");
        deactivateWeb3();
      }
    });
  }, []);
  return (
    <header>
      {account ? (
        <div>{account}</div>
      ) : (
        <button
          onClick={
            isWeb3Enabled
              ? deactivateWeb3
              : () => {
                  enableWeb3();
                  window.localStorage.setItem("connected", "injected");
                }
          }
          disabled={isWeb3EnableLoading}
        >
          {isWeb3Enabled ? "Disable Web3" : "Enable Web3"}
        </button>
      )}
    </header>
  );
}
export default ManualHeader;
