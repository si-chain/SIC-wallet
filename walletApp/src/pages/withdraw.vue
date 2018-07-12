<template>
  <div>
    <sic-header :left-options="{backText: ''}">{{$t('withdraw.extract')}}</sic-header>
    <group>
      <x-input :class="val === 'account' ? 'withdraw-input-focus' : 'withdraw-input'" :title="$t('withdraw.to')" required :placeholder="$t('withdraw.to_placeholder')" v-model="ethAddress" :is-type="validateAccount" @on-focus="sendInputFocus('account')">
        <img slot="label" class="input-icon" src="../assets/images/ico_accountname_send.png" width="24" height="24">
      </x-input>
      <x-input :class="val === 'amount' ? 'withdraw-input-focus' : 'withdraw-input'" :title="$t('withdraw.amount')" type="number" required :placeholder="$t('withdraw.amount_placeholder')" :is-type="validateAmount" v-model="amount"  @on-focus="sendInputFocus('amount')">
        <img slot="label" class="input-icon" src="../assets/images/ico_amount_send.png" width="24" height="24">
      </x-input>
      <x-input :class="val === 'memo' ? 'withdraw-input-focus' : 'withdraw-input'" :title="$t('withdraw.memo')" :placeholder="$t('withdraw.memo')" v-model="memo" @on-focus="sendInputFocus('memo')">
        <img slot="label" class="input-icon" src="../assets/images/ico_memo_send.png" width="24" height="24">
      </x-input>
    </group>

    <x-button class="withdraw-btn" :disabled="!(ethAddress.match('^0x[a-fA-F0-9]{40}$') && amount > 0.001)" type="primary" @click.native="next" :show-loading="loading">{{btnTitle}}</x-button>
    <toast v-model="ethToast" type="warn">{{error}}</toast>
    <alert v-model="show" :title="$t('index.notice')" :content="error"></alert>
    <password-confirm v-show="isUnlock" :iShowLock="isUnlock" ref="confirm" @setUnlock="setUnlock" @unlocking="unlocking"></password-confirm>
  </div>
</template>
<script>
import Eos from 'eosjs'
import config from '../libs/env'
import passwordConfirm from '../components/PasswordConfirm'
import { Group, XInput, Toast, XButton, Alert } from 'vux'
import sicHeader from '../components/sicHeader'
export default {
  components: {
    Group, XInput, sicHeader, Toast, XButton, passwordConfirm, Alert
  },
  data () {
    return {
      val: '',
      ethAddress: '',
      amount: '',
      memo: '',
      show: false,
      loading: false,
      ethToast: false,
      isUnlock: false,
      btnTitle: this.$t('withdraw.next'),
      pwd: '',
      isSuccess: 'warn',
      error: '',
      validateAmount: function (value) {
        return {
          valid: value > 20,
          msg: this.$t('withdraw.error.amount.minwithwrap')
        }
      },
      validateAccount: function (value) {
        let valid = null
        if (value.match('^0x[a-fA-F0-9]{40}$')) {
          valid = true
        } else {
          valid = false
        }
        return {
          valid: valid,
          msg: this.$t('withdraw.accountError')
        }
      }
    }
  },
  methods: {
    validateEthAdd () {
      let _this = this
      this.ethToast = false
      if (this.ethAddress.match('^0x[a-fA-F0-9]{40}$')) {
        return true
      } else {
        _this.error = _this.$t('withdraw.accountError')
        _this.ethToast = true
        return false
      }
    },
    setUnlock (val) {
      this.isUnlock = val
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
    withdraw () {
      if (this.amount > 20) {
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
              contract.withdraw({
                from: accountStr.account,
                quantity: _this.amount + ' SIC',
                memo: _this.memo + Date.now()
              }, {authorization: accountStr.account}).then(res => {
                _this.$http.get(`${this.basePath}/v1/coin/withdraw/${res.transaction_id}/${_this.ethAddress}`).then(res => {
                  _this.isSuccess = 'success'
                  _this.show = true
                  _this.error = _this.$t('withdraw.success.title')
                  _this.loading = false
                  _this.btnTitle = _this.$t('withdraw.success.title')
                  _this.amount = ''
                  setTimeout(() => {
                    _this.$router.push(`/withdraw?account=${this.$route.query.account}`)
                  }, 500)
                }).catch(() => {
                  _this.loading = false
                  _this.show = true
                  _this.isSuccess = 'warn'
                  _this.error = _this.$t('withdraw.tip')
                })
              }).catch((req) => {
                let data = JSON.parse(req)
                _this.btnTitle = _this.$t('withdraw.next')
                _this.loading = false
                _this.show = true
                _this.isSuccess = 'warn'
                _this.error = data.error.details[0].message
                _this.amount = ''
                _this.memo = ''
              })
            })
          } catch (error) {
            _this.loading = false
            _this.show = true
            _this.isSuccess = 'warn'
            _this.error = _this.$t('withdraw.tip')
            _this.amount = ''
            _this.memo = ''
          }
        } catch (error) {
          _this.loading = false
          _this.show = true
          _this.isSuccess = 'warn'
          _this.error = _this.$t('unlock.error.invalid_password')
          _this.btnTitle = _this.$t('withdraw.next')
        }
      } else {
        this.loading = false
        this.show = true
        this.isSuccess = 'warn'
        this.error = this.$t('withdraw.tip')
        this.amount = ''
        this.memo = ''
      }
    },
    next () {
      this.isUnlock = true
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
.withdraw-btn{
  position: absolute;
  bottom: 0;
  padding: .357143rem 0;
}
.withdraw-input:after{
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
.withdraw-input-focus:after{
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

