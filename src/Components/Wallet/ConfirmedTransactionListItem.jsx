import React, { Component, Fragment } from 'react'
import moment from 'moment'
import { ETHERSCAN, VEFORGE } from '../Constants'
import Helper from '../Helper'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {Typography, ButtonBase} from '@material-ui/core'
const helper = new Helper()

// Icon at the left
const Icon = ({ stateMachine }) => {
    if (stateMachine === 'SENT') {
        return <FontAwesomeIcon icon="minus" />
    } else if (stateMachine === 'RECEIVED') {
        return <FontAwesomeIcon icon="plus" />
    } else if (stateMachine === 'UPGRADED') {
        return <FontAwesomeIcon icon="arrow-up" />
    } else {
        return <span />
    }
}

// Text Content
const ItemContent = ({ stateMachine, transaction, onClickListener }) => {
    let texts = {
        type: '',
        address: ''
    }

    if (stateMachine === 'SENT') {
        texts.type = 'Sent DBETs'
        texts.address = (
            <Fragment>
                Destination:{' '}
                <span className="monospace">
                    {helper.formatAddress(transaction.to)}
                </span>
            </Fragment>
        )
    } else if (stateMachine === 'RECEIVED') {
        texts.type = 'Received DBETs'
        texts.address = (
            <Typography>
                Origin:{' '}
                <Typography component="span" className="monospace">
                    {helper.formatAddress(transaction.from)}
                </Typography>
            </Typography>
        )
    } else if (stateMachine === 'UPGRADED' && transaction.isVET) {
        texts.type = 'Upgraded DBETs to VET'
        texts.address = ''
    }

    return (
        <Fragment>
            <Typography color="primary">{texts.type}</Typography>
            <ButtonBase focusRipple={true} style={{margin: '0 !important'}} onClick={onClickListener}>
                <Typography>Hash:{' '}{transaction.hash}</Typography>
            </ButtonBase>
            <Typography>{texts.address}</Typography>
        </Fragment>
    )
}

// Wrapper Element
export default class ConfirmedTransactionListItem extends Component {
    // Creates an event listener to open the transaction on Etherscan
    openOnEtherscanListener = () => {
        let hash = this.props.transaction.hash
        if (hash) {
            if (this.props.transaction.isVET) {
                helper.openUrl(`${VEFORGE}/transactions/${hash}`)
            } else {
                helper.openUrl(`${ETHERSCAN}/tx/${hash}`)
            }
        }
    }

    render() {
        let { transaction, walletAddress } = this.props
        // Set the State Machine to the proper display
        let stateMachine
        if (
            transaction.from.toLowerCase() === walletAddress &&
            transaction.to.toLowerCase() !== walletAddress
        ) {
            stateMachine = 'SENT'
        } else if (
            transaction.to.toLowerCase() === walletAddress &&
            transaction.from.toLowerCase() !== walletAddress
        ) {
            stateMachine = 'RECEIVED'
        } else {
            stateMachine = 'UPGRADED'
        }
        let timestamp = moment
            .unix(transaction.block.timestamp)
            .format('YYYY-MM-DD HH:mm:SS')
        return (
            <article className="tx">
                <div className="icon">
                    <Icon stateMachine={stateMachine} />
                </div>
                <section className="text">
                    <ItemContent
                        stateMachine={stateMachine}
                        transaction={transaction}
                        onClickListener={this.openOnEtherscanListener}
                    />
                    <Typography variant="caption">{timestamp}</Typography>
                </section>
                <Typography variant="display2">{helper.formatNumber(transaction.value)}</Typography>
            </article>
        )
    }
}
