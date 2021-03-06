import Training from "../models/training";
import Athlete from "../models/athlete";
import Records from "../models/records";
import mongoose from "mongoose";

export const createAthlete = (allData, athleteId) => {
	let neededForAthlete = [
		"age",
		"gender",
		"height",
		"weight",
		"default_max_heart_rate",
		"default_max_biking_heart_rate",
		"resting_heart_rate",
		"functional_threshold_power",
		"max_heart_rate",
	];
	let userData = allData;
	Object.keys(userData)
		.filter((key) => !neededForAthlete.includes(key))
		.forEach((key) => delete userData[key]);

	Object.assign(userData, { _id: athleteId });
	const athlete = new Athlete(userData);
	return athlete;
};

export const createTraining = (allData, athleteId) => {
	let neededForTraining = [
		"time_created",
		"name",
		"sport",
		"created_at",
		"avg_cadence",
		"avg_heart_rate",
		"avg_power",
		"avg_speed",
		"intensity_factor",
		"max_cadence",
		"max_heart_rate",
		"max_power",
		"max_speed",
		"normalized_power",
		"total_ascent",
		"total_calories",
		"total_cycles",
		"total_descent",
		"total_distance",
		"total_elapsed_time",
		"total_timer_time",
		"total_work",
		"training_stress_score",
	];
	let trainingData = allData;
	Object.keys(trainingData)
		.filter((key) => !neededForTraining.includes(key))
		.forEach((key) => {
			delete trainingData[key];
		});
	Object.keys(trainingData).map((key) => {
		if (key === "total_work") {
			trainingData[key] = trainingData[key] / 1000;
		} else if (key === "total_timer_time") {
		} else if (key === "total_ascent") {
			trainingData[key] = trainingData[key] * 1000;
		}
	});
	console.log(trainingData);

	Object.assign(trainingData, { athlete_id: athleteId });
	const training = new Training(trainingData);

	return training;
};

export const createRecords = (allData) => {
	let recordsData = allData.records;
	let neededForRecords = [
		"timestamp",
		"elapsed_time",
		"timer_time",
		"position_lat",
		"position_long",
		"distance",
		"accumulated_power",
		"altitude",
		"speed",
		"power",
		"heart_rate",
		"cadence",
		"temperature",
	];

	recordsData.forEach((record) => {
		record.altitude = record.altitude * 1000;
		Object.keys(record)
			.filter((key) => !neededForRecords.includes(key))
			.forEach((key) => delete record[key]);
	});
	Object.assign(recordsData[0], { power: recordsData[0].accumulated_power });
	for (let i = 1; i < recordsData.length; i++) {
		{
			if (
				!isNaN(recordsData[i].accumulated_power) &&
				!isNaN(
					recordsData[i - 1].accumulated_power &&
						recordsData[i].accumulated_power
				)
			) {
				Object.assign(recordsData[i], {
					power: Math.abs(
						recordsData[i].accumulated_power -
							recordsData[i - 1].accumulated_power
					),
				});
			}
		}
	}

	return recordsData;
};
