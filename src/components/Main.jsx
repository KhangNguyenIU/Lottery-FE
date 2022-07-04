import React from 'react';

/**
 * @author
 * @function Main
 **/

export const Main = ({ lotteryId, handleOpen }) => {
  return (
    <div className="h-screen flex justify-center items-center text-white">
      <div className="flex flex-col justify-center items-center">
        <h1 className="text-5xl font-bold ">
          Lottery # {lotteryId ? lotteryId : ''}
        </h1>
        <h2 className="text-7xl font-bold text-yellow-600">$ 47.000</h2>
        <h3 className='text-4xl text-gray-200'>in przzing pool</h3>
        <h3 className='text-3xl  text-yellow-600'>10h 36m until draw</h3>

        <button
        onClick={handleOpen}
        className='px-4 py-3 bg-purple-400 mt-5 text-2xl font-bold rounded-md'>Buy Ticket</button>
      </div>
    </div>
  );
};
