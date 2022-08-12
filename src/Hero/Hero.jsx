import React from 'react'
import Button from '../Button'
import "./Hero.css"
import heroimage1 from "../images/hero-right.svg"
import heroimage2 from "../images/hero-left.svg"
const Hero = () => {
  return (
    <>
      <div className="hero">
        <h1>bullchord music card</h1>
        <h2>buy and own <span>musical cards</span> of your favorites artistes.</h2>
        <p>Upload and sell your musical cards as and artiste, find, bid and buy musical cards of
        your favourite artiste or songs if you are into collecting</p>


          <div className="buttons">
              <Button name="Become a creator" className="button"/>
              <Button name="Explore cards" className="button button-two" />
          </div>

          <div className="hero-styling">
<img src={heroimage1} alt="" />
<img src={heroimage2} alt="" />
          </div>
      </div>
    </>
  )
}

export default Hero