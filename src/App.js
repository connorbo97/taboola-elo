import logo from './logo.svg';
import './App.css';

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { DatabaseContextProvider } from './contexts/DatabaseContext';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBJ9OQTzlPSRVnWnxMxMOSqccZhec4y2XQ",
  authDomain: "taboola-elo.firebaseapp.com",
  projectId: "taboola-elo",
  storageBucket: "taboola-elo.appspot.com",
  messagingSenderId: "411780773436",
  appId: "1:411780773436:web:29d07bbae92de304177539"
};

// Initialize Firebase
initializeApp(firebaseConfig);

function App() {
  return (
    <DatabaseContextProvider>
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    </DatabaseContextProvider>
  );
}

export default App;
