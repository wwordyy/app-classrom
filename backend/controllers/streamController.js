
const streamService = require('../services/streamService');

class StreamController {

    async createStream (req, res) {

        try{ 

            const { title, description, startDate, endDate, groups } = req.body;

            if (!title || !startDate || !endDate) {

                return res.status(400).json({
                    error: 'Название, старт и конец потока - это обязательные поля к заполнению!'

                })
            }

            await streamService.createStream({title, description, startDate, endDate, groups})

            return res.status(201).json({
                "ok": true,
            })

        } catch (e) {
            return res.status(400).json({
                error: e.message
            })
        }


    }

}

module.exports = new StreamController();