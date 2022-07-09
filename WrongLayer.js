import React from 'react'
import styles from './css/fillStyle.module.css'
import { linearScale } from './functions/LinearScale'
function WrongLayer(props) {
    //console.log(props)
    let transform = linearScale(0, props.score_list.length, props.leftBoundary, props.rightBoundary)
	let rects = []
    let cont = false
	let startX = null
    // color of block
	let fill = 'rgba(0, 0, 255, 0.3)'
    for (let i = 0; i < props.score_list.length; i++) {
        if(cont){
            //遇到1結束==>開始畫實體rects
            if(props.score_list[i]===1){
                let endX = transform(i)
				rects.push(<rect
					key={i}
					x={startX}
					y={props.topBoundary}
					width={endX - startX}
					height={props.bottomBoundary - props.topBoundary}
					style={{
						fill: fill
					}} />)
				cont = false
            }
        }else{
            //遇到0開始==>開始找結束位置(1)
            if(props.score_list[i]===0){
                startX = transform(i)
				cont = true
            }
        }
    }
    //draw all rects
    return <svg className={styles.fill} width={props.width} height={props.height}>{rects}</svg>;
}
export default WrongLayer