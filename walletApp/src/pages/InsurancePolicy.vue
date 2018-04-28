<!--
****--@file     InsurancePolicy
****--@date     2018-04-08 11:10
****--@author   jhd
****--@describe   保单托管
-->
<template>
    <div class="insurance-policy">
      <x-header :left-options="{showBack: false}">{{$t('policy.tip_insurance')}}</x-header>
      <group>
        <cell is-link link="/insurance-policy">
          <img slot="icon" class="policy-icon" src="../assets/icon_031.png" width="25" height="25" alt="">
          <span slot="title"><span style="vertical-align:middle;">{{$t('policy.tip_insurance_policy')}}</span></span>
        </cell>
        <cell is-link link="/insurance-claim">
          <img slot="icon" class="policy-icon" src="../assets/icon_06.png" width="25" height="25" alt="">
          <span slot="title"><span style="vertical-align:middle;">{{$t('index.claim_trusteeship')}}</span></span>
        </cell>
      </group>
      <tab style="margin-top:10px;" v-model="index" prevent-default @on-before-index-change="switchTabItem">
        <tab-item v-if="index === 0" selected>{{$t('policy.tip_insurance_policy')}}</tab-item>
        <tab-item v-else>{{$t('policy.tip_insurance_policy')}}</tab-item>
        <tab-item v-if="index === 1" selected>{{$t('index.claim_trusteeship')}}</tab-item>
        <tab-item v-else>{{$t('index.claim_trusteeship')}}</tab-item>
      </tab>
      <p class="list-title" v-if="index === 0">
        <img src="../assets/list.png" width="20" height="25" alt="">
        {{ $t('policy.policy_list') }}
      </p>
      <p class="list-title" v-else>
        <img src="../assets/list.png" width="20" height="25" alt="">
        {{ $t('index.claim_trusteeship') }}
      </p>
      <div class="wrapper" ref="wrapper">
        <card class="wrap-item" v-if="policyList.length > 0" v-for="(item,index) in policyList" :key="index">
          <cell slot="header" :title="$t('policy.upload_time')">{{item.upload_time.replace('T', ' ')}}</cell>
          <cell slot="content" v-if="item.status ===4" :title="$t('policy.policy_num')">{{item.policyID}}</cell>
          <cell slot="content" v-else :title="$t('policy.policy_file')">{{item.ID}}</cell>
          <step slot="footer" class="step" v-model="item.status" background-color='#fbf9fe'>
            <step-item :title="$t('policy.policy_status_step1')"></step-item>
            <step-item :title="$t('policy.policy_status_step2')"></step-item>
            <step-item v-if="item.status ===4" :title="$t('policy.policy_status_step4')"></step-item>
            <step-item v-else :title="$t('policy.policy_status_step3')"></step-item>
          </step>
        </card>
      </div>
      <divider class="no-more" v-if="!more">{{ $t('policy.policy_more') }}</divider>
    </div>
</template>

<script>
import Bscroll from 'better-scroll'
import Step from '../components/step'
import StepItem from '../components/step-Item'
import { XHeader, Group, Box, Tab, TabItem, Cell, Divider, Scroller, Card } from 'vux'
export default {
  components: {
    XHeader,
    Group,
    Box,
    Cell,
    Divider,
    Card,
    Step,
    StepItem,
    Scroller,
    Tab,
    TabItem
  },
  data () {
    return {
      index: 0,
      policyList: [],
      more: true,
      lowerBound: 1,
      url: `${this.basePath}/v1/policy/list/${this.$store.state.account}`
    }
  },
  methods: {
    getData () {
      let _this = this
      this.$http.get(this.url, { lowerBound: this.lowerBound }).then(res => {
        let data = res.data.data
        _this.policyList = _this.policyList.concat(data.rows)
        _this.more = data.more
        if (data.rows.length > 0) {
          _this.lowerBound = data.rows[data.rows.length - 1].ID
          _this.$nextTick(() => {
            if (!_this.scroll) {
              _this.scroll = new Bscroll(_this.$refs.wrapper, {})
              _this.scroll.on('touchEnd', (pos) => {
                // 下拉动作
                if (_this.more && pos.y > _this.scroll.maxScrollY - 90) {
                  _this.getData()
                }
              }, _this)
            } else {
              _this.scroll.refresh()
            }
          })
        }
      })
    },
    switchTabItem (index) {
      this.index = index
      if (index === 0) {
        this.url = `${this.basePath}/v1/policy/list/${this.$store.state.account}`
        this.$store.commit('setIndex', 1)
      } else {
        this.url = `${this.basePath}/v1/claim/list/${this.$store.state.account}`
        this.$store.commit('setIndex', 0)
      }
      this.policyList = []
      this.getData()
    }
  },
  created () {
    this.index = this.$store.state.index
    if (this.index === 0) {
      this.url = `${this.basePath}/v1/policy/list/${this.$store.state.account}`
    } else {
      this.url = `${this.basePath}/v1/claim/list/${this.$store.state.account}`
    }
    this.getData()
  },
  watch: {
    index (val) {
      // this.getData()
    }
  }
}
</script>

<style scoped lang="less">
.insurance-policy{
  padding-bottom: 60px;
}
.no-more {
  padding:10px 70px
}
.vux-step{
  margin:0 10px;
  padding:5px 0 10px 0;
  border-bottom: 1px solid #333333;
}
.policy-icon{
  vertical-align: middle;
  margin-right: 10px;
}
.list-title{
  margin-top: 15px;
  padding: 5px 0;
  background-color: #ffffff;
  img{
    vertical-align: middle;
    margin-left: 18px;
  }
}
.wrapper .wrap-item{
  padding:10px 0;
}
.weui-panel:before{
  border-top: none;
}
</style>
