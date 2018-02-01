import React from 'react'
import { FlatButton } from 'material-ui'
import { KeyDown } from 'react-event-components'

import KeyboardKeyList from './KeyboardKeyList.jsx'

const constants = require('../Constants')
const styles = require('../Base/styles').styles

const NUMERIC_KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9']
const MAX_DIGITS = 9

export default class Keyboard extends React.Component {
    appendDigitFromKey = k => {
        let enteredValue = this.props.enteredValue
        if (k < constants.KEY_DOT && enteredValue.length <= MAX_DIGITS) {
            enteredValue =
                enteredValue === '0' ? k.toString() : enteredValue.concat(k)
        } else if (
            k === constants.KEY_ZERO &&
            enteredValue.length <= MAX_DIGITS
        ) {
            enteredValue = enteredValue === '0' ? '0' : enteredValue.concat('0')
        } else if (
            k === constants.KEY_DOT &&
            enteredValue.length <= MAX_DIGITS
        ) {
            if (enteredValue.indexOf('.') !== -1) return
            enteredValue = enteredValue.concat('.')
        } else if (k === constants.KEY_BACKSPACE) {
            if (enteredValue.length === 1) enteredValue = '0'
            else {
                enteredValue = enteredValue.slice(0, -1)
            }
        }
        this.props.onKeyboardValueChangedListener(enteredValue)
    }

    handleKeyboardInput = key => {
        if (!this.props.isAnyDialogOpen)
            if (NUMERIC_KEYS.indexOf(key) !== -1) {
                this.appendDigitFromKey(parseInt(key, 10))
            } else if (key === constants.KEY_STRING_DOT) {
                this.appendDigitFromKey(constants.KEY_DOT)
            } else if (key === constants.KEY_STRING_ZERO) {
                this.appendDigitFromKey(constants.KEY_ZERO)
            } else if (key === constants.KEY_STRING_BACKSPACE) {
                this.appendDigitFromKey(constants.KEY_BACKSPACE)
            } else if (key === constants.KEY_STRING_ENTER) {
                if (this.props.canSend) {
                    this.props.onSendListener()
                }
            }
    }

    // A Keyboard Key has been pressed.
    // Key Id is stored in 'data-keyboard-key' attribute
    onKeyboardKeyPressedListener = event => {
        let digit = event.currentTarget.dataset.keyboardKey
        if (digit) {
            this.appendDigitFromKey(parseInt(digit, 10))
        }
    }

    renderKeySelectAll = () => {
        let labelStyle = this.props.isLoading
            ? styles.keyboard.send
            : styles.keyboard.sendDisabled
        return (
            <FlatButton
                className="mx-auto d-block"
                disabled={this.props.isLoading}
                label={
                    <span>
                        <i className="fa fa-expand mr-2" /> Select All
                    </span>
                }
                onClick={this.props.onSelectAllListener}
                labelStyle={labelStyle}
            />
        )
    }

    renderKeySend = () => {
        let labelStyle = this.props.canSend
            ? styles.keyboard.send
            : styles.keyboard.sendDisabled
        return (
            <FlatButton
                className="mx-auto d-block"
                disabled={!this.props.canSend}
                label={
                    <span>
                        <i className="fa fa-paper-plane-o mr-2" /> Send DBETs
                    </span>
                }
                onClick={this.props.onSendListener}
                labelStyle={labelStyle}
            />
        )
    }

    render() {
        return (
            <div className="container">
                <KeyboardKeyList
                    onKeyPressedListener={this.onKeyboardKeyPressedListener}
                />
                <div className="row py-4">
                    <div className="col-12 mt-4">
                        {this.renderKeySelectAll()}
                    </div>
                    <div className="col-12 mt-4">{this.renderKeySend()}</div>
                </div>
                <KeyDown do={this.handleKeyboardInput} />
            </div>
        )
    }
}
