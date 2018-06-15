<!--
****--@file     InsurancePolicy
****--@date     2018-04-08 11:10
****--@author   jhd
****--@describe   保单托管
-->
<template>
    <div class="insurance-policy">
      <x-header v-if="account === 'sic.policy'" :left-options="{backText: ''}">{{$t('policy.tip_insurance_policy')}}</x-header>
      <x-header v-else :left-options="{backText: ''}">{{$t('policy.tip_insurance_claim')}}</x-header>
      <div class="content">
          <div class="list-block">
              <ul>
                <li class="align-top">
                    <div class="item-content">
                    <div class="item-media"><i class="icon icon-form-comment"></i></div>
                    <div class="item-inner">
                        <div class="item-title label">{{$t('policy.upload_select')}}</div>
                    </div>
                    </div>
                    <div class="item-input">
                        <upload></upload>
                    </div>
                </li>
              </ul>
          </div>
          <box gap="10px 15px">
            <flexbox>
              <flexbox-item>
                <x-button type="warn" @click.native="confirm" link="/policy">{{$t('index.cancel')}}</x-button>
              </flexbox-item>
              <flexbox-item>
                <x-button type="primary" @click.native="uploadFile">{{$t('index.confirm')}}</x-button>
              </flexbox-item>
            </flexbox>
          </box>
      </div>
      <div v-transfer-dom>
        <alert v-model="show" button-text=" ">
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
import { AlertModule, XHeader, Msg, Alert, Box, XButton, Loading, Flexbox, FlexboxItem, TransferDomDirective as TransferDom } from 'vux'
import upload from '../components/upload-img'
import passwordConfirm from '../components/PasswordConfirm'
import { mapState } from 'vuex'
export default {
  directives: {
    TransferDom
  },
  data () {
    return {
      account: 'sic.policy',
      table: 'policy',
      imgs: [],
      type: 1,
      show: false,
      isUnlock: false,
      upLoadImg: false,
      formData: {
        // policyNo: '', // 保单号
        // insuredName: '', // 被保人姓名
        // insuredCertNo: '', // 被保人证件号
        // insuredCertType: '111', // 被保人证件类型
        entity: 'policy',
        type: 'LIHI',
        version: '1.0.0',
        body: {
          file: [] // 文件
        }
      },
      files: [],
      icon: 'success',
      title: this.$t('policy.success'),
      buttons: [{
        type: 'primary',
        text: this.$t('policy.look_detail'),
        onClick: this.keepOn.bind(this)
      }, {
        type: 'default',
        text: this.$t('policy.back_home'),
        link: '/'
      }]
    }
  },
  computed: {
    ...mapState({
      imgStatus: state => state.img_status,
      imgPaths: state => state.img_paths
    })
  },
  created () {
    if (this.$route.path === '/insurance-policy') {
      this.account = 'sic.policy'
      this.type = 1
    } else {
      this.account = 'sic.claim'
      this.type = 2
    }
  },
  methods: {
    uploadXHR () {
      var form = new FormData()
      this.files.map(item => {
        form.append('files', item)
      })
      var xhr = new XMLHttpRequest()
      xhr.open('post', `${this.basePath}/v1/file/uploads`, true)
      let that = this
      xhr.onload = function (res) {
        if (xhr.status === 200) {
          that.uploadSuccess(JSON.parse(res.target.response))
        } else {
          that.upLoadImg = false
          that.show = true
          that.icon = 'warn'
          that.title = that.$t('policy.error')
          setTimeout(() => {
            that.$store.commit('set_img_upload_cache', [])
          }, 500)
        }
      }
      xhr.send(form)
    },
    unlocking (pwd) {
      this.pwd = pwd
      this.upLoadImg = true
      this.uploadXHR()
    },
    uploadSuccess (data) {
      let _this = this
      this.isUnlock = false
      if (data.code === 200) {
        let accountStr
        this.$common.getStore('account').map(item => {
          if (item.account === _this.$store.state.account) {
            accountStr = item
          }
        })
        try {
          let accountData = JSON.parse(this.$common.decryptActive(accountStr.encryption, _this.pwd))
          let activeKey = this.$common.decryptActive(accountData.active, _this.pwd)
          console.log(activeKey)
          config.keyProvider = activeKey
          let eos = Eos(config)
          let t = {}
          t.files = data.data.files
          const policyContract = eos.contract(this.account)
          try {
            policyContract.then(contract => {
              contract.upload({
                id: data.data.id,
                type: _this.type,
                ossAddr: JSON.stringify(t),
                upload_num: data.data.num,
                producer: accountData.account
              }, {authorization: accountData.account}).then(res => {
                this.show = true
                this.upLoadImg = false
                this.icon = 'success'
                this.title = this.$t('policy.success')
                this.$store.commit('set_img_upload_cache', [])
              })
            })
          } catch (err) {
            alert(err)
          }
        } catch (error) {
          console.log(error)
          this.showModule()
          this.upLoadImg = false
          setTimeout(() => {
            AlertModule.hide()
          }, 3000)
        }
      } else {
        this.show = true
        this.icon = 'warn'
        this.title = this.$t('policy.error')
        setTimeout(() => {
          this.$store.commit('set_img_upload_cache', [])
        }, 500)
      }
    },
    // 提交
    uploadFile () {
      let _this = this
      if (this.$store.state.img_upload_cache.length > 0) {
        this.$store.state.img_upload_cache.map(item => {
          _this.files.push(item.file)
        })
        this.isUnlock = true
      } else {
        this.show = true
        this.icon = 'warn'
        this.title = this.$t('policy.upload_select')
      }
    },
    showModule () {
      AlertModule.show({
        title: this.$t('unlock.error.invalid_password'),
        icon: 'warn',
        content: '',
        onShow () {
          console.log('Module: I\'m showing')
        },
        onHide () {
          console.log('Module: I\'m hiding now')
        }
      })
    },
    submit () {
      let values = []
      for (let key of this.imgPaths) {
        values.push(key)
      }
      this.imgs = values
    },
    confirm () {
      this.$store.commit('set_img_upload_cache', [])
    },
    keepOn () {
      this.confirm()
      this.files = []
      this.show = false
      this.$route.path === '/insurance-policy' ? this.$store.commit('setIndex', 0) : this.$store.commit('setIndex', 1)
      this.$router.push('/policy')
    },
    setUnlock (val) {
      this.isUnlock = val
    }
  },
  watch: {
    imgStatus () {
      if (this.imgStatus === 'finished') {
        this.submit()
      }
    }
  },
  destoryed () {
    this.imgs = []
  },
  components: {
    upload,
    Alert,
    Msg,
    XButton,
    XHeader,
    Flexbox,
    Box,
    Loading,
    FlexboxItem,
    passwordConfirm
  }
}
</script>

<style scoped lang="less">
.header-wrap {
  height: 2.2rem;
}
.item-input {
  position: relative;
}
.btn {
  width: 100%;
  height: 3em;
  border-radius: 0.2rem;
  background-color: green;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
}
.label{
  font-size: 18px;
  line-height: 30px;
  padding: 10px 15px 0 15px;
}
</style>
