import React from 'react';
import {LocaleProvider} from 'antd';
// import { Form,Input,Icon,Row,Col,message,Table } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';

import { LoginForm } from "./Login/frmLogin"

import "antd/dist/antd.css";
import "./App.css"
// import $ from 'jquery'

// const FormItem = Form.Item;

export default App;



function App(){
    return (
        <LocaleProvider locale={zhCN}>
            <div className={"rootContainer"}>
                <LoginForm />
            </div>
        </LocaleProvider>
    )
}

// class TestDiv extends React.Component {
//     render() {
//         return(
//             <div>
//                 <h1>Test Div</h1>
//             </div>
//         )
//     }
// }
//
// class ContentContainer extends Component {
//     constructor(props) {
//         super(props);
//         this.state={
//             address:"",
//             isProcessing:false,
//             oprType:0,
//             isFormDisable:false,
//             resultText:"",
//             resultKey:"",
//             showType:0,
//         }
//     }
//
//     componentWillMount() {
//         $.ajax({
//             url:'../../config.json',
//             cache:false,
//             dataType:'json',
//             success:function(data){
//                 this.setState({
//                     address:data["address"]
//                 });
//             }.bind(this),
//             error:function(e){
//                 console.log(e.toString());
//                 this.setState({
//                     address:""
//                 });
//             }.bind(this)
//         });
//     }
//
//     componentDidMount() {
//         this.setState({
//             showType:1
//         })
//     }
//
//     showConvert(showType){
//         this.setState({
//             showType:showType,
//         })
//     }
//
//     handleRequest(text,key,oprType){
//         if(this.state.address === ""){
//             message.warn("request address is empty,please retry after a few seconds",3);
//             return
//         }
//
//         let d = {};
//         d.requesttext = text;
//         d.requestkey = key;
//         d.oprtype = oprType;
//
//         const hide = message.loading("action in progress..",0);
//
//         $.ajax({
//             type:'POST',
//             url:this.state.address + "/code",
//             data:JSON.stringify(d),
//             dataType:'json',
//             timeout:30000,
//             contentType:'application/json',
//             cache:false,
//             sync:true,
//             beforeSend:function(){
//                 this.setState({
//                     isFormDisable:true,
//                 });
//             }.bind(this),
//             complete:function(){
//                 this.setState({
//                     isFormDisable:false,
//                 });
//                 setTimeout(hide,0)
//             }.bind(this),
//             success: function (data) {
//                 if(data["errcode"]===0){
//                     // message.info(data["responsetext"],5)
//                     this.setState({
//                         resultText:data["responsetext"],
//                         resultKey:key,
//                         showType:2,
//                     });
//                 } else {
//                     message.error(data["errmsg"],3)
//                 }
//             }.bind(this),
//             error:function(xhr,status,e) {
//                 console.log(e);
//                 message.error("[" + xhr.status + "]" + status + ":"+ e.toString(),3)
//             }
//         })
//     }
//
//     render() {
//         switch (this.state.showType) {
//             case 1:
//                 return (
//                     <div>
//                         <EFromContainer
//                             showConvert={()=>this.showConvert(2)}
//                             handleRequest={(text,key,oprType)=>this.handleRequest(text,key,oprType)}
//                             disable={this.state.isFormDisable}
//                         />
//                     </div>
//                 );
//             case 2:
//                 return (
//                     <div>
//                         <ResultContainer resultText={this.state.resultText} resultKey={this.state.resultKey} showConvert={()=>this.showConvert(1)}/>
//                     </div>
//                 );
//             default:
//                 return (
//                     <div>&nbsp;</div>
//                 )
//         }
//     }
// }
//
// class ResultContainer extends React.Component {
//
//     render() {
//         const dataSource = [
//             {
//                 key:"Text",
//                 lab:"Text",
//                 val:this.props.resultText
//             },
//             {
//                 key:"Key",
//                 lab:"Key",
//                 val:this.props.resultKey
//             }
//         ];
//
//         const columns = [
//             {
//                 align:"right",
//                 dataIndex:"lab",
//                 title:"Content",
//                 rowKey:"key",
//             }  ,
//             {
//                 dataIndex:"val",
//                 title:"Val",
//             }
//         ];
//
//         return (
//             <div className={"ResultContainer"}>
//                 <h1>Result</h1>
//                 <div>
//                     <Table pagination={false} showHeader={false} bordered={true} dataSource={dataSource} columns={columns} />
//                 </div>
//                 <div className={"divNextBtn"}>
//                     &nbsp;
//                     <Button
//                         style={{float:"right"}} size={"large"} type={"primary"}
//                         onClick={this.props.showConvert}>
//                         Next
//                     </Button>
//                 </div>
//             </div>
//         )
//     }
// }
//
//
// class FromContainer extends React.Component {
//     constructor(props) {
//         super(props);
//         this.state={
//             oprType:0,
//         }
//     }
//
//     componentDidMount() {
//         FromContainer.resetFocus()
//     }
//
//     static resetFocus(){
//         document.getElementById("formContainer_requestText").focus();
//     }
//
//     handleReset = () => {
//         this.props.form.resetFields();
//         FromContainer.resetFocus();
//     };
//
//     updateOprType(oprType){
//         this.setState({
//             oprType:oprType,
//         })
//     }
//
//     handleSubmit = (e) => {
//         e.preventDefault();
//            this.props.form.validateFields((err,values)=> {
//            if (!err) {
//                this.props.handleRequest(values["requestText"],values["requestKey"],this.state.oprType)
//            }
//         });
//     };
//
//     render(){
//         const { getFieldDecorator } = this.props.form;
//
//         return (
//             <div className={"FormContainer"}>
//                 <Form onSubmit={this.handleSubmit}>
//                     <h1>Coding</h1>
//                     <FormItem>
//                         {getFieldDecorator('requestText',{
//                             rules:[{required:true,message:"request text can not be empty"}]
//                         })(
//                             <Input
//                                 id={"inputText"}
//                                 disabled={this.props.disable}
//                                 autoFocus={true}
//                                 size={"large"}
//                                 prefix={
//                                     <Icon
//                                         type={"edit"}
//                                         theme="filled"
//                                         style={{color:'rgba(0,0,0,.25'}}
//                                     />
//                                 }
//                                 placeholder={"Text"}
//                             />,
//                         )}
//                     </FormItem>
//                     <FormItem>
//                         {getFieldDecorator('requestKey',{
//                             rules:[{required:true,message:"request key can not be empty"}]
//                         })(
//                             <Input
//                                 disabled={this.props.disable}
//                                 size={"large"}
//                                 prefix={
//                                     <Icon
//                                         type={"lock"}
//                                         theme="filled"
//                                         style={{color:'rgba(0,0,0,.25'}}
//                                     />
//                                 }
//                                 placeholder={"Key"}
//                             />,
//                         )}
//                     </FormItem>
//                     <Row gutter={{ xs: 8, sm: 16, md: 24}}>
//                         <Col xs={7} sm={6} md={5}>
//                             <Button
//                                 disabled={this.props.disable}
//                                 size={"large"} type={"primary"}
//                                 onClick={this.handleReset}>
//                                 Reset
//                             </Button>
//                         </Col>
//                         <Col xs={1} sm={6} md={9}>&nbsp;</Col>
//                         <Col xs={8} sm={6} md={5}>
//                             <Button
//                                 htmlType={"submit"}
//                                 disabled={this.props.disable}
//                                 style={{float:"right"}} size={"large"} type={"primary"}
//                                 onClick={()=>{this.updateOprType(1)}}>
//                                 Encrypt
//                             </Button>
//                         </Col>
//                         <Col xs={8} sm={6} md={5}>
//                             <Button
//                                 htmlType={"submit"}
//                                 disabled={this.props.disable}
//                                 style={{float:"right"}} size={"large"} type={"primary"}
//                                 onClick={()=>{this.updateOprType(2)}}>
//                                 Decrypt
//                             </Button>
//                         </Col>
//                     </Row>
//                 </Form>
//             </div>
//         )
//     }
// }
//
// const EFromContainer = Form.create({ name: 'formContainer' })(FromContainer);
