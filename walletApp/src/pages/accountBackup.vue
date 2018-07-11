<template>
  <div class="page-group" style="overflow:hidden">
    <sic-header :left-options="{backText: ''}">{{$t('index.backup_wallet')}}</sic-header>
    <div class="page">
      <div class="content">
        <!-- <div class="content-block text-center">
          <account-image :size="30" :account="$route.query.account"></account-image>
          <p>{{$route.query.account}}</p>
        </div> -->
        <wallet-detail :isBackground="false"></wallet-detail>
        <sic-cell :title="$t('wallet_backup.index.label.asset')" :isLink="false" :value="balance">
          <img slot="icon" class="icon" src="../assets/images/ico_asset_backup.png" alt="">
        </sic-cell>
        <sic-cell :title="$t('wallet_backup.index.label.private_key')" :link="`/wallet-backup-key?account=${$route.query.account}`">
          <img slot="icon" class="icon" src="../assets/images/ico_privatekey_backup.png" alt="">
        </sic-cell>
        <sic-cell :title="$t('index.authorization_record')" :link="`/authorization-record?account=${$route.query.account}`">
          <img slot="icon" class="icon" src="../assets/images/ico_authorization_backup.png" alt="">
          <div class="badge-value" v-if="!$store.state.msgList > 0">
            <span class="vertical-middle">{{ $t('index.message') }}</span>
            <badge :text="$store.state.msgList.length"></badge>
          </div>
        </sic-cell>
        <!-- <p class="tip-error text-center" v-if="!error.common">{{error.common}}</p> -->
        <div class="tip-info">
            <span style="color:#999">*</span> {{$t('wallet_backup.index.tip')}}
        </div>
        <div class="button-block">
          <x-button type="primary" :link="`/wallet-backup-key?account=${$route.query.account}`">{{$t('wallet_backup.index.button_backup')}}</x-button>
          <x-button type="default" @click.native="delWallet">{{$t('wallet_backup.index.button_remove')}}</x-button>
          <!-- <flexbox>
            <flexbox-item>
              <x-button type="primary" :link="`/wallet-backup-key?account=${$route.query.account}`">{{$t('wallet_backup.index.button_backup')}}</x-button>
            </flexbox-item>
            <flexbox-item>
              <x-button type="default" @click.native="delWallet">{{$t('wallet_backup.index.button_remove')}}</x-button>
            </flexbox-item>
          </flexbox> -->
        </div>
      </div>
    </div>
    <password-confirm v-show="isUnlock" :iShowLock="isUnlock" @unlocking="unlocking" @setUnlock="setUnlock" :tips="$t('wallet_del.tip_del')"></password-confirm>
  </div>
</template>
<script>
import sicHeader from '../components/sicHeader'
import walletDetail from '../components/accountDetail'
import sicCell from '../components/sicCell'
import { XButton, Group, Cell, Flexbox, FlexboxItem, Badge } from 'vux'
import AccountImage from '../components/AccountImage.vue'
import PasswordConfirm from '../components/PasswordConfirm.vue'
export default {
  components: {
    XButton,
    Group,
    Cell,
    sicHeader,
    Flexbox,
    FlexboxItem,
    AccountImage,
    PasswordConfirm,
    Badge,
    walletDetail,
    sicCell
  },
  mounted () {
    this.loadBalance()
  },
  data () {
    return {
      balance: '**',
      error: {
        common: ''
      },
      isUnlock: false
    }
  },
  methods: {
    loadBalance () {
      let account = this.$route.query.account
      this.$http.get(`${this.basePath}/v1/chain/accounts/eos/${account}`).then(res => {
        let data = res.data
        if (data.code === 200) {
          this.balance = data.data.eos_balance
          this.balance = data.data.eos_balance.split(' ')[0]
        } else {
          this.balance = '0'
        }
      })
    },
    delWallet () {
      this.error.common = ''
      this.isUnlock = true
    },
    unlocking (flag) {
      if (!flag) {
        let self = this
        let account = this.$route.query.account
        let wallets = this.$common.get_wallets()
        let wallet = wallets.find(function (w) {
          return w.account === account
        })
        self.$common.del_wallet(wallet).then(() => {
          if (wallets.length > 1) {
            wallets.map(item => {
              if (item.account !== wallet.account) {
                self.$store.state.account = item.account
              }
            })
          } else {
            self.$store.state.account = ''
          }
          self.$router.replace({
            path: self.$route.query.from || this.$router.push('/')// eslint-disable-line
          })
          flag = false
        })
      }
      this.isUnlock = flag
    },
    setUnlock (val) {
      this.isUnlock = val
    }
  },
  computed: {
    linkBackupKey () {
      let query = {
        account: this.$route.query.account,
        from: this.$route.fullPath
      }
      return this.$router.push({path: '/wallet-backup-detail', query})
    }
  }
}
</script>
<style scoped lang="less">
.button-block{
  position: absolute;
  width: 100%;
  bottom: 0;
  display: flex;
  justify-content: flex-start;
  .weui-btn_primary{
    flex: 3.5
  }
  .weui-btn_default{
    flex: 2
  }
}
.weui-btn + .weui-btn{
  margin-top:0;
}
.badge-value{
  position: absolute;
  right: 2.857143rem;
}
.text-center {
    text-align: center;
}
.tip-error, .tip-alert {
    margin-top: 10px;
    background: #fbf2f1;
    color: #c2433b;
    font-size: 12px;
    padding: .3rem;
    white-space: normal;
    word-break: break-all;
}
.list-block .item-content {
    box-sizing: border-box;
    padding-left: .75rem;
    min-height: 2.2rem;
    display: flex;
    -webkit-box-pack: justify;
    -webkit-justify-content: space-between;
    justify-content: space-between;
    -webkit-box-align: center;
    -webkit-align-items: center;
    align-items: center;
}
.tip-info {
  width:96%;
  text-align:left;
  margin:0 auto;
  font-size: 12px;
  margin-top:10px;
  line-height: 16px;
  color: #999;
}
</style>
