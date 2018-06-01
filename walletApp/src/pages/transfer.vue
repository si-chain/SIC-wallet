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
          <x-button :text="$t('transfer.title')" :link="`/transfer-detail?account=${$route.query.account}`"></x-button>
        </flexbox-item>
        <flexbox-item>
          <x-button v-if="isIdentity" type="primary" :text="$t('transfer.extract')" :link="`/withdraw?account=${$route.query.account}`"></x-button>
          <x-button v-else :text="$t('transfer.extract')" type="primary" @click.native="ShowIdentityMsg = !ShowIdentityMsg"></x-button>
        </flexbox-item>
      </flexbox>
    </div>
    <div v-transfer-dom>
        <alert v-model="ShowIdentityMsg" button-text=" ">
          <msg slot="default" :description="$t('withdraw.msg')" :buttons="buttons" :icon="icon"></msg>
        </alert>
    </div>
  </div>
</template>
<script>
import { Flexbox, FlexboxItem, XButton, XHeader, FormPreview, Divider, Alert, Msg, Loading, TransferDomDirective as TransferDom } from 'vux'
export default{
  directives: {
    TransferDom
  },
  components: {
    Flexbox,
    FlexboxItem,
    XButton,
    XHeader,
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
        _this.list.push([{
          label: _this.$t('transfer.to'),
          value: item.to
        }, {
          label: _this.$t('transfer.memo'),
          value: item.memo
        }])
        account === item.from ? _this.transferData.push('<span style="color:red">-' + item.quantity + '</span>') : _this.transferData.push('<span style="color:green">+' + item.quantity + '</span>')
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
  bottom:1px;
  width: 100%;
}
.no-more {
  padding:10px 70px
}
</style>

