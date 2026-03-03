

const dashboardService = require('../../services/observer/dashboardService')


class DashboardController {


    async getOverview(req,res) {

        try{
            const overview =  await dashboardService.getOverview();
            
            res.status(200).json(overview);

        } catch (e)
        {
            res.status(400).json({
                error: e.message
            })
        }


    }


    async getGroupsSubmissionsSubmitted(req, res) {
        try {

            const result = await dashboardService.getGroupsSubmissionsSubmitted();

            res.status(200).json(result);

        } catch (e) {
            res.status(400).json({
                error: e.message
            })

        }

    }


    async getSubmissionStats(req, res) {

        try{
            const result = await dashboardService.getSubmissionStats();

            res.status(200).json(result);

        } catch (e) {
            res.status(400).json({
                error: e.message
            })
            
        }
    }


    async getGroupsOverview(req, res) {

        try{

            const result = await dashboardService.getGroupsOverview();

            res.status(200).json(result);


        } catch(e) {

            res.status(400).json({
                error: e.message
            })
        }

    }


    async getTeachersStats(req, res) {

    try {
        const data = await dashboardService.getTeachersStats();

        return res.status(200).json(data);
        
    } catch (e) {
        return res.status(400).json({ 
            error: e.message 
        });
    }

}


}

module.exports = new DashboardController();