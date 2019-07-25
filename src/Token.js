import React from 'react';
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
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
    },
    modules: {
        marginTop: 50
    }
}));


export function EtherscanLink({ prefix, address }) {
    return <Link href={`${prefix}/${address}`} target="_blank" rel="noreferrer">{address}</Link>;
}

export function Row({label, value}) {
    return (
        <TableRow>
            <TableCell style={{minWidth: 180}}>
                <Typography variant="button">{label}</Typography>
            </TableCell>
            <TableCell>{value}</TableCell>
        </TableRow>
    );
}

function _bool(val) {
    return val ? 'true' : 'false';
}

function Module({etherscanUrl, moduleAddress, moduleName, factoryAddress, label, isArchived, moduleTypes}) {
  return (
    <TableRow>
        <TableCell>
            <Typography variant="button">{moduleTypes}</Typography>
        </TableCell>
        <TableCell>{moduleName}</TableCell>
        <TableCell>{label}</TableCell>
        <TableCell>{_bool(isArchived)}</TableCell>
        <TableCell><EtherscanLink address={moduleAddress} prefix={etherscanUrl}/></TableCell>
    </TableRow>);
}

function Modules({etherscanUrl, modulesDetails}) {
    const classes = useStyles();
    return (
        <div className={classes.modules}>
            <Typography align="left" variant="h6" gutterBottom>{"Attached modules"}</Typography>
            <Table className={classes.table} size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>Type</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Label</TableCell>
                        <TableCell>Archived</TableCell>
                        <TableCell>Address</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {modulesDetails.map(module => <Module key={module.moduleAddress} etherscanUrl={etherscanUrl} {...module} /> )}
                </TableBody>
            </Table>
        </div>
    )
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
    modulesDetails,
    etherscanUrl
 }) {
    const classes = useStyles();
    return (
        <div className={classes.root}>
            <Typography align="left" variant="h5" gutterBottom>{name}</Typography>
            <Table className={classes.table} size="small">
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
            <Modules etherscanUrl={etherscanUrl} modulesDetails={modulesDetails} />
        </div>
    );        
}