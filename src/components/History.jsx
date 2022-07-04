import React from 'react';

/**
 * @author
 * @function Main
 **/

export const History = ({ lotteryId }) => {
  return (
    <div className="h-screen flex justify-center items-center text-white w-full">
      <div className="flex flex-col justify-center items-center w-full">
        <h3 className="text-4xl text-gray-200">TIcket history</h3>
        <div className="flex flex-col w-1/3 h-28 mt-5">
          <div className="flex">
            <div className="basis-1/2">Numbers</div>
            <div className="basis-1/2 flex justify-end">Lottery Id</div>
          </div>

          <div className="flex mt-5">
            <div className="basis-1/2 flex">
                {
                    [1,2,3,4,5].map((num, index)=>(
                        <div key={index} className="text-2xl text-purple-900 mr-4">
                            {num}
                        </div>
                    ))
                }
            </div>
            <div className="basis-1/2 flex justify-end"><p className='text-2xl text-purple-900 mr-4'> 1</p></div>
          </div>
        </div>
      </div>
    </div>
  );
};
