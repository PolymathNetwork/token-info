import React from 'react';
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';

import { zero_address } from './constants'

const capitalize = (s) => {
    if (typeof s !== 'string') return ''
    return s.charAt(0).toUpperCase() + s.slice(1)
}

const useStyles = makeStyles(theme => ({
    link: {
        margin: theme.spacing(1),
    },
    tableWrapper: {
        backgroundColor: '#EBF0F7',
        marginLeft: 30,
        marginRight: 30,
        marginBottom: 30,
        padding: 10,
        borderRadius: 5
    },
    table: {
        padding: 30,
        maxWidth: 500,
        width: '100%',
        backgroundColor: 'inherit',
        borderRadius: 20
    },
    modules: {
        marginTop: 30,
        marginBottom: 50
    }
}));


export function EtherscanLink({ prefix, address }) {
    return <Link href={`${prefix}/${address}`} target="_blank" rel="noreferrer">{address}</Link>;
}

export function Row({label, value}) {
    return (
        <TableRow>
            <TableCell 
            style={{minWidth: 140, borderBottom: 0}}
            >
                <Typography style={{fontWeight: 500}} color="textSecondary">{label}</Typography>
            </TableCell>
            <TableCell style={{borderBottom: 0, fontWeight: 500}}>{value}</TableCell>
        </TableRow>
    );
}

function _bool(val) {
    return val ? 'true' : 'false';
}

function Module({etherscanUrl, moduleAddress, moduleName, factoryAddress, paused, label, isArchived, moduleTypes}) {
    if (label) {
        moduleName = `${moduleName (label)}`;
    }

    return (
    <TableRow>
        <TableCell style={{borderBottom: 0}}>
            <Typography style={{}} >{capitalize(moduleTypes)}</Typography>
        </TableCell>
        <TableCell style={{borderBottom: 0, fontWeight: 500}}>{moduleName}</TableCell>
        <TableCell style={{borderBottom: 0, fontWeight: 500}}>{_bool(isArchived)}</TableCell>
        <TableCell style={{borderBottom: 0, fontWeight: 500}}>{_bool(paused)}</TableCell>
        <TableCell style={{borderBottom: 0, fontWeight: 500}}><EtherscanLink address={moduleAddress} prefix={etherscanUrl}/></TableCell>
    </TableRow>);
}

function Modules({etherscanUrl, modulesDetails}) {
    const classes = useStyles();
    return (
        <Paper className={classes.modules} style={{height: '100%', overflow: 'auto'}} elevation={10}>
            <Box pl={4} pt={3} pb={3}>
                <Typography align="left" variant="h5">{"Attached modules"}</Typography>
            </Box>
            <Box className={classes.tableWrapper}>
                <Table className={classes.table} size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell style={{borderBottom: 0}}>Type</TableCell>
                            <TableCell style={{borderBottom: 0}}>Name (label?)</TableCell>
                            <TableCell style={{borderBottom: 0}}>Archived</TableCell>
                            <TableCell style={{borderBottom: 0}}>Paused</TableCell>
                            <TableCell style={{borderBottom: 0}}>Address</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {modulesDetails.map(module => <Module key={module.moduleAddress} etherscanUrl={etherscanUrl} {...module} /> )}
                    </TableBody>
                </Table>
            </Box>
        </Paper>
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
    treasuryWallet,
    dataStore,
    documents,
    modulesDetails,
    etherscanUrl
 }) {
    const classes = useStyles();
    return (
        <div className={classes.root}>
            <Paper padding={50} style={{height: '100%', overflow: 'auto'}} elevation={10}>
                <Box pl={4} pt={3} pb={3}>
                    <Typography align="left" variant="h5">{name}</Typography>
                </Box>
                <Box className={classes.tableWrapper}>
                    <Table className={classes.table} size="small">
                        <TableBody>
                            <Row label='Symbol' value={symbol}/>
                            <Row label='Owner' value={<EtherscanLink address={owner} prefix={etherscanUrl}/>}/>
                            <Row label='Address' value={<EtherscanLink address={address} prefix={etherscanUrl}/>}/>
                            <Row label='Treasury wallet' value={treasuryWallet ?
                                <EtherscanLink address={treasuryWallet} prefix={etherscanUrl}/> : 'N/A'
                            }/>
                            <Row label='Data store' value={dataStore ?
                                <EtherscanLink address={dataStore} prefix={etherscanUrl}/> : 'N/A'
                            }/>
                            <Row label='Documents' value={documents ?
                                documents.join(', ') : 'N/A'}/>
                            <Row label='Version' value={versionArray.join('.')}/>
                            <Row label='Token edtails' value={tokenDetails}/>
                            <Row label='Divisible' value={_bool(granularity === '1')}/>
                            <Row label='Total Supply' value={totalSupply}/>
                            <Row label='Decimals' value={decimals}/>
                            <Row label='Transfers frozen' value={_bool(transfersFrozen)}/>
                            <Row label='Issuable'value={_bool(isIssuable)}/>
                            <Row label='Controller disabled' value={_bool(controllerDisabled)}/>
                            <Row label='Controller' value={controller === zero_address ? '' : controller}/>
                            <Row label='Investor count' value={getInvestorCount}/>
                            <Row label='Current checkpoint' value={currentCheckpointId}/>
                        </TableBody>
                    </Table>
                </Box>
            </Paper>
            <Modules etherscanUrl={etherscanUrl} modulesDetails={modulesDetails} />
        </div>
    );        
}