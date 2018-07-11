<template>
    <div class="page-group">
      <sic-header :left-options="{backText: ''}">{{$t('index.transaction_record')}}</sic-header>
      <loading :show="transferData.length === 0  && !isLoading" text=""></loading>
      <div style="padding:3.785714rem 3px 0 3px" v-if="transferData.length > 0 || isLoading" v-swipedown="{fn:vuetouchDown}" v-swipeup="{fn:vuetouchUp}">
        <load-more :tip="$t('loadmsg.more')" v-if="isTouchDown"></load-more>
        <div v-for="(item,index) in transferData" :key="index">
          <form-preview :header-label="$t('index.transaction_sum')" :header-value="transferData[index]" :body-items="list[index]"></form-preview>
          <br>
        </div>
        <!-- <divider class="no-more">{{ $t('policy.policy_more') }}</divider> -->
        <load-more v-if="!isTouchDown" :show-loading="false" :tip="$t('loadmsg.not_more')"></load-more>
        <load-more v-if="!isTouchDown && isTouchUp" :tip="$t('loadmsg.more')"></load-more>
      </div>
    </div>
</template>
<script>
import sicHeader from '../components/sicHeader'
import { FormPreview, Divider, Loading, LoadMore } from 'vux'

export default {
  components: {
    sicHeader,
    FormPreview,
    Divider,
    Loading,
    LoadMore
  },
  data () {
    let wallets = this.$common.get_wallets()
    return {
      wallets: wallets,
      list: [],
      transferData: [],
      isLoading: false,
      isTouchDown: false,
      isTouchUp: false
    }
  },
  methods: {
    goDetail (account) {
      this.$router.push({path: '/wallet-backup', query: {account: account}})
    },
    vuetouchDown (s, e) {
      console.log(11111)
      this.isTouchDown = true
      let account = this.$route.query.account
      let _this = this
      this.$http.get(`${this.basePath}/v1/chain/accounts/actions/transfer/${account}`).then(res => {
        this.isTouchDown = false
        if (res.data.data) {
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
        }
      })
    },
    vuetouchUp (s, e) {
      console.log('vuetouchUp')
      this.isTouchUp = true
      setTimeout(() => {
        this.isTouchUp = false
      }, 750)
    }
  },
  created () {
    let account = this.$route.query.account
    let _this = this
    this.$http.get(`${this.basePath}/v1/chain/accounts/actions/transfer/${account}`).then(res => {
      this.isLoading = true
      if (res.data.data) {
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
      }
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
