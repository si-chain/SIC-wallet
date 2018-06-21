<template>
    <div class="page-group">
      <x-header :left-options="{backText: ''}">{{$t('index.authorization_record')}}</x-header>
      <div style="padding-top:50px" ref="authorization" v-if="authorizationData.length > 0 || isLoading">
        <authorization-item v-if="authorizationData.length > 0" @setPwdShow="setPwdShow" v-for="(item,index) in authorizationData" :key="index" :itemData="item"></authorization-item>
        <!-- <divider class="no-more">{{ $t('policy.policy_more') }}</divider> -->
        <load-more :show-loading="false" :tip="$t('loadmsg.not_more')"></load-more>
      </div>
      <loading :show="authorizationData.length === 0 && !isLoading" text=""></loading>
      <div v-transfer-dom>
        <alert v-model="showModal" button-text=" ">
          <msg slot="default" :title="title" :buttons="buttons" :icon="icon"></msg>
        </alert>
      </div>
      <div v-transfer-dom>
        <loading :show="upLoadImg" text=""></loading>
      </div>
      <password-confirm v-if="isUnlock" ref="confirm" @setUnlock="setUnlock" @unlocking="unlocking"></password-confirm>
    </div>
</template>
<script>
import Eos from 'eosjs'
import config from '../libs/env'
import authorizationItem from '../components/authorizationItem'
import { XHeader, XButton, Alert, Loading, Msg, FormPreview, Divider, Card, Cell, Group, Flexbox, FlexboxItem, Checklist, LoadMore, TransferDomDirective as TransferDom } from 'vux'
import passwordConfirm from '../components/PasswordConfirm'
import SIC from 'sic-ecies'
export default {
  directives: {
    TransferDom
  },
  components: {
    XHeader,
    LoadMore,
    FormPreview,
    Divider,
    Card,
    Cell,
    Group,
    Flexbox,
    FlexboxItem,
    XButton,
    Checklist,
    authorizationItem,
    Alert,
    Msg,
    passwordConfirm,
    Loading
  },
  data () {
    let wallets = this.$common.get_wallets()
    return {
      wallets: wallets,
      list: [],
      reqVal: [],
      valueList: [],
      show: false,
      more: true,
      policyData: [],
      isUnlock: false,
      upLoadImg: false,
      isLoading: false,
      pwd: '',
      id: '',
      reqKey: '',
      submitData: [],
      account: this.$route.query.account,
      type: 'Agree',
      authorizationData: [],
      inlineDescList: [
        {key: '1', value: 'Tiger is good', inlineDesc: 'Tiger is the king of mountain'},
        {key: '2', value: 'Lion is better', inlineDesc: 'Lion is the king of woods'},
        {key: '3', value: 'Camel is best, no inline-desc'}
      ],
      inlineDescListValue: [],
      showModal: false,
      icon: 'success',
      title: this.$t('policy.success'),
      buttons: [{
        type: 'primary',
        text: this.$t('index.confirm'),
        onClick: this.keepOn.bind(this)
      }],
      scrollData: {
        noFlag: false
      }
    }
  },
  methods: {
    getData () {
      this.$http.get(`${this.basePath}/v1/msg/user/${this.account}?limit=100`).then(res => {
        this.isLoading = true
        this.authorizationData = this.authorizationData.concat(res.data.data.rows)
        this.more = res.data.data.more
        this.authorizationData.map(item => {
          item.isShow = false
          item.inlineDescList = this.inlineDescList
          item.inlineDescListValue = this.inlineDescListValue
        })
      })
    },
    change (val, label) {
      console.log('change', val, label)
    },
    isShow (idx) {
      this.authorizationData[idx].isShow = !this.authorizationData[idx].isShow
    },
    authHandleScroll () {
      // console.log(this.$refs.authorization.scrollTop)
      if (this.more) {
        this.getData()
      }
    },
    setPwdShow (index, type, reqKey, reqVal) {
      this.isUnlock = true
      this.id = index
      this.reqKey = reqKey
      this.type = type
      this.reqVal = reqVal
      this.getPolicyList()
    },
    getPolicyList () {
      let _this = this
      this.$http.get(`${this.basePath}/v1/policy/list/${this.$store.state.account}?limit=100`).then(res => {
        let data = res.data.data
        _this.policyData = _this.policyData.concat(data.rows)
        if (data.more) {
          _this.getPolicyList()
        } else {
          _this.policyData.map(item => {
            if (item.status === 20) {
              _this.submitData.push(item)
            }
          })
        }
      })
    },
    setUnlock (val) {
      this.isUnlock = val
    },
    unlocking (pwd) {
      this.pwd = pwd
      this.isUnlock = false
      if (this.type === 'Agree') {
        this.agressAuth()
      } else {
        this.rejectAuth()
      }
    },
    agressAuth () {
      let _this = this
      try {
        this.upLoadImg = true
        let accountStr
        this.$common.getStore('account').map(item => {
          if (item.account === _this.$store.state.account) {
            accountStr = item
          }
        })
        let accountData = JSON.parse(this.$common.decryptActive(accountStr.encryption, _this.pwd))
        let activeKey = this.$common.decryptActive(accountData.active, _this.pwd)
        config.keyProvider = activeKey
        this.reqVal.map(item => {
          let val = SIC().decrypt(item.value, activeKey)
          this.valueList.push({
            applyId: item.id,
            val: val
          })
        })
        let value = SIC().encrypt(JSON.stringify(_this.valueList), _this.reqKey)
        let eos = Eos(config)
        // 合约名
        const contractName = 'sic.auth'
        // const user = 'sic.auditor';
        const policyContract = eos.contract(contractName)

        policyContract.then(contract => {
          contract.agreeauth({
            // 请求ID
            id: _this.id,
            user: accountData.account,
            // 使用reqKey加密数据
            value: value
          }, {authorization: accountData.account}).then(res => {
            _this.upLoadImg = false
            _this.showModal = true
            _this.icon = 'success'
            _this.buttons[0].type = 'primary'
            _this.title = _this.$t('policy.success')
            _this.$http.get(`${_this.basePath}/v1/msg/user/${_this.account}?limit=100`).then(res => {
              _this.authorizationData = []
              _this.authorizationData = _this.authorizationData.concat(res.data.data.rows)
              _this.more = res.data.data.more
              _this.authorizationData.map(item => {
                item.isShow = false
                item.inlineDescList = _this.inlineDescList
                item.inlineDescListValue = _this.inlineDescListValue
              })
            })
          })
        })
      } catch (error) {
        console.log(error)
        _this.showModal = true
        _this.upLoadImg = false
        _this.buttons[0].type = 'warn'
        _this.icon = 'warn'
        _this.title = _this.$t('policy.error')
      }
    },
    rejectAuth () {
      let _this = this
      try {
        this.upLoadImg = true
        let accountStr
        this.$common.getStore('account').map(item => {
          if (item.account === _this.$store.state.account) {
            accountStr = item
          }
        })
        let accountData = JSON.parse(this.$common.decryptActive(accountStr.encryption, _this.pwd))
        let activeKey = this.$common.decryptActive(accountData.active, _this.pwd)
        config.keyProvider = activeKey
        let eos = Eos(config)
        // 合约名
        const contractName = 'sic.auth'
        const policyContract = eos.contract(contractName)
        policyContract.then(contract => {
          contract.rejectauth({
            id: _this.id,
            user: accountData.account
          }, {authorization: accountData.account}).then(res => {
            _this.authorizationData = []
            _this.upLoadImg = false
            _this.showModal = true
            _this.icon = 'success'
            _this.buttons[0].type = 'primary'
            _this.title = _this.$t('policy.success')
            _this.$http.get(`${_this.basePath}/v1/msg/user/${_this.account}?limit=100`).then(res => {
              _this.authorizationData = []
              _this.authorizationData = _this.authorizationData.concat(res.data.data.rows)
              _this.more = res.data.data.more
              _this.authorizationData.map(item => {
                item.isShow = false
                item.inlineDescList = _this.inlineDescList
                item.inlineDescListValue = _this.inlineDescListValue
              })
            })
          })
        })
      } catch (error) {
        console.log(error)
        _this.showModal = true
        _this.upLoadImg = false
        _this.buttons[0].type = 'warn'
        _this.icon = 'warn'
        _this.title = _this.$t('policy.error')
      }
    },
    keepOn () {
      // this.getData()
      this.showModal = false
    }
  },
  created () {
    this.getData()
    window.addEventListener('scroll', this.authHandleScroll, true)
  },
  watch: {
    authorizationData (newData, vla) {
      this.authorizationData = newData
    }
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
  padding:10px 70px
}
</style>
