import cron from 'node-cron'
import { sequelize } from './db.config.js'
import moment from 'moment'

const months = {
    0: 'January',
    1: 'February',
    2: 'March',
    3: 'April',
    4: 'May',
    5: 'June',
    6: 'July',
    7: 'August',
    8: 'September',
    9: 'October',
    10: 'November',
    11: 'December'
}

cron.schedule('* * * * *', async () => {
    // const currentDate = new Date();
    // const curr_date = moment().utcOffset("+05:30").format("YYYY-MM-DD HH:mm:ss");
    const month = moment().utcOffset("+05:30").month()
    // console.log("Current sys date", curr_date);
    const getTrainersSQL = "select * from users where account_type = 2";
    const [data] = await sequelize.query(getTrainersSQL);
    
    data.forEach(async (item) => {
        const fetchTrainerSQL = "select * from trainers where trainer_id = :trainer_id";
        const [[data]] = await sequelize.query(fetchTrainerSQL, {
            replacements: {
                trainer_id: item.id
            }
        });

        console.log(data);



        const createPaySlipSQL = "insert into salary (trainer_id, amount, salary_month, status) VALUES (:trainer_id, :amount, :salary_month, :status)";
        await sequelize.query(createPaySlipSQL, {
            replacements: {
                trainer_id: item.id,
                amount: data.base_salary,
                salary_month: months[month],
                status: 'pending'
            }
        })
        console.log("Row Inserted");
    })
}, {
    timezone: 'Asia/Kolkata'
})