import React, { Component } from "react";
import { connect } from "react-redux";
import * as actions from "../../store/actions/index";
import classes from "./Stats.module.css";

import CanvasJSReact from "../../components/DisplayTrainingData/Charts/canvasjs.react";
const CanvasJSChart = CanvasJSReact.CanvasJSChart;

class Stats extends Component {
	componentDidMount() {
		this.props.statisticsData(this.props.userId);
	}
	render() {
		let optionsWeek = null;
		let optionsMonth = null;
		let week = [];
		let month = [];
		let chartMonth = null;
		let chartWeek = null;
		if (this.props.success) {
			for (let record of this.props.stats.month[0]) {
				month.push({ y: record[1], label: record[0] });
			}
			for (let record of this.props.stats.week[0]) {
				week.push({ y: record[1], label: record[0] });
			}
			console.log("week", week, month);
			optionsWeek = {
				theme: "light2",
				width: 300,
				axisY: { gridThickness: 0, margin: 0, minimum: 0 },
				axisX: { gridThickness: 0, margin: 0 },
				data: [
					{
						type: "bar",
						color: "blue",
						fillOpacity: 0.9,
						dataPoints: [week],
					},
				],
			};

			optionsMonth = {
				theme: "light2",
				width: 300,
				axisY: { gridThickness: 0, margin: 0, minimum: 0 },
				axisX: { gridThickness: 0, margin: 0 },
				data: [
					{
						type: "bar",
						color: "blue",
						fillOpacity: 0.9,
						dataPoints: [month],
					},
				],
			};
			chartMonth = <CanvasJSChart options={optionsMonth} />;
			chartWeek = <CanvasJSChart options={optionsWeek} />;
		}
		return (
			<div className={classes.Container}>
				<div className={classes.Captions}>
					<p>Stats</p>
					<p>Total duration</p>
					<p>Total distance</p>
					<p>Total TSS</p>
				</div>
				<div className={classes.Week}>This week {chartWeek}</div>
				<div className={classes.Month}>This month {chartWeek}</div>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		stats: state.statistics.statisticsData[0],
		statsSuccess: state.statistics.success,
		userId: state.auth.userId,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		statisticsData: (userId) => dispatch(actions.fetchStatistics(userId)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Stats);
