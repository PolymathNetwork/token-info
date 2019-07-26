import securityToken2ABI from './abis/SecurityToken2.json';
import securityToken3ABI from './abis/SecurityToken3.json';
import { zero_address } from './constants';

export async function fetchInfo(web3, str, ticker) {
    let calls = [];
    let batch = [];
    let tokenAddress = await str.methods.getSecurityTokenAddress(ticker).call();

    if (tokenAddress === zero_address) {
        throw new Error('Symbol not found') 
    }

    let token = new web3.eth.Contract(securityToken3ABI, tokenAddress);
    const version = await token.methods.getVersion().call();
    batch.push(new web3.BatchRequest());

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
        calls.push(token.methods.decimals().call);
        calls.push(token.methods.getModulesByType(1).call);
        calls.push(token.methods.getModulesByType(2).call);
        calls.push(token.methods.getModulesByType(3).call);
        calls.push(token.methods.getModulesByType(4).call);
        calls.push(token.methods.getModulesByType(5).call);
    }
    else if (version[0] === '3') {
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
        calls.push(token.methods.decimals().call);
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
    else {
        throw new Error(`Token version ${version.join('.')} is not supported.`) 
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

    const modulesMap = [
        '',
        'permission',
        'transfer',
        'sto',
        'checkpoint',
        'burn',
        'data',
        'wallet'
    ]

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
        13: decimals,
        14: permission,
        15: transfer,
        16: sto,
        17: checkpoint,
        18: burn,
        19: data,
        20: wallet
    } = result;

    data = data ? data : [];
    wallet = wallet ? wallet : [];

    const modules = [
        permission,
        transfer,
        sto,
        checkpoint,
        burn,
        data,
        wallet
    ];

    const modulesDetails = [];

    for (const moduleAdresses of modules) {
        for (const moduleAddress of moduleAdresses) {
            let moduleDetails = await token.methods.getModule(moduleAddress).call();
            moduleDetails.moduleName = web3.utils.hexToUtf8(moduleDetails.moduleName);
            moduleDetails.label = moduleDetails.label ?
                web3.utils.hexToUtf8(moduleDetails.label) :
                '';
            moduleDetails.moduleTypes = modulesMap[moduleDetails.moduleTypes[0]];
            modulesDetails.push(moduleDetails);
        }
    }

    const uniqueModules = [];
    const map = new Map();
    for (const item of modulesDetails) {
        if(!map.has(item.moduleAddress)){
            map.set(item.moduleAddress, true); 
            uniqueModules.push(item);
        }
    }

    totalSupply = web3.utils.fromWei(totalSupply);

    const props = {   
        address: tokenAddress,
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
        decimals,
        modulesDetails: uniqueModules
    };
    return props;
}