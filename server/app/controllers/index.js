import User from '../models/User';
import Channel from '../models/Channel';
import { sendResponse, sendError } from '../../utility';

module.exports = {
    createUser: async (req, res) => {
        const requestData = req.body;
        const isUserExist = await User.findOneData({ email: requestData.email });
        if(isUserExist) {
            return sendResponse(
                res,
                isUserExist,
                "User fetched successfully",
                true,
                200
            );
        }
        const userObj = new User(req.body);
        await userObj.saveData();
        sendResponse(res, userObj, "User created successfully", true, 200);
    },

    createChannel: async (req, res) => {
        const channelUsers = req.body.channelUsers;
        const firstUser = channelUsers[0];
        const secondUser = channelUsers[1];
        let isChannelAlreadyExist = false;
        let channelModel;

        const channelList = await Channel.findData(
            {
                "channelUsers.email": firstUser.email,
            }
        );

        if(channelList && channelList.length) {
            channelList.forEach((channel) => {
                isChannelAlreadyExist = channel.channelUsers.find((user) => user.email === secondUser.email);
                if(isChannelAlreadyExist){
                    channelModel = channel;
                }
            });
        };

        if(isChannelAlreadyExist){
            return sendResponse(res, channelModel, "Channel created successfully", true, 200);
        }

        channelModel = new Channel(req.body);
        await channelModel.saveData();
        sendResponse(res, channelModel, "Channel created successfully", true, 200);
    },

    getChannelList: async (req, res) => {
        const requestData = req.query;
        const channelList = await Channel.findData({ "channelUsers.email": requestData.email });
        sendResponse(res, channelList, "Channel list fetched", true, 200 );
    },

    searchUser: async (req, res) => {
        const requestData = req.query;
        const isUserExist = await User.findOneData({ email: requestData.email });
        if(!isUserExist) { return sendError(res, {}, "No user found!") };
        sendResponse(res, isUserExist, "User found successfully", true, 200);
    },

    sendMessage: async (req, res) => {
        const requestData = req.body;
        await Channel.findOneAndUpdateData(
            { _id: requestData.channelId },
            { $push: { messages: requestData.messages } }
        );
        sendResponse(res, {}, "Message send successfully", true, 200);
    }
};