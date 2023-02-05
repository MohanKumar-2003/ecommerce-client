import React,{createContext, useState, useEffect} from "react";
import ProductAPI from "./api/ProductAPI";
import UserAPI from "./api/UserAPI";
import CategoriesAPI from "./api/CategoriesAPI";
import axios from "axios";

export const GlobalState=createContext()
export const DataProvider=({children})=>{
    const [token,setToken]=useState(false)
  
    useEffect(()=>{
        const refreshtoken=async()=>{
            const res=await axios.get('/user/refresh-token')
            setToken(res.data.accesstoken)
            setTimeout(()=>{
                refreshtoken()
            },15000)
        } 
        refreshtoken()
    },[])
    const state={
        token:[token,setToken],
        productsAPI:ProductAPI(),
        userAPI: UserAPI(token),
        categoriesAPI:CategoriesAPI()
    }
    return(
        <GlobalState.Provider value={state}>
        {children}
        </GlobalState.Provider>
    )
}