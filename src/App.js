import React from 'react';
import {LocaleProvider} from 'antd';
import {message} from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';

import { LoginForm } from "./Login/frmLogin"
import { CReport } from "./Report/frmMdBaoZhShouR"

import "antd/dist/antd.css";
import "./App.css"
import $ from 'jquery'

export default App;

function App(){
    return (
        <LocaleProvider locale={zhCN}>
            <div className={"rootContainer"}>
                <Container />
            </div>
        </LocaleProvider>
    )
}

class Container extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            showPage:0,//0-init(null),1-login,-2-report
            isLoggingIn:false,
            svrAddress:"",
            token:"",
        }
    }

    componentDidMount() {
        this.refreshConfig();
        this.setState({
            showPage:1,
        })
    }

    refreshConfig(){
        $.ajax({
            url:'../../config.json',
            cache:false,
            dataType:'json',
            success:function(data){
                this.setState({
                    svrAddress:data["address"],
                });
            }.bind(this),
            error:function(e){
                console.log(e.toString());
                this.setState({
                    svrAddress:"",
                });
            }.bind(this)
        });
    }

    handleLogin(username, password){
        if (this.state.svrAddress === "") {
            console.warn("address is empty");
            return
        }

        let d = {};
        d.loginname = username;
        d.loginpwd = password;

        $.ajax({
            type:'POST',
            url:this.state.svrAddress + "/login",
            data:JSON.stringify(d),
            dataType:'json',
            timeout:30000,
            contentType:'application/json',
            cache:false,
            sync:true,
            beforeSend:function(){
                this.setState({
                    isLoggingIn:true,
                });
            }.bind(this),
            complete:function(){
                this.setState({
                    isLoggingIn:false,
                });
            }.bind(this),
            success: function (data) {
                if(data["errcode"]===0){
                    this.setState({
                        token:data["token"],
                        showPage:2,
                    });
                } else {
                    message.error(data["errmsg"],3);
                    this.setState({
                        token:"",
                    })
                }
            }.bind(this),
            error:function(xhr,status,e) {
                console.log(e);
                message.error("[" + xhr.status + "]" + status + ":"+ e.toString(),3)
            }
        })
    }

    render(){
        switch (this.state.showPage) {
            case 0:
                return (<div>&nbsp;</div>);
            case 1:
                return (
                    <div>
                        <LoginForm disabled={this.state.isLoggingIn} title={"登   录"} handleLogin={(username,password)=> this.handleLogin(username,password)} />
                    </div>
                );
            case 2:
                return (
                    <div>
                        <CReport />
                    </div>
                );
            default:
                return (<div>&nbsp;</div>);
        }
    }
}
