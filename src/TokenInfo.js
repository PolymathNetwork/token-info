// import React, { useContext } from 'react';
// import MetaMaskContext from "./MetaMaskContext";
// import getTokens from './ti';

// export default class TokenInfo extends React.Component {
//     async componentDidMount() {
//         const ret = useContext(
//             MetaMaskContext,
//         );
//         console.log(ret)
//         const { web3, accounts, error, awaiting } = ret;
    
//         if (web3 && accounts && !error && !awaiting) {
//             let securityTokenRegistryAddress, urlDomain;
//             const chainId = await web3.eth.net.getId()
//             if (chainId == 1) {  //Mainnet
//                 securityTokenRegistryAddress = "0x240f9f86b1465bf1b8eb29bc88cbf65573dfdd97";
//                 urlDomain = 'api';
//             } else if (chainId == 42) {  //Kovan
//                 securityTokenRegistryAddress = "0x91110c2f67e2881a8540417be9eadf5bc9f2f248";
//                 urlDomain = 'api-kovan';
//             } else {
//                 console.log('Invalid network');
//                 return;
//             }
//             await getTokens(web3, securityTokenRegistryAddress, urlDomain);
//         }
//     }
//     render() {
//         return <div>testing</div>;
//     }
// }
  