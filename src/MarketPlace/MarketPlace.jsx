/** @format */

import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import axios from "axios";
import Web3Modal, { providers } from "web3modal";
import "./MarketPlace.css";

import { nftaddress, nftmarketaddress } from "../new-config";

//importing the abi to interract with the front end from the hardhat contracts artifacts
import NFT from "../artifacts/contracts/NFT.sol/NFT.json";
import Market from "../artifacts/contracts/NFTMarket.sol/NFTMarket.json";
// import { ethers } from 'hardhat'

const MarketPlace = () => {
  //setting the usestates
  const [nfts, setNfts] = useState([]);
  const [loadingState, setLoadingState] = useState("not-loaded");

  //loadinmg the nfts on screen load
  useEffect(() => {
    loadNfts();
  }, []);

  //fetching the nfts from the blockchain
  async function loadNfts() {
    //read a
    const provider = new ethers.providers.JsonRpcProvider();
    //configuring the contract, referencing the actual nft contract
    const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider);
    //getting the market contract to map over it and display it on the client side
    const marketContract = new ethers.Contract(
      nftmarketaddress,
      Market.abi,
      provider
    );
    //getting the data from the market contract
    const data = await marketContract.fetchMarketItems();
    //mapping over the data from the blockchain
    const items = await Promise.all(
      data.map(async (i) => {
        //getting the token uri that contains the meta data of the file
        const tokenUri = await tokenContract.tokenURI(i.tokenId);
        //getting the actual meta data from the token uri(uri is the details of the file)
        const meta = await axios.get(tokenUri);
        //getting the price but formating it
        let price = ethers.utils.formatUnits(i.price.toString(), "ether");

        //returning the list of items
        let item = {
          price,
          tokenId: i.tokenId.toNumber(),
          seller: i.seller,
          owner: i.owner,
          image: meta.data.image,
          name: meta.data.name,
          description: meta.data.description,
        };
        return item;
      })
    );
    setNfts(items);
    setLoadingState("loaded");
  }

  //buying nfts
  async function buyNfts(nft) {
    //connecting to the web3modal
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();

    //connecting a provider with the web 3 modal provider
    const provider = new ethers.providers.Web3Provider(connection);

    //connecting with a signer
    const signer = provider.getSigner();
    //getting the signer contract address
    const contract = new ethers.Contract(nftmarketaddress, Market.abi, signer);

    //getting the formatted price
    const price = ethers.utils.parseUnits(nft.price.toString(), "ether");

    const transaction = await contract.createMarketSale(
      nftaddress,
      nft.tokenId,
      {
        //the value is the price of the item that will be passed from the buyer to the seller
        value: price,
      }
    );

    //waiting till the transaction completes
    await transaction.wait();
    loadNfts();
  }
  //checking if the nft market is empty then returning a warning string
  if (loadingState === "loaded" && !nfts.length)
    return (
      <div className="warning" id="market">
        <p>
          No song currently available on the marketPlace, be the first to create
        </p>
      </div>
    );
  return (
    <>
      <div className="marketPlace">
        {nfts.map((nft, i) => {
          // console.log(nft)
          const { image, name, description, price } = nft;
          return (
            <div className="music_cards" key={i}>
              <div className="card-image">
                <img src={image} />
              </div>

              <p className="artiste-name" style={{ height: "64px" }}>
                {name}
              </p>
              <p className="song-desc">{description}</p>

              <div className="buy-button">
                <p>{price} MATIC</p>
                <button className="button" onClick={() => buyNfts(nft)}>
                  Buy Now
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default MarketPlace;
