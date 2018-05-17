/*eslint-disable */
const locale = {
    index: {
      start:'Start',
      home:'home',
      SIC:'Fund Manage',
      account:'Account',
      balance_loading: 'loading..',
      success: 'success',
      error: 'error',
      sign_up:'Sign Up',
      claim_trusteeship:'Claim Trusteeship',
      existing_account:'Existing Account',
      authorization: 'To grant authorization',
      confirm_authorization: 'Do you confirm the authorization？',
      backup_wallet: 'backup private key',
      asset_name: 'SIC',
      asset_full_name: 'SIChares',
      value: 'Total Assets($)',
      transfer: 'Send',
      receive: 'Receive',
      wallet: 'Wallet',
      account_name: 'Account',
      copy: 'Copy',
      copied: 'Copied',
      confirm: 'Confirm',
      cancel: 'Cancel',
      account_is_address: 'Account name is your address',
      import_error: 'Active privileges private key and password mismatch',
      import_key_isnull: 'Please fill in the active private key',
      manage_wallets: 'Manage Wallets',
      transaction_record: 'Transaction record',
      transaction_sum: 'Transaction amount',
      message:'New Message',
      authorization_record:'Authorization record'
    },
    authorization: {
      time: 'Request time',
      applicant: 'Applicant',
      msg: 'Info',
      num: 'Reward',
      status: 'Status',
      type: 'Type',
      Agree: 'Agree',
      Reject: 'Reject'
    },
    policy: {
      tip_insurance: 'Data Escrow',
      tip_insurance_policy: 'Insurance Policy',
      tip_insurance_claim: 'Insurance Claim',
      policy_list: 'Policy record',
      success: 'success!',
      error: 'error!',
      policy_more: 'No More',
      look_detail: 'Look More',
      policy_img: 'Policy Image',
      upload_select:'Select the uploaded picture',
      back_home: 'Back Home',
      upload_time: 'Upload Time',
      policy_num: 'Policy Number',
      policy_file: 'Document Number',
      policy_value: 'Refusal',
      policy_status_step1: 'Uploaded',
      policy_status_step2: 'Audit',
      policy_status_step3: 'Complete',
      policy_status_step4: 'Audit Failure',
    },
    left_panel: {
        import_wallet: 'Import Wallet',
        create_wallet: 'Create Wallet',
        history: 'History',
        insurance_policy: 'Insurance Policy',
        language: 'Language',
        about: 'About'
    },
    wallet_create: {
        index: {
            title: 'Wallet',
            tip_empty: 'SIC Wallet was not created',
            button_create: 'Create Wallet',
            button_import: 'Import Wallet',
            tip_how: 'How to import wallet'
        },
        one: {
            title: 'Wallet Create',
            label: {
                account: 'Account'
            },
            placeholder: {
                account: 'Enter account name here'
            },
            query_account_name: 'Checking account name',
            error: {
                query_account_failed: 'Failed to query account, please retry',
                account_already_exist: 'Account already exist',
                empty_account: 'Account name should not be empty',
                account_should_be_longer: 'Account name be longer',
                account_should_be_shorter: 'Account name be shorter',
                account_should_start_with_a_letter: 'Each account segment should start with a letter',
                account_format_error: 'Each account segment should have only letters, digits',
                account_end_error: 'Each account segment should end with a letter or digit',
                account_segment_should_be_longer: 'Each account segment should be longer',
                premium_name: 'This is a premium name which is not supported by this faucet Please enter a regular name containing least one dash, a number or no vowels'
            },
            next: 'Next'
        },
        two: {
            title: 'Wallet Create',
            label: {
                password: 'Password',
                confirm: 'Confirm'
            },
            placeholder: {
                password: 'Is equal to 6 characters'
            },
            creating: 'Account Creating',
            done: 'Done',
            notice: 'Notice',
            error: {
                password_not_equal: 'Password not equal',
                account_has_been_registered: 'Account has bean registered by someone, please select another.',
                account_create_failed: 'Account create failed, please retry',
                account_create_error: 'Internal Server Error',
                account_401: 'Only authenticated users can access the data',
                account_403: 'Only user with same id or admins can access the data',
                account_404: 'Account does not exist'
            }
        },
        success: {
            title: 'Create Success',
            tip1: 'Wallet created',
            tip2: 'Please do remember to backup your wallet private key, there is no way to find it back if you lost it.',
            backup_wallet: 'Backup Now',
            detail: 'Open my wallet'
        }
    },
    wallet_import: {
        title: 'Wallet Import',
        label: {
            password: 'Password',
            confirm: 'Confirm'
        },
        placeholder: {
            key: 'Enter your active private key here',
            password: 'Is equal to 6 characters'
        },
        confirm: 'Import Now',
        error: {
            password_not_equal: 'Password not equal',
            account_already_exist: 'Account already imported',
            account_not_found: 'Account not found',
            invalid_key: 'Incorrect key format',
            no_reference_account: 'Import failed! No account for this active private key was found.'
        },
        success: {
            title: 'Import Success',
            tip1: 'Wallet imported',
            tip2: 'Please do remember to backup your wallet private key, there is no way to find it back if you lost it.',
            backup_wallet: 'Backup Now',
            detail: 'Open my wallet'
        }
    },
    wallet_manage: {
        title: 'Wallets',
        tip_backup: 'Backup required',
        button_import: 'Import Wallet',
        button_create: 'Create Wallet'
    },
    wallet_backup: {
        index: {
            title: 'Private key backup',
            tip: 'Please make sure your wallet is backed up and backed-up info is kept in good care.',
            label: {
                account: 'Account',
                asset: 'Asset(SIC)',
                private_key: 'Private Key'
            },
            button_backup: 'Backup Now',
            button_remove: 'Remove Wallet'
        },
        detail: {
            title: 'Private key backup',
            tip: 'To make backup easier, your wallet account is encrypted with the following key of letters. Back up this key to retrieve your wallet.',
            tip1: 'Copy or transcribe the key verbatim on paper, and keep it in good care.',
            tip2: 'Anyone with knowledge of info on your key gains access to the assets in your wallet.',
            unlock: 'Unlock',
            copy: 'Copy',
            copied: 'Copied',
            cancel: 'Cancel',
            ok: 'OK',
            confirm: 'Verify that the private key has been backed up?',
            tip_password: 'Unlock your wallet',
            go_back: 'Go Back',
            placeholder: {
                password: 'Please enter your password'
            },
            error: {
                invalid_password: 'Invalid password',
                invaild_digit: 'The password is 6 bits'
            }
        }
    },
    wallet_del: {
        title: 'Wallet delete',
        cancel: 'Cancel',
        ok: 'Ok',
        tip_del: 'Confirm unlock and delete this wallet. This operation is irrevocable. Are you sure to delete this wallet?',
        placeholder: {
            password: 'Please enter your password'
        },
        error: {
            invalid_password: 'Invalid password',
            invalid_delete: 'Unable to delete account with balance'
        }
    },
    language_setting: {
        title: 'Language'
    },
    about: {
        title: 'About us',
        version: 'V1.0.1',
        desc: {
            line1: 'SIC Wallet is a lite mobile wallet  ',
            line2: 'to facilitate SIC transfer, collection, wallet management',
            line3: 'and review of updates on SIC at any time.'
        },
        disclaimer: 'Disclaimer'
    },
    disclaimer: {
        title: 'Disclaimer',
        content: '<h4 class="text-center">Notice to Use and Disclaimer</h4>' +
            '<p>SIC Wallet is a decentralized blockchain lication. Please acquire a full understanding of the blockchain technology before use. Make sure you have the basic competence to use and manage decentralized wallet on a reasonable level.</p>' +
            '<p>1. Once SIC Wallet account or password is lost, it is unable to retrieve. Please keep properly your account and password, and make sure to back up your private key to the wallet, which is the only credential to get back your wallet. GXChain is not responsible for the loss or theft of the wallet due to your failure to back up the private key, safekeep or properly use the wallet.</p>' +
            '<p>2. If you obtain SIC Wallet  or any other lication under the same name of this sofeware from any unauthorized third party, GXB will not vouch for its security. You will be responsible for the loss inflicted thereby. </p>' +
            '<p>3. By transferring SIC via SIC wallet, you understand the IRRETRIEVABLE attribute of blockchain-based operation and will be responsible for irreversible loss due to your misoperation.</p>' +
            '<p>4. You shall comply with relevant state laws, policies and regulations when trading on SIC Wallet.</p>',
        accept: 'I have read and accept'
    },
    unlock: {
        account_not_found: 'Account not found in current wallet',
        cancel: 'Cancel',
        ok: 'OK',
        tip_password: 'Unlock your wallet',
        placeholder: {
            password: 'Please enter your password'
        },
        error: {
            invalid_password: 'Invalid password'
        }
    },
    transfer: {
        header: 'SIC',
        title: 'Send',
        from: 'From',
        to: 'To',
        to_placeholder: 'account name',
        amount: 'Amount',
        amount_placeholder: 'Amount to send',
        receive_amount: 'Amount to receive',
        available: '<span class="color-danger">{amount}</span> SIC Available',
        memo: 'Memo',
        fee: 'Fee',
        memo_placeholder: 'Optional',
        next: 'Next',
        send: 'Send',
        sending: 'Sending',
        error: {
            amount: {
                invalid: 'Invalid amount',
                insufficient_balance: 'Insufficient balance, Please make sure your balance are more than amount and fee',
                minimum: 'The minimum amount must not be less than 0.0001'
            },
            account: {
                cannot_send_to_yourself: 'Cannot send to yourself',
                from_account_not_exist: 'From account not found',
                to_account_not_exist: 'To account not found',
                empty_account: 'Account name should not be empty',
                account_should_be_longer: 'Account name be longer',
                account_should_be_shorter: 'Account name be shorter,no more than 13.',
                account_should_start_with_a_letter: 'Each account segment should start with a letter',
                account_format_error: 'Each account segment should have only letters, digits',
                account_end_error: 'Each account segment should end with a letter or digit',
                memo_signer_not_exist: 'Cannot encrypt memo,since memo private key not exist'
            }
        },
        confirm: {
            title: 'Confirm',
            title_password: 'Password',
            enter_password: 'Enter Password'
        },
        success: {
            title: 'Success',
            tip1: 'Send successful',
            tip2: 'has received your transfer',
            done: 'Done'
        }
    },
    trade_history: {
        title: 'Trade History',
        switchs: 'Switch',
        currentAccount: 'Current Account: {account}',
        empty: 'No more record',
        received: 'Received',
        sent: 'Sent'
    },
    trade: {
        title: 'Trade Detail',
        sent: 'Send to',
        receive: 'Receive from',
        label: {
            from: 'Send Account',
            to: 'Receive Account',
            timestamp: 'Timestamp',
            fee: 'Fee(SIC)',
            memo: 'Memo'
        },
        modal: {
            ok: 'OK'
        }
    }
};

export default locale;
