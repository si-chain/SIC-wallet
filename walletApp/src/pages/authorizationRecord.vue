<template>
    <div class="page-group">
      <x-header :left-options="{backText: ''}">{{$t('index.authorization_record')}}</x-header>
      <div style="padding-top:50px">
        <card class="wrap-item" v-for="(item,index) in authorizationData" :key="index">
          <cell slot="header" :title="$t('authorization.msg')">{{item.msg}}</cell>
          <group slot="content">
            <cell :title="$t('authorization.applicant')">{{item.applicant}}</cell>
            <cell :title="$t('authorization.time')">{{item.dt}}</cell>
            <cell :title="$t('authorization.type')">{{item.type | msgTyep}}</cell>
            <cell :title="$t('authorization.num')">{{item.reward | msgTyep}}</cell>
            <cell :title="$t('authorization.status')">{{item.status | msgStatus}}</cell>
          </group>
          <div slot="footer" style="padding:10px" v-if="item.status === 0">
            <flexbox>
              <flexbox-item>
                <x-button type="warn">{{$t('authorization.Reject')}}</x-button>
              </flexbox-item>
              <flexbox-item>
                <x-button type="primary">{{$t('authorization.Agree')}}</x-button>
              </flexbox-item>
            </flexbox>
          </div>
        </card>
        <divider class="no-more">{{ $t('policy.policy_more') }}</divider>
      </div>
    </div>
</template>
<script>
import { XHeader, XButton, FormPreview, Divider, Card, Cell, Group, Flexbox, FlexboxItem } from 'vux'

export default {
  components: {
    XHeader,
    FormPreview,
    Divider,
    Card,
    Cell,
    Group,
    Flexbox,
    FlexboxItem,
    XButton
  },
  data () {
    let wallets = this.$common.get_wallets()
    return {
      wallets: wallets,
      list: [],
      account: this.$route.query.account,
      authorizationData: []
    }
  },
  methods: {
    getData () {
      this.$http.get(`${this.basePath}/v1/msg/user/${this.account}`).then(res => {
        this.authorizationData = res.data.data.rows
      })
    }
  },
  created () {
    this.getData()
    window.addEventListener('scroll', this.handleScroll, true)
  }
}
</script>
<style scoped lang="less">
.page-group{
  background: #efeff4;
  height: 100%;
}
.vux-header{
  position: absolute;
  width: 100%;
  z-index: 9999;
  top:0;
}
</style>
