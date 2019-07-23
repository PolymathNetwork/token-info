import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import { fetchInfo } from './ti';
import Token from './Token';
import STRAbi from './abis/SecurityTokenRegistry.json';
import './App.css';
import { Button } from 'polymath-ui';

function App() {
  const [loading, setLoading] = useState(false);
  const [web3, setWeb3] = useState(undefined);
  const [str, setStr] = useState(undefined);
  const [ticker, setTicker] = useState('');
  const [errors, setErrors] = useState([]);
  const [tokenInfo, setTokenInfo] = useState(undefined);
  
  useEffect(() => {
    async function initWeb3() {
      let web3
      if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        try { 
          await window.ethereum.enable()
        } catch(e) {
          console.error('User has denied account access to DApp...')
        }
      }
      else if (window.web3) {
        web3 = new Web3(web3.currentProvider);
        console.log('else if (window.web3)')
      }
      else {
        alert('You have to install MetaMask !');
      }

      /////
      
      if (web3) {
        let securityTokenRegistryAddress, urlDomain;
        let str
        const chainId = await web3.eth.net.getId()
        console.log(chainId)
        if (chainId == 1) {  //Mainnet
            securityTokenRegistryAddress = "0x240f9f86b1465bf1b8eb29bc88cbf65573dfdd97";
            str = new web3.eth.Contract(STRAbi, securityTokenRegistryAddress);
            urlDomain = 'api';
        } else if (chainId == 42) {  //Kovan
            securityTokenRegistryAddress = "0x91110c2f67e2881a8540417be9eadf5bc9f2f248";
            str = new web3.eth.Contract(STRAbi, securityTokenRegistryAddress);
            urlDomain = 'api-kovan';
        } else {
            window.alert('Invalid network');
            return;
        }

        setWeb3(web3);
        setStr(str);

      }
    }

    initWeb3();
  }, []);

  const changeHandler = (event) => {
    setTicker(event.target.value);
  }

  const submitHandler = async () => {
    setLoading(true);
    try {
      const tokenInfo = await fetchInfo(web3, str, ticker);
      console.log('Fetched tokenInfo', tokenInfo);
      setTokenInfo(tokenInfo);
      setErrors([]);
      console.log(tokenInfo)
    } catch (error) {
      setTokenInfo(undefined);
      setErrors([error.message]);
    }
    setLoading(false);
  }

  return (
    <div className="App">
      <header className="App-header">
        <input 
          type="text"
          name="ticker"
          value={ticker}
          onChange={changeHandler} />
        <Button onClick={submitHandler}>Submit</Button>
        { tokenInfo && <Token {...tokenInfo} />}
        { loading &&  <span>Loading...</span> }
        {/* @TODO display all errors */}
        { errors && <div>{errors[0]}</div>}
      </header>
    </div>
  );
}

export default App;
