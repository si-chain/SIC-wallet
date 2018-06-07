<template>
  <div>
    <canvas v-show="account" ref="canvas" :style="{width:size,height:size}" :width="size * 2" :height="size * 2" :data-jdenticon-hash="hash"></canvas>
    <img v-show="!account" src="../assets/bbbhead.png" width="40px" style="margin-top:-4px" alt="">
  </div>
</template>
<script>
import jdenticon from 'jdenticon'
import sha256 from 'js-sha256'
export default {
  props: {
    size: {
      type: Number,
      default: 30
    },
    account: {
      type: String,
      default: ''
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
      // hues: [1, 2, 3, 4, 5],
      lightness: {
        color: [0.4, 0.8],
        grayscale: [0.3, 0.9]
      },
      saturation: {
        color: [0.4, 0.8],
        grayscale: [0.3, 0.9]
      },
      // backColor: '#fff',
      replaceMode: 'once'
    }
  }
}
</script>
