import React, { useCallback, useEffect, useState } from "react";
import { useDatabase } from "../contexts/DatabaseContext";
import styles from "./logMatch.module.scss";
import classnames from "classnames/bind";

const classNameBuilder = classnames.bind(styles);

const TEAMS = {
  RED: "red",
  BLUE: "blue",
};

const safeParseInt = (val) => {
  const parsed = parseInt(val);

  if (isNaN(parsed)) {
    return 0;
  }
  return parsed;
};

const PlayerDropdown = ({ players, player, setPlayer, id, label }) => {
  return (
    <div className={styles["dropdown"]}>
      <label htmlFor={id}>{label}</label>
      <select
        id={id}
        value={player}
        onChange={(e) => setPlayer(e.target.value)}
        disabled={players.length === 0}
      >
        <option value={""} key={""}>
          Select...
        </option>
        {players.map((p) => (
          <option key={p.id} value={p.id} disabled={p.disabled}>
            {p.label}
          </option>
        ))}
      </select>
    </div>
  );
};

const PlayerCard = ({ player, className }) => {
  return (
    <div className={styles["player-card"] + " " + className}>
      <u>{player.label}</u>
      <img src={player.logo} alt="red logo 1" />
      <div>{player.value}</div>
    </div>
  );
};

export const LogMatch = ({ players, playersMap, fetchPlayers }) => {
  const { updateDocument, addDocument } = useDatabase();

  const [red1, setRed1] = useState("");
  const [red2, setRed2] = useState("");
  const [blue1, setBlue1] = useState("");
  const [blue2, setBlue2] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [winningTeam, setWinningTeam] = useState("");

  const hasMatchup = Boolean(
    (red1 && blue1 && !red2 && !blue2) || (red1 && red2 && blue1 && blue2)
  );

  useEffect(() => {
    if (!hasMatchup) {
      setWinningTeam("");
    }
  }, [hasMatchup]);

  const updateMatchHistory = useCallback(
    ({
      red1,
      red2,
      blue1,
      blue2,
      red1Elo,
      red2Elo,
      blue1Elo,
      blue2Elo,
      winningTeam,
    }) => {
      return addDocument({
        collections: ["sports", "pingpong", "matches"],
        data: {
          player1: red1,
          player2: blue1,
          player1b: red2,
          player2b: blue2,
          player1Elo: red1Elo,
          player2Elo: blue1Elo,
          player1bElo: red2Elo,
          player2bElo: blue2Elo,
          player1Wins: winningTeam === TEAMS.RED,
          timestamp: new Date(),
        },
      });
    },
    [addDocument]
  );

  const updateElo = useCallback(async () => {
    setSubmitting(true);
    const red1Elo = playersMap[red1]?.value;
    const blue1Elo = playersMap[blue1]?.value;
    // default to player 1 elo so that the average is the same value if red or blue aren't provided
    const red2Elo = playersMap[red2]?.value || red1Elo;
    const blue2Elo = playersMap[blue2]?.value || blue1Elo;

    const redEloAvg = (red1Elo + red2Elo) / 2;
    const blueEloAvg = (blue1Elo + blue2Elo) / 2;

    const kFactor = 20;

    const redScore = winningTeam === TEAMS.RED ? 1 : 0;
    const blueScore = winningTeam === TEAMS.BLUE ? 1 : 0;
    const newElo = {};
    const updateIndividualElo = (id, otherTeamEloAvg, score) => {
      if (!id) {
        return;
      }

      return updateDocument({
        id,
        getNewValue: (doc) => {
          const curElo = parseInt(doc.data().value);

          if (isNaN(curElo)) {
            alert("failed to update " + id);
            return {};
          }

          const expected =
            1 / (1 + Math.pow(10, (otherTeamEloAvg - curElo) / 400));

          const result = Math.round(curElo + kFactor * (score - expected));

          if (isNaN(result)) {
            alert("failed to update " + result);
            return {};
          }

          newElo[id] = result;

          const prevWins = safeParseInt(doc.data().wins);
          const prevLosses = safeParseInt(doc.data().losses);

          return {
            value: result,
            wins: score ? prevWins + 1 : prevWins,
            losses: score ? prevLosses : prevLosses + 1,
          };
        },
      });
    };

    const updates = [
      updateIndividualElo(red1, blueEloAvg, redScore),
      updateIndividualElo(red2, blueEloAvg, redScore),
      updateIndividualElo(blue1, redEloAvg, blueScore),
      updateIndividualElo(blue2, redEloAvg, blueScore),
    ];

    try {
      await Promise.all(updates);

      await fetchPlayers();
    } catch (err) {
      alert("Failed to update elo " + err?.message);
      console.log(err);
    }

    setSubmitting(false);
    setWinningTeam("");

    updateMatchHistory({
      red1,
      red2,
      blue1,
      blue2,
      red1Elo: newElo[red1] || red1Elo,
      red2Elo: newElo[red2] || red2Elo,
      blue1Elo: newElo[blue1] || blue1Elo,
      blue2Elo: newElo[blue2] || blue2Elo,
      winningTeam,
    });

    // eslint-disable-next-line no-undef
    fetchPlayers();
  }, [
    blue1,
    blue2,
    fetchPlayers,
    playersMap,
    red1,
    red2,
    updateDocument,
    updateMatchHistory,
    winningTeam,
  ]);

  const selectedPlayers = [red1, red2, blue1, blue2];
  const selectedPlayersSet = new Set(selectedPlayers);

  const availablePlayers = players.map((p) => ({
    ...p,
    disabled: selectedPlayersSet.has(p.id),
  }));

  return (
    <form className={styles["form"]}>
      <h2>Log a Match</h2>
      <div className={styles["players"]}>
        <div className={styles["team"] + " " + styles["red"]}>
          <PlayerDropdown
            label="Red 1"
            id="Red 1"
            players={availablePlayers}
            player={red1}
            setPlayer={setRed1}
          />
          <PlayerDropdown
            label="Red 2 (Optional)"
            id="Red 2"
            players={availablePlayers}
            player={red2}
            setPlayer={setRed2}
          />
        </div>
        <div className={styles["team"] + " " + styles["blue"]}>
          <PlayerDropdown
            label="Blue 1"
            id="Blue 1"
            players={availablePlayers}
            player={blue1}
            setPlayer={setBlue1}
          />
          <PlayerDropdown
            label="Blue 2 (Optional)"
            id="Blue 2"
            players={availablePlayers}
            player={blue2}
            setPlayer={setBlue2}
          />
        </div>
      </div>
      <div className={styles["matchup"]}>
        {red1 && (
          <div
            className={classNameBuilder("side", {
              winning: winningTeam === TEAMS.RED,
              losing: winningTeam === TEAMS.BLUE,
            })}
          >
            <PlayerCard player={playersMap[red1]} />
            {red2 && hasMatchup && <PlayerCard player={playersMap[red2]} />}
          </div>
        )}
        <h2 style={{ margin: 0 }}>VS</h2>
        {blue1 && (
          <div
            className={classNameBuilder("side", {
              winning: winningTeam === TEAMS.BLUE,
              losing: winningTeam === TEAMS.RED,
            })}
          >
            <PlayerCard
              player={playersMap[blue1]}
              className={styles["inverse"]}
            />
            {blue2 && hasMatchup && (
              <PlayerCard
                player={playersMap[blue2]}
                className={styles["inverse"]}
              />
            )}
          </div>
        )}
      </div>
      {hasMatchup && (
        <div className={styles["winner"]}>
          <label htmlFor="player1Score">Winner</label>
          <select
            value={winningTeam}
            onChange={(e) => setWinningTeam(e.target.value)}
          >
            <option value={""}>Select...</option>
            <option value={TEAMS.RED}>Red</option>
            <option value={TEAMS.BLUE}>Blue</option>
          </select>
        </div>
      )}
      <button
        type="submit"
        disabled={!winningTeam || !hasMatchup || submitting}
        onClick={(e) => {
          e.preventDefault();
          updateElo();
        }}
      >
        Submit
      </button>
    </form>
  );
};
