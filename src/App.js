import React, { useState, useEffect } from "react";
import styled, { keyframes, css } from "styled-components";

const GRID_ROWS = 15;
const GRID_COLUMNS = 20;
const TRAIL_LENGTH = 6;
const FRAME_DELAY = 100;

const fall = keyframes`
  0% { transform: translateY(-100%); }
  100% { transform: translateY(100%); }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: linear-gradient(to bottom, #001f3f, #011627);
  color: white;
  font-family: Arial, sans-serif;
`;

const Grid = styled.div`
  display: grid;
  grid-template-rows: repeat(${GRID_ROWS}, 1fr);
  grid-template-columns: repeat(${GRID_COLUMNS}, 1fr);
  width: 80vmin;
  height: 60vmin;
  background: #000;
  border: 2px solid grey;
`;

const Cell = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  background: ${(props) => props.color || "transparent"};
  border: 2px solid grey;
  ${(props) =>
    props.israin &&
    css`
      animation: ${fall} 1s linear infinite;
    `}
`;

function App() {
  const [gridData, setGridData] = useState(
    Array.from({ length: GRID_ROWS }, () =>
      Array.from({ length: GRID_COLUMNS }, () => null)
    )
  );

  useEffect(() => {
    let activeTrails = Array(GRID_COLUMNS).fill(null);

    function addTrail() {
      const newTrailColumn = Math.floor(Math.random() * GRID_COLUMNS);
      const baseHue = Math.random() * 360;

      activeTrails[newTrailColumn] = {
        baseHue,
        position: 0,
      };
    }

    function updateTrails() {
      const newGridData = Array.from({ length: GRID_ROWS }, () =>
        Array.from({ length: GRID_COLUMNS }, () => null)
      );

      for (let col = 0; col < GRID_COLUMNS; col++) {
        const trail = activeTrails[col];
        if (trail) {
          for (let i = 0; i < TRAIL_LENGTH; i++) {
            const row = trail.position - i;
            if (row >= 0 && row < GRID_ROWS) {
              const lightness = 50 - i * 8;
              const color = `hsl(${trail.baseHue}, 100%, ${lightness}%)`;
              newGridData[row][col] = color;
            }
          }

          trail.position++;

          if (trail.position - TRAIL_LENGTH > GRID_ROWS) {
            activeTrails[col] = null;
          }
        }
      }

      setGridData(newGridData);
    }

    const addTrailInterval = setInterval(addTrail, 300);

    const animationInterval = setInterval(updateTrails, FRAME_DELAY);

    return () => {
      clearInterval(addTrailInterval);
      clearInterval(animationInterval);
    };
  }, []);

  return (
    <Container>
      <h1>Falling Rain</h1>
      <Grid>
        {gridData.map((row, rowIndex) =>
          row.map((cellColor, colIndex) => (
            <Cell key={`${rowIndex}-${colIndex}`} color={cellColor} />
          ))
        )}
      </Grid>
    </Container>
  );
}

export default App;
