/** @format */

import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Navigation.css";
import forward from "../images/forward.svg";
import Web3Modal, { providers } from "web3modal";
import Web3 from "web3";

const Navigation = () => {
  const [isConnected, setIsConnected] = useState("Connect a Wallet");

  const walletConnect = async () => {
    // let accounts = await web3.eth.getAccounts();
    // let balance = await web3.eth.getBalance(accounts[0]);
    // console.log(accounts[0]);
    // console.log(balance);
    // if (typeof window.ethereum !== "undefined") {
    //   const web3 = new Web3(window.ethereum);
    //   try {
    //     const web3Modal = new Web3Modal();
    //     const connection = await web3Modal.connect();
    //     const accounts = await window.ethereum.request({
    //       method: "eth_accounts",
    //     });
    //     if (accounts.length) {
    //       setIsConnected(accounts[0]);
    //       // console.log(`You're connected to: ${accounts[0]}`);
    //     } else if (accounts.length === 0) {
    //       setIsConnected("Connect a Wallet");
    //       const web3Modal = new Web3Modal();
    //       const connection = await web3Modal.connect();
    //       console.log("Metamask is not connected");
    //     }
    //   } catch (e) {
    //     //access denied
    //     return false;
    //   }
    // }
    if (typeof window.ethereum !== "undefined") {
      // Instance web3 with the provided information
      const web3 = new Web3(window.ethereum);
      try {
        // Request account access
        await window.ethereum.enable();
        return true;
      } catch (e) {
        // User denied access
        return false;
      }
    }
  };
  // Runs on page load
  initialise();

  // Runs whenever the user changes account state
  window.ethereum.on("accountsChanged", async () => {
    initialise();
  });
  return (
    <>
      <nav className="navigation">
        <div className="logo">Logo</div>
        <div className="N-menu">
          <ul className="list">
            <li>
              <Link to="/createcard">Create Card</Link>
            </li>
            <li>
              <Link to="/mycards">My Cards</Link>
            </li>
            <li>
              <Link to="/dashboard">Dashboad</Link>
            </li>
            <li>
              <a href="#">About us</a>
            </li>
          </ul>
        </div>
        <div className="N-action">
          <img src={forward} alt="" />
          <div className="action-button">
            <button onClick={walletConnect}>{isConnected}</button>
            <hr />
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navigation;
