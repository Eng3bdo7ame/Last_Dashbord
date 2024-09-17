import React, { createContext, useState, useContext } from "react";

const BoardContext = createContext();

export const useBoard = () => useContext(BoardContext);

export const BoardProvider = ({ children }) => {
  const [columnsData, setColumnsData] = useState([]);

  return (
    <BoardContext.Provider value={{ columnsData, setColumnsData }}>
      {children}
    </BoardContext.Provider>
  );
};
