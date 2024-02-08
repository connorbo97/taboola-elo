import { createContext, useContext, useMemo } from 'react';
import { firestore } from "firebase/compat/app";
// Required for side-effects
import { collection, addDoc, getDoc, getDocs, doc } from "firebase/firestore";

const DatabaseContext = createContext(null);

const DEFAULT_COLLECTION = ['pingpong', 'players']

const generateDatabase = (db) => ({
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
        
        return querySnapshot.docs.map((doc) => doc.data());
    },
    readDocument: async ({ id, collections = DEFAULT_COLLECTION}) => {
        const docSnap = await getDoc(doc(db, ...collections, id));

        if (!docSnap.exists()) {
          // docSnap.data() will be undefined in this case
          console.log("No such document!");
          return null
        }

        return docSnap.data();
    },
});

export const DatabaseContextProvider = ({ children }) =>{
    const db = useMemo(() => generateDatabase(firestore()), []);

    return (
        <DatabaseContext.Provider value={db}>
            {children}
        </DatabaseContext.Provider>
    )

}
export const useDatabase = () => {
    const database = useContext(DatabaseContext);

    return database;
}