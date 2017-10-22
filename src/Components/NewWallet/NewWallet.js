import React, {Component} from 'react'

import {FlatButton, MuiThemeProvider, Snackbar, TextField} from 'material-ui'

import ConfirmationDialog from '../Base/Dialogs/ConfirmationDialog'
import ProceedDialog from './Dialogs/ProceedDialog'

import Themes from './../Base/Themes'

import './newwallet.css'

const bip39 = require('bip39')
const ethers = require('ethers')
const styles = require('../Base/styles').styles
const themes = new Themes()

class NewWallet extends Component {

    constructor(props) {
        super(props)
        this.state = {
            mnemonic: '',
            dialogs: {
                error: {
                    open: false,
                    title: '',
                    message: ''
                },
                proceed: {
                    open: false
                }
            },
            snackbar: {
                open: false
            }
        }
    }

    actions = () => {
        const self = this
        return {
            generateMnemonic: () => {
                let mnemonic = bip39.generateMnemonic()
                console.log('New mnemonic', mnemonic)
                self.setState({
                    mnemonic: mnemonic
                })
                self.helpers().copyMnemonic(mnemonic)
            }
        }
    }

    views = () => {
        const self = this
        return {
            top: () => {
                return <div className="col-10 col-md-8 mx-auto top">
                    <p className="pt-3">Create a new wallet</p>
                </div>
            },
            mnemonic: () => {
                return <div className="col-10 col-md-8 mx-auto mnemonic">
                    <div className="row">
                        <div className="col-12">
                            <TextField
                                id="input-mnemonic"
                                type="text"
                                onClick={() => {
                                    self.helpers().copyMnemonic()
                                }}
                                fullWidth={true}
                                multiLine={true}
                                hintStyle={styles.textField.hintStyle}
                                inputStyle={styles.textField.inputStyle}
                                floatingLabelStyle={styles.textField.floatingLabelStyle}
                                floatingLabelFocusStyle={styles.textField.floatingLabelFocusStyle}
                                underlineStyle={styles.textField.underlineStyle}
                                underlineFocusStyle={styles.textField.underlineStyle}
                                value={self.state.mnemonic}
                            />
                            <p>MAKE SURE THE SEED THAT YOU CHOOSE IS STORED IN A SAFE PLACE.
                                ONCE
                                YOU'RE ABSOLUTELY SURE,
                                CLICK
                                ON THE BUTTON BELOW TO CONTINUE</p>
                        </div>
                    </div>
                </div>
            },
            generate: () => {
                return <div className="col-10 col-md-8 mx-auto generate"
                            onClick={self.actions().generateMnemonic}>
                    <p>Generate seed phrase</p>
                </div>
            },
            back: () => {
                return <div className="col-6 offset-0 col-md-1 offset-md-5">
                    <FlatButton
                        label="Back"
                        className="float-right"
                        onClick={() => {
                            window.location = '/wallet/login'
                        }}
                    />
                </div>
            },
            proceed: () => {
                return <div className="col-6 col-md-1">
                    <FlatButton
                        label="Proceed"
                        disabled={self.state.mnemonic.length == 0}
                        onClick={() => {
                            self.helpers().toggleProceedDialog(true)
                        }}
                    />
                </div>
            },
            snackbar: () => {
                return <MuiThemeProvider muiTheme={themes.getSnackbar()}>
                    <Snackbar
                        message="Copied seed phrase to clipboard"
                        open={self.state.snackbar.open}
                        autoHideDuration={3000}
                    />
                </MuiThemeProvider>
            }
        }
    }

    dialogs = () => {
        const self = this
        return {
            error: () => {
                return <ConfirmationDialog
                    onClick={() => {
                        self.helpers().toggleErrorDialog(false)
                    }}
                    onClose={() => {
                        self.helpers().toggleErrorDialog(false)
                    }}
                    title={self.state.dialogs.error.title}
                    message={self.state.dialogs.error.message}
                    open={self.state.dialogs.error.open}
                />
            },
            proceed: () => {
                return <ProceedDialog
                    onProceed={() => {
                        console.log('Valid mnemonic')
                        window.location = '/wallet/login'
                    }}
                    toggleDialog={(open) => {
                        self.helpers().toggleProceedDialog(open)
                    }}
                    mnemonic={self.state.mnemonic}
                    open={self.state.dialogs.proceed.open}
                />
            }
        }
    }

    helpers = () => {
        const self = this
        return {
            toggleErrorDialog: (open, title, message) => {
                let dialogs = self.state.dialogs
                dialogs.error = {
                    open: open,
                    title: title,
                    message: message
                }
                self.setState({
                    dialogs: dialogs
                })
            },
            toggleProceedDialog: (open) => {
                let dialogs = self.state.dialogs
                dialogs.proceed.open = open
                self.setState({
                    dialogs: dialogs
                })
            },
            showSnackbar: () => {
                let snackbar = self.state.snackbar
                snackbar.open = true
                self.setState({
                    snackbar: snackbar
                })
            },
            copyMnemonic: (mnemonic) => {
                if (!mnemonic)
                    mnemonic = self.state.mnemonic

                // State changes to #input-mnemonic takes time. Copy after a timeout.
                setTimeout(() => {
                    if (mnemonic.length > 0) {
                        let inputMnemonic = document.getElementById("input-mnemonic")
                        inputMnemonic.select()
                        document.execCommand("Copy")
                        self.helpers().showSnackbar()
                    }
                }, 100)
            }
        }
    }

    render() {
        const self = this
        return (
            <MuiThemeProvider muiTheme={themes.getAppBar()}>
                <div className="new-wallet">
                    <div className="container h-100">
                        <div className="row h-100">
                            <div className="col my-auto">
                                <div className="row mb-4">
                                    { self.views().top() }
                                    { self.views().mnemonic() }
                                    { self.views().generate() }
                                    <div className="col-12">
                                        <div className="row mt-4">
                                            { self.views().back() }
                                            { self.views().proceed() }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    { self.dialogs().error() }
                    { self.dialogs().proceed() }
                    { self.views().snackbar() }
                </div>
            </MuiThemeProvider>
        )
    }

}

export default NewWallet