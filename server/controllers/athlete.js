import Athlete from "../models/athlete";
import { createAthlete } from "../helpers/createDoc";
export const getAllAthletes = async (req, res, next) => {
	try {
		const allAthletes = await Athlete.find();
		res.json(allAthletes);
	} catch (err) {
		next(err);
	}
};

export const createNewAthlete = async (req, res, next) => {
	const athlete = createAthlete(req.body, req.params.athleteid);
	try {
		newAthlete = await athlete.save();
		res.json(newAthlete);
	} catch (err) {
		next(err);
	}
};

export const getAthlete = async (req, res, next) => {
	try {
		const athlete = await Athlete.findById(req.params.athleteid);
		res.json(athlete);
	} catch (err) {
		next(err);
	}
};

export const updateAthlete = async (req, res, next) => {
	try {
		const athlete = await Athlete.findByIdAndUpdate(
			req.params.athleteid,
			req.body
		);
		res.json(athlete);
	} catch (err) {
		next(err);
	}
};

export const deleteAthlete = async (req, res, next) => {
	try {
		const athlete = await Athlete.findById(req.params.athleteid);
		if (athlete) {
			await athlete.remove();
		}
		res.json(athlete);
	} catch (err) {
		next(err);
	}
};