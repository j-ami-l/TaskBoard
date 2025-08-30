import { createUserWithEmailAndPassword, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from 'firebase/auth';
import React, { createContext, useEffect, useState } from 'react';
import { auth } from '../Firebase/firebase.config';


export const AuthContext = createContext()

const AuthProvider = ({children}) => {


    const provider = new GoogleAuthProvider()

    const [user , setUser] = useState(null)
    const [loading , setLoading] = useState(true)
    
    
    const register = (email , password) => {
        setLoading(true)
        return createUserWithEmailAndPassword(auth, email , password)
    }

    const login = (email , password) => {
        setLoading(true)
        return signInWithEmailAndPassword(auth ,email , password)
    }

    const logout = () =>{
        //setLoading(true)
        return signOut(auth)
    }

    const signIntWithGoogle = () =>{
        setLoading(true)
        return signInWithPopup(auth , provider)
    }

    const updateuser = (updates) => {
        setLoading(true)
        return updateProfile(auth.currentUser, updates)
    }

    useEffect(()=>{
        const unSubscribe = onAuthStateChanged(auth , (currentUser)=>{
            setUser(currentUser)
            setLoading(false)
        })
        return unSubscribe
    } , [])



    const userInfo = {
        user,
        register , 
        login,
        loading,
        logout,
        signIntWithGoogle,
        updateuser
    }



    return (
        <AuthContext value={userInfo}>{children}</AuthContext>
    );
};

export default AuthProvider;