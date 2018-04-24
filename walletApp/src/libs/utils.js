/*eslint-disable */
/* jshint ignore:start */
import ecc from 'eosjs-ecc'
import AES from 'crypto-js/aes'
import CryptoJS from 'crypto-js';
import _ from 'lodash'
let util = {}
util._ = _
/**
 * 存储localStorage
 */
util.setStore = (name, content) => {
  if (!name) return
  if (typeof content !== 'string') {
    content = JSON.stringify(content)
  }
  window.localStorage.setItem(name, content)
}

/**
 * 获取localStorage
 */
util.getStore = name => {
  if (!name) return
  return window.localStorage.getItem(name)
}

/**
 * 删除localStorage
 */
util.removeStore = name => {
  if (!name) return
  window.localStorage.removeItem(name)
}
/**
 * get wallets from local storage
 */
util.get_wallets = () => {
  let wallets = localStorage.getItem('sic_wallet')
  if (!wallets) {
    wallets = []
  } else {
    wallets = JSON.parse(wallets)
  }
  return wallets
}

util.IsInArray = function (arr, val) {
  let testStr = ',' + arr.join(',') + ',';
  return testStr.indexOf(',' + val + ',') != -1;
};
/**
 * save wallets into local storage
 * @param wallets
 */
util.set_wallets = (wallets) => {
  return new Promise((resolve, reject) => {
    localStorage.setItem('sic_wallet', JSON.stringify(wallets))
    try {
      set_wallets_db(wallets)
      // set_wallet_native(wallets);
    } catch (ex) {

    } finally {
      resolve()
    }
  })
}
/**
 * 删除钱包本地存储
 * @param wallet
 */
util.del_wallet = (wallet) => {
  return new Promise((resolve, reject) => {
    let wallets = util.get_wallets()
    for (let i = 0; i < wallets.length; i++) {
      if (wallet.account === wallets[i].account) {
        wallets.splice(i, 1)
      }
    }
    return util.set_wallets(wallets).then(() => {
      resolve()
    })
  })
}
/**
 * 更新钱包
 * @param {*} wallet
 */
util.update_wallet = (wallet) => {
  return new Promise((resolve, reject) => {
    let wallets = util.get_wallets();
    let updated = 0; // eslint-disable-line
    wallets = wallets.map((w) => {
      if (w.account == wallet.account) {
        updated += 1;
        return wallet;
      }
      return w;
    });
    return util.set_wallets(wallets).then(() => {
      resolve();
    });
  });
};
/**
 * 获得免责声明
 * @returns {boolean}
 */
util.get_disclaimer_accepted = () => {
  let result = localStorage.getItem('sic_wallets_accepted');
  return !!Number(result);
};

/**
 * 设定免责声明
 * @param accepted
 */
util.set_disclaimer_accepted = (accepted) => {
  if (accepted) {
    localStorage.setItem('sic_wallets_accepted', accepted ? 1 : 0);
  } else {
    localStorage.removeItem('sic_wallets_accepted');
  }
};
/***
     * 加密
     * @param
     * data（String） => 需要加密的字符串
     * password (String) => 加密的依据
     */
util.encryption = (data, password) => {
  try {
    return AES.encrypt(data, password).toString()
  } catch (exception) {
    console.log(exception)
    return 'index.import_error'
  }
};
/**
 * 解密
 * @param
 * data（String） => 需要解密的字符串
 * password (String) => 解密的依据
 */
util.decrypt = (data, password) => {
  try {
    return CryptoJS.enc.Utf8.stringify(AES.decrypt(data, password))
  } catch (exception) {
    console.log(exception)
    return 'unlock.error.invalid_password'
  }
  // return CryptoJS.enc.Utf8.stringify(AES.decrypt(data, password))
};
/**
 * 导出公钥
 * @param
 * data（String） => 需要解密的字符串
 * password (String) => 解密的依据
 */
util.backupPublicKey = (data, password) => {
  let str = util.decrypt(data, password)
  console.log(str)
  if (str !== 'unlock.error.invalid_password') {
    let publicKey = ecc.privateToPublic(str)
    return publicKey
  } else {
    return 'unlock.error.invalid_password'
  }
}
/**
 * 备份导出
 * @param
 * data（Object） => 具有加密的对象
 * password (String) => 解密 加密的依据
 */
util.backupExport = (data, password) => {
  let backupData = {
    'account': data.account
  }
  backupData.active = util.decrypt(data.active, password)
  backupData.owner = util.decrypt(data.owner, password)
  let exportStr = JSON.stringify(backupData)
  exportStr = util.encryption(exportStr, password)
  return exportStr
}
/**
 * 备份导入
 * @param
 * data（String） => 密文
 * password (String) => 解密 加密的依据
 */
util.backupImport = (data, password) => {
  let backupData = null
  if (util.decrypt(data, password)) {
    backupData = JSON.parse(util.decrypt(data, password))
    return backupData
  } else {
    return false
  }
}
/**
 * create an account by faucet api and import
 * @param account
 * @param password
 * @returns {bluebird}
 */
util.create_account = (account, password) => {
  let activekey = ecc.randomKey()
  let active_pubkey = ecc.privateToPublic(activekey)
  let ownerkey = ecc.randomKey()
  let owner_pubkey = ecc.privateToPublic(ownerkey)
  let active = AES.encrypt(activekey, password).toString()
  let owner = AES.encrypt(ownerkey, password).toString()
  let data = {
    params: {
      'chainName': 'eos',
      'accountName': account,
      'keys': {
        'active': active_pubkey,
        'owner': owner_pubkey
      }
    },
    wallet: {
      account: account,
      active,
      active_pubkey,
      owner,
      owner_pubkey,
      backup_date: null
    }
  }
  return data
}
export default util
