import securityToken2ABI from './abis/SecurityToken2.json';
import securityToken3ABI from './abis/SecurityToken3.json';
import moduleABI from './abis/Module.json';
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
        calls.push(token.methods.getTreasuryWallet().call);
        calls.push(token.methods.dataStore().call);
        calls.push(token.methods.getAllDocuments().call);
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
        20: wallet,
        21: treasuryWallet,
        22: dataStore,
        23: documents
    } = result;

    /////////////////////////////////////////
    // Post-processing
    /////////////////////////////////////////

    documents = documents ? documents.map(doc => web3.utils.hexToUtf8(doc)) : null;
    totalSupply = web3.utils.fromWei(totalSupply);

    /////////////////////////////////////////
    // Backward compatibility
    /////////////////////////////////////////

     if (version[0] === '2') {
        data = data ? data : [];
        wallet = wallet ? wallet : [];
        isIssuable = !isIssuable;
        treasuryWallet = null;
        dataStore = null;
        documents = null;
    }

    /////////////////////////////////////////
    // Modules
    /////////////////////////////////////////

    const modulesMap = [
        '',
        'permission',
        'transfer',
        'sto',
        'checkpoint',
        'burn',
        'data',
        'wallet'
    ];

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
            const module = new web3.eth.Contract(moduleABI, moduleAddress);
            const paused = await module.methods.paused().call();

            let moduleDetails = await token.methods.getModule(moduleAddress).call();
            moduleDetails.paused = paused;
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
    // Remove duplicate
    for (const item of modulesDetails) {
        if(!map.has(item.moduleAddress)){
            map.set(item.moduleAddress, true); 
            uniqueModules.push(item);
        }
    }

    /////////////////////////////////////////
    // Prep props
    /////////////////////////////////////////

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
        treasuryWallet,
        dataStore,
        documents,
        modulesDetails: uniqueModules
    };
    return props;
}