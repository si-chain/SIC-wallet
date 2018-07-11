
<template>
  <div>
    <div class="sic-cell circle" v-if="type === 'circle'" @click="onClick">
      <p class="fund-manage">{{title}}</p>
      <p class="balance">{{value}}</p>
      <slot class="default-slot"></slot>
      <div class="sic-cell-rignt-icon"></div>
    </div>
    <div v-else class="sic-cell cell-default"  @click="onClick">
      <div class="sic-cell__hd align-center">
        <slot name="icon"></slot>
      </div>
      <p class="fund-manage">{{title}}</p>
      <slot class="default-slot"></slot>
      <div v-if="isLink" class="sic-cell-rignt-icon"></div>
      <p v-else class="not-link-value balance">{{value}}</p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      default: ''
    },
    title: {
      type: String
    },
    value: {
      type: String,
      default: ''
    },
    link: {
      type: String,
      default: ''
    },
    isLink: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      msg: '0.00000'
    }
  },
  methods: {
    onClick () {
      if (this.link) {
        this.$common.go(this.link, this.$router)
      }
    }
  }
}
</script>
<style lang="less" scoped>
.sic-cell{
  width: 100%;
  position: relative;
  height: 4rem;
}
.circle{
  width: 90%;
  height: 4rem;
  background: rgb(255,255,255);
  border-radius: 2.142857rem;
  box-shadow: 0px 3px 17px #999999;
  text-align: center; 
  .fund-manage{
    padding-top: .357143rem;
  }
}
.fund-manage{
  font-weight: 600;
  font-size: 1.071429rem;
  color: @index-color;
}
.balance{
  font-size: 1.714286rem;
  font-weight: 900;
  color: @index-color;
}
.default-slot{
  position: absolute;
  right: 2.857143rem;
}
.not-link-value{
  position: absolute;
  right: 1.428571rem;
}
.sic-cell-rignt-icon:after {
    content: " ";
    display: inline-block;
    height: 6px;
    width: 6px;
    border-width: 2px 2px 0 0;
    border-color: #C8C8CD;
    border-style: solid;
    -webkit-transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
    transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
    position: relative;
    top: -2px;
    position: absolute;
    top: 50%;
    margin-top: -4px;
    right: 1.428571rem;
}
.sic-cell__hd{
  margin: 0 2.285714rem 0 1.142857rem;
}
.cell-default{
  align-items:center;
  display: flex;
  .fund-manage{
    color: #000000;
  }
}
</style>
