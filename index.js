import express from 'express'
import { initApp } from './src/initApp.js'
import chalk from "chalk"
const app = express()
const port = process.env.PORT || 3001;
// app.set("case sensitive routing", true);

initApp(app, express)

app.listen(port, () => console.log(chalk.cyan(`Example app listening on port ${port}`)));