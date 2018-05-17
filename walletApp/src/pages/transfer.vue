<template>
  <div>
    <x-header :left-options="{backText: ''}">{{$t('transfer.header')}}</x-header>
    <loading :show="transferData.length === 0  && !isLoading" text=""></loading>
    <div style="padding:50px 3px 0 3px" v-if="transferData.length > 0 || isLoading">
      <div v-for="(item,index) in transferData" :key="index">
        <form-preview :header-label="$t('index.transaction_sum')" :header-value="transferData[index]" :body-items="list[index]"></form-preview>
        <br>
      </div>
      <divider class="no-more">{{ $t('policy.policy_more') }}</divider>
    </div>
    <div class="transfer-bom">
      <flexbox>
        <flexbox-item>
          <x-button type="primary" :text="$t('transfer.title')" :link="`/transfer-detail?account=${$route.query.account}`"></x-button>
        </flexbox-item>
        <flexbox-item>
          <x-button type="primary" :text="$t('transfer.extract')" :link="`/transfer-detail?account=${$route.query.account}`"></x-button>
        </flexbox-item>
      </flexbox>
    </div>
  </div>
</template>
<script>
import { Flexbox, FlexboxItem, XButton, XHeader, FormPreview, Divider, Loading } from 'vux'
export default{
  components: {
    Flexbox,
    FlexboxItem,
    XButton,
    XHeader,
    FormPreview,
    Divider,
    Loading
  },
  data () {
    return {
      list: [],
      transferData: [],
      isLoading: false
    }
  },
  created () {
    let account = this.$route.query.account
    let _this = this
    this.$http.get(`${this.basePath}/v1/chain/accounts/actions/transfer/${account}`).then(res => {
      this.isLoading = true
      let data = res.data.data.records
      data.map(item => {
        _this.list.push([{
          label: _this.$t('transfer.to'),
          value: item.to
        }, {
          label: _this.$t('transfer.memo'),
          value: item.memo
        }])
        _this.transferData.push(item.quantity)
      })
    })
  }
}
</script>
<style lang="less" scoped>
.vux-header{
  position: absolute;
  width: 100%;
  z-index: 9999;
  top:0;
}
.transfer-bom{
  position: absolute;
  bottom:1px;
  width: 100%;
}
.no-more {
  padding:10px 70px
}
</style>

