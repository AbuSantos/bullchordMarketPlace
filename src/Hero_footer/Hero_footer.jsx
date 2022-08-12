import React from 'react'
import "./Hero_footer.css"
import group from "../images/group.svg"
import note from "../images/m-note.svg"
import pool from "../images/pool.svg"
import vertical from "../images/vertical.svg"

const Hero_footer = () => {
  return (
    <>
      <div className="hero-footer">
          <div className="footer-div">
            <img src={pool} alt="" />
            <p>Take part in NFT pools easily</p>
          </div>
          <img src={vertical} alt="" className='hero-footer-image' />
          <div className="footer-div">
            <img src={note} alt="" />
            <p>Mint musicall files into NFT  fungible tokens</p>
          </div>
          <img src={vertical} alt="" className='hero-footer-image' />

          <div className="footer-div">
            <img src={group} alt="" />
            <p>Create an event and invite others to come listen</p>
          </div>
      </div>
    </>
  )
}

export default Hero_footer