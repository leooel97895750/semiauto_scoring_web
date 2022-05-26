import React, { Component } from 'react'
import Dropdown from 'react-bootstrap/Dropdown'

class DrawGraph extends Component {
	constructor(props) {
		super(props)
		this.state = {

		}
	}
	

	componentDidUpdate () {

		// hypnogram繪製
		let hHeight = 100;
        let hWidth = 1000;
		let hCanvas = document.getElementById("hypnogram");
        hCanvas.height = hHeight;
        hCanvas.width = hWidth;
        let hCTX = hCanvas.getContext("2d");
        hCTX.clearRect(0, 0, hCanvas.width, hCanvas.height);
        // 左側Label
        hCTX.font = "14px Arial";
        hCTX.textAlign = "end";
        hCTX.fillStyle = "#AA0000";
        hCTX.fillText("R", 85, 15);
        hCTX.fillStyle = "black";
        hCTX.fillText("W", 85, 30);
        hCTX.fillStyle = "#CCAA00";
        hCTX.fillText("N1", 85, 45);
        hCTX.fillStyle = "green";
        hCTX.fillText("N2", 85, 60);
        hCTX.fillStyle = "blue";
        hCTX.fillText("N3", 85, 75);
        // 畫橫時間軸
        hCTX.beginPath();
        hCTX.moveTo(100, 25);
        hCTX.lineTo(hWidth, 25);
        hCTX.strokeStyle = 'gray';
        hCTX.lineWidth = "1";
        hCTX.stroke();

        let stage = this.props.stage;
		console.log(stage);
        for(let i=0; i<stage.length; i++){
            
            if(stage[i] === -1){
                hCTX.fillStyle = "#A2142F";
                hCTX.fillRect(100+i, 10, 1, 15);
                hCTX.stroke();
            }
            else{
                if(stage[i] === 3){
                    hCTX.fillStyle = "#0072BD";
                    hCTX.fillRect(100+i, 25, 1, 45);
                    hCTX.stroke();
                }
                if(stage[i] === 2){
                    hCTX.fillStyle = "#77AC30";
                    hCTX.fillRect(100+i, 25, 1, 30);
                    hCTX.stroke();
                }
                if(stage[i] === 1){
                    hCTX.fillStyle = "#EDB120";
                    hCTX.fillRect(100+i, 25, 1, 15);
                    hCTX.stroke();
                }
            } 
        }

		//繪製完成後存起來
		
		let graphData = {
			hypnogram: document.getElementById("hypnogram").toDataURL('image/png')
		}
		this.props.saveGraph(graphData);
	}

	render () {
		return(
			<>
				<div style={{display:this.props.visible, position: "absolute", width:"100%", fontSize:"20px", backgroundColor:"white", zIndex:"100"}}>
					<canvas id = "hypnogram" width = "1000px" height = "100px" style={{margin:"5px"}}/><br />
					<canvas id = "stage_matrix" width = "800px" height = "100px" style={{margin:"5px"}}/><br />
					
				</div>
			</>
		)
	}
}

export default DrawGraph