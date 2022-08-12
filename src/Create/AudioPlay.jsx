/** @format */

import React, { useState, useEffect } from "react";
import Web3 from "web3";
import Web3Modal, { providers } from "web3modal";

let a;
let plays = 0;
const likeCount = [];
const AudioPlay = () => {
  const [buttonName, setButtonName] = useState("Play");
  const [audio, setAudio] = useState();
  const [web3Enabled, setWeb3Enabled] = useState(false);
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    if (a) {
      a.pause();
      a = null;
      setButtonName("Play");
    }

    if (audio) {
      a = new Audio(audio);
      a.onended = () => {
        setButtonName("Play");
        plays++;
      };
    }
  }, [audio]);

  //handling the play and pause button
  const handleClick = () => {
    if (buttonName === "Play") {
      a.play();
      setButtonName("Pause");
    } else {
      a.pause();
      setButtonName("Play");
    }
    console.log(plays);
  };

  const addFile = (e) => {
    //selecting the input files and making it an audio file
    if (e.target.files[0]) {
      setAudio(URL.createObjectURL(e.target.files[0]));
    }
  };

  // let web3 : Web3 = new Web3()
  const checkEnabled = async () => {
    //checking if metamask has been installed in the pc
    const web3 = new Web3(window.ethereum);
    if (typeof window.ethereum !== "underfined") {
      console.log("installed");
      //instantiating web3 provider
      try {
        const web3Modal = new Web3Modal();
        const connection = await web3Modal.connect();

        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });
        if (accounts.length) {
          let accounts = await web3.eth.getAccounts();
          let balance = await web3.eth.getBalance(accounts[0]);
          if ((balance = 0)) {
            console.log("Please purchase more coin");
          }
          console.log(
            `You're connected to: ${accounts[0]} and the balance${balance}`
          );
        } else {
          const web3Modal = new Web3Modal();
          const connection = await web3Modal.connect();
          console.log("Metamask is not connected");
        }

        // let accounts = await Web3.eth.getAccounts();
        console.log(accounts[0]);
        //request the account access
        // if (await window.ethereum.enabled()) {
        //   // return true;
        //   console.log("connected");
        // } else {
        //   console.log("not-connected");
        // }
      } catch (e) {
        //access denied
        return false;
      }
    }
    return false;
  };

  // const favorites = async () => {
  //   if (await !checkEnabled()) {
  //     alert("Please install Metamask to use this dApp");
  //   }

  //   setWeb3Enabled(true);

  //   //getting the accounts
  //   let acc = await Web3.eth.getAccounts();

  //   const newAccounts = await Promise.all(
  //     acc.map(async (address = string) => {
  //       const balance = await web3.eth.getBalance(address);
  //       const tokenBalances = await Promise.all(
  //         tokenAddresses.map(async (token) => {
  //           const tokenInst = new web3.eth.Contract(tokenABI, token.address);
  //           const balance = await tokenInst.methods.balanceOf(address).call();

  //           return {
  //             token: token.token,
  //             balance,
  //           };
  //         })
  //       );
  //       return {
  //         address,
  //         balance: web3.utils.fromWei(balance, "wei"),
  //         tokens: tokenBalances,
  //       };
  //     })
  //   );
  //   setAccounts(newAccounts);
  //   //liking reduces the amount in the balance
  //   //to reduce the balance, we've to access the owners balance
  //   // deduct a % from it
  //   //the amount is burnt
  //   //liking creates a favourites list that can be played
  // };
  const { ethereum } = window;
  const checkConnection = () => {
    if (accounts && accounts.length) {
      console.log("Connected");
    } else {
      console.log("not Connected");
    }
  };
  return (
    <>
      <button onClick={handleClick}>{buttonName}</button>
      <input type="file" onChange={addFile} />
      <p>{plays}</p>
      <button onClick={checkEnabled}>Like</button>
      <button onClick={checkConnection}>Check Connection</button>
    </>
  );
};

export default AudioPlay;
