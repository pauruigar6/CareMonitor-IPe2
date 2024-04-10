// AudioContext.js
import React, { createContext, useReducer, useContext, useEffect } from "react";
import { auth, db } from '../utils/firebase-config';
import { collection, getDocs, where, query } from 'firebase/firestore';

const AudioContext = createContext();

export const AudioProvider = ({ children }) => {
  const initialState = {
    recordings: [],
  };

  const audioReducer = (state, action) => {
    switch (action.type) {
      case "SET_RECORDINGS":
        return { ...state, recordings: action.payload };
      case "ADD_RECORDING":
        const newRecording = { ...action.payload, timestamp: Date.now() };
        return { ...state, recordings: [...state.recordings, newRecording] };
      case "CLEAR_ALL_RECORDINGS":
        return { ...state, recordings: [] };
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(audioReducer, initialState);

  useEffect(() => {
    const fetchUserRecordings = async () => {
      try {
        const user = auth.currentUser;

        if (user) {
          const q = query(collection(db, 'audioInfo'), where('userIdField', '==', user.uid));
          const querySnapshot = await getDocs(q);

          const userRecordings = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          dispatch({ type: 'SET_RECORDINGS', payload: userRecordings });
        }
      } catch (error) {
        console.error('Error fetching user recordings:', error);
      }
    };

    fetchUserRecordings();
  }, []);

  return (
    <AudioContext.Provider value={{ state, dispatch }}>
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error("useAudio must be used within an AudioProvider");
  }
  return context;
};
