import React, { useCallback, useState, useRef } from "react";
import produce from "immer";
import "./App.css";

const numRows = 40;
const numCols = 40;

const neighborCoordinates = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1]
];

const generateEmptyGrid = () =>
  Array.from(Array(numRows), () => Array.from(Array(numCols), () => 0));

const generateRandomGrid = () =>
  Array.from(Array(numRows), () =>
    Array.from(Array(numCols), () => (Math.random() > 0.75 ? 1 : 0))
  );

const App: React.FC = () => {
  const [grid, setGrid] = useState(generateEmptyGrid());
  const [running, setRunning] = useState(false);

  const runningRef = useRef(running);
  runningRef.current = running;

  const simulate = useCallback(() => {
    if (!runningRef.current) {
      return;
    }

    setGrid(g =>
      produce(g, gridCopy => {
        for (let i = 0; i < numRows; i++) {
          for (let j = 0; j < numCols; j++) {
            let neighbors = 0;

            neighborCoordinates.forEach(([x, y]) => {
              const newI = i + x;
              const newJ = j + y;

              if (newI >= 0 && newI < numRows && newJ >= 0 && newJ < numCols) {
                neighbors += g[newI][newJ];
              }
            });

            if (neighbors < 2 || neighbors > 3) {
              gridCopy[i][j] = 0;
            } else if (g[i][j] === 0 && neighbors === 3) {
              gridCopy[i][j] = 1;
            }
          }
        }
      })
    );

    setTimeout(simulate, 100);
  }, []);

  return (
    <>
      <button
        onClick={() => {
          setRunning(!running);

          if (!running) {
            runningRef.current = true;
            simulate();
          }
        }}
      >
        {running ? "Stop" : "Start"}
      </button>
      <button
        onClick={() => {
          setGrid(generateEmptyGrid());
        }}
      >
        Clear
      </button>
      <button
        onClick={() => {
          setGrid(generateRandomGrid());
        }}
      >
        Random
      </button>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${numCols}, 20px)`
        }}
      >
        {grid.map((rows, i) =>
          rows.map((col, j) => (
            <div
              key={`${i}-${j}`}
              onClick={() => {
                setGrid(g =>
                  produce(g, gridCopy => {
                    gridCopy[i][j] = g[i][j] ? 0 : 1;
                  })
                );
              }}
              style={{
                width: 20,
                height: 20,
                backgroundColor: grid[i][j] ? "gray" : undefined,
                border: "solid 1px black"
              }}
            />
          ))
        )}
      </div>
    </>
  );
};

export default App;
