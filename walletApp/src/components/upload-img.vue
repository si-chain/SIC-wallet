<!--
****--@file     upload-img
****--@date     2018-04-08 9:50
****--@author   jhd
****--@describe   图片上传组件
-->
<template>
  <div class="imgUploader">
    <div class="file-list">
      <section
        v-for="(file, index) in imgStore" :key="index"
        class="file-item draggable-item"
      >
        <img :src="file.src" alt="" ondragstart="return false;">
        <span class="file-remove" @click="remove(index)">+</span>
        <span class="flie-loading file-tip" v-if="imgStatus==='uploading'">上传中...</span>
        <span class="flie-finished file-tip" v-if="imgStatus==='finished'">已上传</span>
        <span class="flie-error file-tip" v-if="imgStatus==='error'">上传失败！</span>
      </section>
      <section class="file-item" v-if="imgStore.length < 20">
        <div class="add">
          <span>+</span>
          <!-- accept="image/jpeg,image/png" capture="camera" -->
          <input type="file" multiple accept="image/*"
            @change="selectImgs" ref="file"
          >
        </div>
      </section>
    </div>
    <!-- <div class="uploadBtn">
      <section>
        <span v-if="imgStore.length > 0" class="empty"
          @click="empty">
            {{imgStatus === 'finished' ? '重新上传' : '清空'}}
        </span>
      </section>
    </div>-->
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  props: ['url'],
  data () {
    return {
      files: [], // 文件缓存
      index: 0, // 序列号
      maxLength: 20 // 图片最大数量
    }
  },
  computed: {
    ...mapState({
      imgStore: state => state.img_upload_cache,
      imgPaths: state => state.img_paths,
      imgStatus: state => state.img_status
    })
  },
  methods: {
    selectImgs () {
      var fileObj = this.$refs.file.files[0]
      var form = new FormData()
      form.append('file', fileObj)
      var xhr = new XMLHttpRequest()
      xhr.open('post', this.url, true)
      let that = this
      xhr.onload = function (res) {
        if (xhr.status === 200) {
          that.setStoreImg(JSON.parse(res.target.response))
        }
      }
      xhr.send(form)
    },
    setStoreImg (data) {
      if (data.code === 200) {
        let fileList = this.$refs.file.files
        for (let i = 0, len = fileList.length; i < len; i++) {
          let item = {
            key: this.index++,
            name: data.data.name,
            size: fileList[i].size,
            file: fileList[i],
            url: data.data.url,
            md5: data.data.md5
          }
          // 将图片文件转成BASE64格式
          let reader = new FileReader()
          reader.onload = e => {
            this.$set(item, 'src', e.target.result)
          }
          reader.readAsDataURL(fileList[i])
          this.files.push(item)
        }
        this.$store.commit('set_img_upload_cache', this.files) // 存储文件缓存
        this.$store.commit('set_img_status', 'finished') // 更新文件上传状态
      } else {
        this.$store.commit('set_img_status', 'error')
      }
    },
    // 移除图片
    remove (index) {
      this.files.splice(index, 1)
      this.$store.commit('set_img_upload_cache', this.files) // 更新存储文件缓存
    }
  },
  beforeCreate () {
    this.$store.commit('set_img_status', 'ready') // 更新文件上传状态
  },
  destroyed () {
    this.$store.commit('set_img_upload_cache', [])
    this.$store.commit('set_img_paths', [])
  },
  watch: {
    imgStore () {
      if (this.imgStore.length <= 0) {
        this.$store.commit('set_img_status', 'ready') // 更新文件上传状态
      }
    }
  }
}
</script>

<style lang="less" scoped>
.imgUploader {
  padding: 0 0 0.5rem 1rem;
  .file-list {
    padding: 10px 0px;
    &::after {
      content: "";
      display: block;
      clear: both;
      visibility: hidden;
      line-height: 0;
      height: 0;
      font-size: 0;
    }
    .file-item {
      float: left;
      position: relative;
      width: 100px;
      text-align: center;
      img {
        width: 80px;
        height: 80px;
        border: 1px solid #ececec;
      }
      .file-tip {
        width: 4rem;
        position: absolute;
        left: 0.5rem;
      }
      .file-remove {
        position: absolute;
        right: 12px;
        top: 4px;
        width: 14px;
        height: 14px;
        color: white;
        cursor: pointer;
        line-height: 12px;
        border-radius: 100%;
        transform: rotate(45deg);
        background: rgba(0, 0, 0, 0.5);
      }
      .flie-loading {
        right: 0;
        top: 1em;
        color: #fff;
        background-color: rgba(0, 0, 0, 0.5);
      }
      .flie-finished {
        right: 0;
        top: 2em;
        color: #fff;
        background-color: rgba(0, 0, 0, 0.5);
      }
      .flie-error {
        right: 0;
        top: 1em;
        color: red;
        background-color: rgba(0, 0, 0, 0.5);
      }
      &:hover .file-remove {
        display: inline;
      }
      .file-name {
        margin: 0;
        height: 40px;
        word-break: break-all;
        font-size: 14px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }
    }
  }
  .add {
    width: 80px;
    height: 80px;
    margin-left: 10px;
    float: left;
    text-align: center;
    line-height: 80px;
    font-size: 30px;
    cursor: pointer;
    border: 1px dashed #f2f2f2;
    color: #999;
    position: relative;
    background: #f2f2f2;
    .fa {
      font-size: 1.4em;
      color: #7dd2d9;
    }
  }
  .uploadBtn {
    .empty {
      position: absolute;
      left: 1.2rem;
      top: 4.7rem;
      background-color: #01b5ce;
      color: #fff;
      font-size: 13px;
      padding: 0.2em 1em;
      border-radius: 1.1rem;
    }
  }
}
input[type="file"] {
  position: absolute;
  left: 0;
  top: 0;
  width: 80px;
  height: 80px;
  border: 1px solid #000;
  opacity: 0;
}
</style>
