<!--
****--@file     InsurancePolicy
****--@date     2018-04-08 11:10
****--@author   jhd
****--@describe   保单托管
-->
<template>
    <div class="insurance-policy">
      <x-header :left-options="{showBack: false}">{{$t('policy.tip_insurance_policy')}}</x-header>
      <group>
        <cell is-link link="/insurance-policy">
          <img slot="icon" class="policy-icon" src="../assets/icon_031.png" width="25" height="25" alt="">
          <span slot="title"><span style="vertical-align:middle;">{{$t('policy.tip_insurance_policy')}}</span></span>
        </cell>
      </group>
      <p class="list-title">
        <img src="../assets/icon_06.png" width="25" height="25" alt="">
        {{ $t('policy.policy_list') }}
      </p>
      <div class="wrapper" ref="wrapper">
        <card class="wrap-item" v-if="policyList.length > 0" v-for="(item,index) in policyList" :key="index">
          <cell slot="header" :title="$t('policy.upload_time')">{{item.upload_time.replace('T', ' ')}}</cell>
          <cell slot="content" v-if="item.status ===4" :title="$t('policy.policy_num')">{{item.policyID}}</cell>
          <cell slot="content" v-else :title="$t('policy.policy_file')">{{item.ossID}}</cell>
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
import { XHeader, Group, Box, Cell, Divider, Scroller, Card } from 'vux'
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
    Scroller
  },
  data () {
    return {
      step: 2,
      policyList: [],
      more: true,
      lowerBound: 1
    }
  },
  computed: {
  },
  methods: {
    getData () {
      let _this = this
      this.$http.get(`http://10.3.1.135:3000/v1/policy/list/${this.$store.state.account}`, { lowerBound: this.lowerBound }).then(res => {
        let data = res.data.data
        this.policyList = this.policyList.concat(data.rows)
        this.more = data.more
        if (data.rows.length > 0) {
          this.lowerBound = data.rows[data.rows.length - 1].ID
          this.$nextTick(() => {
            if (!this.scroll) {
              this.scroll = new Bscroll(this.$refs.wrapper, {})
              this.scroll.on('touchEnd', (pos) => {
                // 下拉动作
                if (this.more && pos.y > this.scroll.maxScrollY - 90) {
                  this.getData()
                }
              }, _this)
            } else {
              this.scroll.refresh()
            }
          })
        }
      })
    }
  },
  created () {
    this.getData()
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
    margin-left: 10px;
  }
}
.wrapper .wrap-item{
  // border-bottom: 1px solid #333333;
}
.weui-panel:before{
  border-top: none;
}
</style>
