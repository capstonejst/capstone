//update this page -- if contract balance is accurate post-payment, send receipt and direct them to receipt page; send webdev confirmation
//otherwise, alert them to please try again

import React, { Component } from 'react'
import { connect } from 'react-redux'
import factory from '../../ethereum/factory'
import fundsTransfer from '../../ethereum/fundsTransfer'
import web3 from '../../ethereum/web3'
import axios from 'axios'
import { withRouter } from 'react-router-dom'
import { Grid } from '@material-ui/core'
import PaymentForm from './bundles/PaymentForm'

import { fetchUserByContract, getContractInfo } from '../store/contracts'
class SingleContractPayment extends Component {
  constructor() {
    super()
    this.state = {
      address: '',
      paid: false
    }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  async componentDidMount() {
    // await this.props.getContractInfo(this.props.match.params.contractId)
  }
  handleChange(evt) {
    this.setState({
      [evt.target.name]: evt.target.value
    })
  }
  async handleSubmit(evt) {
    console.log('contract', this.props.contract)
    console.log('contract', this.props.contract.data.balance)
    console.log('hi we are in handlesubmit')
    evt.preventDefault()

    let accounts = await web3.eth.getAccounts(console.log)
    const blocks = await factory.methods.getDeployedBlocks().call()
    console.log('blocks', blocks)
    const contractHash = this.props.match.params.contractId
    const indexOf = blocks.indexOf(contractHash)
    console.log('index', indexOf)
    const currentContract = fundsTransfer(blocks[indexOf])
    console.log('currentContract', currentContract)
    currentContract.options.address = `${contractHash}`
    //let address = document.getElementById('address').value
    //let address = document.getElementById(this.state.address).value
    let address = this.state.address
    console.log('address', address)
    const depositFunds = await currentContract.methods.deposit().send({
      gas: 6000000,
      value: this.props.contract.data.balance * 1000000000000000000,
      //this needs to change to actual value... we need to talk about this value being lower!
      from: address
    })

    const contractPaid = () =>
      axios({
        method: 'PUT',
        url: 'http://localhost:8080/api/contracts/paid',
        data: {
          contractHash: contractHash
        }
      }).then(
        this.setState({
          address: '',
          paid: true
        })
      )

    const sendReceipt = (name, email, mail) =>
      axios({
        method: 'POST',
        url: 'http://localhost:8080/api/send',
        data: {
          name: name,
          email: email,
          mail: mail
        }
      })
    axios
      .all([
        contractPaid(),
        sendReceipt('Tricia', 'tricia.lobo@gmail.com', {
          from: 'tricia',
          to: 'tricia.lobo@gmail.com',
          subject: 'Receipt for Your Payment to Grace',
          html: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><!--[if IE]><html xmlns="http://www.w3.org/1999/xhtml" class="ie"><![endif]--><!--[if !IE]><!--><html style="margin: 0;padding: 0;" xmlns="http://www.w3.org/1999/xhtml"><!--<![endif]--><head>
          <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
          <title></title>
          <!--[if !mso]><!--><meta http-equiv="X-UA-Compatible" content="IE=edge" /><!--<![endif]-->
          <meta name="viewport" content="width=device-width" /><style type="text/css">
      @media only screen and (min-width: 620px){.wrapper{min-width:600px !important}.wrapper h1{}.wrapper h1{font-size:64px !important;line-height:63px !important}.wrapper h2{}.wrapper h2{font-size:30px !important;line-height:38px !important}.wrapper h3{}.wrapper h3{font-size:22px !important;line-height:31px !important}.column{}.wrapper .size-8{font-size:8px !important;line-height:14px !important}.wrapper .size-9{font-size:9px !important;line-height:16px !important}.wrapper .size-10{font-size:10px !important;line-height:18px !important}.wrapper .size-11{font-size:11px !important;line-height:19px !important}.wrapper .size-12{font-size:12px !important;line-height:19px !important}.wrapper .size-13{font-size:13px !important;line-height:21px !important}.wrapper .size-14{font-size:14px !important;line-height:21px !important}.wrapper .size-15{font-size:15px !important;line-height:23px 
      !important}.wrapper .size-16{font-size:16px !important;line-height:24px !important}.wrapper .size-17{font-size:17px !important;line-height:26px !important}.wrapper .size-18{font-size:18px !important;line-height:26px !important}.wrapper .size-20{font-size:20px !important;line-height:28px !important}.wrapper .size-22{font-size:22px !important;line-height:31px !important}.wrapper .size-24{font-size:24px !important;line-height:32px !important}.wrapper .size-26{font-size:26px !important;line-height:34px !important}.wrapper .size-28{font-size:28px !important;line-height:36px !important}.wrapper .size-30{font-size:30px !important;line-height:38px !important}.wrapper .size-32{font-size:32px !important;line-height:40px !important}.wrapper .size-34{font-size:34px !important;line-height:43px !important}.wrapper .size-36{font-size:36px !important;line-height:43px !important}.wrapper 
      .size-40{font-size:40px !important;line-height:47px !important}.wrapper .size-44{font-size:44px !important;line-height:50px !important}.wrapper .size-48{font-size:48px !important;line-height:54px !important}.wrapper .size-56{font-size:56px !important;line-height:60px !important}.wrapper .size-64{font-size:64px !important;line-height:63px !important}}
      </style>
          <style type="text/css">
      body {
        margin: 0;
        padding: 0;
      }
     .info {
      padding-top: 50px;
      padding-bottom: 50px;
     }
      .center {
        display: block;
        margin-left: auto;
        margin-right: auto;
        width: 50%;
    }
      table {
        border-collapse: collapse;
        table-layout: fixed;
      }
      * {
        line-height: inherit;
      }
      [x-apple-data-detectors],
      [href^="tel"],
      [href^="sms"] {
        color: inherit !important;
        text-decoration: none !important;
      }
      .wrapper .footer__share-button a:hover,
      .wrapper .footer__share-button a:focus {
        color: #ffffff !important;
      }
      .btn a:hover,
      .btn a:focus,
      .footer__share-button a:hover,
      .footer__share-button a:focus,
      .email-footer__links a:hover,
      .email-footer__links a:focus {
        opacity: 0.8;
      }
      .preheader,
      .header,
      .layout,
      .column {
        transition: width 0.25s ease-in-out, max-width 0.25s ease-in-out;
      }
      .preheader td {
        padding-bottom: 8px;
      }
      .layout,
      div.header {
        max-width: 400px !important;
        -fallback-width: 95% !important;
        width: calc(100% - 20px) !important;
      }
      div.preheader {
        max-width: 360px !important;
        -fallback-width: 90% !important;
        width: calc(100% - 60px) !important;
      }
      .snippet,
      .webversion {
        Float: none !important;
      }
      .column {
        max-width: 400px !important;
        width: 100% !important;
      }
      .fixed-width.has-border {
        max-width: 402px !important;
      }
      .fixed-width.has-border .layout__inner {
        box-sizing: border-box;
      }
      .snippet,
      .webversion {
        width: 50% !important;
      }
      .ie .btn {
        width: 100%;
      }
      [owa] .column div,
      [owa] .column button {
        display: block !important;
      }
      .ie .column,
      [owa] .column,
      .ie .gutter,
      [owa] .gutter {
        display: table-cell;
        float: none !important;
        vertical-align: top;
      }
      .ie div.preheader,
      [owa] div.preheader,
      .ie .email-footer,
      [owa] .email-footer {
        max-width: 560px !important;
        width: 560px !important;
      }
      .ie .snippet,
      [owa] .snippet,
      .ie .webversion,
      [owa] .webversion {
        width: 280px !important;
      }
      .ie div.header,
      [owa] div.header,
      .ie .layout,
      [owa] .layout,
      .ie .one-col .column,
      [owa] .one-col .column {
        max-width: 600px !important;
        width: 600px !important;
      }
      .ie .fixed-width.has-border,
      [owa] .fixed-width.has-border,
      .ie .has-gutter.has-border,
      [owa] .has-gutter.has-border {
        max-width: 602px !important;
        width: 602px !important;
      }
      .ie .two-col .column,
      [owa] .two-col .column {
        max-width: 300px !important;
        width: 300px !important;
      }
      .ie .three-col .column,
      [owa] .three-col .column,
      .ie .narrow,
      [owa] .narrow {
        max-width: 200px !important;
        width: 200px !important;
      }
      .ie .wide,
      [owa] .wide {
        width: 400px !important;
      }
      .ie .two-col.has-gutter .column,
      [owa] .two-col.x_has-gutter .column {
        max-width: 290px !important;
        width: 290px !important;
      }
      .ie .three-col.has-gutter .column,
      [owa] .three-col.x_has-gutter .column,
      .ie .has-gutter .narrow,
      [owa] .has-gutter .narrow {
        max-width: 188px !important;
        width: 188px !important;
      }
      .ie .has-gutter .wide,
      [owa] .has-gutter .wide {
        max-width: 394px !important;
        width: 394px !important;
      }
      .ie .two-col.has-gutter.has-border .column,
      [owa] .two-col.x_has-gutter.x_has-border .column {
        max-width: 292px !important;
        width: 292px !important;
      }
      .ie .three-col.has-gutter.has-border .column,
      [owa] .three-col.x_has-gutter.x_has-border .column,
      .ie .has-gutter.has-border .narrow,
      [owa] .has-gutter.x_has-border .narrow {
        max-width: 190px !important;
        width: 190px !important;
      }
      .ie .has-gutter.has-border .wide,
      [owa] .has-gutter.x_has-border .wide {
        max-width: 396px !important;
        width: 396px !important;
      }
      .ie .fixed-width .layout__inner {
        border-left: 0 none white !important;
        border-right: 0 none white !important;
      }
      .ie .layout__edges {
        display: none;
      }
      .mso .layout__edges {
        font-size: 0;
      }
      .layout-fixed-width,
      .mso .layout-full-width {
        background-color: #ffffff;
      }
      @media only screen and (min-width: 620px) {
        .column,
        .gutter {
          display: table-cell;
          Float: none !important;
          vertical-align: top;
        }
        div.preheader,
        .email-footer {
          max-width: 560px !important;
          width: 560px !important;
        }
        .snippet,
        .webversion {
          width: 280px !important;
        }
        div.header,
        .layout,
        .one-col .column {
          max-width: 600px !important;
          width: 600px !important;
        }
        .fixed-width.has-border,
        .fixed-width.ecxhas-border,
        .has-gutter.has-border,
        .has-gutter.ecxhas-border {
          max-width: 602px !important;
          width: 602px !important;
        }
        .two-col .column {
          max-width: 300px !important;
          width: 300px !important;
        }
        .three-col .column,
        .column.narrow {
          max-width: 200px !important;
          width: 200px !important;
        }
        .column.wide {
          width: 400px !important;
        }
        .two-col.has-gutter .column,
        .two-col.ecxhas-gutter .column {
          max-width: 290px !important;
          width: 290px !important;
        }
        .three-col.has-gutter .column,
        .three-col.ecxhas-gutter .column,
        .has-gutter .narrow {
          max-width: 188px !important;
          width: 188px !important;
        }
        .has-gutter .wide {
          max-width: 394px !important;
          width: 394px !important;
        }
        .two-col.has-gutter.has-border .column,
        .two-col.ecxhas-gutter.ecxhas-border .column {
          max-width: 292px !important;
          width: 292px !important;
        }
        .three-col.has-gutter.has-border .column,
        .three-col.ecxhas-gutter.ecxhas-border .column,
        .has-gutter.has-border .narrow,
        .has-gutter.ecxhas-border .narrow {
          max-width: 190px !important;
          width: 190px !important;
        }
        .has-gutter.has-border .wide,
        .has-gutter.ecxhas-border .wide {
          max-width: 396px !important;
          width: 396px !important;
        }
      }
      @media only screen and (-webkit-min-device-pixel-ratio: 2), only screen and (min--moz-device-pixel-ratio: 2), only screen and (-o-min-device-pixel-ratio: 2/1), only screen and (min-device-pixel-ratio: 2), only screen and (min-resolution: 192dpi), only screen and (min-resolution: 2dppx) {
        .fblike {
          background-image: url(https://i10.createsend1.com/static/eb/master/13-the-blueprint-3/images/fblike@2x.png) !important;
        }
        .tweet {
          background-image: url(https://i7.createsend1.com/static/eb/master/13-the-blueprint-3/images/tweet@2x.png) !important;
        }
        .linkedinshare {
          background-image: url(https://i8.createsend1.com/static/eb/master/13-the-blueprint-3/images/lishare@2x.png) !important;
        }
        .forwardtoafriend {
          background-image: url(https://i9.createsend1.com/static/eb/master/13-the-blueprint-3/images/forward@2x.png) !important;
        }
      }
      @media (max-width: 321px) {
        .fixed-width.has-border .layout__inner {
          border-width: 1px 0 !important;
        }
        .layout,
        .column {
          min-width: 320px !important;
          width: 320px !important;
        }
        .border {
          display: none;
        }
      }
      .mso div {
        border: 0 none white !important;
      }
      .mso .w560 .divider {
        Margin-left: 260px !important;
        Margin-right: 260px !important;
      }
      .mso .w360 .divider {
        Margin-left: 160px !important;
        Margin-right: 160px !important;
      }
      .mso .w260 .divider {
        Margin-left: 110px !important;
        Margin-right: 110px !important;
      }
      .mso .w160 .divider {
        Margin-left: 60px !important;
        Margin-right: 60px !important;
      }
      .mso .w354 .divider {
        Margin-left: 157px !important;
        Margin-right: 157px !important;
      }
      .mso .w250 .divider {
        Margin-left: 105px !important;
        Margin-right: 105px !important;
      }
      .mso .w148 .divider {
        Margin-left: 54px !important;
        Margin-right: 54px !important;
      }
      .mso .size-8,
      .ie .size-8 {
        font-size: 8px !important;
        line-height: 14px !important;
      }
      .mso .size-9,
      .ie .size-9 {
        font-size: 9px !important;
        line-height: 16px !important;
      }
      .mso .size-10,
      .ie .size-10 {
        font-size: 10px !important;
        line-height: 18px !important;
      }
      .mso .size-11,
      .ie .size-11 {
        font-size: 11px !important;
        line-height: 19px !important;
      }
      .mso .size-12,
      .ie .size-12 {
        font-size: 12px !important;
        line-height: 19px !important;
      }
      .mso .size-13,
      .ie .size-13 {
        font-size: 13px !important;
        line-height: 21px !important;
      }
      .mso .size-14,
      .ie .size-14 {
        font-size: 14px !important;
        line-height: 21px !important;
      }
      .mso .size-15,
      .ie .size-15 {
        font-size: 15px !important;
        line-height: 23px !important;
      }
      .mso .size-16,
      .ie .size-16 {
        font-size: 16px !important;
        line-height: 24px !important;
      }

      .mso .size-17,
      .ie .size-17 {
        font-size: 17px !important;
        line-height: 26px !important;
      }
      .mso .size-18,
      .ie .size-18 {
        font-size: 18px !important;
        line-height: 26px !important;
      }
      .mso .size-20,
      .ie .size-20 {
        font-size: 20px !important;
        line-height: 28px !important;
      }
      .mso .size-22,
      .ie .size-22 {
        font-size: 22px !important;
        line-height: 31px !important;
      }
      .mso .size-24,
      .ie .size-24 {
        font-size: 24px !important;
        line-height: 32px !important;
      }
      .mso .size-26,
      .ie .size-26 {
        font-size: 26px !important;
        line-height: 34px !important;
      }
      .mso .size-28,
      .ie .size-28 {
        font-size: 28px !important;
        line-height: 36px !important;
      }
      .mso .size-30,
      .ie .size-30 {
        font-size: 30px !important;
        line-height: 38px !important;
      }
      .mso .size-32,
      .ie .size-32 {
        font-size: 32px !important;
        line-height: 40px !important;
      }
      .mso .size-34,
      .ie .size-34 {
        font-size: 34px !important;
        line-height: 43px !important;
      }
      .mso .size-36,
      .ie .size-36 {
        font-size: 36px !important;
        line-height: 43px !important;
      }
      .mso .size-40,
      .ie .size-40 {
        font-size: 40px !important;
        line-height: 47px !important;
      }
      .mso .size-44,
      .ie .size-44 {
        font-size: 44px !important;
        line-height: 50px !important;
      }
      .mso .size-48,
      .ie .size-48 {
        font-size: 48px !important;
        line-height: 54px !important;
      }
      .mso .size-56,
      .ie .size-56 {
        font-size: 56px !important;
        line-height: 60px !important;
      }
      .mso .size-64,
      .ie .size-64 {
        font-size: 64px !important;
        line-height: 63px !important;
      }
      </style>
          
        <style type="text/css">
      body{background-color:#fff}.logo a:hover,.logo a:focus{color:#859bb1 !important}.mso .layout-has-border{border-top:1px solid #ccc;border-bottom:1px solid #ccc}.mso .layout-has-bottom-border{border-bottom:1px solid #ccc}.mso .border,.ie .border{background-color:#ccc}.mso h1,.ie h1{}.mso h1,.ie h1{font-size:64px !important;line-height:63px !important}.mso h2,.ie h2{}.mso h2,.ie h2{font-size:30px !important;line-height:38px !important}.mso h3,.ie h3{}.mso h3,.ie h3{font-size:22px !important;line-height:31px !important}.mso .layout__inner,.ie .layout__inner{}.mso .footer__share-button p{}.mso .footer__share-button p{font-family:sans-serif}
      </style><meta name="robots" content="noindex,nofollow" />
      <meta property="og:title" content="My First Campaign" />
      </head>
      <!--[if mso]>
        <body class="mso">
      <![endif]-->
      <!--[if !mso]><!-->
        <body class="no-padding" style="margin: 0;padding: 0;-webkit-text-size-adjust: 100%;">
      <!--<![endif]-->
          <table class="wrapper" style="border-collapse: collapse;table-layout: fixed;min-width: 320px;width: 100%;background-color: #fff;" cellpadding="0" cellspacing="0" role="presentation"><tbody><tr><td>
            <div role="banner">
              <div class="preheader" style="Margin: 0 auto;max-width: 560px;min-width: 280px; width: 280px;width: calc(28000% - 167440px);">
                <div style="border-collapse: collapse;display: table;width: 100%;">
                <!--[if (mso)|(IE)]><table align="center" class="preheader" cellpadding="0" cellspacing="0" role="presentation"><tr><td style="width: 280px" valign="top"><![endif]-->
                  <div class="snippet" style="display: table-cell;Float: left;font-size: 12px;line-height: 19px;max-width: 280px;min-width: 140px; width: 140px;width: calc(14000% - 78120px);padding: 10px 0 5px 0;color: #adb3b9;font-family: sans-serif;">
                    
                  </div>
                <!--[if (mso)|(IE)]></td><td style="width: 280px" valign="top"><![endif]-->
                  <div class="webversion" style="display: table-cell;Float: left;font-size: 12px;line-height: 19px;max-width: 280px;min-width: 139px; width: 139px;width: calc(14100% - 78680px);padding: 10px 0 5px 0;text-align: right;color: #adb3b9;font-family: sans-serif;">

                  </div>
                <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
                </div>
              </div>
              <div class="header" style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);" id="emb-email-header-container">
              <!--[if (mso)|(IE)]><table align="center" class="header" cellpadding="0" cellspacing="0" role="presentation"><tr><td style="width: 600px"><![endif]-->
                <div class="logo"  emb-logo-margin-box" style="font-size: 26px;line-height: 32px;Margin-top: 6px;Margin-bottom: 20px;color: #c3ced9;font-family: Roboto,Tahoma,sans-serif;Margin-left: 20px;Margin-right: 20px;" align="center">
               
                <div class="logo-center" align="center" id="emb-email-header"><img style="display: block;height: auto;width: 100%;border: 0;max-width: 211px;" alt="" width="211" /></div>
                <p class="size-64" style="Margin-top: 0;Margin-bottom: 0;font-size: 44px;line-height: 50px;text-align: center;" lang="x-size-64"><span style="color:#000000"><strong>grace</strong></span></p>

                </div>
            </div>
            <div role="section">
            <div style="background-color: #000000;">
              <div class="layout three-col" style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;">
                <div class="layout__inner" style="border-collapse: collapse;display: table;width: 100%;">
                <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" role="presentation"><tr class="layout-full-width" style="background-color: #000000;"><td class="layout__edges">&nbsp;</td><td style="width: 200px" valign="top" class="w160"><![endif]-->
                  <div class="column" style="Float: left;max-width: 320px;min-width: 200px; width: 320px;width: calc(72200px - 12000%);text-align: left;color: #8e959c;font-size: 14px;line-height: 21px;font-family: sans-serif;">
                  
                    <div style="Margin-left: 20px;Margin-right: 20px;">
            <div style="mso-line-height-rule: exactly;line-height: 10px;font-size: 1px;">&nbsp;</div>
          </div>
                  
                  </div>



                <!--[if (mso)|(IE)]></td><td style="width: 200px" valign="top" class="w160"><![endif]-->
                  <div class="column" style="Float: left;max-width: 320px;min-width: 200px; width: 320px;width: calc(72200px - 12000%);text-align: left;color: #8e959c;font-size: 14px;line-height: 21px;font-family: sans-serif;">
                  
                    <div style="Margin-left: 20px;Margin-right: 20px;">
            <div style="mso-line-height-rule: exactly;line-height: 10px;font-size: 1px;">&nbsp;</div>
          </div>
                  
                  </div>
                <!--[if (mso)|(IE)]></td><td style="width: 200px" valign="top" class="w160"><![endif]-->
                  <div class="column" style="Float: left;max-width: 320px;min-width: 200px; width: 320px;width: calc(72200px - 12000%);text-align: left;color: #8e959c;font-size: 14px;line-height: 21px;font-family: sans-serif;">
                  
                    <div style="Margin-left: 20px;Margin-right: 20px;">
            <div style="mso-line-height-rule: exactly;line-height: 10px;font-size: 1px;">&nbsp;</div>
          </div>
                  
                  </div>
                <!--[if (mso)|(IE)]></td><td class="layout__edges">&nbsp;</td></tr></table><![endif]-->
                </div>
              </div>
            </div>
        
            <div style="background-color: #ffffff;">
              <div class="layout one-col" style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;">
                <div class="layout__inner" style="border-collapse: collapse;display: table;width: 100%;">
                <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" role="presentation"><tr class="layout-full-width" style="background-color: #ffffff;"><td class="layout__edges">&nbsp;</td><td style="width: 600px" class="w560"><![endif]-->
                  <div class="column" style="max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);text-align: left;color: #8e959c;font-size: 14px;line-height: 21px;font-family: sans-serif;">
                  
                    <div style="Margin-left: 20px;Margin-right: 20px;">
            <div style="mso-line-height-rule: exactly;mso-text-raise: 4px;">
              <p style="Margin-top: 0;Margin-bottom: 20px;">
            </p></div>
          </div>
                  
            <div style="mso-line-height-rule: exactly;mso-text-raise: 4px;">
            <p class="size-50" style="Margin-top: 0;Margin-bottom: 0;font-size: 24px;line-height: 50px;text-align: center;" lang="x-size-64"><span style="color:#000000">Thank you for your payment</span></p>
            <div style="Margin-left: 20px;Margin-right: 20px;">
            <img src = https://i.postimg.cc/13vQP3dx/logo-4.png style = "width:43px;height:43px;"class = "center" />

          <div class = "info" text-align: center;>
              <p class = "center" style="Margin-top: 0;Margin-bottom: 0;text-align: center; align=center">Contract# ${contractHash}<br />
              <p style="Margin-top: 0;Margin-bottom: 0;text-align: center;">Amount paid: ${
                this.props.contract.data.balance
              } ETH <br />
              <p style="Margin-top: 0;Margin-bottom: 0;text-align: center;"> ${
                this.props.contract.data.bundle.projectName
              }
            
      </p>
      </div>
      <p style="Margin-top: 20px;Margin-bottom: 20px;text-align: center;">&nbsp;</p>
            </div>
          </div>
                  
                    <div style="Margin-left: 20px;Margin-right: 20px;">
            <div class="btn btn--flat btn--large" style="Margin-bottom: 20px;text-align: center;">
            <!--[if mso]><p style="line-height:0;margin:0;">&nbsp;</p><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" href="http://localhost:8080" style="width:92px" arcsize="9%" fillcolor="#E31212" stroke="f"><v:textbox style="mso-fit-shape-to-text:t" inset="0px,11px,0px,11px"><center style="font-size:14px;line-height:24px;color:#86c7bf;font-family:Avenir,sans-serif;font-weight:bold;mso-line-height-rule:exactly;mso-text-raise:4px">Button</center></v:textbox></v:roundrect><![endif]--></div>
          </div>
                  
                    <div style="Margin-left: 20px;Margin-right: 20px;">
            <div style="mso-line-height-rule: exactly;line-height: 110px;font-size: 1px;">&nbsp;</div>
          </div>
                  
                    <div style="Margin-left: 20px;Margin-right: 20px;">
            <div style="mso-line-height-rule: exactly;line-height: 5px;font-size: 1px;">&nbsp;</div>
          </div>
                  
                    <div style="Margin-left: 20px;Margin-right: 20px;">
            <div style="mso-line-height-rule: exactly;line-height: 85px;font-size: 1px;">&nbsp;</div>
          </div>
                  
                  </div>
                <!--[if (mso)|(IE)]></td><td class="layout__edges">&nbsp;</td></tr></table><![endif]-->
                </div>
              </div>
            </div>
        
            <div style="mso-line-height-rule: exactly;line-height: 15px;font-size: 15px;">&nbsp;</div>
        
            <div class="layout one-col fixed-width" style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;">
              <div class="layout__inner" style="border-collapse: collapse;display: table;width: 100%;background-color: #ffffff;">
              <!--[if (mso)|(IE)]><table align="center" cellpadding="0" cellspacing="0" role="presentation"><tr class="layout-fixed-width" style="background-color: #ffffff;"><td style="width: 600px" class="w560"><![endif]-->
                <div class="column" style="text-align: left;color: #8e959c;font-size: 14px;line-height: 21px;font-family: sans-serif;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);">
              
                  <div style="Margin-left: 20px;Margin-right: 20px;">
            <div style="mso-line-height-rule: exactly;line-height: 50px;font-size: 1px;">&nbsp;</div>
          </div>
              
                  <div style="Margin-left: 20px;Margin-right: 20px;">
            <div style="mso-line-height-rule: exactly;line-height: 20px;font-size: 1px;">&nbsp;</div>
          </div>
              
                </div>
              <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
              </div>
            </div>
        
            <div style="mso-line-height-rule: exactly;line-height: 20px;font-size: 20px;">&nbsp;</div>
        
            
            <div style="mso-line-height-rule: exactly;" role="contentinfo">
              
                  </div>
                <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
                </div>
              </div>
   
            </div>
            <div style="mso-line-height-rule: exactly;line-height: 40px;font-size: 40px;">&nbsp;</div>
          </div></td></tr></tbody></table>
        
      </body></html>`
        })
      ])
      .then(
        axios.spread(function() {
          //
        })
      )
      .then(response => {
        if (response.data.msg === 'success') {
          console.log('receipt sent')
        } else if (response.data.msg === 'fail') {
          console.log('Message failed to send.')
        }
      })

    // .then(
    //   this.props.history.push({
    //     pathname: '/confirmpayment'
    //   })
    //)
  }
  render() {
    const contractHash = this.props.match.params.contractId
    const campaign = this.props.allCampaigns.filter(
      camp => camp.id === this.props.contract.data.campaignId
    )
    return (
      this.props.contract.data.campaignId &&
      campaign.length && (
        <PaymentForm
          campaign={campaign[0]}
          handleChange={this.handleChange}
          handleSubmit={this.handleSubmit}
          address={this.state.address}
          paid={this.state.paid}
        />
      )
    )
  }
}

const mapState = state => {
  return {
    user: state.user,
    allCampaigns: state.campaigns.allCampaigns,
    contract: state.contracts.contract
  }
}

const mapDispatch = dispatch => {
  return {
    fetchUserByContract: contractHash =>
      dispatch(fetchUserByContract(contractHash)),
    getContractInfo: contractHash => dispatch(getContractInfo(contractHash))
  }
}
export default withRouter(connect(mapState, mapDispatch)(SingleContractPayment))
