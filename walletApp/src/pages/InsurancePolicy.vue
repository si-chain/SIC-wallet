<!--
****--@file     InsurancePolicy
****--@date     2018-04-08 11:10
****--@author   jhd
****--@describe   保单托管
-->
<template>
    <div class="insurance-policy">
      <x-header>{{$t('policy.tip_insurance_policy')}}</x-header>
      <group>
        <cell is-link link="/insurance-policy">
          <span slot="title" style="color:green;"><span style="vertical-align:middle;">{{$t('policy.tip_insurance_policy')}}</span></span>
        </cell>
      </group>
      <divider>{{ $t('policy.policy_list') }}</divider>
      <card v-for="i in 5" :key="i">
        <cell slot="header" :title="$t('policy.upload_time')">2018-04-08</cell>
        <cell slot="content" :title="$t('policy.policy_num')">23959584737</cell>
        <step slot="footer" v-model="step" background-color='#fbf9fe'>
          <step-item :title="$t('policy.policy_status_step1')"></step-item>
          <step-item :title="$t('policy.policy_status_step2')"></step-item>
          <step-item :title="$t('policy.policy_status_step3')"></step-item>
        </step>
      </card>
    </div>
</template>

<script>
import { XHeader, Group, Box, Cell, Divider, Card, Step, StepItem } from 'vux'
export default {
  components: {
    XHeader,
    Group,
    Box,
    Cell,
    Divider,
    Card,
    Step,
    StepItem
  },
  data () {
    return {
      step: 1
    }
  },
  computed: {
  },
  methods: {
  }
}
</script>

<style scoped lang="less">
.insurance-policy{
  padding-bottom: 60px;
}
.vux-step{
  padding: 10px;
}
</style>
