
const prisma = require('../../prisma/client');
const ExcelJS = require('exceljs');


class ReportService {


    async generatedGroupsReport () {

        const groups = await prisma.group.findMany({
            include: {
                teacher: { select: { fullName: true } },
                students: {
                    select: {
                        id: true,
                        fullName: true,
                        email: true,
                        submissions: {
                            include: { statusSubmission: true }
                        }
                    }
                },
                posts: { select: { id: true } }
            }
        });


        const workbook = new ExcelJS.Workbook();


        for (const group of groups) {

            const sheet = workbook.addWorksheet(group.name);

            sheet.mergeCells('A1:E1');
            sheet.getCell('A1').value = `Группа: ${group.name}`;
            sheet.getCell('A1').font = { bold: true, size: 14 };

            sheet.getCell('A2').value = `Преподаватель: ${group.teacher?.fullName ?? 'Не назначен'}`;
            sheet.getCell('A3').value = `Студентов: ${group.students.length}`;

            sheet.addRow([]);
            const headerRow = sheet.addRow(['№', 'ФИО', 'Email', '% сдачи', 'Средний балл']);
            headerRow.font = { bold: true };
            headerRow.eachCell(cell => {
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FFD3D3D3' }
                };
                cell.border = {
                    bottom: { style: 'thin' }
                };
            });

            group.students.forEach((student, index) => {
                const total = student.submissions.length;
                const submitted = student.submissions.filter(s =>
                    s.statusSubmission.title === 'submitted' ||
                    s.statusSubmission.title === 'graded'
                ).length;
                const graded = student.submissions.filter(s => s.grade !== null);
                const avgGrade = graded.length > 0
                    ? Math.round(graded.reduce((sum, s) => sum + s.grade, 0) / graded.length)
                    : null;

                const percent = total === 0 ? 0 : Math.round((submitted / total) * 100);

                const row = sheet.addRow([
                    index + 1,
                    student.fullName,
                    student.email,
                    `${percent}%`,
                    avgGrade ?? '—'
                ]);

                const percentCell = row.getCell(4);
                percentCell.font = {
                    color: {
                        argb: percent >= 75 ? 'FF008000' : percent >= 50 ? 'FFFF8C00' : 'FFFF0000'
                    }
                };
            });

            sheet.columns = [
                { width: 5 },
                { width: 30 },
                { width: 25 },
                { width: 12 },
                { width: 15 },
            ];

        }


        return workbook;
    }




}


module.exports = new ReportService();