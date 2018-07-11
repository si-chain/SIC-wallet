<!--
****--@file     InsurancePolicy
****--@date     2018-04-08 11:10
****--@author   jhd
****--@describe   保单托管
-->
<template>
    <div class="list-box" :style="{height:listHeight}" ref="wrapper" id="vux_view_box_body" v-swipedown="{fn:vuetouchDown}" v-swipeup="{fn:vuetouchUp}" v-swipeleft="{fn:vuetouchLeft}" v-swiperight="{fn:vuetouchRight}">
          <cell is-link link="/insurance-policy" style="border-bottom:1px solid #ddd">
            <img slot="icon" class="policy-icon" src="../assets/icon_031.png" width="25" height="25" alt="">
            <span slot="title"><span style="vertical-align:middle;">{{$t('policy.tip_insurance_policy')}}</span></span>
          </cell>
        <div style="height:3.142857rem;">
            <tab style="margin-top:0.714286rem;" v-model="index" prevent-default @on-before-index-change="switchTabItem">
              <tab-item v-if="index === 0" selected>{{$t('policy.history_policy')}}</tab-item>
              <tab-item v-else>{{$t('policy.history_policy')}}</tab-item>
            </tab>
        </div>
        <div ref="viewBox" class="wrapper" v-if="policyList.length > 0 || isLoading" >
          <div>
            <load-more tip=" " v-if="isTouchDown"></load-more>
            <card class="wrap-item" v-if="policyList.length > 0" v-for="(item,index) in policyList" :key="index">
              <cell slot="header" :title="$t('policy.upload_time')">{{item.upload_time | moment('YYYY MM DD hh:mm:ss')}}</cell>
              <cell slot="content" v-if="item.status === 5" :title="$t('policy.policy_file')">{{item.ID}}</cell>
              <cell slot="content" v-if="item.status === 4" :title="$t('policy.policy_num')"><span style="color:#3287fd">{{item.policyID}}</span></cell>
              <cell slot="content" v-if="item.status === 5" :title="$t('policy.policy_value')"><span style="color:#f59902">{{item.value}}</span></cell>
              <cell slot="content" v-if="item.status === 2 || item.status === 1" :title="$t('policy.policy_file')">{{item.ID}}</cell>
              <step slot="footer" class="step" v-model="item.status" background-color='#fbf9fe'>
                <step-item :title="$t('policy.policy_status_step1')"></step-item>
                <step-item :title="$t('policy.policy_status_step2')"></step-item>
                <step-item v-if="item.status === 5" class="is-error-step" :title="$t('policy.policy_status_step4')"></step-item>
                <step-item v-else :title="$t('policy.policy_status_step3')"></step-item>
              </step>
            </card>
          </div>
        </div>
        <div v-if="notmore">
          <load-more tip=" "></load-more>
        </div>
        <div v-else-if="!more">
          <divider class="no-more">{{ $t('policy.policy_more') }}</divider>
          <p class="no-more-tip">{{$t('policy.upload_nomore_tip')}}</p>
        </div>
        <div v-else>
          <load-more :tip="$t('loadmsg.more')"></load-more>
        </div>
        <loading :show="policyList.length === 0  && !isLoading" text=""></loading>
      </div>
</template>

<script>
// import Bscroll from 'better-scroll'
import Step from '../components/step'
import StepItem from '../components/step-Item'
import { XHeader, Group, Loading, Box, Tab, TabItem, Cell, Divider, Scroller, Card, LoadMore } from 'vux'
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
    TabItem,
    Loading,
    LoadMore
  },
  data () {
    return {
      listHeight: '37.3rem',
      index: 0,
      policyList: [],
      more: true,
      lowerBound: 1,
      isTouchDown: false,
      isLoading: false,
      notmore: false,
      disabled: typeof navigator !== 'undefined' && /iphone/i.test(navigator.userAgent) && /ucbrowser/i.test(navigator.userAgent),
      url: `${this.basePath}/v1/policy/list/${this.$store.state.account}`
    }
  },
  methods: {
    vuetouchDown (s, e) {
      this.lowerBound = 1
      this.isTouchDown = true
      setTimeout(() => {
        let _this = this
        this.$http.get(this.url, { lowerBound: this.lowerBound }).then(res => {
          this.isTouchDown = false
          let data = res.data.data
          _this.policyList = data.rows
          _this.policyList.map(item => {
            item.status === 0 ? item.status = 1 : item.status === 10 ? item.status = 1 : item.status === 20 ? item.status = 4 : item.status === 30 ? item.status = 5 : item.status = 5
          })
          _this.more = data.more
          if (data.rows.length > 0) {
            _this.lowerBound = data.rows[data.rows.length - 1].ID
          }
        })
      }, 750)
    },
    vuetouchUp (s, e) {
      this.notmore = true
      setTimeout(() => {
        this.notmore = false
      }, 750)
    },
    vuetouchLeft (s, e) {
      this.$common.go(`/home?account=this.$route.query.account || this.$store.state.account`, this.$router)
    },
    vuetouchRight (s, e) {
      this.$common.go(`/`, this.$router)
    },
    getPolicyData () {
      let _this = this
      this.$http.get(this.url, { lowerBound: this.lowerBound }).then(res => {
        this.isLoading = true
        let data = res.data.data
        _this.policyList = _this.policyList.concat(data.rows)
        _this.policyList.map(item => {
          item.status === 0 ? item.status = 1 : item.status === 10 ? item.status = 1 : item.status === 20 ? item.status = 4 : item.status === 30 ? item.status = 5 : item.status = 5
        })
        _this.more = data.more
        if (data.rows.length > 0) {
          _this.lowerBound = data.rows[data.rows.length - 1].ID
        }
      })
    },
    policyHandleScroll (event) {
      if (event.target.scrollTop + event.target.clientHeight === event.target.scrollHeight) {
        if (this.more) {
          this.getPolicyData()
        }
      }
    },
    switchTabItem (index) {
      this.index = index
      this.isLoading = false
      if (index === 0) {
        this.url = `${this.basePath}/v1/policy/list/${this.$store.state.account}?limit=100`
        this.$store.commit('setIndex', 1)
      } else {
        this.url = `${this.basePath}/v1/claim/list/${this.$store.state.account}?limit=100`
        this.$store.commit('setIndex', 0)
      }
      this.policyList = []
      this.getPolicyData()
    }
  },
  created () {
    if (!this.$route.params.account) {
      this.$router.push(`/policy?account=${this.$store.state.account}`)
    }
    this.index = this.$store.state.index
    if (this.index === 0) {
      this.url = `${this.basePath}/v1/policy/list/${this.$store.state.account}?limit=100`
    } else {
      this.url = `${this.basePath}/v1/claim/list/${this.$store.state.account}?limit=100`
    }
    this.getPolicyData()
    window.addEventListener('scroll', this.policyHandleScroll, true)
    this.listHeight = window.screen.availHeight / 14 - 8.357143 + 'rem'
  },
  watch: {
    index (val) {}
  }
}
</script>

<style scoped lang="less">
.insurance-policy{
  // margin-top: 8.357143rem;
}
.no-more {
  padding:10px 70px
}
.vux-header{
  position: absolute;
  width: 100%;
  z-index: 9999;
  top:0;
}
.vux-tab .vux-tab-item{
  font-size: 17px;
}
.list-box{
  position: absolute;
  top: 8.357143rem;
  overflow-y: scroll;
  height: 100%;
  width: 100%;
}
.wrapper{
  overflow-y: scroll;
}
.vux-step{
  margin:0 10px;
  padding:5px 0 10px 0;
  border-bottom: 1px solid #dddddd;
}
.policy-icon{
  vertical-align: middle;
  margin-right: 10px;
}
.list-title{
  font-size: 16px;
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
.is-error-step{

  color: #f59902!important;
}
.weui-panel:before{
  border-top: none;
}
.no-more-tip{
  width:80%;
  text-align:center;
  margin:0 auto;
  font-size: 12px;
  line-height: 16px;
  color: #999;
}
</style>
