import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import { fetchInfo } from './ti';
import Token from './Token';
import STRAbi from './abis/SecurityTokenRegistry.json';
import './App.css';
import { STR_MAINNET, STR_KOVAN } from './constants';

function App() {
  const [loading, setLoading] = useState(false);
  const [web3, setWeb3] = useState();
  const [str, setStr] = useState();
  const [ticker, setTicker] = useState('');
  const [errors, setErrors] = useState([]);
  const [tokenInfo, setTokenInfo] = useState();
  const [network, setNetwork] = useState('');
  const [etherscanUrl, setEtherscanUrl] = useState('');

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
      }
      else {
        setErrors(['You have to install MetaMask !']);
      }

      /////
      
      let str;
      if (web3) {
        const chainId = await web3.eth.net.getId()
        if (chainId === 1) {
            str = new web3.eth.Contract(STRAbi, STR_MAINNET);
            setStr(str);
            setNetwork('mainnet');
            setEtherscanUrl('https://etherscan.io/address');
        } else if (chainId === 42) {
            str = new web3.eth.Contract(STRAbi, STR_KOVAN);
            setStr(str)
            setNetwork('kovan');
            setEtherscanUrl('https://kovan.etherscan.io/address')
        } else {
            setErrors(["Network that you chose is not supported.\n" +
            "Open MetaMask and choose Mainnet or Kovan."]);
            setStr();
            setNetwork();
            setEtherscanUrl();
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

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    setTokenInfo(undefined);
    try {
      const tokenInfo = await fetchInfo(web3, str, ticker);
      setTokenInfo(tokenInfo);
      setErrors([]);
    } catch (error) {
      setErrors([error.message]);
    }
    setLoading(false);
  }

  return (
    <div className="App">
      <header className="App-header">
        <form onSubmit={submitHandler}>
          <input 
            type="text"
            name="ticker"
            value={ticker}
            disabled={!network}
            onChange={changeHandler} />
          <input type="submit" value="Submit" disabled={!ticker || !network} />
          { tokenInfo && <Token {...tokenInfo} etherscanUrl={etherscanUrl} />}
          { loading &&  <span>Loading...</span> }
          {/* @TODO display all errors */}
          { errors && <div>{errors[0]}</div>}
        </form>
      </header>
    </div>
  );
}

export default App;
