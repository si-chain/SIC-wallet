/*eslint-disable */
const locale = {
    index: {
      http_error: '系统异常,请稍后再试',
      newAccount: '新账号',
      newAccountTip:'创建一个钱包和一个账户',
      start:'点击开始SIC',
      home:'我',
      random:'随机',
      Invite:'邀请码',
      placeholderInvite: '邀请码',
      SIC:'资金管理',
      notice: '提示',
      goIdentity:'立即认证',
      agreement:'用户协议',
      account:'账号',
      identity: '短信认证',
      authorization: '授权',
      claim_trusteeship:'理赔托管',
      success: '成功',
      error: '失败',
      sign_up:'注册',
      existing_account:'已有账号',
      confirm_authorization: '确定授权吗？',
      balance_loading: '**',
      backup_wallet: '备份私钥',
      asset_name: 'SIC',
      asset_full_name: '',
      value: '价值(CNY)',
      transfer: '转账',
      receive: '接收',
      wallet: '钱包',
      account_name: '账户名',
      copy: '复制',
      copied: '已复制',
      confirm: '确定',
      cancel: '取消',
      account_is_address: '账户名既转账地址',
      import_error: '活跃权限私钥与密码不匹配',
      import_key_isnull: '请填写活跃权限私钥',
      manage_wallets: '管理钱包',
      transaction_record: '交易记录',
      transaction_sum: '交易金额',
      message:'新消息',
      authorization_record:'授权记录'
    },
    identity:{
      phone:'手机号码',
      placeholder:'请输入手机号码',
      code:'验证码',
      next:'重置',
      sendCode:'发送验证码',
      success_description:'已完成手机验证',
      error_description:'请确认输入正确的验证码',
      success: '验证成功',
      error: '验证码输入错误'
    },
    withdraw:{
        msg:'转账功能只对认证用户开放，请完成认证后在进行此功能的操作！',
        tip: '您输入的信息有误',
        header: 'SIC',
        extract: '提现',
        from: '发送账户',
        to: 'ethAddress',
        to_placeholder: '填写对方账号',
        amount: '数量',
        amount_placeholder: '填写SIC数量',
        receive_amount: '填写接收SIC数量',
        available: '可用: <span class="color-danger">{amount}</span> SIC',
        memo: '备注',
        fee: '手续费',
        memo_placeholder: '选填',
        next: '下 一 步',
        send: '发送',
        sending: '发送中',
        accountError: '账号错误',
        error: {
          tip: '提现失败',
          amount: {
            invalid: '数量不正确',
            insufficient_balance: '余额不足,请确认余额大于提现金额+手续费',
            minimum: '最小数量不能少于0.0001',
            minwithwrap: '最小数量不能少于20'
          },
        },
        confirm: {
          title: '确认提现',
          title_password: '密码',
          enter_password: '请输入密码'
        },
        success: {
          title: '操作成功'
        }
    },
    authorization:{
      tip:'提示',
      time:'请求时间',
      applicant: '申请账户',
      content:'请求内容',
      msg:'请求出错',
      num:'奖励金额',
      status:'状态',
      type:'授权类型',
      Agree:'同意',
      Reject:'拒绝'
    },
    policy: {
      tip_insurance: '数据托管',
      upload_nomore_tip: '保单挖矿说明：点击上方的"保单托管"后可以上传自己的保单文件或图片，通过审核后，即可获得奖励的SIC',
      policy_upload_tip_title:'温馨提示',
      policy_upload_tip: '建议上传电子版保单文件，但也可以用是拍摄纸质保单，若纸质保单，需上传有保单号，保险产品名，保险人，被保险人的完全清晰的内容。',
      tip_insurance_policy: '保单托管',
      history_policy: '保单托管记录',
      history_claim: '理赔托管记录',
      tip_insurance_claim: '理赔托管',
      policy_list: '保单记录',
      success:'成功！',
      error:'失败',
      look_detail: '查看详情',
      back_home: '返回首页',
      policy_more: '暂无更多',
      upload_select:'选择上传的图片',
      policy_img: '保单图片',
      upload_time: '上传时间',
      policy_num: '保单编号',
      policy_file: '文件编号',
      policy_value: '拒绝原因',
      policy_status_step1: '已上传',
      policy_status_step2: '审核中',
      policy_status_step3: '完成',
      policy_status_step4: '审核失败',
    },
    left_panel: {
        import_wallet: '导入钱包',
        create_wallet: '创建钱包',
        history: '转收记录',
        insurance_policy: '保单托管',
        language: 'Language',
        about: '关于我们'
    },
    wallet_create: {
      create_account:'创建账户',
      placeholder:{
        step1:'请输入用户名',
        step2:'请输入密码'
      },
        index: {
            title: '钱包',
            tip_empty: '暂未绑定SIC钱包',
            button_create: '创建钱包',
            button_import: '导入钱包',
            tip_how: '如何导入钱包?'
        },
        one: {
            title: '钱包创建',
            label: {
                account: '账户名'
            },
            placeholder: {
                account: '输入字母加数字的组合'
            },
            query_account_name: '正在检查账户名',
            error: {
                query_account_failed: '查询账户失败，请重试',
                account_already_exist: '账户已存在',
                empty_account: '账户名不可为空',
                account_should_be_longer: '账户名至少1位',
                account_should_be_shorter: '账户名小于12位',
                account_should_start_with_a_letter: '账户名需以字母开头',
                account_format_error: '账户名只能是[a-z][1-5]且长度为12位的组合',
                account_end_error: '账户名需要以字母或数字结尾',
                account_segment_should_be_longer: '账户名长度是12位',
                premium_name: '你使用的是高级账户名,请选择其他名字，包含至少一个横杠、数字或者不含元音字母'
            },
            next: '下一步'
        },
        two: {
            title: '钱包创建',
            label: {
                password: '输入密码',
                confirm: '确认密码'
            },
            placeholder: {
                password: '6位字符'
            },
            creating: '正在创建账户',
            done: '完成',
            notice: '提示',
            error: {
                password_not_equal: '两次输入密码不一致',
                account_has_been_registered: '账号已经被注册，请重新填写账号',
                account_create_failed: '创建账户失败，请重试',
                account_create_error: '内部服务器错误',
                account_401: '只有经过身份验证的用户才能访问数据',
                account_403: '只有具有相同id或admins的用户才能访问数据',
                account_404: '帐户不存在'
            }
        },
        success: {
            title: '创建成功',
            tip1: '钱包创建成功',
            tip2: '强烈建议您在使用前备份钱包私钥，一旦丢失不可找回',
            backup_wallet: '备份私钥',
            detail: '查看钱包详情'
        }
    },
    wallet_import: {
        title: '账户导入',
        label: {
            password: '输入密码',
            confirm: '确认密码'
        },
        placeholder: {
            key: '在此填入活跃权限私钥',
            password: '6位字符'
        },
        confirm: '确认导入',
        error: {
            title:'导入失败',
            password_not_equal: '两次输入密码不一致',
            account_already_exist: '账户已存在',
            account_not_found: '账户不存在',
            invalid_key: '私钥格式错误',
            no_reference_account: '导入失败，私钥对应账户不存在'
        },
        success: {
            title: '导入成功',
            tip1: '钱包导入成功',
            tip2: '强烈建议您在使用前备份钱包私钥，一旦丢失不可找回',
            backup_wallet: '备份私钥',
            detail: '查看钱包详情'
        }
    },
    wallet_manage: {
        title: '钱包管理',
        tip_backup: '请备份',
        button_import: '导入钱包',
        button_create: '创建钱包'
    },
    wallet_backup: {
        index: {
            title: '备份私钥',
            tip: '请务必备份好钱包，并妥善保管备份信息。',
            label: {
                account: '钱包账号',
                asset: '钱包资产(SIC)',
                private_key: '私钥'
            },
            button_backup: '备份私钥',
            button_remove: '删除钱包'
        },
        detail: {
            title: '备份私钥',
            tip: '为了方便备份，我们将钱包账户加密为以下英文字母组成的密钥，备份该密钥即可恢复钱包。',
            tip1: '按顺序将密钥复制或抄录在纸上，并妥善保存',
            tip2: '任何人获得你的密钥信息即可操作你的钱包资金',
            unlock: '解锁',
            copy: '复制私钥',
            copied: '已复制',
            cancel: '取消',
            ok: '确定',
            confirm: '确定已备份好密钥？',
            tip_password: '解锁你的钱包',
            go_back: '回到首页',
            placeholder: {
                password: '请输入密码'
            },
            error: {
                invalid_password: '密码错误',
                invaild_digit: '密码为6位'
            }
        }
    },
    wallet_del: {
        title: '删除钱包',
        cancel: '取消',
        ok: '确定',
        tip_del: '确认解锁并删除此钱包，此操作不可撤销，确定删除吗？',
        placeholder: {
            password: '请输入密码'
        },
        error: {
            invalid_password: '密码错误',
            invalid_delete: '无法删除含有余额的账户'
        }
    },
    language_setting: {
        title: 'Language'
    },
    about: {
        title: '关于我们',
        version: 'V1.0.1',
        desc: {
            line1: 'SIC Wallet是一款移动端轻钱包，',
            line2: '通过它能实现SIC的转账、收款和钱包管理，',
            line3: '并及时掌握SIC的最新动态。'
        },
        disclaimer: '免责声明'
    },
    disclaimer: {
        title: '免责声明',
        content: '<h4 class="text-center">使用须知和免责声明</h4>' +
        '<p>SIC钱包是去中心化区块链应用，在您使用之前，请充分了解区块链科技知识，具备合理使用和管理去中心化钱包的基本能力。</p>' +
        '<p>一、SIC钱包账户和密码一旦丢失不可找回，请妥善保管好您的账户和密码，并务必备份好钱包的私钥。私钥是找回钱包的唯一凭证！因未备份私钥、未妥善保管或因操作不当而造成钱包丢失或被盗的情况，概不负责。</p>' +
        '<p>二、如果您从未经授权的第三方获取SIC钱包或与本软件名称相同的应用程序，将无法保证软件的安全性，因此造成的损失由您自行承担。</p>' +
        '<p>三、使用SIC钱包发送SIC等功能时，您应理解区块链操作“不可撤销”属性，并自行承担因操作失误而导致结果不可逆的损失。\n</p>' +
        '<p>四、在SIC钱包上交易时，您应当遵循有关国家政策、法律法规的要求。</p>',
        accept: '我已阅读并同意'
    },
    unlock: {
        account_not_found: '钱包内没有此账户',
        cancel: '取消',
        ok: '确定',
        tip_password: '解锁你的钱包',
        placeholder: {
            password: '请输入密码'
        },
        error: {
            invalid_password: '密码错误'
        }
    },
    transfer: {
        tip:'您输入的信息有误',
        header: 'SIC',
        title: '转账',
        extract: '提现',
        from: '发送账户',
        to: '对方账户',
        to_placeholder: '填写对方账号',
        amount: '发送数量',
        amount_placeholder: '填写SIC数量',
        receive_amount: '填写接收SIC数量',
        available: '可用: <span class="color-danger">{amount}</span> SIC',
        memo: '备   注',
        fee: '手续费',
        memo_placeholder: '选填',
        next: '下 一 步',
        send: '发送',
        sending: '发送中',
        error: {
          tip:'转账失败',
          amount: {
              invalid: '数量不正确',
              insufficient_balance: '余额不足,请确认余额大于转账金额+手续费',
              minimum: '最小数量不能少于0.0001'
          },
          account: {
              cannot_send_to_yourself: '不能向自己转账',
              from_account_not_exist: '请输入正确的账号',
              to_account_not_exist: '对方账户不存在',
              empty_account: '账户名不可为空',
              account_should_be_longer: '账户名至少1位',
              account_should_be_shorter: '账户名过长，不要超过13位',
              account_should_start_with_a_letter: '账户名需以字母开头',
              account_format_error: '账户名只能是字母、数字的组合',
              account_end_error: '账户名需要以字母或数字结尾',
              memo_signer_not_exist: '备注私钥不存在，无法添加备注'
          }
        },
        confirm: {
            title: '确认转账',
            title_password: '密码',
            enter_password: '请输入密码'
        },
        success: {
            title: '转账成功',
            tip1: '转账成功',
            tip2: '已收到你的转账',
            done: '完成'
        }
    },
    trade_history: {
        title: '转收记录',
        switchs: '切换',
        currentAccount: '当前账户:',
        empty: '无更多记录',
        received: '转账',
        sent: '发送'
    },
    trade: {
        title: '记录详情',
        sent: '转到以下账户',
        receive: '来自以下账户',
        label: {
            from: '发送账号',
            to: '接收账号',
            timestamp: '操作时间',
            fee: '手续费(SIC)',
            memo: '备注(MEMO)'
        },
        modal: {
            ok: '好的'
        }
    }
};

export default locale;
