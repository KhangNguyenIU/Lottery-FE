import moment from 'moment';
import React, { useContext } from 'react';
import { LotteryStatus } from '../constant';
import { LotteryContext } from '../context/LotteryTransaction';
import { timeLeft } from '../utils';

/**
 * @author
 * @function Main
 **/

export const Main = ({ handleOpen }) => {
  const { getCurrentLottery, currentLottery } = useContext(LotteryContext);

  return (
    <div className="h-screen flex justify-center items-center text-white">
      <div className="flex flex-col justify-center items-center">
        <h1 className="text-5xl font-bold ">
          currentLottery #{' '}
          {currentLottery ? parseInt(currentLottery?.lotteryID?._hex) : ''}
        </h1>
        <h2 className="text-7xl font-bold text-yellow-600">
          Total prize{' '}
          {currentLottery
            ? parseInt(currentLottery?.prizePoolInCake?._hex) / 10 ** 18
            : ''}
        </h2>
        <h3 className="text-4xl text-gray-200">in przzing pool</h3>
        <h3 className="text-3xl  text-yellow-600">
          {timeLeft(parseInt(currentLottery?.closingTimestamp))} minutes until
          draw
        </h3>
        <h3 className="text-2xl  text-yellow-600">
          Status: {LotteryStatus[currentLottery?.lotteryStatus]}
        </h3>
        {currentLottery?.lotteryStatus === 3 ? (
          <div className="flex">
            {currentLottery?.winningNumbers.map((num, i) => (
              <span key={i} className="text-5xl text-purple-900 mr-5">
                {num}
              </span>
            ))}
          </div>
        ) : (
          <button
            onClick={handleOpen}
            className="px-4 py-3 bg-purple-400 mt-5 text-2xl font-bold rounded-md"
          >
            Buy Ticket
          </button>
        )}
        {/* <button
          onClick={getCurrentLottery}
          className="px-4 py-3 bg-purple-400 mt-5 text-2xl font-bold rounded-md"
        >
          Tests
        </button> */}
      </div>
    </div>
  );
};
