import React from 'react';

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
    permissionModules,
    transferModules,
    stoModules,
    checkpointModules,
    burnModules }) {
    return (
        <table>
            <tbody>
                <tr>
                    <td>name</td>
                    <td>{name}</td>
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
                    <td>{totalSupply}</td>
                </tr>
                <tr>
                    <td>Transfers Frozen?</td>
                    <td>{transfersFrozen}</td>
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
                    <td>STOs</td>
                    <td>{stoModules.join(', ') || 'None'}</td>
                </tr>
                <tr>
                    <td>Permission modules</td>
                    <td>{permissionModules.join(', ') || 'None'}</td>
                </tr>
                <tr>
                    <td>Transfer modules</td>
                    <td>{transferModules.join(', ') || 'None'}</td>
                </tr>
                <tr>
                    <td>Dividend modules</td>
                    <td>{checkpointModules.join(', ') || 'None'}</td>
                </tr>
                <tr>
                    <td>Burn modules</td>
                    <td>{burnModules.join(', ') || 'None'}</td>
                </tr>
            </tbody>
        </table>
    );        
}