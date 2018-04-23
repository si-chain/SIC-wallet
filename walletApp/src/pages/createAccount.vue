<template>
  <div class="creat-account">
    <x-header :left-options="{backText: ''}">创建钱包</x-header>
    <div class="account-image-wrap">
      <account-image class="account-image" :size="40" :account="account"></account-image>
    </div>
    <group>
      <x-input title="账号" v-model="account" @on-blur="accountOnBlur"></x-input>
      <x-input title="输入密码" type="password" :max="6" :min="6" v-model="password"></x-input>
      <x-input title="确认密码" type="password" :max="6" :min="6" v-model="confirm" @on-blur="confirmOnBlur"></x-input>
    </group>
    <group>
      <x-button type="primary" @click.native="submit" :show-loading="loading">注册</x-button>
    </group>
    <toast v-model="show" type="warn">{{error}}</toast>
  </div>
</template>
<script>
// <i18n>
//   query_account_failed:
//     zn-CN: '查询账户失败，请重试',

//   error: {
//     query_account_failed: '查询账户失败，请重试',
//     account_already_exist: '账户已存在',
//     empty_account: '账户名不可为空',
//     account_should_be_longer: '账户名至少3位',
//     account_should_be_shorter: '账户名过长',
//     account_should_start_with_a_letter: '账户名需以字母开头',
//     account_format_error: '账户名只能是字母、数字的组合',
//     account_end_error: '账户名需要以字母或数字结尾',
//     account_segment_should_be_longer: '账户名长度是1到13位',
//     premium_name: '你使用的是高级账户名,请选择其他名字，包含至少一个横杠、数字或者不含元音字母'
//   },
// </i18n>
import AccountImage from '../components/AccountImage'
import { XHeader, Group, XButton, XInput, Toast } from 'vux'
export default{
  components: {
    AccountImage,
    XHeader,
    Group,
    XButton,
    XInput,
    Toast
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
      accountSuccess: false
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
        this.error = '账户名不可为空'
        this.show = true
        return false
      } else if (length < 1) {
        this.error = '账户名至少3位'
        this.show = true
      } else if (length > 13) {
        this.error = '账户名过长'
        this.show = true
        return false
      } else if (!/^[.12345a-z]+$/.test(this.account)) {
        this.error = '账户名只能是字母、数字的组合'
        this.show = true
        return false
      } else {
        let account = this.account
        this.$http.get(`/chain/accounts/eos/${account}`).then(res => {
          let data = res.data
          console.log(res, data)
          if (data.code === 400) {
            this.show = false
            this.isAccount = true
            return true
          } else {
            this.error = '账户已存在'
            this.show = true
            return false
          }
        }).catch(ex => {
          this.error = '请求错误，请稍后再试'
          this.show = true
          return false
        })
      }
    },
    confirmOnBlur () {
      if (this.password === '') {
        this.error = '请输入密码'
        this.show = true
        return false
      } else if (this.password !== this.confirm) {
        this.error = '两次密码输入不一致！'
        this.show = true
        return false
      } else {
        return true
      }
    },
    submit () {
      let _this = this
      this.loading = true
      if (this.isAccount) {
        this.accountSuccess = true
        let getData = this.$common.create_account(this.account, this.password)
        this.$http.post('/chain/accounts/faucet', getData.params).then(res => {
          let data = res.data
          if (data.code === 200) {
            console.log(this.$common.get_wallets())
            let wallets = this.$common.get_wallets()
            wallets.push(getData.wallet)
            this.$common.set_wallets(wallets)
            this.$store.commit('UPDATE_WALLETS', wallets)
            console.log(this.$store.state)
            this.$router.push({path: '/wallet-create-success', query: {account: this.account}})
          } else {
            _this.error = '创建账户失败，请重试'
            _this.show = true
          }
        })
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
.vux-header{
  background-color: #ffffff
}
</style>

