
const chatService = require('../services/chatService');


class ChatControler {

    async createChat(req, res) {

        try {
            const { teacherId } = req.body;
            const observerId = req.user.id;

            const data = await chatService.createChat(Number(teacherId), observerId);

            return res.status(201).json(data);

        } catch (e) {
            console.log(e.message);
            return res.status(400).json({
                error: e.message
            })

        }



    }


    async getChats (req, res) {

        try {

            const userId = req.user.id;

            const chats = await chatService.getChats(userId);

            return res.status(200).json(chats);



        } catch (e) {

            return res.status(400).json({
                error: e.message
            })

        }
    }


    async getMessages(req, res) {

        try {

            const { chatId } = req.params;
            const userId = req.user.id;

            const messages = await chatService.getMessages(chatId, userId);

            return res.status(200).json(messages);


        } catch (e) {

            return res.status(400).json({
                error: e.message
            })

        }
    }


    async sendMessage(req, res) {

        try {

            const { chatId } = req.params;
            const { content } = req.body;
            const userId = req.user.id;

            const message = await chatService.sendMessage(chatId, content, userId);

            return res.status(201).json(message);

        } catch (e) {

            return res.status(400).json({
                error: e.message
            })

        }






    }

}


module.exports = new ChatControler();