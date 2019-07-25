import React from 'react';
import Web3 from 'web3';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

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
    const classes = useStyles();
    return <Link href={`${prefix}/${address}`}>{address}</Link>;
}

export function Row({label, value}) {
    return <TableRow><TableCell>{label}</TableCell><TableCell>{value}</TableCell></TableRow>
}

export function Label({children}) {
    return <TableCell><Typography variant="button" display="block">{children}</Typography></TableCell>
}

export function Value({children, monospace}) {
    return <TableCell><Box fontFamily={monospace ? "Monospace" : "fontFamily"}>{children}</Box></TableCell>
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
                    <Row label='owner' value={<EtherscanLink address={owner} prefix={etherscanUrl}/>}/>
                    <Row label='Version' value={versionArray.join('.')}/>
                    <Row label='Token Details' value={tokenDetails}/>
                    <Row label='Symbol' value={symbol}/>
                    <Row label='Granularity' value={granularity}/>
                    <Row label='Total Supply' value={totalSupply}/>
                    <Row label='Transfers Frozen?' value={transfersFrozen? 'True' : 'False'}/>
                    <Row label='Issuable?'value={isIssuable ? 'True' : 'False'}/>
                    <Row label='Controller Disabled?' value={controllerDisabled ? 'True' : 'False'}/>
                    <Row label='Controller' value={controller === '0x0000000000000000000000000000000000000000' ? 'None' : controller}/>
                    <Row label='Investor Count' value={getInvestorCount}/>
                    <Row label='Current Checkpoint Id' value={currentCheckpointId}/>
                </TableBody>
            </Table>
            <Typography align="left" variant="h6" gutterBottom>{"Attached modules"}</Typography>
            <Table className="table" size="small">
                <TableBody>
                    <Row label='Permission modules' value={m.permission}/>
                    <Row label='Transfer modules' value={m.transfer}/>
                    <Row label='STOs' value={m.sto}/>
                    <Row label='Dividend modules' value={m.checkpoint}/>
                    <Row label='Burn modules' value={m.burn}/>
                    <Row label='Data Storage modules' value={m.data}/>
                    <Row label='Wallet modules' value={m.wallet}/>
                </TableBody>
            </Table>
        </div>
    );        
}