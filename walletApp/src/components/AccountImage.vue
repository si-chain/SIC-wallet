<template>
  <div :style="{width:wrapSize,height:wrapSize,background:!account ? background : '#ffffff'}" class="align-center canvas-wrap">
    <canvas v-show="account" ref="canvas" :style="{width:size + 'px',height:size +'px'}" :width="size " :height="size " :data-jdenticon-hash="hash"></canvas>
    <img v-show="!account" src="../assets/images/img_head_account.png" :width="60" style="margin-top:1px" alt="">
  </div>
</template>
<script>
import jdenticon from 'jdenticon'
import sha256 from 'js-sha256'
export default {
  props: {
    wrapSize: {
      type: String,
      default: '5.714286rem'
    },
    size: {
      type: Number,
      default: 50
    },
    account: {
      type: String,
      default: ''
    },
    background: {
      type: String,
      default: '#ffffff'
    }
  },
  computed: {
    hash: function () {
      return this.account ? sha256(this.account) : ''
    }
  },
  watch: {
    account () {
      this.drawCanvas()
    },
    size () {
      this.drawCanvas()
    }
  },
  methods: {
    drawCanvas () {
      if (this.account) {
        jdenticon.update(this.$refs.canvas, this.hash, 0.05)
      }
    }
  },
  mounted () {
    this.drawCanvas()
    jdenticon.config = {
      lightness: {
        color: [0.4, 0.8],
        grayscale: [0.3, 0.9]
      },
      saturation: {
        color: [0.4, 0.8],
        grayscale: [0.3, 0.9]
      },
      replaceMode: 'once'
    }
  }
}
</script>
<style lang="less" scoped>
.canvas-wrap{
  border-radius: 50%;
  align-items:center;
}
</style>

