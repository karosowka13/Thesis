import React, { Component } from "react";
import { connect } from "react-redux";
import * as actions from "../../../../store/actions/index";
import classes from "./Stats.module.css";

import CanvasJSReact from "../../../../components/DisplayTrainingData/Charts/canvasjs.react";
const CanvasJSChart = CanvasJSReact.CanvasJSChart;

class Stats extends Component {
	componentDidMount() {
		this.props.statisticsData(this.props.userId);
	}

	componentDidUpdate(prevProps) {
		if (
			prevProps.statsSuccess !== this.props.statsSuccess ||
			this.props.successUpload !== prevProps.successUpload ||
			this.props.successDelete !== prevProps.successDelete ||
			this.props.trainings.length !== prevProps.trainings.length
		) {
			this.props.statisticsData(this.props.userId);
		}
	}

	render() {
		let optionsWeek = null;
		let optionsMonth = null;
		let timeW = null;
		let distanceW = null;
		let tssW = null;
		let timeM = null;
		let distanceM = null;
		let tssM = null;
		let chartMonth = null;
		let chartWeek = null;

		if (this.props.statsSuccess && this.props.stats.week.length > 0) {
			let recordMonth = this.props.stats.month[0];
			let recordWeek = this.props.stats.week[0];
			let totalTSSMonth = this.props.stats.totalTSSMonth;
			let totalTSSWeek = this.props.stats.totalTSSWeek;
			let month = [];
			let week = [];
			Object.keys(recordMonth).forEach((key) => {
				if (key !== "_id") {
					let newKey = null;
					let newValue = recordMonth[key];
					if (key === "total_elapsed_time") {
						newValue = recordMonth[key] / 60;
						timeM = (newValue / 60).toFixed(2) + " h";
						newKey = "duration";
					}
					if (key === "training_stress_score") {
						tssM = totalTSSMonth.toFixed(2);
						newKey = "TSS";
					}
					if (key === "total_distance") {
						newKey = "distance";
						distanceM = recordMonth[key].toFixed(2) + " km";
					}
					newValue = parseFloat(newValue.toFixed(0));
					month.push({ y: newValue, label: newKey });
				}
			});
			Object.keys(recordWeek).forEach((key) => {
				if (key !== "_id") {
					let newKey = null;
					let newValue = recordWeek[key];
					if (key === "total_elapsed_time") {
						newValue = recordWeek[key] / 60;
						timeW = (newValue / 60).toFixed(2) + " h";
						newKey = "duration";
					}
					if (key === "training_stress_score") {
						newKey = "TSS";
						tssW = totalTSSWeek.toFixed(2);
					}
					if (key === "total_distance") {
						newKey = "km";
						distanceW = recordWeek[key].toFixed(2) + " km";
					}
					newValue = parseFloat(newValue.toFixed(0));
					week.push({ y: newValue, label: newKey });
				}
			});

			optionsWeek = {
				theme: "light2",
				height: 140,
				width: 200,
				axisY: {
					lineThicknes: 0,
					tickLength: 0,
					labelFontSize: 0,
					gridThickness: 0,
					margin: 0,
					minimum: 0,
				},
				axisX: { labelFontSize: 0, gridThickness: 0, margin: 0 },
				dataPointWidth: 20,

				data: [
					{
						type: "bar",
						color: "#1a8fff",
						fillOpacity: 0.9,
						dataPoints: week,
					},
				],
			};

			optionsMonth = {
				theme: "light2",
				height: 140,
				width: 200,
				axisY: {
					lineThicknes: 0,
					tickLength: 0,
					labelFontSize: 0,
					gridThickness: 0,
					margin: 0,
					minimum: 0,
				},
				axisX: { labelFontSize: 0, gridThickness: 0, margin: 0 },
				dataPointWidth: 20,
				data: [
					{
						type: "bar",
						color: "#1a8fff",
						fillOpacity: 0.9,
						dataPoints: month,
					},
				],
			};
			chartMonth = (
				<div className={classes.Chart}>
					<CanvasJSChart options={optionsMonth} />
				</div>
			);
			chartWeek = (
				<div className={classes.Chart}>
					<CanvasJSChart options={optionsWeek} />
				</div>
			);
		}
		return (
			<div className={classes.Container}>
				<div className={classes.Captions}>
					<p>Total stats</p>
					<p>TSS </p>
					<p>Time on bike </p>
					<p>Distance on bike </p>
				</div>
				<div className={classes.Week}>
					<div className={classes.Text}>
						<p>Last 7 days</p> <p>{tssW} </p> <p>{timeW} </p>{" "}
						<p>{distanceW} </p>
					</div>
					{chartWeek}
				</div>
				<div className={classes.Month}>
					<div className={classes.Text}>
						<p>Last 30 days</p> <p>{tssM} </p> <p>{timeM} </p>
						<p>{distanceM} </p>{" "}
					</div>
					{chartMonth}
				</div>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		stats: state.statistics.statisticsData[0],
		statsSuccess: state.statistics.success,
		userId: state.auth.userId,
		successUpload: state.loadTraininglog.success,
		successDelete: state.loadTraininglog.successDelete,
		trainings: state.loadTraininglog.trainings,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		statisticsData: (userId) => dispatch(actions.fetchStatistics(userId)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Stats);
