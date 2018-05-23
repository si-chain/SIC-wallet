
<template>
  <div>
    <x-header :left-options="{backText: ''}">{{$t('index.identity')}}</x-header>
    <group>
      <x-input :title="$t('identity.phone')" v-model="phoneNumber" name="mobile" :placeholder="$t('identity.placeholder')" keyboard="number" @on-change="phoneNumberChange" is-type="china-mobile"></x-input>
      <x-input :title="$t('identity.code')" :max="4" :min="4" class="weui-vcode" v-model="validateCode">
        <x-button :disabled="!((sendCode === '发送验证码' || sendCode === 'Send Code' || sendCode === '重置' || sendCode === 'Resend') && isPhone)" slot="right" type="primary" @click.native="getCode" mini>{{sendCode}}</x-button>
      </x-input>

    </group>
    <box gap="10px 10px">
      <x-button :disabled="!(isPhone && validateCode !=='')" @click.native="verifyCode" type="primary">{{$t('index.confirm')}}</x-button>
    </box>
    <div v-transfer-dom>
        <alert v-model="isIdentityMsg" button-text=" ">
          <msg slot="default" :title="$t('identity.success')" :description="description" :buttons="buttons" :icon="icon"></msg>
        </alert>
    </div>
  </div>
</template>

<script>
import { Alert, Group, Box, XInput, XButton, XHeader, Msg, TransferDomDirective as TransferDom } from 'vux'
export default {
  directives: {
    TransferDom
  },
  data () {
    return {
      phoneNumber: '',
      validateCode: '',
      sendCode: this.$t('identity.sendCode'),
      timer: null,
      isPhone: false,
      isIdentityMsg: false,
      description: '',
      buttons: [],
      icon: ''
    }
  },
  methods: {
    phoneNumberChange (val) {
      let myreg = /^[1][3,4,5,7,8][0-9]{9}$/
      if (myreg.test(val)) {
        this.isPhone = true
      } else {
        this.isPhone = false
      }
    },
    getCode () {
      let data = {
        mobile: this.phoneNumber
      }
      this.$http.post(`${this.basePath}/v1/msg/sms/code`, data).then(res => {
        let count = 60
        let _this = this
        this.timer = setInterval(() => {
          _this.sendCode = count-- + ' S'
          if (count === -1) {
            clearInterval(_this.timer)
            _this.sendCode = _this.$t('identity.next')
          }
        }, 1000)
      })
    },
    verifyCode () {
      let data = {
        mobile: this.phoneNumber,
        code: this.validateCode
      }
      let _this = this
      this.$http.post(`${this.basePath}/v1/msg/sms/code/verify`, data).then(res => {
        if (res.data.success) {
          _this.buttons = [{
            type: 'primary',
            text: _this.$t('identity.success'),
            link: `/home?account=${_this.$store.state.account}`
          }]
          _this.icon = 'success'
          _this.isIdentityMsg = true
          let isIdentityList = _this.$common.getStore('isIdentityList') || []
          isIdentityList.push({
            account: _this.$store.state.account,
            isIdentity: true
          })
          _this.$common.setStore('isIdentityList', isIdentityList)
        } else {
          _this.buttons = [{
            type: 'warn',
            text: _this.$t('identity.error'),
            onClick: _this.nextDo.bind(_this)
          }]
          _this.icon = 'warn'
          _this.isIdentityMsg = true
        }
      })
    },
    nextDo () {
      this.isIdentityMsg = false
      this.validateCode = ''
    },
    clearTimer () {
      if (this.timer) {
        clearInterval(this.timer)
      }
    }
  },
  created () {
    this.clearTimer()
  },
  beforeDestroy () {
    this.clearTimer()
  },
  components: {
    Group, XInput, XButton, Box, XHeader, Msg, Alert
  }
}
</script>

<style>


</style>
