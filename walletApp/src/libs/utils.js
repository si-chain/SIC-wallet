/*eslint-disable */
/* jshint ignore:start */
import ecc from 'eosjs-ecc'
import AES from 'crypto-js/aes'
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
};
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
