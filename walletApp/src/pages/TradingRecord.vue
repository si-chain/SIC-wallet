<template>
    <div class="page-group">
      <x-header :left-options="{backText: ''}">{{$t('index.transaction_record')}}</x-header>
      <loading :show="transferData.length === 0  && !isLoading" text=""></loading>
      <div style="padding:3.785714rem 3px 0 3px" v-if="transferData.length > 0 || isLoading">
        <div v-for="(item,index) in transferData" :key="index">
          <form-preview :header-label="$t('index.transaction_sum')" :header-value="transferData[index]" :body-items="list[index]"></form-preview>
          <br>
        </div>
        <divider class="no-more">{{ $t('policy.policy_more') }}</divider>
      </div>
    </div>
</template>
<script>
import { XHeader, FormPreview, Divider, Loading } from 'vux'

export default {
  components: {
    XHeader,
    FormPreview,
    Divider,
    Loading
  },
  data () {
    let wallets = this.$common.get_wallets()
    return {
      wallets: wallets,
      list: [],
      transferData: [],
      isLoading: false
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
      this.isLoading = true
      let data = res.data.data.records
      data.map(item => {
        if (account === item.from) {
          _this.list.push([{
            label: _this.$t('transfer.to'),
            value: item.to
          }, {
            label: _this.$t('transfer.memo'),
            value: item.memo
          }])
          _this.transferData.push('<span style="color:#f59902">-' + item.quantity + '</span>')
        } else {
          _this.list.push([{
            label: _this.$t('transfer.to'),
            value: item.from
          }, {
            label: _this.$t('transfer.memo'),
            value: item.memo
          }])
          _this.transferData.push('<span style="color:rgb(72, 114, 220)">+' + item.quantity + '</span>')
        }
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
.no-more {
  padding:0.714286rem 5.0rem;
  margin-top: -1.071429rem;
}
</style>
