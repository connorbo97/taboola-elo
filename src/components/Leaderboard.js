import React, { useMemo, useState } from "react";
import styles from "./leaderboard.module.scss";

const SORT_METHODS = {
  PLAYER_ASC: "PLAYER_ASC",
  PLAYER_DESC: "PLAYER_DESC",
  ELO_ASC: "ELO_ASC",
  ELO_DESC: "ELO_DESC",
  WIN_DESC: "WIN_DESC",
  WIN_ASC: "WIN_ASC",
};

const SORT_FUNCTIONS = {
  [SORT_METHODS.PLAYER_ASC]: (a, b) =>
    a.label.toLowerCase() < b.label.toLowerCase() ? -1 : 1,
  [SORT_METHODS.PLAYER_DESC]: (a, b) => (a.label > b.label ? -1 : 1),
  [SORT_METHODS.ELO_ASC]: (a, b) => a.value - b.value,
  [SORT_METHODS.ELO_DESC]: (a, b) => b.value - a.value,
  [SORT_METHODS.WIN_ASC]: (a, b) => (a.wins || 0) - (b.wins || 0),
  [SORT_METHODS.WIN_DESC]: (a, b) => (b.wins || 0) - (a.wins || 0),
};

export const Leaderboard = ({ players }) => {
  const [sortMethod, setSortMethod] = useState(SORT_METHODS.ELO_DESC);
  const sortedPlayers = useMemo(() => {
    return [...players].sort(SORT_FUNCTIONS[sortMethod]);
  }, [players, sortMethod]);

  const highestELO = players.reduce((acc, p) => {
    return p.value > acc ? p.value : acc;
  }, 0);

  return (
    <div className={styles["container"]}>
      <h2>Leaderboard</h2>
      <table className={styles["leaderboard-container"]}>
        <tr>
          <th style={{ width: "120px" }}></th>
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
              if (sortMethod === SORT_METHODS.WIN_DESC) {
                setSortMethod(SORT_METHODS.WIN_ASC);
              } else {
                setSortMethod(SORT_METHODS.WIN_DESC);
              }
            }}
          >
            WINS{sortMethod === SORT_METHODS.WIN_DESC && <>&#8595;</>}
            {sortMethod === SORT_METHODS.WIN_ASC && <>&#8593;</>}
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
            ELO{sortMethod === SORT_METHODS.ELO_DESC && <>&#8595;</>}
            {sortMethod === SORT_METHODS.ELO_ASC && <>&#8593;</>}
          </th>
        </tr>
        {sortedPlayers.map((p, i) => (
          <tr style={{ height: "50px" }}>
            <td style={{ position: "relative" }}>
              <img
                src={p.logo}
                alt="logo"
                width="45"
                height="45"
                style={{
                  position: "absolute",
                  left: "50%",
                  top: "50%",
                  transform: "translate(-50%, -50%)",
                }}
              />
            </td>
            <td style={{ textAlign: "center" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "2px",
                }}
              >
                {highestELO === p.value && (
                  <img
                    src="https://i.pinimg.com/originals/6e/b2/4e/6eb24ecffbbbfbcab03fa5679a893172.png"
                    width="20"
                    height="20"
                    alt="crown"
                  />
                )}
                {p.label}
                {highestELO === p.value && (
                  <img
                    src="https://i.pinimg.com/originals/6e/b2/4e/6eb24ecffbbbfbcab03fa5679a893172.png"
                    width="20"
                    height="20"
                    alt="crown"
                  />
                )}
              </div>
            </td>
            <td style={{ width: "60px", textAlign: "center" }}>
              <div>{p.wins || 0}</div>
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
