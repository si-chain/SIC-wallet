<template>
  <div style="padding: 15px 10px">
    <card class="wrap-item">
      <cell slot="header" :title="$t('authorization.msg')">{{itemData.msg}}</cell>
      <group slot="content">
        <cell :title="$t('authorization.applicant')">{{itemData.applicant}}</cell>
        <cell :title="$t('authorization.time')">{{itemData.dt}}</cell>
        <cell :title="$t('authorization.type')">{{itemData.type | msgTyep}}</cell>
        <cell :title="$t('authorization.num')">{{itemData.reward | msgTyep}}</cell>
        <cell :title="$t('authorization.status')">{{itemData.status | msgStatus}}</cell>
        <div v-if="this.itemData.status === 0">
          <div v-if="Show">
            <p style="padding:5px 10px" v-for="child in applayList" :key="child.applyId">请求编号：
              <span style="float:right">{{child.applyId}}</span>
            </p>
          </div>
          <!-- <checklist style="padding-bottom:10px" :disabled="itemData.status !==0 " label-position="left" title="list" :options="itemData.inlineDescList" v-model="itemData.inlineDescListValue" @on-change="change"></checklist> -->
          <divider v-if="!Show"><x-icon @click="isShow" type="ios-arrow-down" size="30"></x-icon></divider>
          <divider v-else><x-icon @click="isShow" type="ios-arrow-up" size="30"></x-icon></divider>
        </div>
      </group>
      <div slot="footer" style="padding:10px" v-if="itemData.status === 0">
        <flexbox>
          <flexbox-item>
            <x-button type="warn" :disabled="applayListValue.length === 0" @click.native="handle('Reject')">{{$t('authorization.Reject')}}</x-button>
          </flexbox-item>
          <flexbox-item>
            <x-button type="primary" :disabled="applayListValue.length === 0" @click.native="handle('Agree')">{{$t('authorization.Agree')}}</x-button>
          </flexbox-item>
        </flexbox>
      </div>
    </card>
  </div>
</template>
<script>
import { AlertModule, XButton, Divider, Card, Cell, Group, Flexbox, FlexboxItem, Checklist } from 'vux'
export default {
  props: {
    itemData: Object
  },
  components: {
    Card, Cell, Group, Flexbox, FlexboxItem, Checklist, Divider, XButton
  },
  data () {
    return {
      Show: this.itemData.isShow,
      status: this.itemData.status,
      applayList: [],
      applayListValue: []
    }
  },
  methods: {
    change (val, label) {
      console.log('change', val, label)
    },
    isShow () {
      this.Show = !this.Show
    },
    handle (type) {
      console.log(this.applayListValue)
      this.$emit('setPwdShow', this.itemData.id, type, this.itemData.reqKey, this.applayListValue)
    }
  },
  created () {
    // let applayList = []
    // applayList = this.itemData.authValue.split('},')
    if (this.itemData.status === 0) {
      this.applayList = JSON.parse(this.itemData.authValue)
      let _this = this
      this.applayList.map(item => {
        this.$http.get(`${this.basePath}/v1/policy/account/${this.$store.state.account}/${item.applyId}`).then(res => {
          _this.applayListValue.push({
            id: item.applyId,
            value: res.data.data.value
          })
        }).catch(() => {
          AlertModule.show({
            title: this.$t('authorization.tip'),
            content: this.$t('authorization.msg')
          })
        })
      })
    }
    this.itemData.inlineDescList.map(item => {
      this.itemData.inlineDescListValue.push(item.key)
    })
  },
  watch: {
    status (val, newval) {
      console.log(val, newval)
    }
  }
}
</script>
