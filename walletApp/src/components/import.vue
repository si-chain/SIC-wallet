<template>
  <div class="import-view">
    <transition name="slide-fade">
      <div v-if="isShow">
        <div class="content" v-if="type === 'success'">
          <div class="list-block">
            <img src="../assets/images/ico_success.png" alt="" width="50">
            <p class="tips">{{$t('index.success')}}</p>
          </div>
          <div class="button-wrap button-block">
            <x-button type="primary" :link="`/wallet-backup?account=${$store.state.account}`">{{$t('wallet_import.success.detail')}}</x-button>
            <x-button type="default" :link="`/?account=${$store.state.account}`">{{$t('wallet_import.success.back_home')}}</x-button>
          </div>
        </div>
        <div class="content" v-else>
          <div class="list-block">
            <img src="../assets/images/ico_fail.png" alt="" width="50">
            <p class="tips">{{$t('index.error')}}</p>
          </div>
          <div class="button-wrap button-block">
            <x-button type="primary" @click.native="Reimport">{{$t('wallet_import.error')}}</x-button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import {XButton} from 'vux'
export default {
  props: {
    isShow: Boolean,
    type: String
  },
  data () {
    return {
    }
  },
  components: {
    XButton
  },
  methods: {
    Reimport () {
      this.$emit('setViewConfirm')
    }
  }
}
</script>

<style lang="less" scoped>
.import-view{
  width: 100%;
  position: fixed;
  height: 100%;
  bottom: 0;
  top: initial;
  background: rgba(255,255,255,0.92);
  transition-duration: .2s;
}
.content{
  text-align: center;
  .tips{
    font-size: @font-size3;
    color: #666666;
    margin-top: 2.142857rem;
  }
}
.list-block{
  margin-top: 16.428571rem;
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

