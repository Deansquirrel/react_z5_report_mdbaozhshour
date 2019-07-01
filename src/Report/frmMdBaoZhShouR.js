import React from "react";
import {Form, DatePicker, Button, Table, Checkbox, message} from 'antd';
import "antd/dist/antd.css";
import "./frmMdBaoZhShouR.css";
import moment from "moment";

import $ from 'jquery'

class FrmMdBaoZhShouR extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            isSearching:false,
            tableData:{},
            showZzDetail:true,
            showKzDetail:true,
            showQzDetail:true,
        }
    }

    handleFrmSubmit(sDate,eDate){

        let sMDate = moment(sDate,'YYYY-MM-DD');
        let eMDate = moment(eDate,'YYYY-MM-DD');

        if (sMDate > eMDate) {
            message.warn("开始日期不能大于截止日期",3);
            this.setState({
                tableData:[],
            });
            return
        }

        if (sMDate.add(60,'day') <= eMDate ) {
            message.warn("查询间隔不能大于60天",3);
            this.setState({
                tableData:[],
            });
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
                // console.log(data);
                if(data["errcode"]===200){
                    this.setState({
                        tableData:data,
                    })
                } else if(data["errcode"]===10000){
                    message.info("登录已过期，请重新登录");
                    setTimeout(()=>{
                        this.props.handleLogout();
                    },100)
                } else if(data["errmsg"]!=="") {
                    message.info(data["errmsg"]);
                    this.setState({
                        tableData:[],
                    })
                } else {
                    console.log(data);
                    this.setState({
                        tableData:[],
                    })
                }
            }.bind(this),
            error:function(xhr,status,e) {
                message.error("[" + xhr.status + "]" + status + ":"+ e,3)
            }
        })
    }

    handleCheckBoxZzDetail = e => {
        this.setState({
            showZzDetail:e.target.checked,
        })
    };

    handleCheckBoxKzDetail = e => {
        this.setState({
            showKzDetail:e.target.checked,
        })
    };

    handleCheckBoxQzDetail = e => {
        this.setState({
            showQzDetail:e.target.checked,
        })
    };

    render() {
        return (
            <div>
                <h1 style={{fontSize:'24px'}}>门店报账收入日报({this.props.mdName})</h1>
                <SearchFormWrapper
                    isSearching={this.state.isSearching}
                    handleSubmit={(sDate,eDate)=>this.handleFrmSubmit(sDate,eDate)}
                />
                <div className={"TableShowDetail"}>
                    <Checkbox onChange={this.handleCheckBoxZzDetail} defaultChecked={true}>显示转帐明细</Checkbox>
                    <Checkbox onChange={this.handleCheckBoxKzDetail} defaultChecked={true}>显示卡种明细</Checkbox>
                    <Checkbox onChange={this.handleCheckBoxQzDetail} defaultChecked={true}>显示券种明细</Checkbox>
                </div>
                <ShowTable
                    showZzDetail={this.state.showZzDetail}
                    showKzDetail={this.state.showKzDetail}
                    showQzDetail={this.state.showQzDetail}
                    isSearching={this.state.isSearching}
                    tableData={this.state.tableData}
                />
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
                this.props.handleSubmit(values["startDate"].format('YYYY-MM-DD'),values["endDate"].format('YYYY-MM-DD'))
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
                                    // return curr < moment().add(-60,'days').startOf('day')
                                    //     || curr > moment().endOf('day')
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
                                    // return curr < moment().add(-60,'days').startOf('day')
                                    //     || curr > moment().endOf('day')
                                    return curr > moment().endOf('day')
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

    render() {

        const zzColumns = (tableData,showZzDetail) => {

            let defaultColumns = {
                title: '转账',
                dataIndex: 'transfer',
                key: 'transfer',
                align: 'right',
            };

            if ($.isEmptyObject(tableData)) {
                return defaultColumns;
            }
            if ($.isEmptyObject(tableData.zzlist)) {
                return defaultColumns;
            }
            if (!showZzDetail) {
                return defaultColumns;
            }
            return {
                title: '转账',
                    children:[
                        {
                            title: '合计',
                            dataIndex: 'transfer',
                            key: 'transfer',
                            align:'right',
                        },
                        ...tableData.zzlist.map((item)=>{
                            return (
                                {
                                    title:item,
                                    dataIndex:item,
                                    key:item,
                                    align:'right',
                                }
                            )
                        }),
                        {
                            title: '已禁用',
                            dataIndex: 'transferforbidden',
                            key: 'transferforbidden',
                            align:'right',
                        },
                    ]
                }
        };

        const kzColumns = (tableData,showKzDetail) => {
            let defaultColumns =
                    {
                        title: '卡种',
                        dataIndex: 'card',
                        key: 'card',
                        align:'right',
                    };
            if ($.isEmptyObject(tableData)) {
                return defaultColumns;
            }
            if ($.isEmptyObject(tableData.kzlist)) {
                return defaultColumns;
            }
            if (!showKzDetail) {
                return defaultColumns;
            }
            return {
                title: '卡种',
                    children:[
                        {
                            title: '合计',
                            dataIndex: 'card',
                            key: 'card',
                            align:'right',
                        },
                        ...this.props.tableData.kzlist.map((item)=>{
                            return (
                                {
                                    title:item,
                                    dataIndex:item,
                                    key:item,
                                    align:'right',
                                }
                            )
                        }),
                        {
                            title: '已禁用',
                            dataIndex: 'cardforbidden',
                            key: 'cardforbidden',
                            align:'right',
                        }
                    ]
            }
        };

        const qzColumns = (tableData,showQzDetail) => {
            let defaultColumns =
                {
                    title: '券种',
                    dataIndex: 'ticket',
                    key: 'ticket',
                    align:'right',
                };
            if ($.isEmptyObject(tableData)) {
                return defaultColumns;
            }
            if ($.isEmptyObject(tableData.qzlist)) {
                return defaultColumns;
            }
            if (!showQzDetail) {
                return defaultColumns;
            }
            return {
                title: '券种',
                children:[
                    {
                        title: '合计',
                        dataIndex: 'ticket',
                        key: 'ticket',
                        align:'right',
                    },
                    ...this.props.tableData.qzlist.map((item)=>{
                        return (
                            {
                                title:item,
                                dataIndex:item,
                                key:item,
                                align:'right',
                            }
                        )
                    }),
                    {
                        title: '已禁用',
                        dataIndex: 'ticketforbidden',
                        key: 'ticketforbidden',
                        align:'right',
                    }
                ]
            }
        };

        const columns = (tableData,showZzDetail,showKzDetail,showQzDetail) => {

            if($.isEmptyObject(tableData)) {
                return defaultColumns;
            }
            return [
                {
                    title: '日期',
                    dataIndex: 'yyr',
                    key: 'yyr',
                    fixed: 'left',
                    align:'center',
                },
                {
                    title: '合计',
                    dataIndex: 'total',
                    key: 'total',
                    fixed: 'left',
                    align:'right',
                },
                {
                    title: '现金',
                    dataIndex: 'cash',
                    key: 'cash',
                    fixed: 'left',
                    align:'right',
                },
                {
                    title: '赊账',
                    dataIndex: 'credit',
                    key: 'credit',
                    fixed: 'left',
                    align:'right',
                },
                zzColumns(tableData,showZzDetail),
                kzColumns(tableData,showKzDetail),
                qzColumns(tableData,showQzDetail),
                {
                    title: '交易次数',
                    dataIndex: 'totalcheck',
                    key: 'totalcheck',
                    align:'right',
                },

            ];
        };

        const defaultColumns = [
            {
                title: '日期',
                dataIndex: 'yyr',
                key: 'yyr',
                align:'center',
            },
            {
                title: '合计',
                dataIndex: 'total',
                key: 'total',
                align:'center',
            },
            {
                title: '现金',
                dataIndex: 'cash',
                key: 'cash',
                align:'center',
            },
            {
                title: '赊账',
                dataIndex: 'credit',
                key: 'credit',
                align:'center',
            },
            {
                title: '转账',
                dataIndex: 'transfer',
                key: 'transfer',
                align:'center',
            },
            {
                title: '卡种',
                dataIndex: 'card',
                key: 'card',
                align:'center',
            },
            {
                title: '券种',
                dataIndex: 'ticket',
                key: 'ticket',
                align:'center',
            },
            {
                title: '交易次数',
                dataIndex: 'totalcheck',
                key: 'totalcheck',
                align:'center',
            },
        ];

        const dataSource = (tableData) => {
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

        } ;

        return (
            <div>
                <Table
                    loading={this.props.isSearching}
                    bordered
                    size="middle"
                    dataSource={dataSource(this.props.tableData)}
                    columns = {columns(this.props.tableData,this.props.showZzDetail,this.props.showKzDetail,this.props.showQzDetail)}
                    scroll={{x:'max-content'}}
                    pagination={{hideOnSinglePage:true,pageSize:10,showTotal:(total,range)=>{ return `${range[0]}-${range[1]} of ${total}`}}}
                />
            </div>
        )
    }
}
