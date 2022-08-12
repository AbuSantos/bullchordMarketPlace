import React,{useEffect,useState} from 'react'
import axios from "axios"
import Web3Modal, { providers } from "web3modal"
import {ethers} from "ethers"

import "./MyAssets.css"

//importing the market and nft contract address
import {
  nftaddress, nftmarketaddress
} from '../new-config'

//importing interract with the front end from the hardhat contracts artifacts
import NFT from "../artifacts/contracts/NFT.sol/NFT.json"
import Market from "../artifacts/contracts/NFTMarket.sol/NFTMarket.json"

const MyAssets = () => {
  const [nfts,setNfts]= useState([])
  const [loadingState,setLoadingState]=useState('not-loaded')
  
  useEffect(()=>{
    loadNfts()
  },[])

//fetching the nfts from the blockchain
async function loadNfts(){
  
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
  setNfts(items)
  setLoadingState("loaded")
}

//checking if the nft market is empty then returning a warning string
if(loadingState === "loaded" && !nfts.length)
return(
  <div className='warning' id='market'>
     <p>You've not purchased any Music card yet, explore market place</p>
  </div>
)
   return (
    <>
      <div className="marketPlace">
        {nfts.map((nft,i) => {
          console.log(nft)
              const{image,name,description,price}=nft
              return(                
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
            )
        })}
      </div>
    </>
    )
}

export default MyAssets
