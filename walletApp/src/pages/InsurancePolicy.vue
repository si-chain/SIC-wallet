<!--
****--@file     InsurancePolicy
****--@date     2018-04-08 11:10
****--@author   jhd
****--@describe   保单托管
-->
<template>
    <div class="insurance-policy">
      <x-header>{{$t('wallet_create.index.tip_insurance_policy')}}</x-header>
        <div class="content">
            <div class="list-block">
                <ul>
                  <li class="align-top">
                      <div class="item-content">
                      <div class="item-media"><i class="icon icon-form-comment"></i></div>
                      <div class="item-inner">
                          <div class="item-title label">保单图片</div>
                      </div>
                      </div>
                      <div class="item-input">
                          <upload url="v1/file/upload"></upload>
                      </div>
                  </li>
                </ul>
            </div>
            <flexbox>
              <flexbox-item>
                <x-button type="warn" @click.native="confirm">取消</x-button>
              </flexbox-item>
              <flexbox-item>
                <x-button type="primary" @click.native="uploadFile">确定</x-button>
              </flexbox-item>
            </flexbox>
        </div>
    </div>
</template>

<script>
import { XHeader, XButton, Flexbox, FlexboxItem } from 'vux'
import upload from '../components/upload-img'
import { mapState } from 'vuex'
export default {
  data () {
    return {
      imgs: [],
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
      }
    }
  },
  computed: {
    ...mapState({
      imgStatus: state => state.img_status,
      imgPaths: state => state.img_paths
    })
  },
  methods: {
    // 提交
    uploadFile () {
      // this.$store.commit('set_img_status', 'uploading');
      if (this.$store.state.img_upload_cache.length > 0) {
        this.$store.state.img_upload_cache.map(item => {
          this.formData.body.file.push({
            fileHash: item.md5,
            fileUrl: item.url
          })
        })
        let opt = {
          ajaxSuccess: res => {
            if (res.code === 200) {
              setTimeout(() => {
                this.$store.commit('set_img_upload_cache', [])
              }, 1000)
            }
          },
          error: res => {
            console.log(res)
          },
          ajaxParams: {
            url: 'policy/trust',
            method: 'post',
            data: this.formData,
            jsonString: true
          }
        }
        this.ajax(opt)
      } else {
        console.log('error')
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
    XButton,
    XHeader,
    Flexbox,
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
</style>
