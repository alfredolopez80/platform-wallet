import React, {Component} from 'react'

import {Dialog, FlatButton, MuiThemeProvider} from 'material-ui'
import { injectIntl } from 'react-intl'
import { componentMessages, getI18nFn } from '../../../i18n/componentMessages'
let i18n
const messages = componentMessages(
    'src.Components.Wallet.Dialogs.TokenUpgradeDialog',
    [{ Loading: 'common.Loading' },
    ]
)
import Themes from '../../Base/Themes'

const themes = new Themes()
let TOKEN_BALANCE_LOADING
// Inner text of the dialog
function VETTokenUpgradeDialogInner({ currentEtherBalance, currentTokenBalance }) {
    if (currentEtherBalance === 0) {
        // Error Message: Print this if there is no Ether in the account
        return <div>
            <p className='text-info'>
                ETH needed to complete the upgrade
            </p>
            <p>
                This account currently has 0 ether (ETH), but it needs some 
                to be able to cover the gas cost of upgrading the tokens. 
            </p>
            <p>
                Please send some ether to this account (e.g. 0.03 ETH), and 
                then try again once it has been received. After you send 
                the ETH, you can click the refresh icon on the main page 
                to check if it has been received.
            </p>
        </div>
    } else {
        // Normal Message: Transfer details and pricing warning
        return <div>
            <p>
                {currentTokenBalance} DBETs will be updated from contract v2 to VET. Are you 
                sure you would like to continue?
            </p>
            <p className="text-info">
                Ether will be discounted from your wallet to cover
                Gas costs
            </p>
        </div>
    }
}

class VETTokenUpgradeDialog extends Component {

    constructor(props) {
        super(props)
        i18n = getI18nFn(props.intl, messages)
        TOKEN_BALANCE_LOADING = i18n('Loading')
        this.state = {
            open: props.open,
            tokenBalance: props.balance,
            ethBalance: props.ethBalance,
            loading: false,
            errors: {
                address: false,
                gasPrice: false
            }
        }

        // Bind the 'this' keyword
        this.onUpgrade = this.onUpgrade.bind(this)
    }

    componentWillReceiveProps(props) {
        this.setState({
            open: props.open,
            tokenBalance: props.balance,
            ethBalance: props.ethBalance,
        })
    }

    onUpgrade(){
        // Upgrade button pressed
        this.props.onUpgrade()
        this.setState({
            loading: true
        })
    }

    render() {
        let currentEtherBalance = parseFloat(this.state.ethBalance)
        let buttonDisabled = currentEtherBalance === 0 ||
            this.state.loading ||
            this.state.tokenBalance === TOKEN_BALANCE_LOADING

        return <MuiThemeProvider muiTheme={themes.getDialog()}>
            <Dialog
                title="Token Upgrade to VET"
                actions={<FlatButton
                    label="Upgrade"
                    primary={false}
                    disabled={buttonDisabled}
                    onClick={this.onUpgrade}/>
                }
                autoScrollBodyContent={true}
                modal={false}
                open={this.state.open}
                onRequestClose={this.props.onClose}>
                <VETTokenUpgradeDialogInner
                    currentEtherBalance={currentEtherBalance}
                    currentTokenBalance={this.state.tokenBalance}
                    />
            </Dialog>
        </MuiThemeProvider>
    }

}

export default injectIntl(VETTokenUpgradeDialog)