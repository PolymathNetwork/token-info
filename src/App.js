import React from 'react';
import Web3 from 'web3';
import { fetchInfo } from './ti';
import Token from './Token';
import STRAbi from './abis/SecurityTokenRegistry.json'
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {    
      web3: undefined,
      str: undefined,
      ticker: '',
      tokenInfo: undefined
    };
  }
  
  componentDidMount = async () => {
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
      this.setState({
        web3, str
      })

      
    }
  }

  changeHandler = (event) => {
    this.setState({ [event.target.name] : event.target.value });
  }

  submitHandler = async () => {
    const tokenInfo = await fetchInfo(this.state.web3, this.state.str, this.state.ticker);
    this.setState({ tokenInfo })
    console.log(tokenInfo)
    // this.str
  }

  render = () => {
    return (
      <div className="App">
        <header className="App-header">
          <input 
            type="text"
            name="ticker"
            value={this.state.ticker}
            onChange={this.changeHandler} />
          <button onClick={this.submitHandler}>Submit</button>
          { this.state.tokenInfo && <Token {...this.state.tokenInfo} />}
        </header>
      </div>
    );
  }
}

export default App;
