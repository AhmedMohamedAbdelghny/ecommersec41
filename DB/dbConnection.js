import mongoose from "mongoose";
import chalk from "chalk";

export const dbConnection = async () => {
    await mongoose.connect(process.env.dbUrlOnline).then(() => {
        console.log(chalk.cyan(`db connected in ${process.env.dbUrlOnline}`));
    }).catch((err) => {
        console.log({ msg: chalk.red("fail connect to db"), err });
    })
}