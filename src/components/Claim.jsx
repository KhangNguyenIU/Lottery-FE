import React, { useContext } from 'react';
import { LotteryContext } from '../context/LotteryTransaction';

/**
 * @author
 * @function Main
 **/

export const Claim = ({ lotteryId }) => {
  const {
    checkIfWalletIsConnected,
    connectWallet,
    currentAccount,
    batchClaimTickets,
    currentLottery,
    changeNotification
  } = useContext(LotteryContext);

  const claim =  async() => {
    try {
      if (currentLottery?.lotteryID && currentAccount) {
        const prize = await batchClaimTickets(
          parseInt(currentLottery?.lotteryID?._hex), currentAccount
        );
        changeNotification(`You win ${prize}`, "success")
      }
    } catch (error) {}
  };

  return (
    <div className="h-screen flex justify-center items-center text-white">
      <div className="flex flex-col justify-center items-center">
        <h3 className="text-4xl text-gray-200">
          Connect your wallet to check if you've won!
        </h3>
        {currentAccount ? (
          <button
          onClick={claim} 
          className="px-4 py-3 bg-purple-400 mt-5 text-2xl font-bold rounded-md">
            Claim
          </button>
        ) : (
          <button
            onClick={connectWallet}
            className="px-4 py-3 bg-purple-400 mt-5 text-2xl font-bold rounded-md"
          >
            Connect Wallet
          </button>
        )}
        {/* <button
          onClick={claim}
        >
          TEST
        </button> */}
      </div>
    </div>
  );
};
