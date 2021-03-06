import Training from "../models/training";
import Athlete from "../models/athlete";
import Records from "../models/records";
import { createTraining } from "../helpers/createDoc";

export const getAllTrainings = async (req, res, next) => {
	try {
		const allTrainings = await Training.find({
			athlete_id: req.params.athleteid,
		});
		res.json(allTrainings);
	} catch (err) {
		next(err);
	}
};

export const createNewTraining = async (req, res, next) => {
	const training = createTraining(req.body, req.params.athleteid);
	try {
		const newTraining = await training.save();
		res.json(newTraining);
	} catch (err) {
		next(err);
	}
};

export const updateTraining = async (req, res, next) => {
	let options = { upsert: true, new: true, omitUndefined: true, multi: true };
	try {
		const training = await Training.findByIdAndUpdate(
			req.params.trainingid,
			{
				$set: req.body,
			},
			options
		);
		res.json(training);
	} catch (err) {
		next(err);
	}
};

export const getTraining = async (req, res, next) => {
	try {
		const training = await Training.findById(req.params.trainingid);
		res.json(training);
	} catch (err) {
		next(err);
	}
};

export const getTrainingsInRange = async (req, res, next) => {
	let from = new Date(req.params.from);
	let to = new Date(req.params.to);

	try {
		const trainingsRange = await Training.find({
			athlete_id: req.params.athleteid,
			time_created: { $gte: from, $lte: to },
		}).sort({ time_created: 1 }); //the newest first
		res.json(trainingsRange);
	} catch (err) {
		next(err);
	}
};

export const getRecords = async (req, res, next) => {
	try {
		const records = await Records.findOne({
			training_id: req.params.trainingid,
		}).populate("details");
		res.json(records);
	} catch (err) {
		next(err);
	}
};

export const deleteTraining = async (req, res, next) => {
	try {
		//remove all records from training
		await Records.deleteMany({ training_id: req.params.trainingid }).exec();
		//remove from reference in Athlete
		await Athlete.update(
			{ training_id: req.params.trainingi },
			{ $pull: { training_id: req.params.trainingi } }
		).exec();
		//remove training data
		await Training.deleteMany({ _id: req.params.trainingid });
		res.json(req.params.trainingid);
	} catch (err) {
		next(err);
	}
};
