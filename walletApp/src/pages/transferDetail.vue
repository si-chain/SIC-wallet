<template>
  <div>
    <sic-header :left-options="{backText: ''}">{{$t('transfer.title')}}</sic-header>
    <group>
      <x-input :class="val === 'account' ? 'send-input-focus' : 'send-input'" :title="$t('transfer.to')" novalidate :icon-type="iconType" label-width="4.5em" required :placeholder="$t('transfer.to_placeholder')" :is-type="validateAccount" v-model="ToAccount" @on-blur="transferAccount" @on-focus="sendInputFocus('account')">
        <img slot="label" class="input-icon" src="../assets/images/ico_accountname_send.png" width="24" height="24">
      </x-input>
      <x-input class="send-input" :class="{'send-input-focus' : val === 'amount'}" :title="$t('transfer.amount')" type="number" label-width="4.5em" required :placeholder="$t('transfer.amount_placeholder')" :is-type="validateAmount" v-model="amount" @on-focus="sendInputFocus('amount')">
        <img slot="label" class="input-icon" src="../assets/images/ico_amount_send.png" width="24" height="24">
      </x-input>
      <x-input class="send-input" :class="{'send-input-focus' : val === 'memo'}" :title="$t('transfer.memo')" label-width="4.5em" :placeholder="$t('transfer.memo')" v-model="memo" @on-focus="sendInputFocus('memo')">
        <img slot="label" class="input-icon" src="../assets/images/ico_memo_send.png" width="24" height="24">
      </x-input>
    </group>
    <x-button class="send-btn" :disabled="iconType === 'error' || iconType === ''" type="primary" @click.native="next" :show-loading="loading">{{btnTitle}}</x-button>
    <toast v-model="showToast" :type="isSuccess">{{error}}</toast>
    <alert v-model="show" :title="$t('index.notice')" :content="error" @on-hide="alertHide"></alert>
    <password-confirm v-show="isUnlock" :iShowLock="isUnlock" ref="confirm" @setUnlock="setUnlock" @unlocking="unlocking"></password-confirm>
  </div>
</template>
<script>
import Eos from 'eosjs'
import config from '../libs/env'
import passwordConfirm from '../components/PasswordConfirm'
import sicHeader from '../components/sicHeader'
import { Group, XInput, Box, Toast, XButton, Alert } from 'vux'
export default {
  components: {
    Group, XInput, sicHeader, Box, Toast, XButton, passwordConfirm, Alert
  },
  data () {
    return {
      val: 'account',
      ToAccount: '',
      amount: '',
      memo: '',
      show: false,
      showToast: false,
      loading: false,
      iconType: '',
      isUnlock: false,
      btnTitle: this.$t('transfer.next'),
      pwd: '',
      isSuccess: 'warn',
      error: '',
      validateAccount: function (value) {
        return {
          valid: /^[.12345a-z]+$/.test(value),
          msg: this.$t('transfer.error.account.from_account_not_exist')
        }
      },
      validateAmount: function (value) {
        return {
          valid: value > 0.0001,
          msg: this.$t('transfer.error.amount.minimum')
        }
      }
    }
  },
  methods: {
    setUnlock (val) {
      this.isUnlock = val
    },
    transferAccount () {
      let account = this.ToAccount
      var length = account.length
      if (!account) {
        this.error = this.$t('wallet_create.one.error.empty_account')
        this.showToast = true
        this.iconType = 'error'
      } else if (length < 1) {
        this.error = this.$t('wallet_create.one.error.account_should_be_longer')
        this.showToast = true
        this.iconType = 'error'
      } else if (length > 12) {
        this.error = this.$t('wallet_create.one.error.account_should_be_shorter')
        this.showToast = true
        this.iconType = 'error'
      } else if (!/^[.12345a-z]+$/.test(this.ToAccount)) {
        this.error = this.$t('wallet_create.one.error.account_format_error')
        this.showToast = true
        this.iconType = 'error'
      } else {
        this.$http.get(`${this.basePath}/v1/chain/accounts/eos/${account}`).then(res => {
          let data = res.data
          if (data.code === 200) {
            this.showToast = false
            this.isAccount = true
            this.iconType = 'success'
            return true
          } else {
            this.error = this.$t('wallet_import.error.account_not_found')
            this.showToast = true
            this.iconType = 'error'
          }
        }).catch(ex => {
          this.error = this.$t('wallet_create.one.error.query_account_failed')
          this.showToast = true
          this.iconType = 'error'
        })
      }
    },
    unlocking (flag, pwd) {
      if (!flag) {
        this.pwd = pwd
        this.loading = true
        this.isUnlock = false
        this.btnTitle = this.$t('transfer.sending')
        this.transfer()
      }
    },
    transfer () {
      if (/^[.12345a-z]+$/.test(this.ToAccount) && this.amount > 0.0001) {
        let _this = this
        try {
          let accountStr
          this.$common.getStore('account').map(item => {
            if (item.account === _this.$store.state.account) {
              accountStr = item
            }
          })
          let accountData = JSON.parse(this.$common.decryptActive(accountStr.encryption, this.pwd))
          let activeKey = this.$common.decryptActive(accountData.active, this.pwd)
          config.keyProvider = activeKey
          let eos = Eos(config)
          // 合约，固定
          const contractName = 'sic.token'
          const contractPromise = eos.contract(contractName)
          try {
            contractPromise.then(contract => {
              contract.transfer({
                from: accountStr.account,
                to: _this.ToAccount,
                quantity: Number(_this.amount).toFixed(4) + ' SIC',
                memo: _this.memo + Date.now()
              }, {authorization: accountStr.account}).then(res => {
                _this.isSuccess = 'success'
                _this.show = true
                _this.error = _this.$t('transfer.success.title')
                _this.loading = false
                _this.btnTitle = _this.$t('transfer.success.title')
                setTimeout(() => {
                  _this.$router.push(`/transfer?account=${this.$route.query.account}`)
                }, 500)
              }).catch((req) => {
                let data = JSON.parse(req)
                _this.btnTitle = _this.$t('transfer.next')
                _this.loading = false
                _this.show = true
                _this.isSuccess = 'warn'
                _this.error = data.error.details[0].message
                // _this.ToAccount = ''
                _this.iconType = ''
                // _this.amount = ''
                // _this.memo = ''
              })
            })
          } catch (error) {
            _this.loading = false
            _this.show = true
            _this.isSuccess = 'warn'
            _this.error = _this.$t('transfer.tip')
            _this.ToAccount = ''
            _this.amount = ''
            _this.memo = ''
          }
        } catch (error) {
          _this.loading = false
          _this.show = true
          _this.isSuccess = 'warn'
          _this.error = _this.$t('unlock.error.invalid_password')
          _this.btnTitle = _this.$t('transfer.next')
        }
      } else {
        this.loading = false
        this.show = true
        this.isSuccess = 'warn'
        this.error = this.$t('transfer.tip')
        this.ToAccount = ''
        this.amount = ''
        this.memo = ''
      }
    },
    next () {
      this.isUnlock = true
    },
    alertHide () {
      this.transferAccount()
    },
    sendInputFocus (val) {
      this.val = val
    }
  }
}
</script>
<style lang="less" scoped>
.input-icon{
  padding: 0 2.5rem 0 .714286rem;
  display:block;
}
.send-btn{
  position: absolute;
  bottom: 0;
  padding: .357143rem 0;
}
.send-input:after{
    content: " ";
    position: absolute;
    left: 0;
    top: 40px;
    right: 0;
    height: 1px;
    border-bottom: 1px solid #D9D9D9;
    color: #D9D9D9;
    -webkit-transform-origin: 0 0;
    transform-origin: 0 0;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
    left: 81px;
}
.send-input-focus:after{
  content: " ";
  position: absolute;
  left: 0;
  top: 40px;
  right: 0;
  height: 1px;
  border-bottom: 2px solid @index-color;
  color: #D9D9D9;
  -webkit-transform-origin: 0 0;
  transform-origin: 0 0;
  -webkit-transform: scaleY(0.5);
  transform: scaleY(0.5);
  left: 81px;
}
.weui-cell:before{
  display: none;
}
</style>

