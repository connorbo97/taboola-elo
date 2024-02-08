import React, { useCallback, useState } from "react";
import { useDatabase } from "../contexts/DatabaseContext";
import styles from "./addPlayer.module.scss";

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

const DEFAULT_STATE = {
  name: "",
  elo: 1000,
  logo: "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg",
  wins: 0,
  losses: 0,
};

export const AddPlayer = ({ fetchPlayers }) => {
  const { addDocument } = useDatabase();
  const [name, setName] = useState(DEFAULT_STATE.name);
  const [elo, setElo] = useState(DEFAULT_STATE.elo);
  const [logo, setLogo] = useState(DEFAULT_STATE.logo);
  const [wins, setWins] = useState(DEFAULT_STATE.wins);
  const [losses, setLosses] = useState(DEFAULT_STATE.losses);

  const [submitting, setSubmitting] = useState(false);

  const hasValidPlayer = name && elo && logo;

  const onAddPlayer = useCallback(async () => {
    setSubmitting(true);
    try {
      addDocument({
        data: {
          label: name,
          value: elo,
          logo,
          wins: wins || 0,
          losses: losses || 0,
        },
      });
    } catch (err) {
      alert("failed to add player. " + err.message);
    }

    setSubmitting(false);

    setName(DEFAULT_STATE.name);
    setElo(DEFAULT_STATE.elo);
    setLogo(DEFAULT_STATE.logo);
    setWins(DEFAULT_STATE.wins);
    setLosses(DEFAULT_STATE.losses);

    fetchPlayers();
  }, [addDocument, elo, fetchPlayers, logo, losses, name, wins]);

  return (
    <form className={styles["container"]}>
      <h2>Add Player</h2>
      <div className={styles["fields"]}>
        <Field
          id="name"
          label="Player Name"
          type="string"
          setValue={setName}
          placeholder="John Doe"
          value={name}
        />
        <Field
          id="elo"
          label="Starting ELO"
          type="number"
          min="0"
          max="7000"
          setValue={setElo}
          value={elo}
        />
        <Field
          id="logo"
          label="Logo URL (1:1)"
          type="string"
          value={logo}
          setValue={setLogo}
        />
        <Field
          id="wins"
          label="Wins"
          type="number"
          min="0"
          max="1000"
          setValue={setWins}
          value={wins}
        />
        <Field
          id="losses"
          label="Losses"
          type="number"
          min="0"
          max="1000"
          setValue={setLosses}
          value={losses}
        />
      </div>
      {logo && <img src={logo} width="50" height="50" alt="player logo" />}

      <input
        type="submit"
        value="Add Player"
        disabled={!hasValidPlayer || submitting}
        onClick={(e) => {
          e.preventDefault();
          onAddPlayer();
        }}
      />
    </form>
  );
};
