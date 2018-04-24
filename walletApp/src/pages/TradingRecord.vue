<template>
    <div class="page-group">
      <x-header :left-options="{backText: '返回'}">记录</x-header>
      <form-preview :header-label="$t('交易金额')" header-value="10.000 sic" :body-items="list"></form-preview>
    </div>
    
</template>
<script>
import { XHeader, FormPreview } from 'vux'

export default {
  components: {
    XHeader,
    FormPreview
  },
  data () {
    let wallets = this.$common.get_wallets()
    return {
      wallets: wallets,
      list: [{
        label: '交易账户',
        value: 'yyt'
      }, {
        label: '备注',
        value: '交易费'
      }]
    }
  },
  methods: {
    goDetail (account) {
      this.$router.push({path: '/wallet-backup', query: {account: account}})
    }
  },
  mounted () {
  }
}
</script>
<style scoped lang="less">
.page-group{
  background: #efeff4;
  height: 100%;
}
</style>
