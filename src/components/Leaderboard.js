import React, { useMemo, useState } from "react";
import styles from "./leaderboard.module.scss";

const SORT_METHODS = {
  PLAYER_ASC: "PLAYER_ASC",
  PLAYER_DESC: "PLAYER_DESC",
  ELO_ASC: "ELO_ASC",
  ELO_DESC: "ELO_DESC",
};

const SORT_FUNCTIONS = {
  [SORT_METHODS.PLAYER_ASC]: (a, b) =>
    a.label.toLowerCase() < b.label.toLowerCase() ? -1 : 1,
  [SORT_METHODS.PLAYER_DESC]: (a, b) => (a.label > b.label ? -1 : 1),
  [SORT_METHODS.ELO_ASC]: (a, b) => a.value - b.value,
  [SORT_METHODS.ELO_DESC]: (a, b) => b.value - a.value,
};

export const Leaderboard = ({ players }) => {
  const [sortMethod, setSortMethod] = useState(SORT_METHODS.ELO_DESC);
  const sortedPlayers = useMemo(() => {
    return [...players].sort(SORT_FUNCTIONS[sortMethod]);
  }, [players, sortMethod]);

  console.log(sortedPlayers, sortMethod);
  return (
    <div className={styles["container"]}>
      <h2>Leaderboard</h2>
      <table className={styles["leaderboard-container"]}>
        <tr>
          <th style={{ width: "50px" }}></th>
          <th
            onClick={() => {
              if (sortMethod === SORT_METHODS.PLAYER_DESC) {
                setSortMethod(SORT_METHODS.PLAYER_ASC);
              } else {
                setSortMethod(SORT_METHODS.PLAYER_DESC);
              }
            }}
          >
            Player{sortMethod === SORT_METHODS.PLAYER_DESC && <>&#8595;</>}
            {sortMethod === SORT_METHODS.PLAYER_ASC && <>&#8593;</>}
          </th>
          <th
            style={{ width: "60px", textAlign: "center" }}
            onClick={() => {
              if (sortMethod === SORT_METHODS.ELO_DESC) {
                setSortMethod(SORT_METHODS.ELO_ASC);
              } else {
                setSortMethod(SORT_METHODS.ELO_DESC);
              }
            }}
          >
            Elo{sortMethod === SORT_METHODS.ELO_DESC && <>&#8595;</>}
            {sortMethod === SORT_METHODS.ELO_ASC && <>&#8593;</>}
          </th>
        </tr>
        {sortedPlayers.map((p) => (
          <tr style={{ height: "50px" }}>
            <td>
              <img src={p.logo} alt="logo" width="50" height="50" />
            </td>
            <td style={{ textAlign: "center" }}>
              <div>{p.label}</div>
            </td>
            <td style={{ width: "60px", textAlign: "center" }}>
              <div>{p.value}</div>
            </td>
          </tr>
        ))}
      </table>
    </div>
  );
};
