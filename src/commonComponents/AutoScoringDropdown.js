import React, { Component } from 'react'
import axios from 'axios'
import Dropdown from 'react-bootstrap/Dropdown'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'

class AutoScoringDropdown extends Component {
	constructor(props) {
		super(props)
		this.state = {
			reason: "",
			visible: false,
			onCancel: false
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

	render () {
		return(
			<>
				<Dropdown onSelect={async (item) => {
					if (item === 'auto_scoring') {
						this.props.onShowAnswerChecked();
					}
					else if (item === 'scoring_reason') {
						let result = await axios.post('/ajax_stage_reason', { psgFileId: this.props.psgFileId, epoch: this.props.currentEpoch });
						console.log(result.data.data[0]);
						let node = result.data.data[0].node;
						// 根據樹節點來給予判讀依據
						let reason = "";
						// N1
						if(node === 1){
							reason = 
							"1. 沒有明顯的Spindle <br/> " +
							"2. 頻率成份較不單一 <br/> " +
							"3. EMG活動量較低 <br/> " +
							"4. 沒有明顯Alpha波 <br/> " +
							"5. EEG整體頻率偏高 無明顯慢波";
						}
						// N2
						else if(node === 2){
							reason = 
							"1. 有觀察到Spindle <br/> " +
							"2. 頻率成份較不單一 <br/> " +
							"3. EMG活動量較低 <br/> " +
							"4. 沒有明顯Alpha波 <br/> " +
							"5. EEG整體頻率偏高 無明顯慢波";
						}
						// Wake
						else if(node === 3){
							reason = 
							"1. EOG有明顯活動 <br/> " +
							"2. EMG活動量較高 <br/> " +
							"3. 有觀察到較多Alpha波 <br/> " +
							"4. EEG整體頻率偏高 無明顯慢波";
						}
						// N1
						else if(node === 4){
							reason = 
							"1. EOG較無明顯活動 <br/> " +
							"2. EMG活動量較低 <br/> " +
							"3. 沒有明顯Alpha波 <br/> " +
							"4. EEG整體頻率偏高 無明顯慢波";
						}
						// REM
						else if(node === 5){
							reason = 
							"1. EMG活動量較低 <br/> " +
							"2. 沒有明顯的Spindle <br/> " +
							"3. 沒有明顯Alpha波 <br/> " +
							"4. EEG整體頻率偏高 無明顯慢波";
						}
						// N1
						else if(node === 6){
							reason = 
							"1. EMG活動量較高 <br/> " +
							"2. 沒有明顯的Spindle <br/> " +
							"3. 沒有明顯Alpha波 <br/> " +
							"4. EEG整體頻率偏高 無明顯慢波";
						}
						// N1
						else if(node === 7){
							reason = 
							"1. 頻率成份較不單一 <br/> " +
							"2. 沒有明顯的Spindle <br/> " +
							"3. 沒有明顯Alpha波 <br/> " +
							"4. EEG整體頻率偏高 無明顯慢波";
						}
						// N2
						else if(node === 8){
							reason = 
							"1. 有觀察到Spindle <br/> " +
							"2. 沒有明顯Alpha波 <br/> " +
							"3. EEG整體頻率偏高 無明顯慢波";
						}
						// N3
						else if(node === 9){
							reason = 
							"1. 有明顯慢波 <br/> " +
							"2. 有少許Spindle <br/> " +
							"3. EEG整體頻率偏低 震幅大";
						}
						// N2
						else if(node === 10){
							reason = 
							"1. 有少許慢波 <br/> " +
							"2. 有明顯Spindle <br/> " +
							"3. EEG整體頻率偏低 震幅大";
						}
						// REM
						else if(node === 11){
							reason = 
							"1. 有明顯反向快速眼動 <br/> " +
							"2. EMG活動量較低 <br/> " +
							"3. 沒有明顯Spindle <br/> " +
							"4. 頻率成份較不單一";
						}
						// N1
						else if(node === 12){
							reason = 
							"1. 沒有反向快速眼動 <br/> " +
							"2. EMG活動量較高 <br/> " +
							"3. 沒有明顯Spindle";
						}
						// N1
						else if(node === 13){
							reason = 
							"1. 頻率成份較不單一 <br/> " +
							"2. 沒有明顯Spindle";
						}
						// N2
						else if(node === 14){
							reason = 
							"1. 沒有明顯Alpha波 <br/> " +
							"2. 較類似於N1、N2交界處 <br/> " +
							"3. 有觀察到Spindle";
						}
						// Mov
						else if(node === 15){
							reason = 
							"1. 有翻身或是移動";
						}
						// REM
						else if(node === 16){
							reason = 
							"1. 沒有反向快速眼動 <br/> " +
							"2. EMG活動量較低 <br/> " +
							"3. 沒有明顯Spindle <br/> " +
							"4. 頻率成份較不單一";
						}
						this.setState({
							reason: reason,
							visible: true
						});
						
					}}}>
					<Dropdown.Toggle as={this.CustomToggle} id="account-dropdown">
						自動判讀&nbsp;
					</Dropdown.Toggle>
					<Dropdown.Menu>
						<Dropdown.Item eventKey={'auto_scoring'} style={{color: 'black'}}>
							進行自動判讀
						</Dropdown.Item>
						<Dropdown.Item eventKey={'scoring_reason'} style={{color: 'black'}}>
							此頁Epoch判讀依據
						</Dropdown.Item>
					</Dropdown.Menu>
				</Dropdown>
				<Modal
					show={this.state.visible}
					onHide={() => {
						this.setState({visible: false});
					}}
					size="sm"
					aria-labelledby="contained-modal-title-vcenter"
					centered>
					<Modal.Header closeButton>
						<Modal.Title id="contained-modal-title-vcenter">
							Scored Stage Reason
						</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<div dangerouslySetInnerHTML={{__html: this.state.reason}}>
							
						</div>
						
					</Modal.Body>
					<Modal.Footer>
						<Button
							variant="danger"
							onClick={() => {
								this.setState({visible: false});
							}}>
							Cancel
						</Button>
					</Modal.Footer>
				</Modal>
			</>
		)
	}
}

export default AutoScoringDropdown