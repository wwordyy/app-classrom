
const prisma = require('./client');
const bcrypt = require('bcryptjs');

function randGrade(min = 2, max = 5) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function main() {

    await prisma.role.createMany({
        data: [
            { title: 'admin' },
            { title: 'teacher' },
            { title: 'student' },
            { title: 'observer' },
        ],
        skipDuplicates: true,
    });

    await prisma.statusSubmission.createMany({
        data: [
            { title: 'not submitted' },
            { title: 'submitted' },
            { title: 'graded' },
        ],
        skipDuplicates: true,
    });

    await prisma.typePost.createMany({
        data: [
            { title: 'Задание' },
            { title: 'Методический материал' },
            { title: 'Итоговая практика' },
            { title: 'Дневник практики' },
        ],
        skipDuplicates: true,
    });

    await prisma.documentType.createMany({
        data: [
            { title: 'Титульный лист',   orderIndex: 1 },
            { title: 'Дневник практики', orderIndex: 2 },
            { title: 'Отчёт',            orderIndex: 3 },
        ],
        skipDuplicates: true,
    });

    const roles = await prisma.role.findMany();
    const R = Object.fromEntries(roles.map(r => [r.title, r.id]));

    const statuses = await prisma.statusSubmission.findMany();
    const S = Object.fromEntries(statuses.map(s => [s.title, s.id]));

    const types = await prisma.typePost.findMany();
    const T = Object.fromEntries(types.map(t => [t.title, t.id]));

    const hash = await bcrypt.hash('123123', 10);

    const observer = await prisma.user.upsert({
        where: { email: 'observer@test.com' },
        update: {},
        create: {
            email: 'observer@test.com',
            passwordHash: hash,
            fullName: 'Наблюдатель Иван Петрович',
            roleId: R['observer'],
        },
    });

    const teacher1 = await prisma.user.upsert({
        where: { email: 'teacher1@test.com' },
        update: {},
        create: {
            email: 'teacher1@test.com',
            passwordHash: hash,
            fullName: 'Смирнова Анна Викторовна',
            roleId: R['teacher'],
        },
    });

    const teacher2 = await prisma.user.upsert({
        where: { email: 'teacher2@test.com' },
        update: {},
        create: {
            email: 'teacher2@test.com',
            passwordHash: hash,
            fullName: 'Козлов Дмитрий Андреевич',
            roleId: R['teacher'],
        },
    });

    const group1 = await prisma.group.upsert({
        where: { name: 'ИС-21' },
        update: {},
        create: {
            name: 'ИС-21',
            courseYear: 3,
            specialty: 'Информационные системы',
            teacherId: teacher1.id,
        },
    });

    const group2 = await prisma.group.upsert({
        where: { name: 'ПР-22' },
        update: {},
        create: {
            name: 'ПР-22',
            courseYear: 2,
            specialty: 'Программирование',
            teacherId: teacher2.id,
        },
    });

    const studentsG1Data = [
        { email: 's1g1@test.com', fullName: 'Алексеев Михаил Сергеевич' },
        { email: 's2g1@test.com', fullName: 'Борисова Екатерина Ивановна' },
        { email: 's3g1@test.com', fullName: 'Васильев Андрей Николаевич' },
        { email: 's4g1@test.com', fullName: 'Григорьева Ольга Петровна' },
        { email: 's5g1@test.com', fullName: 'Денисов Артём Владимирович' },
    ];

    const studentsG1 = [];
    for (const s of studentsG1Data) {
        const user = await prisma.user.upsert({
            where: { email: s.email },
            update: {},
            create: {
                email: s.email,
                passwordHash: hash,
                fullName: s.fullName,
                roleId: R['student'],
                groupId: group1.id,
            },
        });
        studentsG1.push(user);
    }

    const studentsG2Data = [
        { email: 's1g2@test.com', fullName: 'Егорова Наталья Александровна' },
        { email: 's2g2@test.com', fullName: 'Жуков Павел Дмитриевич' },
        { email: 's3g2@test.com', fullName: 'Захарова Мария Олеговна' },
        { email: 's4g2@test.com', fullName: 'Иванов Кирилл Романович' },
    ];

    const studentsG2 = [];
    for (const s of studentsG2Data) {
        const user = await prisma.user.upsert({
            where: { email: s.email },
            update: {},
            create: {
                email: s.email,
                passwordHash: hash,
                fullName: s.fullName,
                roleId: R['student'],
                groupId: group2.id,
            },
        });
        studentsG2.push(user);
    }

    await prisma.post.create({
        data: {
            title: 'Введение в практику',
            content: 'Ознакомьтесь с местом прохождения практики и напишите отчёт.',
            dueDate: new Date('2024-10-01'),
            maxScore: 5,
            groupId: group1.id,
            typePostId: T['Задание'],
        },
    }).catch(() => {});

    await prisma.post.create({
        data: {
            title: 'Анализ предметной области',
            content: 'Проведите анализ предметной области вашего проекта.',
            dueDate: new Date('2024-10-15'),
            maxScore: 5,
            groupId: group1.id,
            typePostId: T['Задание'],
        },
    }).catch(() => {});

    await prisma.post.create({
        data: {
            title: 'Методические указания',
            content: 'Изучите методические указания по прохождению практики.',
            groupId: group1.id,
            typePostId: T['Методический материал'],
        },
    }).catch(() => {});

    await prisma.post.create({
        data: {
            title: 'Дневник практики',
            content: 'Заполняйте дневник практики каждую неделю.',
            groupId: group1.id,
            typePostId: T['Дневник практики'],
            weeks: [
                { week: 1, goal: 'Знакомство с организацией, изучение структуры' },
                { week: 2, goal: 'Участие в рабочих процессах, сбор материала' },
                { week: 3, goal: 'Самостоятельная работа под руководством наставника' },
                { week: 4, goal: 'Подготовка отчётных материалов' },
            ],
        },
    }).catch(() => {});

    await prisma.post.create({
        data: {
            title: 'Отчёт по первой неделе',
            content: 'Опишите чем вы занимались на первой неделе практики.',
            dueDate: new Date('2024-10-07'),
            maxScore: 5,
            groupId: group2.id,
            typePostId: T['Задание'],
        },
    }).catch(() => {});

    await prisma.post.create({
        data: {
            title: 'Техническое задание',
            content: 'Составьте техническое задание для вашего проекта.',
            dueDate: new Date('2024-10-20'),
            maxScore: 5,
            groupId: group2.id,
            typePostId: T['Задание'],
        },
    }).catch(() => {});

    const postsG1 = await prisma.post.findMany({ where: { groupId: group1.id }, orderBy: { id: 'asc' } });
    const postsG2 = await prisma.post.findMany({ where: { groupId: group2.id }, orderBy: { id: 'asc' } });

    const taskPostsG1 = postsG1.filter(p => p.typePostId === T['Задание']);
    const taskPostsG2 = postsG2.filter(p => p.typePostId === T['Задание']);


    for (const post of taskPostsG1) {
        await prisma.submission.create({ data: {
            postId: post.id, userId: studentsG1[0].id,
            fileUrl: '/uploads/posts/sample.pdf',
            submittedAt: new Date('2024-09-28'),
            statusSubmissionId: S['Проверено'],
            grade: randGrade(4, 5),
            feedBackTeacher: 'Отлично, хорошая работа!',
        }}).catch(() => {});
    }

    for (const post of taskPostsG1) {
        await prisma.submission.create({ data: {
            postId: post.id, userId: studentsG1[1].id,
            fileUrl: '/uploads/posts/sample.pdf',
            submittedAt: new Date('2024-09-30'),
            statusSubmissionId: S['На проверке'],
        }}).catch(() => {});
    }

    if (taskPostsG1[0]) {
        await prisma.submission.create({ data: {
            postId: taskPostsG1[0].id, userId: studentsG1[2].id,
            fileUrl: '/uploads/posts/sample.pdf',
            submittedAt: new Date('2024-10-01'),
            statusSubmissionId: S['Проверено'],
            grade: 3,
            feedBackTeacher: 'Нужно доработать некоторые разделы.',
        }}).catch(() => {});
    }
    for (const post of taskPostsG1.slice(1)) {
        await prisma.submission.create({ data: {
            postId: post.id, userId: studentsG1[2].id,
            statusSubmissionId: S['Не отправлено'],
        }}).catch(() => {});
    }

    for (const post of taskPostsG1) {
        await prisma.submission.create({ data: {
            postId: post.id, userId: studentsG1[3].id,
            statusSubmissionId: S['Не отправлено'],
        }}).catch(() => {});
    }

    for (const post of taskPostsG1) {
        await prisma.submission.create({ data: {
            postId: post.id, userId: studentsG1[4].id,
            fileUrl: '/uploads/posts/sample.pdf',
            submittedAt: new Date('2024-10-05'),
            statusSubmissionId: S['Проверено'],
            grade: randGrade(2, 3),
            feedBackTeacher: 'Требует значительной доработки.',
        }}).catch(() => {});
    }


    for (const post of taskPostsG2) {
        await prisma.submission.create({ data: {
            postId: post.id, userId: studentsG2[0].id,
            fileUrl: '/uploads/posts/sample.pdf',
            submittedAt: new Date('2024-10-05'),
            statusSubmissionId: S['Проверено'],
            grade: randGrade(4, 5),
            feedBackTeacher: 'Хорошая работа!',
        }}).catch(() => {});
    }

    for (const post of taskPostsG2) {
        await prisma.submission.create({ data: {
            postId: post.id, userId: studentsG2[1].id,
            fileUrl: '/uploads/posts/sample.pdf',
            submittedAt: new Date('2024-10-06'),
            statusSubmissionId: S['На проверке'],
        }}).catch(() => {});
    }

    // Студент 3 г2 — не сдал
    for (const post of taskPostsG2) {
        await prisma.submission.create({ data: {
            postId: post.id, userId: studentsG2[2].id,
            statusSubmissionId: S['Не отправлено'],
        }}).catch(() => {});
    }

    if (taskPostsG2[0]) {
        await prisma.submission.create({ data: {
            postId: taskPostsG2[0].id, userId: studentsG2[3].id,
            fileUrl: '/uploads/posts/sample.pdf',
            submittedAt: new Date('2024-10-07'),
            statusSubmissionId: S['Проверено'],
            grade: 3,
        }}).catch(() => {});
    }
    if (taskPostsG2[1]) {
        await prisma.submission.create({ data: {
            postId: taskPostsG2[1].id, userId: studentsG2[3].id,
            statusSubmissionId: S['Не отправлено'],
        }}).catch(() => {});
    }


    const practiceData = [
        { student: studentsG1[0], grade: 5, comment: 'Отличная работа на протяжении всей практики' },
        { student: studentsG1[2], grade: 4, comment: 'Хорошо, но есть замечания по отчёту' },
        { student: studentsG1[4], grade: 3, comment: 'Удовлетворительно' },
    ];
    for (const { student, grade, comment } of practiceData) {
        await prisma.practiceResult.create({ data: {
            studentId: student.id,
            groupId: group1.id,
            teacherId: teacher1.id,
            grade,
            comment,
        }}).catch(() => {});
    }

    await prisma.practiceResult.create({ data: {
        studentId: studentsG2[0].id,
        groupId: group2.id,
        teacherId: teacher2.id,
        grade: 5,
        comment: 'Выдающийся результат',
    }}).catch(() => {});

    // ── Чаты ──────────────────────────────────────────────────────────
    const chat1 = await prisma.chat.create({
        data: {
            users: { create: [{ userId: teacher1.id }, { userId: observer.id }] },
        },
    });
    await prisma.chatMessage.createMany({ data: [
        { chatId: chat1.id, authorId: observer.id,  content: 'Добрый день! Как продвигается практика у группы ИС-21?' },
        { chatId: chat1.id, authorId: teacher1.id,  content: 'Добрый день! В целом хорошо, большинство студентов сдали задания вовремя.' },
        { chatId: chat1.id, authorId: observer.id,  content: 'Отлично, спасибо за информацию!' },
    ]});

    const chat2 = await prisma.chat.create({
        data: {
            users: { create: [{ userId: teacher1.id }, { userId: studentsG1[0].id }] },
        },
    });
    await prisma.chatMessage.createMany({ data: [
        { chatId: chat2.id, authorId: studentsG1[0].id, content: 'Здравствуйте! Можно уточнить требования к отчёту?' },
        { chatId: chat2.id, authorId: teacher1.id,      content: 'Здравствуйте! Конечно, объём — не менее 20 страниц.' },
    ]});

    console.log('✅ Seed выполнен успешно');
    console.log('');
    console.log('Логины (пароль у всех: 123123)');
    console.log('  Наблюдатель:      observer@test.com');
    console.log('  Преподаватель 1:  teacher1@test.com  (группа ИС-21)');
    console.log('  Преподаватель 2:  teacher2@test.com  (группа ПР-22)');
    console.log('  Студенты г.1:     s1g1@test.com ... s5g1@test.com');
    console.log('  Студенты г.2:     s1g2@test.com ... s4g2@test.com');
}

main()
    .catch(e => { console.error(e); process.exit(1); })
    .finally(() => prisma.$disconnect());