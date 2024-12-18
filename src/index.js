const { Telegraf } = require('telegraf')
const { message } = require('telegraf/filters')
const { Wish } = require('../db/models')
const cron = require('node-cron');
require('dotenv').config()

const bot = new Telegraf(process.env.BOT_TOKEN)
bot.start((ctx) => ctx.reply('Доброго времени суток! Здесь вы можете оставить своё пожелание и увидеть его через 1 год'))
bot.help((ctx) => ctx.reply('No help'))

const scheduleDate = new Date('2025-12-31T23:59:00');
const cronPatternDate = `${scheduleDate.getSeconds()} ${scheduleDate.getMinutes()} ${scheduleDate.getHours()} ${scheduleDate.getDate()} ${scheduleDate.getMonth() + 1} *`;

async function setupScheduledCircles() {
    try {
        const wishes = await Wish.findAll({
            where: {
                videoIsSent: false
            }
      });
        wishes.forEach(wish => {
            cron.schedule(cronPatternDate, async () => {
                try {
                    await bot.telegram.sendVideoNote(wish.chatId, wish.fileId);
                    wish.isSent = true;
                    await wish.save();
                    console.log(`Отправлено видео для пользователя ${wish.userId}`);
                } catch (error) {
                    console.error('Ошибка при отправке запланированного видео:', error);
                }
            }, {
                scheduled: true,
                timezone: "Europe/Moscow",
                once: true
            });
        });
    } catch (error) {
        console.error('Ошибка:', error);
    }
}


bot.on(message('video_note'), async (ctx) => {

    const currentDate = new Date();
    const deadlineDate = new Date('2025-01-15T00:00:00');
    
    if (currentDate > deadlineDate) {
        await ctx.reply('Извините, время приёма пожеланий уже закончилось!');
        return;
    }
    
    try {
        const userId = ctx.update.message.from.id
        const fileId = ctx.message.video_note.file_id
        const chatId = ctx.chat.id

        const findPreviousWish = await Wish.findOne({where: {
            userId: userId
        }})

        if(findPreviousWish && fileId) {
            findPreviousWish.fileId = fileId
            await findPreviousWish.save()
        }
        else if(!findPreviousWish) {
             const {dataValues} = await Wish.create({
                fileId: fileId, userId: userId, chatId: chatId, 
             })             
        }

        setTimeout(async () => {
            try {
                
                await bot.telegram.deleteMessage(ctx.chat.id , ctx.message.message_id);
                findPreviousWish ?  await ctx.reply(`${ctx.update.message.from.first_name}, ваше обновленное пожелание спрятано! Отправлю его 31 декабря 2025 года в 23:59!`) 
                 : await ctx.reply(`${ctx.update.message.from.first_name}, ваше пожелание спрятано и сохранено! Отправлю его 31 декабря 2025 года в 23:59!`) 

            } catch (error) {
                console.error(`Ошибка при удалении кружка спустя время`, error)
            }
        }, 1000); 
           
    } catch (error) {
        console.error('Ошибка при обработке видеосообщения:', error);
    }
})

bot.on(message('text'), async (ctx) => {
    try {
            await ctx.reply('Отправь мне кружочек с пожеланиями, а я отправлю тебе его через год!')
    } catch (error) {
        console.error('Ошибка при обработке текста:', error)
    }
})

bot.catch((err) => {
    console.error('Глобальная ошибка бота:', err)
})

console.log('Бот запускается...');

setupScheduledCircles();

bot.launch()
    .then(() => console.log('Бот успешно запущен'))
    .catch((err) => console.error('Ошибка при запуске бота:', err))

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))