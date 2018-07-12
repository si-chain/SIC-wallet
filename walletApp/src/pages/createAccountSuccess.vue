<template>
  <div style="overflow:hidden;width:100%">
    <sic-header :left-options="{backText: ''}">{{$t('wallet_create.success.title')}}</sic-header>
    <div class="page-group">
      <div class="svg-wrap">
        <!-- <success-check-mark></success-check-mark> -->
        <img src="../assets/images/ico_success.png" alt="" width="70">
        <p class="text-center text-success">{{$t('wallet_create.success.tip1')}}</p>
      </div>
      <div class="tip-wrap">
        <p class="tip-alert text-center">{{$t('wallet_create.success.tip2')}}</p>
      </div>
      <div class="button-wrap button-block">
        <x-button type="primary" :link="`/wallet-backup-key?account=${$store.state.account}`">{{$t('wallet_create.success.backup_wallet')}}</x-button>
        <x-button type="default" :link="`/?account=${$store.state.account}`">{{$t('wallet_create.success.detail')}}</x-button>
      </div>
    </div>
  </div>
</template>
<script>
import sicHeader from '../components/sicHeader'
import { XButton } from 'vux'
// import SuccessCheckMark from '../components/SuccessCheckMark.vue'
export default {
  data () {
    return {}
  },
  components: {
    XButton,
    sicHeader
  }
}
</script>
<style scoped lang="less">
.page-group{
  background: url(../assets/images/bg_create.jpg);
  background-repeat: no-repeat;
  background-size: 100% 100%;
  height:100%;
}
.svg-wrap{
  img{
    margin:9.285714rem 0 2.142857rem 0;
  }
  text-align: center;
}
.text-success{
  font-size: @font-size3;
  color:#ffffff;
}
.tip-wrap{
  margin:0 2.142857rem;
  position: absolute;
  bottom: 5.714286rem;
  background: rgba(246, 57, 81, .2);
  border-radius: 5px;
}
.tip-alert{
  color: #f63951;
  font-size: @font-size4;
  padding:5px 1.071429rem;
  white-space: normal;
  letter-spacing: normal;
  word-break: normal;
}
.text-center{
  text-align: center;
}
</style>
