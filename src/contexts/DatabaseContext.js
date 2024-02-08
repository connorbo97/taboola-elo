import { createContext, useContext, useMemo } from "react";
// Required for side-effects
import {
  getFirestore,
  collection,
  addDoc,
  getDoc,
  getDocs,
  doc,
  runTransaction,
} from "firebase/firestore";
const DatabaseContext = createContext(null);

const DEFAULT_COLLECTION = ["sports", "pingpong", "players"];

const generateDatabase = (db) => {
  return {
    addDocument: async ({ data, collections = DEFAULT_COLLECTION }) => {
      try {
        const docRef = await addDoc(collection(db, ...collections), data);
        console.log("Document written with ID: ", docRef.id);
      } catch (e) {
        console.error("Error adding document: ", e);
      }
    },
    getAllDocuments: async (collections = DEFAULT_COLLECTION) => {
      const querySnapshot = await getDocs(collection(db, ...collections));

      return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    },
    readDocument: async ({ id, collections = DEFAULT_COLLECTION }) => {
      const docSnap = await getDoc(doc(db, ...collections, id));

      if (!docSnap.exists()) {
        // docSnap.data() will be undefined in this case
        console.log("No such document!");
        return null;
      }

      return docSnap.data();
    },
    updateDocument: async ({
      id,
      collections = DEFAULT_COLLECTION,
      getNewValue,
    }) => {
      await runTransaction(db, async (transaction) => {
        const docRef = doc(db, ...collections, id);

        const targetDoc = await transaction.get(docRef);

        if (!targetDoc.exists()) {
          alert("failed to update " + id);
          throw new Error("Document does not exist!");
        }

        const newData = getNewValue(targetDoc);

        transaction.update(docRef, { ...newData });
      });
    },
  };
};

export const DatabaseContextProvider = ({ children }) => {
  const db = useMemo(() => generateDatabase(getFirestore()), []);

  return (
    <DatabaseContext.Provider value={db}>{children}</DatabaseContext.Provider>
  );
};
export const useDatabase = () => {
  const database = useContext(DatabaseContext);

  return database;
};
