const securityToken2ABI = require('./abis/SecurityToken-2.json');
const securityToken3ABI = require('./abis/SecurityToken-3.json');

export async function fetchInfo(web3, str, ticker) {
    let calls = [];
    let batch = [];
    const tokenAddress = await  str.methods.getSecurityTokenAddress(ticker).call();
    console.log('tokenAddress', tokenAddress);

    let token = new web3.eth.Contract(securityToken3ABI, tokenAddress);
    const version = await token.methods.getVersion().call();
    batch.push(new web3.BatchRequest());

    console.log(version[0])

    if (version[0] === 2) {
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

    const {
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
        13: permissionModules,
        14: transferModules,
        15: stoModules,
        16: checkpointModules,
        17: burnModules,
        18: dataModules,
        19: walletModules
    } = result;

    return {      
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
        permissionModules,
        transferModules,
        stoModules,
        checkpointModules,
        burnModules,
        dataModules,
        walletModules
    }
}