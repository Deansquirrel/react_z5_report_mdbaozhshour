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
            tableData:{},
        }
    }

    handleFrmSubmit(sDate,eDate){

        if (sDate > eDate) {
            message.warn("开始日期不能大于截止日期",3);
            return
        }

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
                console.log(data);
                this.setState({
                    tableData:data,
                })
            }.bind(this),
            error:function(xhr,status,e) {
                message.error("[" + xhr.status + "]" + status + ":"+ e,3)
            }
        })
    }

    render() {
        return (
            <div>
                <h1 style={{fontSize:'24px'}}>门店报账收入日报({this.props.mdName})</h1>
                <SearchFormWrapper isSearching={this.state.isSearching} handleSubmit={(sDate,eDate)=>this.handleFrmSubmit(sDate,eDate)} />
                <ShowTable tableData={this.state.tableData} />
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
                // if (sDate > eDate){
                //     let t = sDate;
                //     sDate = eDate;
                //     eDate = t;
                // }
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
                                    return curr < moment().add(-60,'days').startOf('day')
                                        || curr > moment().endOf('day')
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
                                    return curr < moment().add(-60,'days').startOf('day')
                                        || curr > moment().endOf('day')
                                }}
                            />,
                        )}
                    </FormItem>
                    <Button
                        loading={this.props.isSearching}
                        style={{float:'left',marginLeft:'36px',marginTop:'3px'}}
                        htmlType={"submit"}
                        type={"primary"}
                    >
                        {!this.props.isSearching?"确定":"Searching"}
                    </Button>
                </Form>
            </div>
        )
    }
}

const SearchFormWrapper = Form.create({ name: 'search_form' })(SearchForm);

class ShowTable extends React.Component {

    getColumns(tableData){
        if ($.isEmptyObject(tableData)){
            return [
                {
                    title: '日期',
                    dataIndex: 'yyr',
                    key: 'yyr',
                },
                {
                    title: '合计',
                    dataIndex: 'total',
                    key: 'total',
                },
                {
                    title: '现金',
                    dataIndex: 'cash',
                    key: 'cash',
                },
                {
                    title: '赊账',
                    dataIndex: 'credit',
                    key: 'credit',
                },
                {
                    title: '转账',
                    children:[
                        {
                            title: '合计',
                            dataIndex: 'transfer',
                            key: 'transfer',
                        },
                        {
                            title: '已禁用',
                            dataIndex: 'transferforbidden',
                            key: 'transferforbidden',
                        }
                    ]
                },
                {
                    title: '卡种',
                    children:[
                        {
                            title: '合计',
                            dataIndex: 'card',
                            key: 'card',
                        },
                        {
                            title: '已禁用',
                            dataIndex: 'cardforbidden',
                            key: 'cardforbidden',
                        }
                    ]
                },
                {
                    title: '券种',
                    children:[
                        {
                            title: '合计',
                            dataIndex: 'ticket',
                            key: 'ticket',
                        },
                        {
                            title: '已禁用',
                            dataIndex: 'ticketforbidden',
                            key: 'ticketforbidden',
                        }
                    ]
                },
                {
                    title: '交易次数',
                    dataIndex: 'totalcheck',
                    key: 'totalcheck',
                },
            ];
        } else {
            return [
                {
                    title: '日期',
                    dataIndex: 'yyr',
                    key: 'yyr',
                    fixed: 'left',
                },
                {
                    title: '合计',
                    dataIndex: 'total',
                    key: 'total',
                    fixed: 'left',
                },
                {
                    title: '现金',
                    dataIndex: 'cash',
                    key: 'cash',
                    fixed: 'left',
                },
                {
                    title: '赊账',
                    dataIndex: 'credit',
                    key: 'credit',
                    fixed: 'left',
                },
                {
                    title: '转账',
                    children:[
                        {
                            title: '合计',
                            dataIndex: 'transfer',
                            key: 'transfer',
                        },
                        ...this.props.tableData.zzlist.map((item)=>{
                            return (
                                {
                                    title:item,
                                    dataIndex:item,
                                    key:item,
                                }
                            )
                        }),
                        {
                            title: '已禁用',
                            dataIndex: 'transferforbidden',
                            key: 'transferforbidden',
                        },
                    ]
                },
                {
                    title: '卡种',
                    children:[
                        {
                            title: '合计',
                            dataIndex: 'card',
                            key: 'card',
                        },
                        ...this.props.tableData.kzlist.map((item)=>{
                            return (
                                {
                                    title:item,
                                    dataIndex:item,
                                    key:item,
                                }
                            )
                        }),
                        {
                            title: '已禁用',
                            dataIndex: 'cardforbidden',
                            key: 'cardforbidden',
                        }
                    ]
                },
                {
                    title: '券种',
                    children:[
                        {
                            title: '合计',
                            dataIndex: 'ticket',
                            key: 'ticket',
                        },
                        ...this.props.tableData.qzlist.map((item)=>{
                            return (
                                {
                                    title:item,
                                    dataIndex:item,
                                    key:item,
                                }
                            )
                        }),
                        {
                            title: '已禁用',
                            dataIndex: 'ticketforbidden',
                            key: 'ticketforbidden',
                        }
                    ]
                },
                {
                    title: '交易次数',
                    dataIndex: 'totalcheck',
                    key: 'totalcheck',
                },

            ];
        }
    }

    getDataSource(tableData){
        if ($.isEmptyObject(tableData)){
            return [];
        } else {
            return tableData.data.map((item)=>{
                return {
                    key:item.yyr,
                    yyr:item.yyr,
                    total:item.total,
                    cash:item.cash,
                    credit:item.credit,
                    transfer:item.transfer,
                    transferforbidden:item.transferforbidden,
                    card:item.card,
                    cardforbidden:item.cardforbidden,
                    ticket:item.ticket,
                    ticketforbidden:item.ticketforbidden,
                    totalcheck:item.totalcheck,
                    ...item.transferdetail,
                    ...item.carddetail,
                    ...item.ticketdetail,
                }
            });
        }
    }

    render() {
        return (
            <div>
                <Table
                    bordered
                    size="middle"
                    dataSource={this.getDataSource(this.props.tableData)}
                    columns = {this.getColumns(this.props.tableData)}
                    scroll={{x:'max-content'}}
                />
            </div>
        )
    }
}
