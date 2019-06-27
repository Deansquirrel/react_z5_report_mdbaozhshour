import React from "react";
import {Form, DatePicker, Button, Table, message} from 'antd';
import "./frmMdBaoZhShouR.css";
import moment from "moment";

import $ from 'jquery'

class FrmMdBaoZhShouR extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            isSearching:false,
        }
    }

    handleFrmSubmit(sDate,eDate){
        console.log(sDate);
        console.log(eDate);

        let d = {};
        d.token = this.props.token;
        d.startdate = sDate;
        d.enddate = eDate;

        $.ajax({
            type:'POST',
            url:this.props.svrAddress + "/data",
            data:JSON.stringify(d),
            dataType:'json',
            timeout:30000,
            contentType:'application/json',
            cache:false,
            sync:true,
            beforeSend:function(){
                this.setState({
                    isSearching:true,
                });
            }.bind(this),
            complete:function(){
                this.setState({
                    isSearching:false,
                });
            }.bind(this),
            success: function (data) {
                console.log(data)
            }.bind(this),
            error:function(xhr,status,e) {
                message.error("[" + xhr.status + "]" + status + ":"+ e,3)
            }
        })

        // Token     string `json:"token"`
        // StartDate string `json:"startdate"`
        // EndDate   string `json:"enddate"`
    }

    render() {
        return (
            <div>
                <h1 style={{fontSize:'24px'}}>门店报账收入日报({this.props.mdName})</h1>
                <SearchFormWrapper handleSubmit={(sDate,eDate)=>this.handleFrmSubmit(sDate,eDate)} />
                <ShowTable data={{}} />
            </div>
        )
    }
}

export { FrmMdBaoZhShouR }


const FormItem = Form.Item;

class SearchForm extends React.Component {

    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err,values)=> {
            if (!err) {
                let sDate = values["startDate"];
                let eDate = values["endDate"];
                if (sDate > eDate){
                    let t = sDate;
                    sDate = eDate;
                    eDate = t;
                }
                this.props.handleSubmit(sDate.format('YYYY-MM-DD'),eDate.format('YYYY-MM-DD'))
            }
        });
    };

    render(){
        const { getFieldDecorator } = this.props.form;

        return (
            <div className={"SearchForm"}>
                <Form style={{height:'100%'}} onSubmit={this.handleSubmit}>
                    <div style={{float:'left',marginTop:'9px'}}><span>查询日期</span></div>
                    <FormItem style={{float:'left',marginLeft:'36px',width:'120px'}}>
                        {getFieldDecorator('startDate',{
                            initialValue:moment().add(-1,'day'),
                            rules:[{required:true,message:"start date can not be empty"}]
                        })(
                            <DatePicker
                                allowClear={false}
                                format={"YYYY-MM-DD"}
                                placeholder={"开始日期"}
                                disabledDate={(curr)=>{
                                    return curr > moment().endOf('day')
                                }}
                            />,
                        )}
                    </FormItem>
                    <div style={{float:'left',marginTop:'9px',marginLeft:'12px'}}><span>-</span></div>
                    <FormItem style={{float:'left',marginLeft:'12px',width:'120px'}}>
                        {getFieldDecorator('endDate',{
                            initialValue:moment().add(-1,'day'),
                            rules:[{required:true,message:"end date can not be empty"}]
                        })(
                            <DatePicker
                                allowClear={false}
                                format={"YYYY-MM-DD"}
                                placeholder={"截止日期"}
                                disabledDate={(curr)=>{
                                    return curr > moment().endOf('day')
                                }}
                            />,
                        )}
                    </FormItem>
                    <Button
                        style={{float:'left',marginLeft:'36px',marginTop:'3px'}}
                        htmlType={"submit"}
                        disabled={this.props.disable}
                        type={"primary"}
                    >
                        确定
                    </Button>
                </Form>
            </div>
        )
    }
}

const SearchFormWrapper = Form.create({ name: 'search_form' })(SearchForm);

class ShowTable extends React.Component {

    render() {
        const dataSource = [
            // {
            //     key: '1',
            //     name: '胡彦斌',
            //     age: 32,
            //     address: '西湖区湖底公园1号',
            // },
            // {
            //     key: '2',
            //     name: '胡彦祖',
            //     age: 42,
            //     address: '西湖区湖底公园1号',
            // },
        ];
        const columns = [
            {
                title: '日期',
                dataIndex: 'date',
                key: 'date',
            },
            {
                title: '合计',
                dataIndex: 'age',
                key: 'age',
            },
            {
                title: '现金',
                dataIndex: 'xj',
                key: 'xj',
            },
            {
                title: '赊账',
                dataIndex: 'sz',
                key: 'sz',
            },
            {
                title: '转账',
                children:[
                    {
                        title: '合计',
                        dataIndex: 'szTotal',
                        key: 'szTotal',
                    },
                    {
                        title: '转账1',
                        dataIndex: 'sz1',
                        key: 'sz1',
                    }
                ]
            },
            {
                title: '卡种',
                children:[
                    {
                        title: '合计',
                        dataIndex: 'kzTotal',
                        key: 'kzTotal',
                    },
                    {
                        title: '卡种1',
                        dataIndex: 'kz1',
                        key: 'kz1',
                    }
                ]
            },
            {
                title: '券种',
                children:[
                    {
                        title: '合计',
                        dataIndex: 'qzTotal',
                        key: 'qzTotal',
                    },
                    {
                        title: '券种1',
                        dataIndex: 'qz1',
                        key: 'qz1',
                    }
                ]
            },
            {
                title: '交易次数',
                dataIndex: 'totalCheck',
                key: 'totalCheck',
            },

        ];
        return (
            <div>
                <Table bordered dataSourct={dataSource} columns = {columns} />
            </div>
        )
    }
}
