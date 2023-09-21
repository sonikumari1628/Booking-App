import React from 'react';
import "./cancel.css";
import { Link } from 'react-router-dom';

const Cancel = () => {
  return (
    <>
    <div className='div1'>Oops!!! Try Again....</div>
    <h1 className='h1'>Thank You!!</h1>
    <Link to="/">
    <button className='butt'>Direct to Home Page</button>
    </Link>
    
  </> 
  )
}

export default Cancel