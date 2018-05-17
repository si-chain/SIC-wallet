<template>
  <div>
    <x-header :left-options="{backText: ''}">{{$t('transfer.title')}}</x-header>
    <group>
      <x-input :title="$t('transfer.to')" novalidate :icon-type="iconType" label-width="4.5em" required :placeholder="$t('transfer.to_placeholder')" :is-type="validateAccount" v-model="ToAccount" @on-blur="transferAccount"></x-input>
      <x-input :title="$t('transfer.amount')" type="number" label-width="4.5em" required :placeholder="$t('transfer.amount_placeholder')" :is-type="validateAmount" v-model="amount"></x-input>
      <x-input :title="$t('transfer.memo')" label-width="4.5em" :placeholder="$t('transfer.memo')" v-model="memo"></x-input>
    </group>
    <box gap="30px 15px">
      <x-button :disabled="iconType === 'error' || iconType === ''" type="primary" @click.native="next" :show-loading="loading">{{btnTitle}}</x-button>
    </box>
    <toast v-model="showToast" :type="isSuccess">{{error}}</toast>
    <alert v-model="show" :title="$t('index.notice')" :content="error"></alert>
    <password-confirm v-if="isUnlock" ref="confirm" @setUnlock="setUnlock" @unlocking="unlocking"></password-confirm>
  </div>
</template>
<script>
import Eos from 'eosjs'
import config from '../libs/env'
import passwordConfirm from '../components/PasswordConfirm'
import { XHeader, Group, XInput, Box, Toast, XButton, Alert } from 'vux'
export default {
  components: {
    Group, XInput, XHeader, Box, Toast, XButton, passwordConfirm, Alert
  },
  data () {
    return {
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
      // this.$http.get(`${this.basePath}/v1/chain/accounts/eos/${this.ToAccount}`).then(res => {
      //   let data = res.data
      //   if (data.code === 200) {
      //     this.iconType = 'success'
      //   } else {
      //     this.iconType = 'error'
      //   }
      //   console.log(this.iconType)
      // }).catch(ex => {
      //   this.iconType = 'error'
      // })
    },
    unlocking (pwd) {
      this.pwd = pwd
      this.loading = true
      this.isUnlock = false
      this.btnTitle = this.$t('transfer.sending')
      this.transfer()
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
          let eos = Eos.Localnet(config)
          // 合约，固定
          const contractName = 'sic.token'
          const contractPromise = eos.contract(contractName)
          try {
            contractPromise.then(contract => {
              contract.transfer({
                from: accountStr.account,
                to: _this.ToAccount,
                quantity: _this.amount + ' SIC',
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
                _this.ToAccount = ''
                _this.iconType = ''
                _this.amount = ''
                _this.memo = ''
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
    }
  }
}
</script>
<style lang="less" scoped>

</style>

