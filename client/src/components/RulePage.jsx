import React, { useState } from "react";

function RulePage({ gameName }) {
  const [showRule, setShowRule] = useState(gameName);
  return (
    <>
      {showRule === "easyParity" && (
        <div className="p-4 text-justify leading-3">
          <h1 className="text-2xl text-center font-bold mb-4">
            Color Prediction Game Rules
          </h1>

          <div className="">
            <h2 className="text-xl font-semibold mb-2">Color Assignments:</h2>
            <div className="p-4">
              <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                <li className="bg-green-200 p-2 rounded">
                  <span className="text-green-500 font-semibold">Green:</span>{" "}
                  Numbers 1, 3, 7, 9
                </li>
                <li className="bg-red-200 p-2 rounded">
                  <span className="text-red-500 font-semibold">Red:</span>{" "}
                  Numbers 2, 4, 6, 8
                </li>
                <li className="bg-violet-200 p-2 rounded">
                  <span className="text-violet-500 font-semibold">Violet:</span>{" "}
                  Numbers 0, 5
                </li>
              </ul>
            </div>
          </div>

          <div>
            <h2 className="text-xl text-center font-semibold mb-2">
              Hint Mechanism:
            </h2>
            <div className="p-4">
              <p>
                To receive a hint for the next color, the user must place a
                specific bet amount, which can be either 100, 200, 1000, or
                5000. The unit digit of the answer to the mathematical
                expression they provide will determine the next color.
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-xl text-center font-semibold mt-4 mb-2">
              Example Gameplay:
            </h2>
            <div className="p-4">
              <ol className="list-decimal pl-4">
                <li className="p-2">
                  If the user enters an expression like{" "}
                  <span className="bg-yellow-200 p-1 rounded">
                    8 + 2 - 1 - 2
                  </span>
                  , the answer is{" "}
                  <span className="bg-blue-200 p-1 rounded">7</span>. Since the
                  unit digit is 1, the next color is{" "}
                  <span className="text-green-500 font-semibold">GREEN</span>.
                </li>
                <li className="p-2">
                  If the user enters an expression like{" "}
                  <span className="bg-yellow-200 p-1 rounded">
                    4 - 1 + 7 - 6
                  </span>
                  , the answer is{" "}
                  <span className="bg-blue-200 p-1 rounded">4</span>. Since the
                  unit digit is 4, the next color is{" "}
                  <span className="text-red-500 font-semibold">RED</span>.
                </li>
                <li className="p-2">
                  If the user enters an expression like{" "}
                  <span className="bg-yellow-200 p-1 rounded">
                    9 + 2 + 1 * 0
                  </span>
                  , the answer is{" "}
                  <span className="bg-blue-200 p-1 rounded">0</span>. Since the
                  unit digit is 0, the next color is{" "}
                  <span className="text-violet-500 font-semibold">VIOLET</span>.
                </li>
              </ol>
            </div>
          </div>

          <div>
            <p className="mt-4">
              Remember to choose your bets and expressions wisely to predict the
              next color correctly!
            </p>
          </div>
        </div>
      )}
      {showRule === "fastParity" && (
        <div className="p-4 text-justify leading-3">
          <h1 className="text-2xl text-center font-bold mb-4">Game Rules</h1>

          <div className="p-2">
            <p className="text-lg mb-4">
              <span className="text-blue-500 font-semibold">30 seconds</span> 1
              issue,
              <span className="text-blue-500 font-semibold">
                {" "}
                20 seconds
              </span>{" "}
              to order,
              <span className="text-blue-500 font-semibold">
                {" "}
                10 seconds
              </span>{" "}
              to show the lottery result. It opens all day. The total number of
              trade is{" "}
              <span className="text-blue-500 font-semibold">2880 issues</span>.
            </p>
          </div>

          <ul className="list-disc pl-6 mb-4">
            <li className="mb-2 p-2">
              JOIN <span className="text-green-500 font-semibold">GREEN:</span>{" "}
              if the result shows 1, 3, 7, 9 you will get{" "}
              <span className="text-blue-500 font-semibold">
                (98*2) 196 rupees
              </span>
              . If the result shows{" "}
              <span className="text-blue-500 font-semibold">5</span>, you will
              get{" "}
              <span className="text-blue-500 font-semibold">
                (98*1.5) 147 rupees
              </span>
              .
            </li>
            <li className="mb-2 p-2">
              JOIN <span className="text-red-500 font-semibold">RED:</span> if
              the result shows 2, 4, 6, 8, you will get{" "}
              <span className="text-blue-500 font-semibold">
                (98*2) 196 rupees
              </span>
              . If the result shows{" "}
              <span className="text-blue-500 font-semibold">0</span>, you will
              get{" "}
              <span className="text-blue-500 font-semibold">
                (98*1.5) 147 rupees
              </span>
              .
            </li>
            <li className="mb-2 p-2">
              JOIN{" "}
              <span className="text-violet-500 font-semibold">VIOLET:</span> if
              the result shows 0 or 5, you will get{" "}
              <span className="text-blue-500 font-semibold">
                (98*4.5) 441 rupees
              </span>
              .
            </li>
          </ul>
        </div>
      )}
      {showRule === "spareParity" && (
        <div className="p-4 text-justify leading-3">
          <h1 className="text-2xl text-center font-bold mb-4">Game Rules</h1>

          <div className="p-2">
            <p className="text-lg mb-4">
              <span className="text-blue-500 font-semibold">180 seconds</span> 1
              issue,
              <span className="text-blue-500 font-semibold">
                {" "}
                150 seconds
              </span>{" "}
              to order,
              <span className="text-blue-500 font-semibold">
                {" "}
                30 seconds
              </span>{" "}
              to show the lottery result. It opens all day. The total number of
              trade is{" "}
              <span className="text-blue-500 font-semibold">2880 issues</span>.
            </p>
          </div>

          <ul className="list-disc pl-6 mb-4">
            <li className="mb-2 p-2">
              JOIN <span className="text-green-500 font-semibold">GREEN:</span>{" "}
              if the result shows 1, 3, 7, 9 you will get{" "}
              <span className="text-blue-500 font-semibold">
                (98*2) 196 rupees
              </span>
              . If the result shows{" "}
              <span className="text-blue-500 font-semibold">5</span>, you will
              get{" "}
              <span className="text-blue-500 font-semibold">
                (98*1.5) 147 rupees
              </span>
              .
            </li>
            <li className="mb-2 p-2">
              JOIN <span className="text-red-500 font-semibold">RED:</span> if
              the result shows 2, 4, 6, 8, you will get{" "}
              <span className="text-blue-500 font-semibold">
                (98*2) 196 rupees
              </span>
              . If the result shows{" "}
              <span className="text-blue-500 font-semibold">0</span>, you will
              get{" "}
              <span className="text-blue-500 font-semibold">
                (98*1.5) 147 rupees
              </span>
              .
            </li>
            <li className="mb-2 p-2">
              JOIN{" "}
              <span className="text-violet-500 font-semibold">VIOLET:</span> if
              the result shows 0 or 5, you will get{" "}
              <span className="text-blue-500 font-semibold">
                (98*4.5) 441 rupees
              </span>
              .
            </li>
          </ul>
        </div>
      )}
    </>
  );
}

export default RulePage;
