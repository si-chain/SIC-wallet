<template>
    <div class="page-group">
      <x-header :left-options="{backText: ''}">{{$t('wallet_manage.title')}}</x-header>

         <div class="content-block button-block bom" v-if="!this.$route.query.account">
          <flexbox>
            <flexbox-item>
              <x-button type="primary" :link="`/create-account?account=${$route.query.account}`">{{$t('wallet_create.index.button_create')}}</x-button>
            </flexbox-item>
            <flexbox-item>
              <x-button type="default" :link="`/account-import?account=${$route.query.account}`">{{$t('wallet_create.index.button_import')}}</x-button>
            </flexbox-item>
          </flexbox>
        </div>
    </div>
</template>
<script>
import { XHeader, Group, Cell, Flexbox, FlexboxItem, XButton } from 'vux'
export default {
  components: {
    XHeader,
    Group,
    Cell,
    Flexbox,
    FlexboxItem,
    XButton
  },
  data () {
    let wallets = this.$common.get_wallets()
    return {
      wallets: wallets
    }
  },
  methods: {
  },
  mounted () {
  }
}
</script>
<style scoped lang="less">
.page-group{
  background: #efeff4;
  height: 100%;
  overflow:hidden
}
.vux-header{
  background-color: #ffffff
}
.page,
.content {}
.pull-to-refresh-layer {
    .line-scale>div {
        background-color: #3d3d3b;
    }
}
.account-img-wrap{
  text-align: center;
  margin-top: 10px;
  float: left;
  width: 25%;
}
.clearfix{
  overflow: hidden;
  background: #ffffff;
}
.info-content{
  float: left;
  width: 75%;
  line-height: 4rem;
  font-size: 26px;
  border-bottom: 1px solid #e7e7e7;
  .backup-date{
    font-size: 16px;
    color: #ed3f14;
    font-weight: bold;
    float: right;
  }
  .icon-c{
    float: right;
    margin: 0 20px;
    line-height: 60px;
    color: #cccccc;
  }
}
.sic{
  text-align: right;
  float: left;
  width: 100%;
  .num{
    font-size: 1.5rem;
    font-weight: bold;
    color: #6699ff;
  }
  .type{
    font-size: .7rem;
    color: #cccccc;
    margin-right: 20px
  }
}
.bom {
       position: fixed;
       bottom: 1%;
       left: 0%;
       right: 0%;
    }
.wallets {
    margin-top: 0;
    margin-bottom: 3.8rem;
    .wallet-info {
        .item-media {
            padding-bottom: .65rem;
        }
        .item-inner {
            padding-bottom: 1rem;
            padding-top: 1rem;
        }
    }
    ul {
        margin-bottom: .2rem;
        /*background: #f0f5f6;*/
    }
    .price-info {
        .item-after {
            align-items: baseline;
            .price {
                font-size: 1rem;
                font-weight: bold;
            }
        }
    }
}
</style>
