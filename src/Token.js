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

export function Label({children}) {
    return <Typography variant="button" display="block">{children}</Typography>
}

export function Value({children, monospace}) {
    return <Box fontFamily={monospace ? "Monospace" : "fontFamily"}>{children}</Box>
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
                    <TableRow>
                        <TableCell><Label>owner</Label></TableCell>
                        <TableCell>{<EtherscanLink address={owner} prefix={etherscanUrl}/>}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell><Label>Version</Label></TableCell>
                        <TableCell><Value>{versionArray.join('.')}</Value></TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell><Label>Token Details</Label></TableCell>
                        <TableCell><Value>{tokenDetails}</Value></TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell><Label>Symbol</Label></TableCell>
                        <TableCell><Value>{symbol}</Value></TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell><Label>Granularity</Label></TableCell>
                        <TableCell><Value>{granularity}</Value></TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell><Label>Total Supply</Label></TableCell>
                        <TableCell><Value>{totalSupply} {symbol}</Value></TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell><Label>Transfers Frozen?</Label></TableCell>
                        <TableCell><Value>{transfersFrozen? 'True' : 'False'}</Value></TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell><Label>Issuable?</Label></TableCell>
                        <TableCell><Value>{isIssuable ? 'True' : 'False'}</Value></TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell><Label>Controller Disabled?</Label></TableCell>
                        <TableCell><Value>{controllerDisabled ? 'True' : 'False'}</Value></TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell><Label>Controller</Label></TableCell>
                        <TableCell><Value>{controller === '0x0000000000000000000000000000000000000000' ? 'None' : controller}</Value></TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell><Label>Investor Count</Label></TableCell>
                        <TableCell><Value>{getInvestorCount}</Value></TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell><Label>Current Checkpoint Id</Label></TableCell>
                        <TableCell><Value>{currentCheckpointId}</Value></TableCell>
                    </TableRow>
                </TableBody>
            </Table>
            <Typography align="left" variant="h6" gutterBottom>{"Attached modules"}</Typography>
            <Table className="table" size="small">
                <TableBody>
                    <TableRow>
                        <TableCell><Label>Permission modules</Label></TableCell>
                        <TableCell><Value>{m.permission}</Value></TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell><Label>Transfer modules</Label></TableCell>
                        <TableCell><Value>{m.transfer}</Value></TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell><Label>STOs</Label></TableCell>
                        <TableCell><Value>{m.sto}</Value></TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell><Label>Dividend modules</Label></TableCell>
                        <TableCell><Value>{m.checkpoint}</Value></TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell><Label>Burn modules</Label></TableCell>
                        <TableCell><Value>{m.burn}</Value></TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell><Label>Data Storage modules</Label></TableCell>
                        <TableCell><Value>{m.data}</Value></TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell><Label>Wallet modules</Label></TableCell>
                        <TableCell><Value>{m.wallet}</Value></TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </div>
    );        
}