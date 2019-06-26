import React from "react";
import { Form,DatePicker,Button } from 'antd';
import "./frmMdBaoZhShouR.css";

class FrmMdBaoZhShouR extends React.Component {
    render() {
        return (
            <div>
                <h1 style={{fontSize:'24px'}}>门店报账收入日报({this.props.mdName})</h1>
                <SearchFormWrapper />
                <div>Report data</div>
            </div>
        )
    }
}

export { FrmMdBaoZhShouR }


const FormItem = Form.Item;

class SearchForm extends React.Component {

    handleSubmit(e){
        e.preventDefault();
        this.props.form.validateFields((err,values)=> {
            if (!err) {
                // this.props.handleRequest(values["requestText"],values["requestKey"],this.state.oprType)
                console.log(values)
            }
        });
    }

    render(){
        const { getFieldDecorator } = this.props.form;

        return (
            <div className={"SearchForm"}>
                <Form style={{height:'100%'}} onSubmit={this.handleSubmit}>
                    <div style={{float:'left',marginTop:'9px'}}><span>查询日期</span></div>
                    <FormItem style={{float:'left',marginLeft:'36px'}}>
                        {getFieldDecorator('startDate',{
                            rules:[{required:true,message:"start date can not be empty"}]
                        })(
                            <DatePicker placeholder={"开始日期"} />,
                        )}
                    </FormItem>
                    <div style={{float:'left',marginTop:'9px',marginLeft:'12px'}}><span>-</span></div>
                    <FormItem style={{float:'left',marginLeft:'12px'}}>
                        {getFieldDecorator('endDate',{
                            rules:[{required:true,message:"end date can not be empty"}]
                        })(
                            <DatePicker placeholder={"截止日期"} />,
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
