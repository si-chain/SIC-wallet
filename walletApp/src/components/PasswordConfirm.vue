<template>
  <div class="popup popup-transfer-confirm">
    <transition name="slide-fade">
      <div v-if="iShowLock">
        <div class="bar bar-nav normal-nav">
          <h3 class="title">{{$t('transfer.confirm.enter_password')}}</h3>
        </div>
        <div class="content">
          <div class="list-block">
            <p class="info-alert text-center" v-if="tips">{{tips}}</p>
            <div class="input-wrap">
              <x-input class="weui-vcode" text-align="center" v-focus label-widt="1em" type="password" :placeholder="$t('transfer.confirm.enter_password')" v-model="password" @on-enter="onEnter"></x-input>
            </div>
            <x-button @click.native="onPasswordConfirm" type="primary">{{$t('transfer.next')}}</x-button>
            <p class="tip-error text-center" v-if="error.common">{{error.common}}</p>
            <!-- <a href="javascript:;" class="pull-right icon icon-close close-popup">&times;</a> -->
            <div class="close-btn align-center" @click="hidden">
              <img src="../assets/images/btn_close.png" alt="" width="40">
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
import { XInput, XButton } from 'vux'
export default {
  components: {
    XInput,
    XButton
  },
  data () {
    return {
      password: '',
      error: {
        common: ''
      }
    }
  },
  props: {
    tips: {
      type: String
    },
    iShowLock: {
      type: Boolean
    },
    isDecrypt: {
      type: Boolean,
      default: false
    }
  },
  directives: {
    focus: {
      // 指令的定义
      update: function (el) {
        el.focus()
      }
    }
  },
  methods: {
    onEnter () {
      this.onPasswordConfirm()
    },
    onPasswordConfirm () {
      let self = this
      let flag = false
      if (this.isDecrypt) {
        this.$emit('unlocking', flag, this.password)
      } else {
        if (!this.password) {
          this.error.common = this.$t('unlock.error.invalid_password')
          flag = true
        }
        let account = this.$route.query.account
        let wallets = this.$common.get_wallets()
        let wallet
        wallets.find(function (w) {
          if (w.account === account) {
            wallet = w
          }
        })
        try {
          let publicWallet = this.$common.backupPublicKey(wallet.active, this.password)
          let activePubkey = wallet.activePubkey
          if (wallet == null) {
            flag = true
            self.error.common = self.$t('unlock.account_not_found')
          } else if (activePubkey !== publicWallet) {
            flag = true
            self.error.common = self.$t('wallet_backup.detail.error.invalid_password')
          } else {
            flag = false
          }
        } catch (error) {
          flag = true
          this.error.common = this.$t('unlock.error.invalid_password')
        }
        this.$emit('unlocking', flag, this.password)
        if (!flag) {
          this.password = ''
          this.error.common = ''
        }
      }
    },
    hidden () {
      this.$emit('setUnlock', false)
      this.password = ''
      this.error.common = ''
    }
  }
}
</script>
<style lang="less" scoped>
.bar {
    z-index: 10;
    height: 2.2rem;
    padding-right: .5rem;
    padding-left: .5rem;
    background-color: #f7f7f8;
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
}
.bar.bar-nav[data-v-9973c114] {
    background: transparent;
}

.normal-nav.bar.bar-nav {
    padding-top: 0;
    height: 2.2rem;
}
.bar-nav {
    opacity: 1;
    background: #05afd1;
}
.bar-nav {
    top: 0;
}
.title {
    margin: 5.785714rem 0 .714286rem 0;
    text-align: center;
    font-size: @font-size2;
    color: #000000;
}

.bar.bar-nav {
  position: relative;
    background: transparent;
    .title {
        font-weight: normal;
        color: #3d3d3b;
    }
}
.popup-transfer-confirm {
    width: 100%;
    position: fixed;
    height: 100%;
    bottom: 0;
    top: initial;
    background: rgba(255,255,255,0.92);
    transition-duration: .2s;
}
.list-block{
  text-align: center;
}
.tip-error,.info-alert {
    color: #f63951;
    font-size: @font-size4;
    display: inline-block;
    width: 83%;
    padding: 5px;
    white-space: normal;
    word-break: break-all;
}
.tip-error{
  margin-top: .714286rem;
}
.info-alert{
  background: rgba(246, 57, 81, .2);
}
.input-wrap{
  border-bottom: 1px solid #e1e1e1;
  width: 86%;
  margin-top: 2.142857rem;
  display: inline-block;
  .weui-cell{
    padding-bottom: .142857rem;
  }
}

.text-center {
    text-align: center;
}
.weui-cells {
  margin-top: 0;
}
.weui-btn{
  width: 86%;
  margin-top: 1.428571rem;
  border-radius: 1.428571rem;
}
.close-btn{
  height: 2.857143rem;
  margin-top: 3rem;
  text-align: center;
}
.slide-fade-enter-active {
  transition: all .5s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-leave-active {
  transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active for below version 2.1.8 */ {
  transform: translateX(10px);
  opacity: 0;
}
</style>
