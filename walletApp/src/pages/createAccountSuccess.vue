<template>
  <div style="overflow:hidden">
    <sic-header :left-options="{backText: ''}">创建成功</sic-header>
    <div class="page-group">
      <div class="svg-wrap">
        <success-check-mark></success-check-mark>
        <p class="text-center text-success">{{$t('wallet_create.success.tip1')}}</p>
      </div>
      <div class="tip-wrap">
        <p class="tip-alert text-center">{{$t('wallet_create.success.tip2')}}</p>
      </div>
      <flexbox>
        <flexbox-item>
          <x-button type="primary" @click.native="backup">{{$t('wallet_create.success.backup_wallet')}}</x-button>
        </flexbox-item>
        <flexbox-item>
          <x-button type="default" :link="`/?account=${$store.state.account}`">{{$t('wallet_create.success.detail')}}</x-button>
        </flexbox-item>
      </flexbox>
    </div>
  </div>
</template>
<script>
import sicHeader from '../components/sicHeader'
import { XButton, Flexbox, FlexboxItem } from 'vux'
import SuccessCheckMark from '../components/SuccessCheckMark.vue'
export default {
  data () {
    return {}
  },
  components: {
    XButton,
    sicHeader,
    Flexbox,
    FlexboxItem,
    SuccessCheckMark
  },
  methods: {
    backup () {
      console.log(this.$store.state.account)
      this.$router.push({path: '/wallet-backup', query: {account: this.$store.state.account}})
    }
  }
}
</script>
<style scoped lang="less">
.page-group{
  padding:0 .75rem;
}
.svg-wrap{
  padding: 5rem 0;
}
.text-success{
  margin-top: 2rem;
  font-size: 18px;
}
.tip-wrap{
  margin: 1rem;
}
.tip-alert{
  background: #fbf2f1;
  color: #c2433b;
  font-size: 12px;
  padding: .3rem;
  white-space: normal;
  letter-spacing: normal;
  word-break: normal;
}
.text-center{
  text-align: center;
}
</style>
