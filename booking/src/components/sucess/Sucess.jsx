import React from 'react';
import "./sucess.css";
import { Link } from 'react-router-dom';


const Sucess = () => {
  return (
    <>
    <div className='div1'>Payment Sucessfully Done</div>
    <h1 className='h1'>Thank You!!</h1>
    <Link to="/">
    <button className='butt'>Direct to Home Page</button>
    </Link>
    
  </> 
  )
}

export default Sucess