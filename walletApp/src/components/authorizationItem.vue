<template>
  <div style="padding-bottom:10px">
    <card class="wrap-item">
      <cell slot="header" :title="$t('authorization.msg')">{{itemData.msg}}</cell>
      <group slot="content">
        <cell :title="$t('authorization.applicant')">{{itemData.applicant}}</cell>
        <cell :title="$t('authorization.time')">{{itemData.dt}}</cell>
        <cell :title="$t('authorization.type')">{{itemData.type | msgTyep}}</cell>
        <cell :title="$t('authorization.num')">{{itemData.reward | msgTyep}}</cell>
        <cell :title="$t('authorization.status')">{{itemData.status | msgStatus}}</cell>
        <!-- <checklist style="padding-bottom:10px" v-if="Show" :disabled="itemData.status !==0 " label-position="left" title="list" :options="itemData.inlineDescList" v-model="itemData.inlineDescListValue" @on-change="change"></checklist>
        <divider v-if="!Show"><x-icon @click="isShow" type="ios-arrow-down" size="30"></x-icon></divider>
        <divider v-else><x-icon @click="isShow" type="ios-arrow-up" size="30"></x-icon></divider> -->
      </group>
      <div slot="footer" style="padding:10px" v-if="itemData.status === 0">
        <flexbox>
          <flexbox-item>
            <x-button type="warn" @click.native="handle('Reject')">{{$t('authorization.Reject')}}</x-button>
          </flexbox-item>
          <flexbox-item>
            <x-button type="primary" @click.native="handle('Agree')">{{$t('authorization.Agree')}}</x-button>
          </flexbox-item>
        </flexbox>
      </div>
    </card>
  </div>
</template>
<script>
import { XButton, Divider, Card, Cell, Group, Flexbox, FlexboxItem, Checklist } from 'vux'
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
      status: this.itemData.status
    }
  },
  methods: {
    change (val, label) {
      console.log('change', val, label)
    },
    isShow () {
      this.Show = !this.Show
      console.log(this.Show)
    },
    handle (type) {
      this.$emit('setPwdShow', this.itemData.id, type, this.itemData.reqKey)
    }
  },
  created () {
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
