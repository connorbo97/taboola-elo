import React, { useState } from "react";
import { useDatabase } from "../contexts/DatabaseContext";
import styles from "./editPlayer.module.scss";

const Field = ({ id, label, type = "text", setValue, ...rest }) => {
  return (
    <>
      <label htmlFor={id}>{label}:</label>
      <input
        type={type}
        name={id}
        onChange={(e) => setValue(e.target.value)}
        {...rest}
      />
    </>
  );
};

export const EditPlayer = ({ players, playersMap, fetchPlayers }) => {
  const { updateDocument } = useDatabase();
  const [submitting, setSubmitting] = useState(false);
  const [name, setName] = useState("");
  const [elo, setElo] = useState(0);
  const [logo, setLogo] = useState("");
  const [wins, setWins] = useState(0);
  const [losses, setLosses] = useState(0);

  const [player, setPlayer] = useState("");

  const setTargetPlayer = (id) => {
    setPlayer(id);
    const target = playersMap[id];

    if (target) {
      setName(target.label);
      setElo(target.value);
      setLogo(target.logo);
      setWins(target.wins);
      setLosses(target.losses);
    } else if (!id) {
      setName("");
      setElo(0);
      setLogo("");
      setWins(0);
      setLosses(0);
    } else {
      alert("Something went wrong. Try refreshing");
    }
  };

  const onEditPlayer = async () => {
    setSubmitting(true);
    try {
      await updateDocument({
        id: player,
        getNewValue: () => ({
          label: name || "<INSERT NAME>",
          value: elo ?? 1000,
          logo:
            logo ||
            "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg",
          wins: wins || 0,
          losses: losses || 0,
        }),
      });
    } catch (err) {
      alert("Something went wrong. Try refreshing");
      console.log(err);
    }
    setSubmitting(false);
    fetchPlayers();
  };

  return (
    <div className={styles["container"]}>
      <h2>Edit Player</h2>

      <div>
        <div className={styles["field"]}>
          <label htmlFor="player">Select Player:</label>
          <select
            id="player"
            value={player}
            onChange={(e) => setTargetPlayer(e.target.value)}
          >
            <option value={""} key={""}>
              Select...
            </option>
            {players.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className={styles["fields"]}>
        <Field
          id="name"
          label="Player Name"
          type="string"
          setValue={setName}
          placeholder="John Doe"
          value={name}
          disabled={!player}
        />
        <Field
          id="elo"
          label="Starting ELO"
          type="number"
          min="0"
          max="7000"
          setValue={setElo}
          value={elo}
          disabled={!player}
        />
        <Field
          id="logo"
          label="Logo URL (1:1)"
          type="string"
          value={logo}
          setValue={setLogo}
          disabled={!player}
        />
        <Field
          id="wins"
          label="Wins"
          type="number"
          min="0"
          max="1000"
          setValue={setWins}
          value={wins}
          disabled={!player}
        />
        <Field
          id="losses"
          label="Losses"
          type="number"
          min="0"
          max="1000"
          setValue={setLosses}
          value={losses}
          disabled={!player}
        />
      </div>
      {logo && <img src={logo} width="50" height="50" alt="player logo" />}

      <input
        type="submit"
        value="Edit Player"
        disabled={!player || submitting}
        onClick={(e) => {
          e.preventDefault();
          onEditPlayer();
        }}
      />
    </div>
  );
};
