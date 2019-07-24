import securityToken2ABI from './abis/SecurityToken-2.json';
import securityToken3ABI from './abis/SecurityToken-3.json';
import { zero_address } from './constants';

export async function fetchInfo(web3, str, ticker) {
    let calls = [];
    let batch = [];
    let tokenAddress = await str.methods.getSecurityTokenAddress(ticker).call();

    if (tokenAddress === zero_address) {
        throw new Error('Symbol does not exist') 
    }

    let token = new web3.eth.Contract(securityToken3ABI, tokenAddress);
    const version = await token.methods.getVersion().call();
    batch.push(new web3.BatchRequest());

    // @TODO handle even older tokens
    if (version[0] === '2') {
        token = new web3.eth.Contract(securityToken2ABI, tokenAddress);
        calls.push(token.methods.owner().call);
        calls.push(token.methods.name().call);
        calls.push(token.methods.getVersion().call);
        calls.push(token.methods.tokenDetails().call);
        calls.push(token.methods.symbol().call);
        calls.push(token.methods.granularity().call);
        calls.push(token.methods.totalSupply().call);
        calls.push(token.methods.transfersFrozen().call);
        calls.push(token.methods.mintingFrozen().call);
        calls.push(token.methods.controllerDisabled().call);
        calls.push(token.methods.controller().call);
        calls.push(token.methods.getInvestorCount().call);
        calls.push(token.methods.currentCheckpointId().call);
        calls.push(token.methods.getModulesByType(1).call);
        calls.push(token.methods.getModulesByType(2).call);
        calls.push(token.methods.getModulesByType(3).call);
        calls.push(token.methods.getModulesByType(4).call);
        calls.push(token.methods.getModulesByType(5).call);
    }
    else {
        let token = new web3.eth.Contract(securityToken3ABI, tokenAddress);
        calls.push(token.methods.owner().call);
        calls.push(token.methods.name().call);
        calls.push(token.methods.getVersion().call);
        calls.push(token.methods.tokenDetails().call);
        calls.push(token.methods.symbol().call);
        calls.push(token.methods.granularity().call);
        calls.push(token.methods.totalSupply().call);
        calls.push(token.methods.transfersFrozen().call);
        calls.push(token.methods.isIssuable().call);
        calls.push(token.methods.controllerDisabled().call);
        calls.push(token.methods.controller().call);
        calls.push(token.methods.getInvestorCount().call);
        calls.push(token.methods.currentCheckpointId().call);
        calls.push(token.methods.getModulesByType(1).call);
        calls.push(token.methods.getModulesByType(2).call);
        calls.push(token.methods.getModulesByType(3).call);
        calls.push(token.methods.getModulesByType(4).call);
        calls.push(token.methods.getModulesByType(5).call);
        calls.push(token.methods.getModulesByType(6).call);
        calls.push(token.methods.getModulesByType(7).call);
        calls.push(token.methods.getModulesByType(8).call);
        calls.push(token.methods.getModulesByType(9).call);
    }
   

    let promises = calls.map(call => {
        return new Promise((res, rej) => {
            let req = call.request((err, data) => {
                if(err) rej(err);
                else res(data)
            });
            batch[batch.length - 1].add(req);
        })
    })
    batch[batch.length - 1].execute();
    const result = await Promise.all(promises);

    // @see https://github.com/PolymathNetwork/polymath-core/blob/dev-3.1.0/contracts/tokens/SecurityTokenStorage.sol#L11
    // PERMISSION_KEY = 1;
    // TRANSFER_KEY = 2;
    // MINT_KEY = 3;
    // CHECKPOINT_KEY = 4;
    // BURN_KEY = 5;
    // DATA_KEY = 6;
    // WALLET_KEY = 7;

    let {
        0: owner,
        1: name,
        2: versionArray,
        3: tokenDetails,
        4: symbol,
        5: granularity,
        6: totalSupply,
        7: transfersFrozen,
        8: isIssuable,
        9: controllerDisabled,
        10: controller,
        11: getInvestorCount,
        12: currentCheckpointId,
        13: permission,
        14: transfer,
        15: sto,
        16: checkpoint,
        17: burn,
        18: data,
        19: wallet
    } = result;

    data = data ? data : [];
    wallet = wallet ? wallet : [];
    const props = {      
        owner,
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
        modules: {
            permission,
            transfer,
            sto,
            checkpoint,
            burn,
            data,
            wallet
        }
    };
    return props;
}