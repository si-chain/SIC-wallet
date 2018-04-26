<!--
****--@file     InsurancePolicy
****--@date     2018-04-08 11:10
****--@author   jhd
****--@describe   保单托管
-->
<template>
    <div class="insurance-policy">
      <x-header :left-options="{backText: ''}">{{$t('policy.tip_insurance_policy')}}</x-header>
      <div class="content">
          <div class="list-block">
              <ul>
                <li class="align-top">
                    <div class="item-content">
                    <div class="item-media"><i class="icon icon-form-comment"></i></div>
                    <div class="item-inner">
                        <div class="item-title label">{{$t('policy.policy_img')}}</div>
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
                <x-button type="warn" @click.native="confirm">{{$t('index.cancel')}}</x-button>
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
    </div>
</template>

<script>
import Eos from 'eosjs'
import config from '../libs/env'
import { XHeader, Msg, Alert, Box, XButton, Flexbox, FlexboxItem, TransferDomDirective as TransferDom } from 'vux'
import upload from '../components/upload-img'
import { mapState } from 'vuex'
export default {
  directives: {
    TransferDom
  },
  data () {
    return {
      account: 'sic.policy',
      table: 'policy',
      user: 'eos',
      imgs: [],
      show: false,
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
      title: '操作成功！',
      buttons: [{
        type: 'primary',
        text: '继续上传',
        onClick: this.keepOn.bind(this)
      }, {
        type: 'default',
        text: '返回首页',
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
  methods: {
    uploadXHR () {
      var form = new FormData()
      this.files.map(item => {
        form.append('files', item)
      })
      var xhr = new XMLHttpRequest()
      xhr.open('post', 'v1/file/uploads', true)
      let that = this
      xhr.onload = function (res) {
        if (xhr.status === 200) {
          that.uploadSuccess(JSON.parse(res.target.response))
        }
      }
      xhr.send(form)
    },
    uploadSuccess (data) {
      if (data.code === 200) {
        // let _this = this
        let zrmPrivateKey = Eos.modules.ecc.seedPrivate('eos')
        let accountStr = JSON.parse(this.$common.getStore('account'))[0]

        let accountData = JSON.parse(this.$common.decryptActive(accountStr.encryption, '111111'))
        let activeKey = this.$common.decryptActive(accountData.active, '111111')
        console.log(activeKey)
        config.keyProvider = zrmPrivateKey
        let eos = Eos.Localnet(config)
        const policyContract = eos.contract(this.account)
        policyContract.then(contract => {
          contract.upload({
            producer: 'eos',
            ossID: data.data.path,
            checkcode: ''
          }).then(res => {
            console.log(res)
            this.show = true
            this.icon = 'success'
            this.title = '操作成功！'
            setTimeout(() => {
              this.$store.commit('set_img_upload_cache', [])
            }, 1000)
          })
        })
      } else {
        this.show = true
        this.icon = 'warn'
        this.title = '上传失败！'
        setTimeout(() => {
          this.$store.commit('set_img_upload_cache', [])
        }, 500)
      }
    },
    // 提交
    uploadFile () {
      console.log(this.$store.state)
      let _this = this
      // this.$store.commit('set_img_status', 'uploading');
      if (this.$store.state.img_upload_cache.length > 0) {
        this.$store.state.img_upload_cache.map(item => {
          _this.files.push(item.file)
        })
        this.uploadXHR()
      } else {
        this.show = true
        this.icon = 'warn'
        this.title = '请选择上传的图片！'
      }
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
      this.show = false
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
    FlexboxItem
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
