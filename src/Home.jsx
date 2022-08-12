import React from 'react'
import Hero from './Hero/Hero'
import Hero_footer from './Hero_footer/Hero_footer'
import MarketPlace from './MarketPlace/MarketPlace'

const Home = () => {
  return (
    <>
      <Hero/>
      <Hero_footer/>
      <div className="display-market">
        <MarketPlace />
      </div>
    </>
  )
}

export default Home