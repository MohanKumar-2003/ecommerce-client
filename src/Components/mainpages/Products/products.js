import React,{useContext,useEffect, useState} from "react";
import { GlobalState } from '../../../GlobalState'
import ProductItem from "../productItem/productItem";
import Loading from "../Loading/Loading";
import axios from "axios";
import Filters from "./filters";
import LoadMore from "./LoadMore";
function Product(){
    const state=useContext(GlobalState)
    const [products,setProducts]=state.productsAPI.products
    const [token]=state.token
    const [isAdmin]=state.userAPI.isAdmin
    const [callback,setCallback]=state.productsAPI.callback
    const [isCheck,setIsCheck]=useState(false)
    const [loading,setLoading]=useState(false)
    const handleCheck=(id)=>{
       products.forEach(product=>{
        if(product._id===id) product.checked=!product.checked
       })
       setProducts([...products])
    }
    const checkAll=()=>{
        products.forEach(product=>{
            product.checked=!isCheck
        })
        setProducts([...products])
        setIsCheck(!isCheck)
    }
    const deleteAll=()=>{
        products.forEach(product=>{
            if(product.checked) deleteProduct(product._id,product.images.public_id)
        })
    }
    
    const deleteProduct=async(id,public_id)=>{
        console.log({id,public_id})
        try{
              setLoading(true)
              const destroyImg= axios.post('/api/destroy',{id},{
                headers:{Authorization:token}
                
              })
             
              const deleteProduct=axios.delete(`/api/products/${id}`,{
                headers:{Authorization:token}
              })
               
              await destroyImg
              await deleteProduct
              setLoading(false)
              setCallback(!callback)
        }
        catch(err){
            alert(err.response.data.msg)
        }
       }
       if(loading) return <div className="products"><Loading /></div>
    return(
        <>
        <Filters />
        {
           isAdmin && <div className="delete-all">
            <span>Select all</span>
            <input type="checkbox" checked={isCheck} onChange={checkAll}/>
            <button onClick={deleteAll}>Delete All</button>
           </div> 
        }
        <div className="products">
            {
                products.map(product=>{
                    return <ProductItem key={product._id} product={product} isAdmin={isAdmin} deleteProduct={deleteProduct} handleCheck={handleCheck} />
                })
            }
        </div>
        <LoadMore />
        {products.length==0 && <Loading /> }
        </>
    )
}
export default Product