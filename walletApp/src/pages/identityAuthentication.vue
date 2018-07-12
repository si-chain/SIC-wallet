
<template>
  <div>
    <sic-header :left-options="{backText: ''}">{{$t('index.identity')}}</sic-header>
    <group>
      <x-input :class="val === 'phone' ? 'send-input-focus' : 'send-input'" :title="$t('identity.phone')" v-model="phoneNumber" name="mobile" :placeholder="$t('identity.placeholder')" keyboard="number" @on-change="phoneNumberChange" is-type="china-mobile" @on-focus="sendInputFocus('phone')">
        <img slot="label" class="input-icon" src="../assets/images/ico_phone_authentication.png" width="24" height="24">
      </x-input>
      <x-input :class="val === 'code' ? 'send-input-focus' : 'send-input'" :title="$t('identity.code')" :max="4" :min="4" class="weui-vcode" placeholder="Code" v-model="validateCode" @on-focus="sendInputFocus('code')">
        <img slot="label" class="input-icon" src="../assets/images/ico_code_authentication.png" width="24" height="24">
        <x-button :disabled="!((sendCode === '发送验证码' || sendCode === 'Send Code' || sendCode === '重置' || sendCode === 'Resend') && isPhone)" slot="right" type="primary" @click.native="getCode" mini>{{sendCode}}</x-button>
      </x-input>

    </group>
    <x-button class="send-btn" :disabled="!(isPhone && validateCode !=='')" @click.native="verifyCode" type="primary">{{$t('index.confirm')}}</x-button>
    <div v-transfer-dom>
        <alert v-model="isIdentityMsg" button-text=" ">
          <msg slot="default" :title="title" :description="description" :buttons="buttons" :icon="icon"></msg>
        </alert>
    </div>
  </div>
</template>

<script>
import sicHeader from '../components/sicHeader'
import { Alert, Group, Box, XInput, XButton, Msg, TransferDomDirective as TransferDom } from 'vux'
export default {
  directives: {
    TransferDom
  },
  data () {
    return {
      val: 'phone',
      phoneNumber: '',
      validateCode: '',
      sendCode: this.$t('identity.sendCode'),
      timer: null,
      isPhone: false,
      isIdentityMsg: false,
      description: '',
      buttons: [],
      title: this.$t('identity.success'),
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
        country: 86,
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
        country: 86,
        code: this.validateCode,
        account: this.$store.state.account
      }
      let _this = this
      this.$http.post(`${this.basePath}/v1/msg/sms/code/verify`, data).then(res => {
        if (res.data.success) {
          _this.buttons = [{
            type: 'primary',
            text: _this.$t('identity.success'),
            link: `/home?account=${_this.$store.state.account}`
          }]
          _this.title = _this.$t('identity.success')
          _this.icon = 'success'
          _this.isIdentityMsg = true
          this.$store.commit('upDataIdentityAccount', _this.$store.state.account)
        } else {
          _this.buttons = [{
            type: 'warn',
            text: _this.$t('identity.error'),
            onClick: _this.nextDo.bind(_this)
          }]
          _this.icon = 'warn'
          _this.title = _this.$t('identity.error')
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
    },
    sendInputFocus (val) {
      this.val = val
    }
  },
  created () {
    this.clearTimer()
  },
  beforeDestroy () {
    this.clearTimer()
  },
  components: {
    Group, XInput, XButton, Box, sicHeader, Msg, Alert
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
.weui-btn_mini {
  padding:11px 14px 3px 1.32rem;
  margin: -17px -15px;
}
</style>

