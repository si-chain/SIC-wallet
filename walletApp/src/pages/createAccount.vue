<template>
  <div class="creat-account" style="overflow:hidden">
    <div v-if="$store.state.account" class="header">
      <div @click="goback" class="left-arrow"></div>
    </div>
    <!-- <x-header v-if="$store.state.account" :left-options="{backText: '返回'}">{{$t('left_panel.create_wallet')}}</x-header> -->
    <x-header v-else :left-options="{showBack: false}">{{$t('left_panel.create_wallet')}}</x-header>
    <div class="creat-box">
      <div class="logo">
        <div class="logo-left">
          <img src="../assets/createlogo.png" alt="">
        </div>
        <div class="account-img"></div>
      </div>
      <p class="new-account-title">{{$t('index.newAccount')}}</p>
      <p class="new-account-tip">{{$t('index.newAccountTip')}}</p>
      <div class="input-item">
        <p class="create-account-title">{{$t('index.account_name')}}</p>
        <x-input novalidate :icon-type="iconType" :placeholder="$t('wallet_create.placeholder.step1')" v-model="account" @on-blur="accountOnBlur"></x-input>
      </div>
      <div class="input-item">
        <p class="create-account-title">{{$t('wallet_create.placeholder.step2')}}</p>
        <x-input novalidate :icon-type="iconTypePwd" type="password" :placeholder="$t('wallet_create.placeholder.step2')" v-model="password" @on-blur="confirmOnBlur"></x-input>
        <!-- <x-input :title="$t('wallet_create.two.label.password')" type="password" novalidate :icon-type="iconTypePwd" v-model="password"></x-input> -->
      </div>
      <div class="btn-wrap">
        <button @click="submit">
          <img src="../assets/bot.png" width="260px" alt="">
        </button>
        <a class="has-account" @click="hasAccount">{{$t('index.existing_account')}}?</a>
      </div>
    </div>

    <!-- <div class="account-image-wrap">
      <account-image class="account-image" :size="40" :account="account"></account-image>
    </div>
    <group>
      <x-input :title="$t('wallet_create.two.label.password')" type="password" novalidate :icon-type="iconTypePwd" v-model="password"></x-input>
      <x-input :title="$t('wallet_create.two.label.confirm')" type="password" novalidate :icon-type="iconTypePwd" v-model="confirm" @on-blur="confirmOnBlur"></x-input>
    </group>
    <box gap="30px 15px">
      <x-button :disabled="!((password === confirm) && confirm !== '')" type="primary" @click.native="submit" :createShow-loading="loading">{{$t('index.sign_up')}}</x-button>
      <a class="has-account" @click="hasAccount">{{$t('index.existing_account')}}?</a>
    </box> -->
    <toast v-model="createShow" type="warn" :width="width">{{error}}</toast>
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
      createShow: false,
      width: '7.6em',
      loading: false,
      password: '',
      confirm: '',
      iconType: '',
      iconTypePwd: '',
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
      // var length = account.length
      console.log(!/^[a-zA-Z1-5]{1,12}/.test(this.account))
      if (!account) {
        this.error = this.$t('wallet_create.one.error.empty_account')
        this.createShow = true
        this.iconType = ''
        this.width = '7.6em'
        return false
      } else if (!/^[a-zA-Z1-5]{1,12}/.test(this.account)) {
        this.error = this.$t('wallet_create.one.error.account_format_error')
        this.createShow = true
        this.width = '18em'
        this.iconType = 'error'
        return false
      } else {
        this.$http.get(`${this.basePath}/v1/chain/accounts/eos/${account}`).then(res => {
          let data = res.data
          if (data.code === 400) {
            this.createShow = false
            this.isAccount = true
            this.iconType = 'success'
            return true
          } else {
            this.error = this.$t('wallet_create.one.error.account_already_exist')
            this.createShow = true
            this.iconType = 'error'
            this.width = '18em'
            return false
          }
        }).catch(ex => {
          this.error = this.$t('wallet_create.one.error.account_format_error')
          this.createShow = true
          this.width = '18em'
          this.iconType = 'error'
          return false
        })
      }
    },
    confirmOnBlur () {
      if (this.password === '') {
        this.error = this.$t('wallet_create.two.label.password')
        this.createShow = true
        this.iconTypePwd = 'error'
        return false
      } else {
        this.iconTypePwd = 'success'
        return true
      }
    },
    hasAccount () {
      this.$router.push('/account-import')
    },
    goback () {
      if (this.$store.state.account) {
        this.$router.push(`/wallet-manage?${this.$store.state.account}`)
      } else {
        this.$router.push(`/wallet-manage`)
      }
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
            _this.$store.commit('setAccount', getData.params.accountName)
            let encryptionWallet = _this.$common.encryption(JSON.stringify(getData.wallet), _this.password)
            encryptionWalletArr.push({
              account: getData.wallet.account,
              encryption: encryptionWallet
            })
            _this.$common.setStore('account', encryptionWalletArr)
            _this.$common.set_wallets(wallets)
            _this.$store.commit('UPDATE_WALLETS', wallets)
            _this.$router.push({path: '/wallet-create-success', query: {account: getData.params.accountName}})
            _this.$store.commit('upDataMsg', false)
          } else {
            _this.error = _this.$t('wallet_create.two.error.account_create_failed')
            _this.createShow = true
          }
        })
      }).catch(function (err) {
        console.warn(err)
      })
    },
    submit () {
      if (this.isAccount && this.password) {
        this.accountSuccess = true
        this.loading = true
        this.createAccount(this.account, this.password)
      } else {
        this.error = this.$t('wallet_create.placeholder.step1')
        this.createShow = true
      }
    }
  }
}
</script>
<style lang="less" scoped>
.vux-header{
  background-color: #ffffff!important;
  height: 40px;
}
.header{
  background-color: #ffffff!important;
  position: relative;
  color: #000000;
  text-align: left;
  line-height: 46px;
  height: 50px;
  font-size: 18px;
  .left-arrow {
    position: absolute;
    width: 30px;
    height: 30px;
    top: 5px;
    left: 8px;
  }
  .left-arrow:before {
    content: "";
    position: absolute;
    width: 12px;
    height: 12px;
    border: 1px solid #000000;
    border-width: 1px 0 0 1px;
    -webkit-transform: rotate(315deg);
    transform: rotate(315deg);
    top: 8px;
    left: 7px;
  }
}
.creat-box{
  padding: 0 20px;
}
.logo{
  height: 50px;
}
.logo-left {
  float: left;
  img{
    height: 50px;
  }
}
.account-img{
  float: right;
  height: 48px;
  width: 48px;
  border-radius: 50%;
  background-color: #0b4acd;
}
.new-account-title{
  line-height: 27px;
  font-size: 19px;
  font-weight: 500;
  color: #1c3c78;
  text-align: left;
  margin-top: 24px;
  width: 100px;
}
.new-account-tip{
  line-height: 20px;
  font-size: 13px;
  color: #4776cf;
  text-align: left;
  width: 200px;
  margin-bottom: 25px;
}
.input-item{
  margin-top: 9px;
}
.create-account-title{
  line-height: 25px;
  font-size: 16px;
  color:#222;
  letter-spacing:4px;
}
.weui-input{
  font-size: 18px;
}
.weui-cell{
  padding: 5px 0;
  border-bottom: 1px solid #D9D9D9;
}
.weui-cell:before {
    content: " ";
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    border-top:none;
    color: #D9D9D9;
    -webkit-transform-origin: 0 0;
    transform-origin: 0 0;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
    left: 15px;
}
.weui-cell__bd{
}
.btn-wrap{
  width: 260px;
  height: 45px;
  margin:28px 0 0 -5px;
}
.account-image-wrap{
  text-align: center;
  padding: 30px 0;
}
.has-account{
  color: #bbbbbb;
  display: inline-block;
  margin-left: 10px;
  float: left;
}
</style>

