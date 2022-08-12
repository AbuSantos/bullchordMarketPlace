/** @format */

import React, { useState, useRef } from "react";
import { ethers } from "ethers";
import { create as ipfsHttpClient } from "ipfs-http-client";
import Web3Modal from "web3modal";
import "./CreateItem.css";
import AudioPlay from "./AudioPlay";
//importing the market and nft contract address
import { nftaddress, nftmarketaddress } from "../new-config";

//importing interract with the front end from the hardhat contracts artifacts
import NFT from "../artifacts/contracts/NFT.sol/NFT.json";
import Market from "../artifacts/contracts/NFTMarket.sol/NFTMarket.json";

//settingn the client that handles the uploads and downloads
const client = ipfsHttpClient("https://ipfs.infura.io:5001/api/v0");

const CreateItem = () => {
  const [fileUrl, setFileUrl] = useState(null);
  const [formInput, setFormInput] = useState({
    price: "",
    name: "",
    description: "",
  });

  async function onChange(e) {
    // accept the input file and display it on the UI
    const files = e.target.files[0];
    setFileUrl(URL.createObjectURL(files));

    try {
      const added = await client.add(files, {
        progress: (prog) => console.log(`received:${prog}`),
      });
      //adding the image uploaded to the infura api
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      setFileUrl(url);
    } catch (error) {
      console.log("Error uploading file:", error);
    }
  }

  //function for submitting the nft
  async function createCard() {
    //getting the form value
    const { name, description, price } = formInput;

    if (!name || !description || !price || !fileUrl) return;

    //passing the data and the image reference as a json file
    //meta must be stored in a json pattern
    const data = JSON.stringify({
      name,
      description,
      image: fileUrl,
    });

    //saving the data to ipfs
    try {
      const added = await client.add(data);
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      return url;
      // console
    } catch (e) {
      console.log("Error uploading file: ", e);
    }
  }

  //listing the item for sale
  async function createSale() {
    //getting the meta from the ipfs, using async because everything happens together
    const url = await createCard();
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    let contract = new ethers.Contract(nftaddress, NFT.abi, signer);
    //creating an nft from the meta from the url
    let transaction = await contract.createToken(url);
    let tx = await transaction.wait();
    console.log(transaction, tx);

    let event = tx.events[0];
    let value = event.args[2];
    let tokenId = value.toNumber();

    //getting the passed in price and formatting it
    const price = ethers.utils.parseUnits(formInput.price, "ether");
    contract = new ethers.Contract(nftmarketaddress, Market.abi, signer);
    let listingPrice = await contract.getListingPrice();
    listingPrice = listingPrice.toString();

    transaction = await contract.createMarketItem(nftaddress, tokenId, price, {
      value: listingPrice,
    });

    await transaction.wait();
  }
  return (
    <>
      <div className="create-item">
        <input
          type="text"
          placeholder="Song Name"
          onChange={(e) => setFormInput({ ...formInput, name: e.target.value })}
        />

        <textarea
          name=""
          id=""
          cols="30"
          rows="7"
          placeholder="Song description"
          className="text-area"
          onChange={(e) =>
            setFormInput({ ...formInput, description: e.target.value })
          }
        />

        <input
          type="text"
          placeholder="Price of the Song"
          onChange={(e) =>
            setFormInput({ ...formInput, price: e.target.value })
          }
        />

        <input
          type="file"
          name="file"
          id=""
          accept="image/*"
          className="fille"
          onChange={onChange}
        />

        <div>
          {fileUrl && <img className="updated-file" src={fileUrl} />}
          <AudioPlay />
        </div>

        <div className="create-button">
          <button onClick={createSale} className="button">
            Create Music Card
          </button>
        </div>
      </div>
    </>
  );
};

export default CreateItem;
