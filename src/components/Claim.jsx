import React from 'react';

/**
 * @author
 * @function Main
 **/

export const Claim = ({ lotteryId }) => {
  return (
    <div className="h-screen flex justify-center items-center text-white">
      <div className="flex flex-col justify-center items-center">
        <h3 className="text-4xl text-gray-200">
          Connect your wallet to check if you've won!
        </h3>
        <button className="px-4 py-3 bg-purple-400 mt-5 text-2xl font-bold rounded-md">
          Connect Wallet
        </button>
      </div>
    </div>
  );
};

