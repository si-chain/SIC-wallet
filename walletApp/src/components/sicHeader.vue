<template>
  <div class="sic-header">
    <div class="sic-header-left">
      <slot name="overwrite-left">
        <transition :name="transition">
          <a class="sic-header-back" v-show="_leftOptions.showBack" @click="onClickBack">{{ typeof _leftOptions.backText === 'undefined' ? $t('back_text') : _leftOptions.backText}}</a>
        </transition>
        <transition :name="transition">
          <div class="left-arrow" @click="onClickBack" v-show="_leftOptions.showBack">
            <img class="left-icon" src="../assets/images/icn_callback.png" alt="">
          </div>
        </transition>
      </slot>
      <slot name="left"></slot>
    </div>
    <h1 class="sic-header-title" @click="$emit('on-click-title')" v-if="!shouldOverWriteTitle">
      <slot>
        <transition :name="transition">
          <span v-show="title">{{title}}</span>
        </transition>
      </slot>
    </h1>
    <div class="sic-header-title-area" v-if="shouldOverWriteTitle">
      <slot name="overwrite-title"></slot>
    </div>
    <div class="sic-header-right">
      <a class="sic-header-more" @click="$emit('on-click-more')" v-if="rightOptions.showMore"></a>
      <slot name="right"></slot>
    </div>
  </div>
</template>

<script>
import objectAssign from 'object-assign'
export default {
  name: 'sic-header',
  props: {
    leftOptions: Object,
    title: String,
    transition: String,
    rightOptions: {
      type: Object,
      default () {
        return {
          showMore: false
        }
      }
    }
  },
  beforeMount () {
    if (this.$slots['overwrite-title']) {
      this.shouldOverWriteTitle = true
    }
  },
  computed: {
    _leftOptions () {
      return objectAssign({
        showBack: true,
        preventGoBack: false
      }, this.leftOptions || {})
    }
  },
  methods: {
    onClickBack () {
      if (this._leftOptions.preventGoBack) {
        this.$emit('on-click-back')
      } else {
        this.$router ? this.$router.back() : window.history.back()
      }
    }
  },
  data () {
    return {
      shouldOverWriteTitle: false
    }
  }
}
</script>

<style lang="less">
.sic-header {
  position: relative;
  padding: 3px 0;
  box-sizing: border-box;
  padding-top: 1.785714rem;
  background-color: @header-background-color;
}
.left-icon{
  width: 1.571429rem;
  height: 1.571429rem;
}
.sic-header .sic-header-title {
  line-height: 40px;
  font-size: 18px;
  font-weight: 400;
  color: @header-title-color;
  text-align: left;
  margin: 0 65px;
}
.sic-header-title-area, .sic-header .sic-header-title {
  height: 40px;
  width: auto;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.sic-header .sic-header-title > span {
  display: inline-block;
}
.sic-header .sic-header-left,.sic-header .sic-header-right {
  position: absolute;
  top: 14px;
  display: block;
  font-size: 14px;
  line-height: 21px;
  color: @header-text-color;
}
.sic-header .sic-header-left a,.sic-header .sic-header-left button,.sic-header .sic-header-right a,.sic-header .sic-header-right button {
  float: left;
  margin-right: 8px;
  color: @header-text-color;
}
.sic-header .sic-header-left a:active,.sic-header .sic-header-left button:active,.sic-header .sic-header-right a:active,.sic-header .sic-header-right button:active {
  opacity: .5
}
.sic-header .sic-header-left {
  left: 18px
}
.sic-header .sic-header-left .sic-header-back {
  padding-left: 16px
}
.sic-header .sic-header-left .left-arrow {
  position: absolute;
  width: 30px;
  height: 30px;
  top: 1.357143rem;
  left: -5px;
  // &:before {
  //   content: "";
  //   position: absolute;
  //   width: 12px;
  //   height: 12px;
  //   border: 1px solid @header-arrow-color;
  //   border-width: 1px 0 0 1px;
  //   transform: rotate(315deg);
  //   top: 8px;
  //   left: 7px;
  // }
}
.sic-header .sic-header-right {
  right: 15px
}
.sic-header .sic-header-right a,.sic-header .sic-header-right button {
  margin-left: 8px;
  margin-right: 0
}
.sic-header .sic-header-right .sic-header-more:after {
  content: "\2022\0020\2022\0020\2022\0020";
  font-size: 16px;
}
.sic-header-fade-in-right-enter-active {
  animation: fadeinR .5s;
}
.sic-header-fade-in-left-enter-active {
  animation: fadeinL .5s;
}
@keyframes fadeinR {
  0% {
    opacity: 0;
    transform: translateX(150px);
  }
  100% {
    opacity:1;
    transform:translateX(0);
  }
}
@keyframes fadeinL{
  0% {
    opacity: 0;
    transform: translateX(-150px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>

