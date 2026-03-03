

const reportService = require('../../services/observer/reportService');


class ReportController {


    async downloadGroupsReport(req, res) {

    try {
        const workbook = await reportService.generatedGroupsReport();

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename="groups_report.xlsx"');

        const buffer = await workbook.xlsx.writeBuffer();
        res.send(buffer);

        } catch (e) {
            return res.status(400).json({ error: e.message });
        }
        
    }


}


module.exports = new ReportController();