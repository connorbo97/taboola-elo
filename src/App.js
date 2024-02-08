// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  DatabaseContextProvider,
  useDatabase,
} from "./contexts/DatabaseContext";
import { LogMatch } from "./components/LogMatch";
import { useCallback, useEffect, useMemo, useState } from "react";
import { keyBy } from "lodash";
import styles from "./app.module.scss";
import { Leaderboard } from "./components/Leaderboard";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBJ9OQTzlPSRVnWnxMxMOSqccZhec4y2XQ",
  authDomain: "taboola-elo.firebaseapp.com",
  projectId: "taboola-elo",
  storageBucket: "taboola-elo.appspot.com",
  messagingSenderId: "411780773436",
  appId: "1:411780773436:web:29d07bbae92de304177539",
};

// Initialize Firebase
initializeApp(firebaseConfig);

function App() {
  const { getAllDocuments } = useDatabase();
  const [fetchingPlayers, setFetchingPlayers] = useState(false);

  const [players, setPlayers] = useState([]);
  const playersMap = useMemo(() => keyBy(players, "id"), [players]);

  const fetchPlayers = useCallback(async () => {
    setFetchingPlayers(true);
    let players;
    try {
      players = await getAllDocuments();
    } catch (err) {
      alert("failed to fetch players. try refreshing");
    }
    setPlayers(players || []);
    setFetchingPlayers(false);
  }, [getAllDocuments]);

  useEffect(() => {
    fetchPlayers();
  }, [fetchPlayers, getAllDocuments]);

  return (
    <div className={styles["app"]}>
      <h1>
        Taboola Ping Pong {fetchingPlayers && <i>(Fetching Players...)</i>}
      </h1>

      <LogMatch
        players={players}
        playersMap={playersMap}
        fetchPlayers={fetchPlayers}
      />
      <div className={styles["divider"]} />
      <Leaderboard players={players} />
      <div style={{ padding: "40px" }} />
    </div>
  );
}

const AppWithWrappers = () => {
  return (
    <DatabaseContextProvider>
      <App />
    </DatabaseContextProvider>
  );
};

export default AppWithWrappers;
