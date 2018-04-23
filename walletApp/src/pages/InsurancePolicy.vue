<!--
****--@file     InsurancePolicy
****--@date     2018-04-08 11:10
****--@author   jhd
****--@describe   保单托管
-->
<template>
    <div class="insurance-policy">
        <header class="bar bar-nav">
            <h3 class="title">{{$t('wallet_create.index.tip_insurance_policy')}}</h3>
        </header>
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
            <div class="content-block">
                <div class="row">
                <div class="col-50"><a href="#" class="button button-big button-fill button-danger" @click="confirm">取消</a></div>
                <div class="col-50"><a href="#" class="button button-big button-fill button-success" @click="uploadFile">提交</a></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
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
    upload
  }
}
</script>

<style scoped lang="less">
.header-wrap {
  height: 2.2rem;
}
.insurance-policy {
  margin: 8px;
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
