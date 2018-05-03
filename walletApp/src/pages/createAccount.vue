<template>
  <div class="creat-account" style="overflow:hidden">
    <x-header :left-options="{backText: ''}">{{$t('left_panel.create_wallet')}}</x-header>
    <div class="account-image-wrap">
      <account-image class="account-image" :size="40" :account="account"></account-image>
    </div>
    <group>
      <x-input :title="$t('index.account')" v-model="account" @on-blur="accountOnBlur"></x-input>
      <x-input :title="$t('wallet_create.two.label.password')" type="password" v-model="password"></x-input>
      <x-input :title="$t('wallet_create.two.label.confirm')" type="password" v-model="confirm" @on-blur="confirmOnBlur"></x-input>
    </group>
    <box gap="30px 15px">
      <x-button type="primary" @click.native="submit" :show-loading="loading">{{$t('index.sign_up')}}</x-button>
      <a class="has-account" @click="hasAccount">{{$t('index.existing_account')}}?</a>
    </box>
    <toast v-model="show" type="warn">{{error}}</toast>
  </div>
</template>
<script>
import AccountImage from '../components/AccountImage'
import ecc from 'eosjs-ecc'
import AES from 'crypto-js/aes'
import Co from 'co'
import { XHeader, Box, Group, XButton, XInput, Toast } from 'vux'
export default{
  components: {
    AccountImage,
    XHeader,
    Group,
    XButton,
    XInput,
    Toast,
    Box
  },
  data () {
    return {
      account: '',
      isAccount: false,
      error: '',
      show: false,
      loading: false,
      password: '',
      confirm: '',
      accountSuccess: false,
      timerInt: null // 时间计时器
    }
  },
  methods: {
    // Blur 事件
    accountOnBlur () {
      this.validateAccount()
    },
    validateAccount () {
      let account = this.account
      var length = account.length
      if (!account) {
        this.error = this.$t('wallet_create.one.error.empty_account')
        this.show = true
        return false
      } else if (length < 1) {
        this.error = this.$t('wallet_create.one.error.account_should_be_longer')
        this.show = true
      } else if (length > 12) {
        this.error = this.$t('wallet_create.one.error.account_should_be_shorter')
        this.show = true
        return false
      } else if (!/^[.12345a-z]+$/.test(this.account)) {
        this.error = this.$t('wallet_create.one.error.account_format_error')
        this.show = true
        return false
      } else {
        let account = this.account
        this.$http.get(`${this.basePath}/v1/chain/accounts/eos/${account}`).then(res => {
          let data = res.data
          if (data.code === 400) {
            this.show = false
            this.isAccount = true
            return true
          } else {
            this.error = this.$t('wallet_create.one.error.account_already_exist')
            this.show = true
            return false
          }
        }).catch(ex => {
          this.error = this.$t('wallet_create.one.error.query_account_failed')
          this.show = true
          return false
        })
      }
    },
    confirmOnBlur () {
      if (this.password === '') {
        this.error = this.$t('wallet_create.two.label.password')
        this.show = true
        return false
      } else if (this.password !== this.confirm) {
        this.error = this.$t('wallet_create.two.error.password_not_equal')
        this.show = true
        return false
      } else {
        return true
      }
    },
    hasAccount () {
      this.$router.push('/account-import')
    },
    createAccount (account, password) {
      let _this = this
      Co(function * () {
        let activekey = yield ecc.randomKey()
        let activePubkey = ecc.privateToPublic(activekey)
        let ownerkey = yield ecc.randomKey()
        let ownerPubkey = ecc.privateToPublic(ownerkey)
        let active = AES.encrypt(activekey, password).toString()
        let owner = AES.encrypt(ownerkey, password).toString()
        let getData = {
          params: {
            'chainName': 'eos',
            'accountName': account,
            'keys': {
              'active': activePubkey,
              'owner': ownerPubkey
            }
          },
          wallet: {
            account: account,
            active,
            activePubkey,
            owner,
            ownerPubkey,
            backup_date: null
          }
        }
        yield _this.$http.post(`${_this.basePath}/v1/chain/accounts/faucet`, getData.params).then(res => {
          let data = res.data
          if (data.code === 200) {
            let wallets = _this.$common.get_wallets()
            let encryptionWalletArr = _this.$common.getStore('account')
            wallets.push(getData.wallet)
            _this.$store.commit('setAccount', getData.wallet.account)
            let encryptionWallet = _this.$common.encryption(JSON.stringify(getData.wallet), _this.password)
            encryptionWalletArr.push({
              account: getData.wallet.account,
              encryption: encryptionWallet
            })
            _this.$common.setStore('account', encryptionWalletArr)
            _this.$common.set_wallets(wallets)
            _this.$store.commit('UPDATE_WALLETS', wallets)
            _this.$router.push({path: '/wallet-create-success', query: {account: _this.account}})
          } else {
            _this.error = _this.$t('wallet_create.two.error.account_create_failed')
            _this.show = true
          }
        })
      }).catch(function (err) {
        console.log(err)
      })
    },
    submit () {
      if (this.isAccount && this.confirm === this.password) {
        this.accountSuccess = true
        this.loading = true
        this.createAccount(this.account, this.password)
      }
    }
  }
}
</script>
<style lang="less" scoped>
.account-image-wrap{
  text-align: center;
  padding: 30px 0;
}
.has-account{
  color: #bbbbbb;
  display: inline-block;
  padding: 10px 5px;
  float: right;
}
</style>

