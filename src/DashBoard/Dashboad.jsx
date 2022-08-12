import React,{useEffect,useState} from 'react'
import {ethers} from "ethers"
import Web3Modal from 'web3modal'
import axios from "axios"
import "./Dashboard.css"


//importing the market and nft contract address
import {
  nftaddress, nftmarketaddress
} from '../new-config'

//importing interract with the front end from the hardhat contracts artifacts
import NFT from "../artifacts/contracts/NFT.sol/NFT.json"
import Market from "../artifacts/contracts/NFTMarket.sol/NFTMarket.json"


const Dashboad = () => {
  const [nfts,setNfts]= useState([])
  const [sold,setSold]= useState([])
  const[loadingState,setLoadingState]= useState("Not loadedS")

  useEffect(()=>{
    loadNfts()
  },[])

  async function loadNfts(){

    //connecting to the metamask
  const web3Modal = new Web3Modal()
  const connection = await web3Modal.connect()
  const provider = new ethers.providers.Web3Provider(connection)
  const signer = provider.getSigner();

   //configuring the contract, referencing the actual nft contract
  const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider)
  //getting the market contract to map over it and display it on the client side
  const marketContract = new ethers.Contract(nftmarketaddress, Market.abi, signer)
    //getting the data from the market contract
  const data = await marketContract.fetchMyNFTS()

   //mapping over the data from the blockchain
  const items = await Promise.all(data.map(async i =>{
      //getting the token uri that contains the meta data of the file
      const tokenUri = await tokenContract.tokenURI(i.tokenId)
      //getting the actual meta data from the token uri(uri is the details of the file)
      const meta = await axios.get(tokenUri)
      //getting the price but formating it 
      let price = ethers.utils.formatUnits(i.price.toString(), "ether")

      //returning the list of items
      let item = {
        price,
        tokenId:i.tokenId.toNumber(),
        seller:i.seller,
        owner:i.owner,
        image:meta.data.image
        // name:meta.data.name,
        // description:meta.data.description
      }
    return item
  }))

  const soldCards =items.filter(i => i.sold)
  setNfts(items)
  setSold(soldCards)
  setLoadingState("loaded")
  }

  if(loadingState === "loaded" && !nfts.length)
return(
  <div className='warning' id='market'>
     <p>You've not sold any Music card yet, explore market place</p>
  </div>
)
// wallet formatting

  return (
    <>
    <div className="marketPlace">
      <h3>My Items</h3>
        {nfts.map((nft,i) => {
              const{image,name,description,price,owner}=nft
              // console.log(nft)
              return( 
                // <div className="chord">
                   <div className="music_cards" key={i}>
                    <div className = "card-image">
                        <img src={image}/>
                    </div>

                    <p className="artiste-name">{nft.name}</p>

                    <p className="song-desc">{description}</p>
                    <h4 className='owner'>
                      {owner.substring(0, 5)}…{owner.substring(owner.length - 4)}
                    </h4>
                    <p className="song-desc"></p>

                    <div className="buy-button">
                        <p>{price} MATIC</p>
                        {/* <button className='button' onClick={()=>buyNfts(nft)}>Buy Now</button> */}
                    </div>
                  </div>
              // </div>               
            )
        })}
      </div>

      <div className="sold-cards">
        <h3>My sold Items</h3>
        {sold.map((item,i) => {
          console.log(item) 
          const{image,name,description,price} = item
          return(    
            <div className="chord">
              <div className="music_cards" key={i}>
                  <div className="card-image">
                      <img src={image}/>
                  </div>

                  <p className="artiste-name" style={{height:"64px"}}>{name}</p>
                  <p className="song-desc">{description}</p>

                  <div className="buy-button">
                      <p>{price} MATIC</p>
                      {/* <button className='button' onClick={()=>buyNfts(nft)}>Buy Now</button> */}
                  </div>
              </div>
            </div>            
            )
        })}

      </div>
    </>
  )
}

export default Dashboad