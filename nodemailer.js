const nodemailer = require('nodemailer');
const schedule = require('node-schedule');

// Setup transporter
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'rishabhk1324@gmail.com',
    pass: process.env.GOOGLE_APP_PASSWORD // use app password if 2FA is enabled
  }
});

// Schedule email reminder
const scheduleEmailReminder = (task) => {
  const deadline = new Date(task.deadline);
  const reminderTime = new Date(deadline.getTime() - 60 * 60 * 1000); // 1 hour before

  schedule.scheduleJob(reminderTime, async () => {
    await transporter.sendMail({
      from: '"Task Reminder" <your_email@gmail.com>',
      to: task.email,
      subject: `Reminder: Task "${task.task}" is due soon`,
      text: `Hey there! Just a reminder that your task "${task.task}" is due by ${task.deadline}.`,
    });
  });
}

module.exports = scheduleEmailReminder;