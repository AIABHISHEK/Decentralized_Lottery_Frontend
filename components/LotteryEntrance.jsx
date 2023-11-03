import { useEffect, useState } from "react";
import { useWeb3Contract, useMoralis } from "react-moralis";
import { ethers } from "ethers";
import { Loading, useNotification } from "web3uikit";
import ABI from "../constants/abi.json";
import CONTRACT_ADDRESS from "../constants/contractAddress.json";

export default function LotteryEntrance() {
  const { chainId: chainIdHex, isWeb3Enabled } = useMoralis();
  console.log(chainIdHex);
  const chainId = parseInt(chainIdHex);
  console.log(chainId);
  const contractAddress =
    chainId in CONTRACT_ADDRESS ? CONTRACT_ADDRESS[chainId][0] : null;
  // console.log(CONTRACT_ADDRESS);
  const [entranceFee, setEntranceFee] = useState("0");
  const [numberOfPlayers, setNumberOfPlayers] = useState("0");
  const [recentWinner, setRecentWinner] = useState("0");
  const dispatchNotification = useNotification();
  const {
    runContractFunction: enterLottery,
    isLoading,
    isFetching,
  } = useWeb3Contract({
    abi: ABI,
    contractAddress: contractAddress,
    functionName: "enterLottery",
    params: {},
    msgValue: entranceFee,
  });

  const { runContractFunction: getNumberOfPlayers } = useWeb3Contract({
    abi: ABI,
    contractAddress: contractAddress,
    functionName: "getNumberOfPlayers",
    params: {},
  });
  const { runContractFunction: getRecentWinner } = useWeb3Contract({
    abi: ABI,
    contractAddress: contractAddress,
    functionName: "getrecentWinner",
    params: {},
  });
  const { runContractFunction: getLotteryEntranceFee } = useWeb3Contract();
  const options = {
    abi: ABI,
    contractAddress: contractAddress,
    functionName: "getLotteryEntranceFee",
    params: {},
  };

  async function updateUI() {
    try {
      const entranceFeeCall = await getLotteryEntranceFee({
        params: options,
      });
      const recentWinnerCall = await getRecentWinner();
      const playerCall = await getNumberOfPlayers();
      console.log(recentWinnerCall);
      console.log(playerCall);
      setRecentWinner(recentWinnerCall);
      setNumberOfPlayers(playerCall.toString());
      setEntranceFee(entranceFeeCall);
      // console.log(error);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    if (isWeb3Enabled) {
      updateUI();
    }
  }, [isWeb3Enabled]);

  const handleSuccess = async (tx) => {
    await tx.wait(); // this wait for transation response
    handleNotification(tx);
    updateUI();
  };


  const handleNotification = function () {
    dispatchNotification({
      type: "success",
      message: "Transaction Complete",
      title: "Tx notifcation",
      position: "topR",
      icon: "bell",
    });
  };


  return (
    <div className="p-5">
      {contractAddress ? (
        <div className="">
          <button
            className="bg-green-300 hover:bg-green-500 p-2"
            onClick={async function () {
              await enterLottery({
                onSuccess: handleSuccess, //this checks transation is sent successfully or not
                onError: (error) => {
                  console.log(error);
                },
              });
            }}
          >
            {isLoading || isFetching ? <Loading /> : <div>Enter Lottery</div>}
          </button>
          <h1 key="ii">
            Lottery Entrance {ethers.utils.formatEther(entranceFee, "ether")}{" "}
            ETH
          </h1>{" "}
          <p key="oi">Enter the lottery by sending 0.1 ETH to this address:</p>
          <div>
          <p className="bg-blue-300">Recent Winner :{recentWinner}</p>
          <p>Number of Player: {numberOfPlayers}</p>
          </div>
          
        </div>
      ) : (
        <div>Select Valid Address</div>
      )}
    </div>
  );
}

// {"5":["0x4975b7D9D668604AEb98Da65e4BfCe0BcAD20527"]}
