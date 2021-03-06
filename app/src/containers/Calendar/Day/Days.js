import React, { Component } from "react";
import * as dateFns from "date-fns";
import { connect } from "react-redux";
import * as actions from "../../../store/actions/index";
import Tooltip from "rc-tooltip";
import "rc-tooltip/assets/bootstrap.css";
import axios from "axios";
import withErrorHandler from "../../../hoc/withErrorHandler/withErrorHandler";
import ButtonIcon from "../../../components/UI/ButtonIcon/ButtonIcon";
import DirectionsBikeIcon from "@material-ui/icons/DirectionsBike";
import ChatIcon from "@material-ui/icons/Chat";

import classes from "./Days.module.css";

class Day extends Component {
	constructor(props) {
		super(props);
		// This binding is necessary to make `this` work in the callback
		this.scrollToNode = this.scrollToNode.bind(this);
		this.state = { today: new Date() };
		this.ref = React.createRef();
	}

	componentDidMount() {
		this.startFetching();
		this.scrollToNode(this.scrollDay);
	}

	componentDidUpdate(prevProps) {
		if (
			this.props.month !== prevProps.month ||
			this.props.successUpload !== prevProps.successUpload ||
			this.props.trainings.length !== prevProps.trainings.length
		) {
			this.startFetching();
		}
		if (
			this.props.day !== prevProps.day &&
			typeof this.props.day !== "undefined"
		) {
			this.scrollToNode(this.scrollDay);
		}
	}

	scrollToNode(node) {
		node.scrollIntoView({ behavior: "smooth", block: "center" });
	}

	startFetching = () => {
		let from = dateFns.startOfWeek(dateFns.startOfMonth(this.props.month), {
			weekStartsOn: 1,
		});
		let end = dateFns.endOfMonth(from);
		let to = dateFns.endOfWeek(end, { weekStartsOn: 1 });
		from = dateFns.formatISO(from, { representation: "date" });
		to = dateFns.formatISO(to, { representation: "date" });
		this.props.fetchTrainings(from, to, this.props.userId);
	};

	getTimeCreated = () => {
		let arrayofobject = this.props.trainings;
		let timeCreated = arrayofobject.map((training) => {
			return training.time_created;
		});
		let unique = [...new Set(timeCreated)];
		return unique;
	};

	render() {
		const currentMonth = this.props.month;
		const selectedDate = this.props.day;
		const monthStart = dateFns.startOfMonth(currentMonth);
		const monthEnd = dateFns.endOfMonth(monthStart);
		const startDate = dateFns.startOfWeek(monthStart, { weekStartsOn: 1 });
		const endDate = dateFns.endOfWeek(monthEnd, { weekEndsOn: 1 });
		const dateFormat = "d";
		const rows = [];
		let days = [];
		let day = startDate;
		let trainedDays = this.getTimeCreated();

		let trainingId = null;
		this.props.trainings.map((training) => {
			if (
				dateFns.isSameDay(
					this.props.day,
					dateFns.parseISO(training.time_created)
				)
			) {
				trainingId = training._id;
			}
		});

		while (day <= endDate) {
			for (let i = 0; i < 7; i++) {
				const cloneDay = day;
				const trainingIcon = [];
				if (trainedDays.length > 0) {
					trainedDays.forEach((trainedDay, index) => {
						trainedDay = dateFns.parseISO(trainedDay);
						if (dateFns.isSameDay(cloneDay, trainedDay)) {
							trainingIcon.push(
								<Tooltip
									key={index}
									placement="topRight"
									trigger={["hover"]}
									mouseLeaveDelay="0.1"
									overlay={<span>View training</span>}
								>
									<DirectionsBikeIcon
										key={cloneDay}
										style={{ fontSize: "inherit", cursor: "pointer" }}
										onClick={this.props.showRide}
									/>
								</Tooltip>
							);
						}
					});
				}
				let dayNumber = dateFns.format(cloneDay, dateFormat);
				const cellClasses = [classes.Cell];

				if (!dateFns.isSameMonth(cloneDay, monthStart)) {
					cellClasses.push(classes.Disabled);
				} else if (dateFns.isSameDay(cloneDay, selectedDate)) {
					cellClasses.push(classes.Selected);
					days.push(
						<div key={"focus"} ref={(node) => (this.scrollDay = node)}></div>
					);
				} else if (dateFns.isSameDay(cloneDay, this.state.today)) {
					cellClasses.push(classes.Today);
				}
				let addTSSButton = null;
				if (cloneDay)
					if (i === 6) {
						addTSSButton = (
							<div className={classes.AddMentalTSS}>
								<Tooltip
									placement="topRight"
									trigger={["hover"]}
									mouseLeaveDelay="0.1"
									overlay={<span>Extra TSS</span>}
								>
									<ChatIcon
										style={{ fontSize: "inherit", cursor: "pointer" }}
										btntype="EditIcon"
										onClick={this.props.addTSS}
									/>
								</Tooltip>
							</div>
						);
					}
				days.push(
					<div
						className={cellClasses.join(" ")}
						key={cloneDay}
						onClick={() => this.props.onDayClick(cloneDay)}
					>
						<div className={classes.Container}>
							<div className={classes.Number}>{dayNumber}</div>

							<ButtonIcon
								key={cloneDay.getTime() + 8}
								btntype="AddCircleOutlineIcon"
								onChange={this.props.showModal}
								idValue={cloneDay.getTime() + 7}
							/>

							<ButtonIcon
								btntype="DeleteIcon"
								onClick={() =>
									this.props.deleteTraining(this.props.userId, trainingId)
								}
							/>

							<div className={classes.Activity}>{trainingIcon}</div>
							{addTSSButton}
						</div>
					</div>
				);
				day = dateFns.addDays(day, 1);
			}
			rows.push(
				<div className={classes.DaysRow} key={day.getTime() + 1}>
					{days}
				</div>
			);
			days = [];
		}

		return <div className={classes.AllDaysContainer}>{rows}</div>;
	}
}

const mapStateToProps = (state) => {
	return {
		userId: state.auth.userId,
		day: state.date.day,
		month: state.date.month,
		trainings: state.loadTraininglog.trainings,
		successUpload: state.loadTraininglog.success,
		pastDay: state.date.pastDay,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		deleteTraining: (userId, trainingId) =>
			dispatch(actions.deleteTraining(userId, trainingId)),
		onDayClick: (day) => dispatch(actions.onDateClick(day)),
		fetchTrainings: (from, to, userId) =>
			dispatch(actions.fetchTrainings(from, to, userId)),
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withErrorHandler(Day, axios));
