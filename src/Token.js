import React from 'react';
import Web3 from 'web3';

export function EtherscanLink({ prefix, address }) {
    return <div><a href={`${prefix}/${address}`}>{address}</a></div>;
}

export default function Token({ owner,
    name,
    versionArray,
    tokenDetails,
    symbol,
    granularity,
    totalSupply,
    transfersFrozen,
    isIssuable,
    controllerDisabled,
    controller,
    getInvestorCount,
    currentCheckpointId,
    modules,
    etherscanUrl
 }) {
    let m = Object.assign({}, modules);
    totalSupply = Web3.utils.fromWei(totalSupply);
    Object.keys(m).forEach((key) => {
        m[key] = m[key].map((address) => {
            return <EtherscanLink key={key} prefix={etherscanUrl} address={address} />
        });
    })

    return (
        <table>
            <tbody>
                <tr>
                    <td>name</td>
                    <td>{name}</td>
                </tr>
                <tr>
                    <td>owner</td>
                    <td>{owner}</td>
                </tr>
                <tr>
                    <td>Version</td>
                    <td>{versionArray.join('.')}</td>
                </tr>
                <tr>
                    <td>Token Details</td>
                    <td>{tokenDetails}</td>
                </tr>
                <tr>
                    <td>Symbol</td>
                    <td>{symbol}</td>
                </tr>
                <tr>
                    <td>Granularity</td>
                    <td>{granularity}</td>
                </tr>
                <tr>
                    <td>Total Supply</td>
                    <td>{totalSupply} {symbol}</td>
                </tr>
                <tr>
                    <td>Transfers Frozen?</td>
                    <td>{transfersFrozen? 'True' : 'False'}</td>
                </tr>
                <tr>
                    <td>Issuable?</td>
                    <td>{isIssuable ? 'True' : 'False'}</td>
                </tr>
                <tr>
                    <td>Controller Disabled?</td>
                    <td>{controllerDisabled ? 'True' : 'False'}</td>
                </tr>
                <tr>
                    <td>Controller</td>
                    <td>{controller === '0x0000000000000000000000000000000000000000' ? 'None' : controller}</td>
                </tr>
                <tr>
                    <td>Investor Count</td>
                    <td>{getInvestorCount}</td>
                </tr>
                <tr>
                    <td>Current Checkpoint Id</td>
                    <td>{currentCheckpointId}</td>
                </tr>

                <tr>
                    <td>Permission modules</td>
                    <td>{m.permission}</td>
                </tr>
                <tr>
                    <td>Transfer modules</td>
                    <td>{m.transfer}</td>
                </tr>
                <tr>
                    <td>STOs</td>
                    <td>{m.sto}</td>
                </tr>
                <tr>
                    <td>Dividend modules</td>
                    <td>{m.checkpoint}</td>
                </tr>
                <tr>
                    <td>Burn modules</td>
                    <td>{m.burn}</td>
                </tr>
                <tr>
                    <td>Data Storage modules</td>
                    <td>{m.data}</td>
                </tr>
                <tr>
                    <td>Wallet modules</td>
                    <td>{m.wallet}</td>
                </tr>
            </tbody>
        </table>
    );        
}