import React, { Component } from 'react'
import axios from 'axios'
import Dropdown from 'react-bootstrap/Dropdown'
import DrawGraph from './DrawGraph'

class ReportDropdown extends Component {
	constructor(props) {
		super(props)
		this.state = {
			visible: "none",
			graphData: {},
		}
	}
	
	CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
		<a
			href="/#/"
			ref={ref}
			onClick={(e) => {
				e.preventDefault();
				onClick(e);
			}}>
			{children}
			&#x25bc;
		</a>
	))

	saveGraph = async (graphData) => {
		let result = await axios.post('/graph', {graphData: graphData, account:this.props.account});
		console.log(graphData);
		console.log(result);
	}

	render () {
		return(
			<>
				<DrawGraph
					stage={this.props.stage}
					visible={this.state.visible}
					saveGraph={this.saveGraph}
				/>
				<Dropdown onSelect={ (item) => {
					if (item === 'workshop') {
						// 繪製圖片傳至後端 (不知道會不會出現canvas還沒畫完的情形?)
						this.setState({visible: "block"}); // 方便繪製的工具，完成後須註解
						
						
						// 產生報告並下載
						let xhttp = new XMLHttpRequest();
						xhttp.responseType = 'blob';
						xhttp.onload = () => {
							let blob = xhttp.response; //Blob資料
							if (xhttp.status === 200) {
								if (blob && blob.size > 0) {
									let element = document.createElement('a');
									element.setAttribute('href', URL.createObjectURL(blob));
									element.setAttribute('download',  'report.docx');
									document.body.appendChild(element);
									element.click();
								} 
							} 
						}
						let data = {account: this.props.account, psgfileid: this.props.psgFileId};
						let url = "https://ncbcilab.csie.ncku.edu.tw/word";
						xhttp.open("POST", url, true);
						xhttp.setRequestHeader("Content-type", "application/json");
  						xhttp.send(JSON.stringify(data));
					}
					else if (item === 'sleep_report') {
						alert("尚未開放的功能喔~\n敬請期待!");
					}}}>
					<Dropdown.Toggle as={this.CustomToggle} id="account-dropdown">
						產生報告&nbsp;
					</Dropdown.Toggle>
					<Dropdown.Menu>
						<Dropdown.Item eventKey={'workshop'} style={{color: 'black'}}>
							工作坊報告
						</Dropdown.Item>
						<Dropdown.Item eventKey={'sleep_report'} style={{color: 'black'}}>
							睡眠檢查報告
						</Dropdown.Item>
					</Dropdown.Menu>
				</Dropdown>
			</>
		)
	}
}

export default ReportDropdown