import React from 'react';
import {LocaleProvider} from 'antd';
import {message} from 'antd';
import { Layout, Menu, Icon, Button } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';

import { LoginForm } from "./Login/frmLogin"
import { FrmMdBaoZhShouR } from "./Report/frmMdBaoZhShouR"

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
            showPage:0,//0-init(null),1-login,-2-pageLoader
            svrAddress:"",
            isLoggingIn:false,
            loginTime:new Date(),
            token:"",
            mdName:"",
        }
    }

    componentDidMount() {
        this.refreshConfig();
        this.setState({
            showPage:2,
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
                        mdName:data["mdname"],
                        loginTime:new Date(),
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

    handleLogout(){
        this.setState({
            token:"",
            mdName:"",
            loginTime:new Date(),
            showPage:1,
        });
    }

    render(){
        switch (this.state.showPage) {
            case 1:
                return (
                    <div>
                        <LoginForm
                            title={"登   录"}
                            disabled={this.state.isLoggingIn}
                            handleLogin={(username,password)=> this.handleLogin(username,password)}
                        />
                    </div>
                );
            case 2:
                return (
                    <div>
                        <PageLoader mdName={this.state.mdName} handleLogout={()=>this.handleLogout()} />
                    </div>
                );
            default:
                return (<div>show page error</div>);
        }
    }
}


const { Header, Sider, Content } = Layout;
const { SubMenu } = Menu;

class PageLoader extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            collapsed: false,
            currPage:""
        }
    }

    toggle = () => {
        this.setState({
            collapsed:!this.state.collapsed,
        })
    };

    componentDidMount() {
        this.setState({
            currPage:"mdBaoZhShouR",
        })
    }

    handleMenuClick(key) {
        this.setState({
            currPage:key,
        })
    }

    getDefaultOpenKey(menuData,currPage){
        let list = [];
        let listMap = new Map();
        menuData.map((item)=>{
            if(item.child.length > 0){
                item.child.map((subItem)=>{
                    listMap[subItem.key]=item.key;
                    return subItem.key
                });
            } else {
                listMap[item.key]=item.key;
            }
            return item.key
        });
        list.push(listMap[currPage]);
        return list
    }

    render() {

        const testData = [
            {key:"mdReport",icon:"table",title:"门店报表",child:[
                    {key:"mdBaoZhShouR",title:"门店报账收入日报"},
                    {key:"mdBaoZhShouR1",title:"门店报账收入日报1"},
                    {key:"mdBaoZhShouR2",title:"门店报账收入日报2"}
                ]},
            {key:"mdReport2",icon:"table",title:"门店报表2",child:[
                    {key:"mdBaoZhShouR3",title:"门店报账收入日报3"},
                    {key:"mdBaoZhShouR4",title:"门店报账收入日报4"},
                    {key:"mdBaoZhShouR5",title:"门店报账收入日报5"}
                ]},
            {key:"mdReport3",icon:"table",title:"门店报表3",child:[]}
        ];


        let MenuList = ({mData}) => {
            return (
                <Menu theme="dark"  mode="inline"
                      defaultSelectedKeys={[this.state.currPage]}
                      defaultOpenKeys={this.getDefaultOpenKey(testData,this.state.currPage)}
                >
                    {mData.map((item)=>{
                        if (item.child.length > 0){
                            return (
                                <SubMenu key={item.key} title ={<span><Icon type={item.icon} /><span>{item.title}</span></span>}>
                                    {item.child.map((subItem)=>{
                                        return (
                                            <Menu.Item key={subItem.key} onClick={()=>this.handleMenuClick(subItem.key)}>
                                                <span>{subItem.title}</span>
                                            </Menu.Item>
                                        )
                                    })}
                                </SubMenu>
                            )
                        } else {
                            return (
                                <Menu.Item key={item.key}>
                                    <Icon type={item.icon} />
                                    <span>{item.title}</span>
                                </Menu.Item>
                            )
                        }
                    })}
                </Menu>
            )
        };

        return (
            <Layout>
                <Sider width={256} style={{minHeight:'100vh'}} trigger={null} collapsible collapsed={this.state.collapsed}>
                    <div className="logo" />
                    <MenuList mData={testData} defaultKey = {"mdBaoZhShouR"} defaultOpenKey={"mdReport"} />
                </Sider>
                <Layout>
                    <Header style={{ background: '#fff', padding: 0 , width: '100%' }}>
                        <Icon
                            className="trigger"
                            type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                            onClick={this.toggle}
                        />
                        <div className={"rightHeader"}>
                            <Button type={"link"} onClick={()=>this.props.handleLogout()}>Logout</Button>
                        </div>
                    </Header>
                    <Content
                        style={{
                            margin: '24px 16px',
                            padding: 24,
                            background: '#fff',
                        }}
                    >
                        <PageContent currPage={this.state.currPage} mdName={this.props.mdName} />
                    </Content>
                </Layout>
            </Layout>
        );
    }
}

class PageContent extends React.Component {
    render() {
        switch (this.props.currPage){
            case "mdBaoZhShouR":
                return (
                    <FrmMdBaoZhShouR mdName={this.props.mdName} />
                );
            case "222":
                return (
                    <div>{this.props.currPage}</div>
                );
            default:
                return (
                    <div>{this.props.currPage}</div>
                );
        }
    }
}
