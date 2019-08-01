import React, { useState, useEffect } from 'react';
import Web3 from 'web3';


import { ReactComponent as Logo } from './polymath.svg';

import { makeStyles } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import { createMuiTheme } from "@material-ui/core";

import Button from '@material-ui/core/Button';
import { green } from '@material-ui/core/colors';
import Container from '@material-ui/core/Container';
import CircularProgress from '@material-ui/core/CircularProgress';
import TextField from '@material-ui/core/TextField';

import { fetchInfo } from './ti';
import Token from './Token';
import SecurityTokenRegistryABI from './abis/SecurityTokenRegistry.json'
import './App.css';
import { STR_MAINNET, STR_KOVAN } from './constants';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#1348E4'
    }
  },
});

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  wrapper: {
    margin: theme.spacing(1),
    position: 'relative',
  },
  buttonSuccess: {
    backgroundColor: green[500],
    '&:hover': {
      backgroundColor: green[700],
    },
  },
  fabProgress: {
    color: green[500],
    position: 'absolute',
    top: -6,
    left: -6,
    zIndex: 1,
  },
  buttonProgress: {
    color: green[500],
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
}));

function App() {
  const [loading, setLoading] = useState(false);
  const [web3, setWeb3] = useState();
  const [str, setStr] = useState();
  const [ticker, setTicker] = useState('');
  const [error, setError] = useState('');
  const [tokenInfo, setTokenInfo] = useState();
  const [network, setNetwork] = useState('');
  const [etherscanUrl, setEtherscanUrl] = useState('');

  const classes = useStyles();

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
        setError('You have to install MetaMask !');
      }

      /////
      
      let str;
      if (web3) {
        const chainId = await web3.eth.net.getId()
        if (chainId === 1) {
            str = new web3.eth.Contract(SecurityTokenRegistryABI, STR_MAINNET);
            setStr(str);
            setNetwork('mainnet');
            setEtherscanUrl('https://etherscan.io/address');
        } else if (chainId === 42) {
            str = new web3.eth.Contract(SecurityTokenRegistryABI, STR_KOVAN);
            setStr(str)
            setNetwork('kovan');
            setEtherscanUrl('https://kovan.etherscan.io/address')
        } else {
            setError("Network that you chose is not supported.\n" +
            "Open MetaMask and choose Mainnet or Kovan.");
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

  const changeHandler = event => {

    const pattern = RegExp('^[a-zA-Z0-9_]*$');
    if (pattern.test(event.target.value)) {
      setTicker(event.target.value.toUpperCase());
    }
  }

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError();
    setTokenInfo();
    try {
      const tokenInfo = await fetchInfo(web3, str, ticker);
      setTokenInfo(tokenInfo);
      setError('');
    } catch (error) {
      setError(error.message);
    }
    setLoading(false);
  }

  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <Container maxWidth="sm" className="root">
          <Logo />
          <form onSubmit={submitHandler}>
            <TextField
              value={ticker}
              style={{ margin: 8 }}
              placeholder="TICKER"
              variant='outlined'
              margin="dense"
              inputProps={{
                maxLength: 10
              }}
              disabled={!network}
              onChange={changeHandler}
            />

            <div className={classes.wrapper}>
              <Button
                variant="contained"
                color="primary"
                disabled={loading || !ticker || !network}
                onClick={submitHandler}
              >
                submit
              </Button>
            </div>

            { tokenInfo && 
              <Token {...tokenInfo} etherscanUrl={etherscanUrl} />
            }
            { loading &&  <CircularProgress className={classes.progress} /> }
            { error && <div>{error}</div>}
          </form>
        </Container>
      </div>
    </ThemeProvider>
  );
}

export default App;
