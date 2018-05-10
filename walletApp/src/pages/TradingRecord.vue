<template>
    <div class="page-group">
      <x-header :left-options="{backText: ''}">{{$t('index.transaction_record')}}</x-header>
      <div style="padding-top:50px">
        <div v-for="(item,index) in transferData" :key="index">
          <form-preview :header-label="$t('index.transaction_sum')" :header-value="transferData[index]" :body-items="list[index]"></form-preview>
          <br>
        </div>
        <divider class="no-more">{{ $t('policy.policy_more') }}</divider>
      </div>
    </div>
</template>
<script>
import { XHeader, FormPreview, Divider } from 'vux'

export default {
  components: {
    XHeader,
    FormPreview,
    Divider
  },
  data () {
    let wallets = this.$common.get_wallets()
    return {
      wallets: wallets,
      list: [],
      transferData: []
    }
  },
  methods: {
    goDetail (account) {
      this.$router.push({path: '/wallet-backup', query: {account: account}})
    }
  },
  created () {
    let account = this.$route.query.account
    let _this = this
    this.$http.get(`${this.basePath}/v1/chain/accounts/actions/transfer/${account}`).then(res => {
      let data = res.data.data
      data.map(item => {
        _this.list.push([{
          label: _this.$t('transfer.to'),
          value: item.data.to
        }, {
          label: _this.$t('transfer.memo'),
          value: item.data.memo
        }])
        _this.transferData.push(item.data.quantity)
      })
    })
  }
}
</script>
<style scoped lang="less">
.page-group{
  height: 100%;
}
.vux-header{
  position: absolute;
  width: 100%;
  z-index: 9999;
  top:0;
}
</style>
