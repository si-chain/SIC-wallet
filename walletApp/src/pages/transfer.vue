<template>
  <div>
    <sic-header :left-options="{backText: ''}">{{$t('transfer.header')}}</sic-header>
    <loading :show="transferData.length === 0  && !isLoading" text=""></loading>
    <div style="padding:3.714286rem 3px 0 3px" v-if="transferData.length > 0 || isLoading">
      <div v-for="(item,index) in transferData" :key="index">
        <form-preview :header-label="$t('index.transaction_sum')" :header-value="transferData[index]" :body-items="list[index]"></form-preview>
        <br>
      </div>
      <divider class="no-more">{{ $t('policy.policy_more') }}</divider>
    </div>
    <div class="transfer-bom button-block">
      <x-button type="primary" :text="$t('transfer.title')" :link="`/transfer-detail?account=${$route.query.account}`"></x-button>
      <x-button v-if="isIdentity" :text="$t('withdraw.extract')" :link="`/withdraw?account=${$route.query.account}`"></x-button>
      <x-button v-else :text="$t('withdraw.extract')" @click.native="ShowIdentityMsg = !ShowIdentityMsg"></x-button>
    </div>
    <div v-transfer-dom>
        <alert v-model="ShowIdentityMsg" button-text=" ">
          <msg slot="default" :description="$t('withdraw.msg')" :buttons="buttons" :icon="icon"></msg>
        </alert>
    </div>
  </div>
</template>
<script>
import sicHeader from '../components/sicHeader'
import { XButton, FormPreview, Divider, Alert, Msg, Loading, TransferDomDirective as TransferDom } from 'vux'
export default{
  directives: {
    TransferDom
  },
  components: {
    XButton,
    sicHeader,
    FormPreview,
    Divider,
    Loading,
    Alert,
    Msg
  },
  data () {
    return {
      list: [],
      transferData: [],
      icon: 'waiting',
      buttons: [{
        type: 'primary',
        text: this.$t('index.goIdentity'),
        link: `/identity-authentication?account=${this.$route.query.account}`
      }, {
        type: 'default',
        text: this.$t('index.cancel'),
        onClick: this.cancel.bind(this)
      }],
      isLoading: false,
      isIdentity: false,
      ShowIdentityMsg: false
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
    if (this.$store.state.IdentityAccount.indexOf(this.$store.state.account) > -1) {
      this.isIdentity = true
    } else {
      this.isIdentity = false
    }
  },
  methods: {
    cancel () {
      this.ShowIdentityMsg = false
    }
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
  width: 100%;
  bottom: 0;
  display: flex;
  justify-content: flex-start;
  .weui-btn_primary{
    flex: 3.5
  }
  .weui-btn_default{
    flex: 2
  }
}
.weui-btn + .weui-btn{
  margin-top:0;
}
.no-more {
  padding:0.714286rem 5.0rem
}
</style>

