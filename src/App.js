import React, { useState, useEffect } from 'react';
import Web3 from 'web3';


import { ReactComponent as Logo } from './polymath.svg';

import { makeStyles } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import { createMuiTheme } from "@material-ui/core";

import { Button, Box, Typography, CircularProgress, TextField, AppBar, Container }
  from '@material-ui/core';


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
  }
  
});

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    height: '100%',
    minHeight: '100%',
    paddingBottom: 50,
    paddingTop: 50,
    borderBottom: 3
  },
  container: {
    height: '100%'
  },
  form: {
    width: 300,
    paddingRight: 30
  },
  formItem: {
    paddingBottom: 15
  },
  topBar: {
    background: 'transparent',
    boxShadow: 'none'
  },
  footer: {
    position: 'absolute',
    top: 'auto',
    bottom: 0,
    color: 'inherit',
    background: 'transparent',
    boxShadow: 'none',
    width: '100%'
  }
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

    const pattern = RegExp('^[a-zA-Z0-9_-]*$');
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
      <AppBar className={classes.topBar} position="static">
        <Box paddingLeft={14} paddingRight={14} paddingTop={5} paddingBottom={5}>
          <Logo />
        </Box>
      </AppBar>
      <Container fixed>
        <Box display="flex" flexDirection="row" className={classes.root}>
          <Box class={classes.form}>
            <form onSubmit={submitHandler}>
              <Box class={classes.formItem}>
                <Typography component="h4" variant="h4">
                Security Token Information 
                </Typography>
              </Box>
              <Box class={classes.formItem}>
                <Typography component="p" color="textSecondary">
                Retrieve information about your security token by typing its symbol below.
                </Typography>
              </Box>
              <Box class={classes.formItem}>
                <TextField
                  label="Symbol"
                  fullWidth
                  // // margin="normal"
                  value={ticker}
                  // style={{ backgroundColor: '#FFFFFF' }}
                  placeholder="Enter your token symbol"
                  inputProps={{
                    maxLength: 10,
                  }}
                  disabled={!network}
                  onChange={changeHandler}
                  label="Symbol"
                  className={classes.textField}
                  margin="normal"
                />
              </Box>

              <Box class={classes.formItem}>  
                <Button
                  fullWidth
                  size="large"
                  variant="contained"
                  color="primary"
                  disabled={loading || !ticker || !network}
                  onClick={submitHandler}
                >
                  Check
                </Button>
              </Box>
            </form>
          </Box>

          <Box flexGrow={1}>  
            { loading &&  <CircularProgress className={classes.progress} /> }
            { error && <Typography color="error">{error}</Typography>}
            { tokenInfo && 
              <Token {...tokenInfo} etherscanUrl={etherscanUrl} />
            }
          </Box>
        </Box>
      </Container>
      <footer  className={classes.footer}>
        <Box paddingLeft={14} paddingRight={14} paddingTop={3} paddingBottom={3}>
          <Typography color="textSecondary" component="p">
            2019 © Polymath
          </Typography>
        </Box>
      </footer>
    </ThemeProvider>
  );
}

export default App;
