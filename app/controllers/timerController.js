const Timer = require('../models/Timer');
const DaySession = require('../models/DaySession');
const { successMessage, errorMessage, status } = require('../helpers/status');

const createTimer = async (req,res) => {
    const userId = req.user.id;
    const timer = Timer.build({
        ...req.body,
        UserId: userId
    });

    try {
        const {dataValues} = await timer.save();

        const daySession = DaySession.build({
            TimerId: dataValues.id
        });

        const daySessionResponse = await daySession.save();
        const daySessionValues = daySessionResponse.dataValues;

        delete dataValues.UserId;
        delete daySessionValues.TimerId;
        
        dataValues.DaySessions = [daySessionValues];
        
        successMessage.result = dataValues;
        res.status(status.created).send(successMessage);
    } catch(err) {
        res.status(status.conflict).send(err);
    }
}

const getAllTimer = async (req, res) => {
    const userId = req.user.id;
    try {
        const dataValues = await Timer.findAll({ where: { UserId: userId }, include: [DaySession] });
        successMessage.result = dataValues;
        res.status(status.success).send(successMessage);
    } catch(err) {

    }
}

const updateTimerTotalDuration = async (daySession) => {
    const timerId = daySession.TimerId;
    let totalDuration = 0;

    try {
        const daySessionsResponse = await DaySession.findAll({where: {TimerId: timerId}});

        for(let daySession of daySessionsResponse) {
            const { dataValues } = daySession;
            
            totalDuration += dataValues.duration;
        }
    
        await Timer.update({totalDuration: totalDuration}, { where: { id: timerId }, returning: true, plain: true });
    } catch(error) {
        console.log(error);
    }
    
    return totalDuration;
}

const createDaySession = async (req, res) => {
    const daySession = DaySession.build({
        ...req.body,
    });

    try {
        const { dataValues } = await daySession.save();

        //Update total duration timer
        const totalDuration = await updateTimerTotalDuration(dataValues);

        //Sucess message
        successMessage.result = { 
            daySession: dataValues,
            totalDuration: totalDuration
        };

        res.status(status.created).send(successMessage);
    } catch(err) {
        res.status(status.conflict).send(err);
    }
}

const updateDaySession = async (req, res) => {
    const idDaySession = req.body.id;
    const newDuration = req.body.duration;
    try {
        //Update day session
        const dataValues = await DaySession.update({duration: newDuration}, { where: {id: idDaySession}, returning: true, plain: true });
    
        //Update total duration timer
        const totalDuration = await updateTimerTotalDuration(dataValues[1]);
        
        //Success message
        successMessage.result = { 
            daySession: dataValues[1],
            totalDuration: totalDuration
        };

        res.status(status.success).send(successMessage);
    } catch(err) {
        res.status(status.conflict).send(err);
    }
}

const updateTimer = async (req, res) => {
    const timerId = req.body.id;
    const updatedTimer = req.body;

    try {
        const dataValues = await Timer.update({...updatedTimer}, { where: {id: timerId}, returning: true, plain: true });
        const timer = await Timer.findOne({ where: {id: timerId}, include: [DaySession] });
        successMessage.result = timer;
        res.status(status.success).send(successMessage);
    } catch(err) {
        res.status(status.conflict).send(err);
    }
}

const deleteTimer = async (req, res) => {
    const timerId = req.params.id;
    
    try {
        const dataValues = await Timer.destroy({ where: {id: timerId} });
        //const daySession = await DaySession.destroy({ where: {TimerId: timerId } });

        successMessage.result = dataValues;
        res.status(status.success).send(successMessage);
    } catch(err) {
        res.status(status.conflict).send(err);
    }
}

module.exports.createTimer = createTimer;
module.exports.getAllTimer = getAllTimer;
module.exports.createDaySession = createDaySession;
module.exports.updateDaySession = updateDaySession;
module.exports.updateTimer = updateTimer;
module.exports.deleteTimer = deleteTimer;