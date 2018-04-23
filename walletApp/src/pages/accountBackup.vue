<template>
  <div class="page-group">
    <x-header :left-options="{backText: ''}">备份私钥</x-header>
    <div class="page">
      <div class="content">
        <div class="tip-info">
            {{$t('wallet_backup.index.tip')}}
        </div>
        <div class="content-block text-center">
          <account-image :size="30" :account="$route.query.account"></account-image>
          <p>{{$route.query.account}}</p>
        </div>
        <group>
          <cell :title="$t('wallet_backup.index.label.account')" :value="$route.query.account"></cell>
          <cell :title="$t('wallet_backup.index.label.asset')" :value="balance"></cell>
          <cell :title="$t('wallet_backup.index.label.private_key')" :link="`/wallet-backup-key?account=${$route.query.account}`" is-link></cell>
        </group>
        <p class="tip-error text-center" v-if="error.common">{{error.common}}</p>
        <div class="content-block button-block">
          <flexbox>
            <flexbox-item>
              <x-button type="primary" :link="`/wallet-backup-key?account=${$route.query.account}`">{{$t('wallet_backup.index.button_backup')}}</x-button>
            </flexbox-item>
            <flexbox-item>
              <x-button type="default" @click.native="delWallet">{{$t('wallet_backup.index.button_remove')}}</x-button>
            </flexbox-item>
          </flexbox>
        </div>
      </div>
    </div>
    <password-confirm v-if="isUnlock" @unlocking="unlocking" :tips="$t('wallet_del.tip_del')"></password-confirm>
  </div>
</template>
<script>
import { XButton, XHeader, Group, Cell, Flexbox, FlexboxItem } from 'vux'
import AccountImage from '../components/AccountImage.vue'
import PasswordConfirm from '../components/PasswordConfirm.vue'
export default {
  components: {
    XButton,
    Group,
    Cell,
    XHeader,
    Flexbox,
    FlexboxItem,
    AccountImage,
    PasswordConfirm
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
      this.$http.get(`chain/accounts/eos/${account}`).then(res => {
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
      if (this.balance === 0.0000) {
        this.isUnlock = true
      } else {
        this.error.common = this.$t('wallet_del.error.invalid_delete')
      }
    },
    unlocking (pwd) {
      let self = this
      if (!pwd) {
        this.error.common = this.$t('unlock.error.invalid_password')
        this.isUnlock = false
        return
      }
      let account = this.$route.query.account
      let wallets = this.$common.get_wallets()
      let wallet = wallets.find(function (w) {
        return w.account === account
      })
      let publicWallet = this.$common.backupPublicKey(wallet.active, pwd)
      let activePubkey = wallet.active_pubkey
      if (wallet == null) {
        this.isUnlock = false
        self.error.common = self.$t('unlock.account_not_found')
      } else if (activePubkey !== publicWallet) {
        this.isUnlock = false
        self.error.common = self.$t('wallet_backup.detail.error.invalid_password')
      } else {
        return self.$common.del_wallet(wallet).then(() => {
          self.$router.replace({
            path: self.$route.query.from || this.$router.push('/')// eslint-disable-line
          })
          this.isUnlock = false
        })
      }
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
.button-block {
    margin-top: 4rem;
}
.content-block{
  margin: 1.75rem 0;
  padding: 0 .75rem;
  color: #6d6d72;
}
.text-center {
    text-align: center;
}
.tip-error, .tip-alert {
    margin-top: 10px;
    background: #fbf2f1;
    color: #c2433b;
    font-size: .6rem;
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
  background: #d6edf8;
  color: #5393bc;
  font-size: .6rem;
  padding: .3rem;
  white-space: normal;
  word-break: break-all;
  word-break: break-word;
}
</style>
