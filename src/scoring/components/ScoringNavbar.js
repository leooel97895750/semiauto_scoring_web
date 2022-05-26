import React from 'react'
import Navbar from 'react-bootstrap/Navbar'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import AccountDropdown from '../../commonComponents/AccountDropdown'
import AutoScoringDropdown from '../../commonComponents/AutoScoringDropdown'
import ReportDropdown from '../../commonComponents/ReportDropdown'

function ScoringNavbar(props) {
	return <Navbar bg="dark" variant="dark">
		<div style={{ width: '150px' }} />
		<Navbar.Brand href="/#/">Scoring Web</Navbar.Brand>
		{props.editable ? <>
			<Form>
				{
					props.hasStagesBeenLoaded ?
					<>
						<Button variant="secondary"
							onClick={props.onComplete}
							disabled={props.buttonDisabled}>
							完成
						</Button>
					</> : null
				}
			</Form>
		</> : null}
		{
			props.editable ? <>
				<div style={{ width: '30px' }} />
				<Navbar.Text>{props.stateToShow}</Navbar.Text>
			</> : null
		}
		{
			props.hasStagesBeenLoaded && props.hasAnswer && props.editable ?
				<>
					<div style={{ width: '30px' }} />
					{/* <input
						type="checkbox"
						id="showAnswer"
						name="showAnswer"
						value="showAnswer"
						disabled={props.enableShowAnswerCheckbox ? '' : 'disabled'}
						onChange = {(e) => {
							props.onShowAnswerChecked(e.target.checked)
						}} /> */}
					<Navbar.Text>
						<AutoScoringDropdown 
							psgFileId = {props.psgFileId} 
							currentEpoch = {props.currentEpoch}
							onShowAnswerChecked = {props.onShowAnswerChecked}
						/>
					</Navbar.Text>
				</> : null
		}
		{
			props.editable == 0 ?
				<>
					<div style={{ width: '30px' }} />
					<Navbar.Text>
						<ReportDropdown 
							stage = {props.stage}
							psgFileId = {props.psgFileId}
							account = {props.account}
						/>
					</Navbar.Text>
				</> : null
		}
		<Navbar.Collapse className="justify-content-end">
			<Navbar.Text>
				<AccountDropdown account={props.account} onLogout={props.onLogout} />
			</Navbar.Text>
			<div style={{ width: '150px' }} />
		</Navbar.Collapse>
	</Navbar>
}

export default ScoringNavbar