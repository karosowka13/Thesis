import * as actionTypes from "./actionTypes";
import axios from "../../axios-auth";

export const traininglogStart = () => {
	return {
		type: actionTypes.TRAININGLOG_START,
	};
};

export const traininglogSuccess = (trainingLog) => {
	return {
		type: actionTypes.TRAININGLOG_SUCCESS,
		trainings: trainingLog,
	};
};

export const traininglogFail = (error) => {
	return {
		type: actionTypes.TRAININGLOG_FAIL,
		error: error,
	};
};

export const deleteTrainingSuccess = (trainingId) => {
	return {
		type: actionTypes.DELETE_TRAINING,
		trainingId: trainingId,
	};
};

export const loadTraininglog = (trainingLog, userId) => {
	return (dispatch) => {
		dispatch(traininglogStart());
		const data = new FormData();
		data.append("file", trainingLog);
		axios
			.post(process.env.REACT_APP_SERVER + "/upload", data, {
				headers: { user: userId },
			})
			.then((response) => {
				dispatch(traininglogSuccess(response.data));
			})
			.catch((err) => {
				console.log(err);
				dispatch(traininglogFail(err.response.data || "Unexpected error"));
			});
	};
};

export const loadMultipleTraining = (files, userId) => {
	return (dispatch) => {
		dispatch(traininglogStart());
		console.log(files);
		axios
			.post(process.env.REACT_APP_SERVER + "/upload/multi", files, {
				headers: { user: userId, "Content-Type": "multipart/form-data" },
			})
			.then((response) => {
				console.log(response);
				dispatch(traininglogSuccess(response.data));
			})
			.catch((err) => {
				console.log(err);
				dispatch(traininglogFail(err.response.data || "Unexpected error"));
			});
	};
};

export const fetchTrainingsSuccess = (trainings) => {
	return {
		type: actionTypes.FETCH_TRAININGS_SUCCESS,
		trainings: trainings,
	};
};

export const fetchTrainingsFail = (error) => {
	return {
		type: actionTypes.FETCH_TRAININGS_FAIL,
		error: error,
	};
};

export const fetchTrainingsStart = () => {
	return {
		type: actionTypes.FETCH_TRAININGS_START,
	};
};

export const fetchTrainings = (from, to, userId) => {
	return (dispatch) => {
		dispatch(fetchTrainingsStart());
		const queryParams = "/athletes/" + userId + "/trainings/" + from + "/" + to;
		axios
			.get(process.env.REACT_APP_SERVER + queryParams)
			.then((res) => {
				const fetchedTrainings = res.data;
				dispatch(fetchTrainingsSuccess(fetchedTrainings));
			})
			.catch((err) => {
				dispatch(fetchTrainingsFail(err));
			});
	};
};

export const deleteTraining = (userId, trainingId) => {
	return (dispatch) => {
		const queryParams = "/athletes/" + userId + "/trainings/" + trainingId;
		axios
			.delete(process.env.REACT_APP_SERVER + queryParams)
			.then((res) => {
				dispatch(deleteTrainingSuccess(trainingId));
			})
			.catch((err) => {
				dispatch(fetchTrainingsFail(err));
			});
	};
};
