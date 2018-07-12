<template>
  <div class="creat-account" style="overflow:hidden">
    <sic-header v-if="$store.state.account" :left-options="{backText: ''}"></sic-header>
    <p v-else style="height: 1.585714rem;background-color: #123258;"></p>
    <div class="creat-box" :class="$store.state.account ? 'hastop' : ''">
      <div class="logo">
        <div class="logo-item logo-left">
          <p class="new">New account</p>
          <p>Create account</p>
        </div>
        <div class="logo-item logo-right">
          <a class="has-account" @click="hasAccount">{{$t('index.existing_account')}}?</a>
          <span class="inline-block language" @click="language">
            <img class="middle" width="24" src="../assets/images/ico_font.png" alt="">
          </span>
        </div>
      </div>
      <div class="account-img">
        <account-image style="margin:8px 0 0 1px;" wrapSize="60px" background="#b2b2b2" :account="account" :size="35"></account-image>
      </div>
      <div class="input-item">
        <p class="create-account-title">{{$t('index.account_name')}}</p>
        <x-input :class="val === 'account' ? 'create-input-focus' : 'create-input'" textAlign="color:#ffffff" novalidate :icon-type="iconType" :placeholder="$t('wallet_create.placeholder.step1')" v-model="account" :min="12" :max="12" @on-blur="accountOnBlur" @on-focus="sendInputFocus('account')">
          <x-button slot="right" type="primary" @click.native="randomEosName" mini>{{$t('index.random')}}</x-button>
        </x-input>
      </div>
      <div class="input-item">
        <p class="create-account-title">{{$t('wallet_create.placeholder.step2')}}</p>
        <x-input :class="val === 'pwd' ? 'create-input-focus' : 'create-input'" novalidate :icon-type="iconTypePwd" type="password" @on-enter="submit" :placeholder="$t('wallet_create.placeholder.step2')" v-model="password" @on-blur="confirmOnBlur" @on-focus="sendInputFocus('pwd')"></x-input>
      </div>
      <div class="input-item">
        <p class="create-account-title">{{$t('index.Invite')}}</p>
        <x-input :class="val === 'invitecode' ? 'create-input-focus' : 'create-input'" :placeholder="$t('index.placeholderInvite')" v-model="invite" @on-blur="InviteOnBlur" @on-focus="sendInputFocus('invitecode')"></x-input>
      </div>
      <x-button type="default" :disabled="password === ''" @click.native="submit">{{$t('wallet_create.create_account')}}</x-button>
    </div>
    <div v-transfer-dom>
      <actionsheet :menus="menus" v-model="showMenu" @on-click-menu="changeLocale"></actionsheet>
    </div>
    <toast v-model="createShow" type="warn" :width="width">{{error}}</toast>
  </div>
</template>
<script>
import AccountImage from '../components/AccountImage'
import ecc from 'eosjs-ecc'
import AES from 'crypto-js/aes'
import Co from 'co'
import sicHeader from '../components/sicHeader'
import { XButton, XInput, Toast, Actionsheet, TransferDom } from 'vux'
export default{
  directives: {
    TransferDom
  },
  components: {
    AccountImage,
    sicHeader,
    Actionsheet,
    XButton,
    XInput,
    Toast
  },
  data () {
    return {
      account: '',
      val: 'invitecode',
      isAccount: false,
      invite: '',
      error: '',
      createShow: false,
      width: '7.6em',
      loading: false,
      password: '',
      confirm: '',
      iconType: '',
      iconTypePwd: '',
      accountSuccess: false,
      timerInt: null, // 时间计时器
      showMenu: false,
      menus: {
        'language.noop': '<span class="menu-title">Language</span>',
        'zh-CN': '中文',
        'en-US': 'English'
      }
    }
  },
  methods: {
    language () {
      this.showMenu = true
    },
    changeLocale (locale) {
      this.$common.setStore('_locale', locale)
      this.$i18n.locale = locale
    },
    // Blur 事件
    accountOnBlur () {
      this.validateAccount()
    },
    randomEosName () {
      this.account = this.$common.randomEosName()
      this.validateAccountHttp()
    },
    InviteOnBlur () {
      console.log(this.invite)
    },
    validateAccount () {
      let account = this.account
      // var length = account.length
      // console.log(!/^[a-zA-Z1-5]{1,12}/.test(this.account))
      if (!account) {
        this.error = this.$t('wallet_create.one.error.empty_account')
        this.createShow = true
        this.iconType = ''
        this.width = '8.5em'
        return false
      } else if (!/^[a-zA-Z1-5]{12}/.test(this.account)) {
        this.error = this.$t('wallet_create.one.error.account_format_error')
        this.createShow = true
        this.width = '18em'
        this.iconType = 'error'
        return false
      } else {
        this.validateAccountHttp()
      }
    },
    validateAccountHttp () {
      let account = this.account
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
            'inviteCode': _this.invite,
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
    },
    sendInputFocus (val) {
      this.val = val
    }
  }
}
</script>
<style lang="less" scoped>
.creat-account{
  background: url(../assets/images/bg_create.jpg);
  background-repeat: no-repeat;
  background-size: 100% 100%;
}
.input-item .weui-cell{
  background:rgb(18, 51, 87, 0.1)!important;
}
.creat-box{
  padding: 0 2.142857rem;
}
.logo{
  height: 3.214286rem;
  position: relative;
  display: flex;
  .logo-item{
    flex:1
  }
  .logo-left{
    color: #8898ac;
    font-size: 13px;
    .new{
      font-size: @font-size2;
    }
  }
  .logo-right{
    display: flex;
    align-items: center;
    a{
      font-size: @font-size4;
      color: #ffffff;
      margin-left: 1.5rem;
    }
    .language{
      margin-left: 1.857143rem;
      position: absolute;
      right: -1rem;
      img{
        margin-top: .428571rem;
      }
    }
  }
}
.account-img{
  margin: 2.142857rem 0  .714286rem -0.357143rem;
}
.create-account-title{
  font-size: @font-size4;
  color: #ffffff;
}
.input-item{
  margin-top: 1.285714rem;
}
.weui-btn_disabled.weui-btn_default{
  background-color: @assist-color;
  color: #ffffff;
  font-size: @font-size2;
  border-radius: 2.142857rem;
  padding: .285714rem 0;
  margin-top: 2.142857rem;
}
.weui-btn_default{
  font-size: @font-size2;
  border-radius: 2.142857rem;
  padding: .285714rem 0;
  margin-top: 2.142857rem;
}
.weui-btn_mini{
  background-color: @assist-color;
  margin-right: .571429rem;
  padding: 2px 1.2rem;
}
.weui-cell{
  padding: 5px 0;
}
.create-input-focus:before {
    content: " ";
    position: absolute;
    left: 0;
    top: 39px;
    right: 8px;
    border-top: 2px solid #ffffff;
    color: #D9D9D9;
    -webkit-transform-origin: 0 0;
    transform-origin: 0 0;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
}
.create-input:before {
    content: " ";
    position: absolute;
    left: 0;
    top: 39px;
    right: 8px;
    border-top: 1px solid #8898ac;
    color: #D9D9D9;
    -webkit-transform-origin: 0 0;
    transform-origin: 0 0;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
}
</style>

