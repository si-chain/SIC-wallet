<template>
  <div class="popup popup-transfer-confirm">
    <div class="bar bar-nav normal-nav">
      <h3 class="title">{{$t('transfer.confirm.enter_password')}}</h3>
      <a href="javascript:;" @click="hidden" class="pull-right icon icon-close close-popup">&times;</a>
    </div>
    <div class="content">
      <div class="list-block" style="padding-left:10px">
        <p class="info-alert text-center" v-if="tips">{{tips}}</p>
        <x-input class="weui-vcode" v-focus label-widt="1em" type="password" :placeholder="$t('transfer.confirm.enter_password')" v-model="password" @on-enter="onEnter">
          <x-button slot="right" @click.native="onPasswordConfirm" type="primary" mini>{{$t('transfer.next')}}</x-button>
        </x-input>
        <!-- <p class="tip-error text-center" v-if="error.common">{{error.common}}</p> -->
      </div>
    </div>
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
      submitting: false,
      error: {
        common: ''
      }
    }
  },
  props: {
    tips: {
      type: String
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
      this.$emit('unlocking', this.password)
    },
    hidden () {
      this.$emit('setUnlock', false)
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
    position: absolute;
    display: block;
    width: 100%;
    padding: 0;
    margin: 0 -.5rem;
    font-size: 1.2rem;
    font-weight: 500;
    line-height: 2.2rem;
    color: #3d4145;
    text-align: center;
    white-space: nowrap;
}

.bar.bar-nav {
  position: relative;
    background: transparent;
    .title {
        font-weight: normal;
        color: #3d3d3b;
    }
    .icon {
        color: #3d3d3b;
        position: absolute;
        right: 2%;
        top:0;
        font-size: 20px;
    }
}
.popup-transfer-confirm {
    width: 100%;
    position: fixed;
    max-height: 9rem;
    bottom: 0;
    top: initial;
    background: #fff;
    transition-duration: .2s;
}
.tip-error,.info-alert {
    background: #fbf2f1;
    color: #c2433b;
    font-size: .6rem;
    padding: .6rem;
    white-space: normal;
    word-break: break-all;
}

.text-center {
    text-align: center;
}
.weui-cells {
  margin-top: 0;
}
</style>
