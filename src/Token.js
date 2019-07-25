import React from 'react';
import Web3 from 'web3';
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

import { zero_address } from './constants'

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
    },
    link: {
        margin: theme.spacing(1),
    },
    table: {
        width: '100%'
    }
}));


export function EtherscanLink({ prefix, address }) {
    return <Link href={`${prefix}/${address}`} target="_blank" rel="noreferrer">{address}</Link>;
}

export function Row({label, value}) {
    return (
        <TableRow>
            <TableCell style={{minWidth: 180}}>
                <Typography variant="button" display="block">{label}</Typography>
            </TableCell>
            <TableCell>{value}</TableCell>
        </TableRow>
    );
}

// export function Label({children}) {
//     return <TableCell><Typography variant="button" display="block">{children}</Typography></TableCell>
// }

// export function Value({children, monospace}) {
//     return <TableCell><Box fontFamily={monospace ? "Monospace" : "fontFamily"}>{children}</Box></TableCell>
// }

function _bool(val) {
    return val ? 'true' : 'false';
}

export default function Token({ owner,
    name,
    address,
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
    decimals,
    modules,
    etherscanUrl
 }) {
    const classes = useStyles();

    let m = Object.assign({}, modules);
    totalSupply = Web3.utils.fromWei(totalSupply);
    Object.keys(m).forEach((key) => {
        m[key] = m[key].map((address) => {
            return <EtherscanLink key={key} prefix={etherscanUrl} address={address} />
        });
    })

    return (
        <div className={classes.root}>
            <Typography align="left" variant="h5" gutterBottom>{name}</Typography>
            <Table className="table" size="small">
                <TableBody>
                    <Row label='Symbol' value={symbol}/>
                    <Row label='owner' value={<EtherscanLink address={owner} prefix={etherscanUrl}/>}/>
                    <Row label='address' value={<EtherscanLink address={address} prefix={etherscanUrl}/>}/>
                    <Row label='Version' value={versionArray.join('.')}/>
                    <Row label='Token Details' value={tokenDetails}/>
                    <Row label='divisible' value={_bool(granularity === '1')}/>
                    <Row label='Total Supply' value={totalSupply}/>
                    <Row label='Decimals' value={decimals}/>
                    <Row label='Transfers Frozen?' value={_bool(transfersFrozen)}/>
                    <Row label='Issuable?'value={_bool(isIssuable)}/>
                    <Row label='Controller Disabled?' value={_bool(controllerDisabled)}/>
                    <Row label='Controller' value={controller === zero_address ? '' : controller}/>
                    <Row label='Investor Count' value={getInvestorCount}/>
                    <Row label='Current Checkpoint Id' value={currentCheckpointId}/>
                </TableBody>
            </Table>
            <Typography align="left" variant="h6" gutterBottom>{"Attached modules"}</Typography>
            <Table className="table" size="small">
                <TableBody>
                    <Row label='Permission' value={m.permission}/>
                    <Row label='Transfer' value={m.transfer}/>
                    <Row label='STO' value={m.sto}/>
                    <Row label='Dividend' value={m.checkpoint}/>
                    <Row label='Burn' value={m.burn}/>
                    <Row label='Data Storage' value={m.data}/>
                    <Row label='Wallet' value={m.wallet}/>
                </TableBody>
            </Table>
        </div>
    );        
}