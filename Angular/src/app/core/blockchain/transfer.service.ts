import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import Web3 from "web3";
const tokenAbi = require('../../../../../Truffle/build/contracts/FuelPurchase.json');

@Injectable({
  providedIn: 'root'
})
export class TransferService {

  account: any = null;
  private web3: any;
  private provider: any;
  private enable: any;
  list: any;

  loading: false;
  contracts: {};

  constructor(private snackBar: MatSnackBar) {
    // this.loadWeb3();
  }

  async loadWeb3() {
    // if (typeof this.web3 !== 'undefined') {
    //   this.provider = this.web3.currentProvider; console.log(this.web3)
    //   this.web3 = new Web3(this.web3.currentProvider);
    // } else {
    //   window.alert("Please connect to Metamask.")
    // }
    // Modern dapp browsers...
    if (window['ethereum']) {
      let ethereum = window['ethereum'];
      this.web3 = new Web3(ethereum);
      this.provider = this.web3.currentProvider;

      // if (typeof this.web3 !== 'undefined') {
      //   this.web3 = new Web3(this.provider)
      // } else {
      //   window.alert("Please connect to Metamask.")
      // }

      try {
        const accounts = await ethereum.send('eth_requestAccounts');
        this.account = accounts.result[0]; console.log(this.account)
        this.web3.eth.defaultAccount = new String(this.account); console.log(this.web3)
        // Accounts now exposed, use them
        ethereum.send('eth_sendTransaction', { from: accounts[0], /* ... */ })
        // // Request account access if needed
        // await ethereum.enable()
        // // Acccounts now exposed
        // web3.eth.sendAsync({/* ... */ })
      } catch (error) {
        // User denied account access...
      }
    }
    // Non-dapp browsers...
    else {
      this.snackBar.open('Navegador no habilitado para Ethereum, considera instalar MetaMask', "Cerrar", {
        duration: 5000,
      });
    }
  }

  async loadContract() {
    const contract = require('@truffle/contract');
    const transferContract = contract(tokenAbi);
    transferContract.setProvider(this.provider);
    this.list = await transferContract.deployed();

    return this.list;
  }
}
