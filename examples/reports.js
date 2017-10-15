const TeleBot = require('../');
const bot = new TeleBot('474605425:AAFZbjuJ9wIs3WgAlU6c1vILcW7ss2GyOBw');

var DATA = require('../model/data');
var registeredGrps = [];
var aprovers = [];

bot.on('/report', msg => {
    let tomo = msg.text.replace("/report ", "").trim();
    console.log("msg", msg);

    if(tomo.length !== 12) {
        bot.sendMessage(msg.chat.id, "El formato del tomo debe ser EEMMPPCCC.MM")
        return;
    }

    DATA.findMV(tomo, (err, data) => {
        if(err) {
            bot.sendMessage(msg.chat.id, "Ups. Ocurrió un error inesperado");
        } else {
            if(data.length == 0) {
                bot.sendMessage(msg.chat.id, "El centro que reporta no existe");
            } else {
                let centro = data[0];
                let resMsg = msg.from.first_name + " reporta la máquina: " + tomo + " como irrecuperable\n" + 
                centro.DES_ESTADO + "\n" + centro.DES_MUNICIPIO + "\n" + centro.DES_PARROQUIA + "\n" +
                centro.CODIGO + " " + centro.NOMBRE + "\n" +
                "MESA " + tomo.substr(10,2);

                bot.sendMessage(msg.from.id, `La máquina ${tomo} fue reportada exitosamente`);

                //NOTIFY TO GROUPS
                registeredGrps.forEach((grpId) => {
                    bot.sendMessage(grpId, `${msg.from.first_name} reportó la máquina ${tomo} como irrecuperable`);                    
                });


                //NOTIFY TO APROVERS
                let replyMarkup = bot.inlineKeyboard([
                    [
                        bot.inlineButton('Aprobar', {callback: 'accepted|' + tomo}),
                        bot.inlineButton('Rechazar', {callback: 'rejected|' + tomo})
                    ]
                ]);
                aprovers.forEach((aprover_id) => {
                    bot.sendMessage(aprover_id, resMsg, {replyMarkup});
                })
            }
        }
    });
});

bot.on('/test', msg => {
    console.log("test_msg", msg);
    let markup = bot.inlineKeyboard([
        [
            bot.inlineButton('Aprobar', {callback: 'accepted'}),
            bot.inlineButton('Rechazar', {callback: 'rejected'})
        ]
    ]);

    return bot.sendMessage(msg.from.id, "resMsg", {markup}).then(re => {
        console.log('re', re);
        lastMessage = [msg.from.id, re.result.message_id];
    });
});

bot.on('callbackQuery', msg => {
    // User message alert
    bot.answerCallbackQuery(msg.id);
    console.log("callback_mess", msg);
    let chatId = msg.message.chat.id;
    let messageId = msg.message.message_id;
    let [resp, tomo] = msg.data.split("|");
    var response= "";

    if(resp == 'accepted') {
        const replyMarkup = bot.inlineKeyboard([
            [
                bot.inlineButton('Aprobada', {callback: 'pressed'})
            ]
        ]);

        bot.editMessageReplyMarkup({chatId, messageId}, {replyMarkup});
        DATA.addMV(tomo, current());
        response = msg.message.text + "\n\nEl procedimiento fue APROBADO por " + msg.from.first_name + " " + msg.from.last_name;
    } else if(resp == 'rejected') {
                const replyMarkup = bot.inlineKeyboard([
            [
                bot.inlineButton('NO Aprobada', {callback: 'pressed'})
            ]
        ]);

        bot.editMessageReplyMarkup({chatId, messageId}, {replyMarkup});
        response = `El procedimiento NO FUE APROBADO para la MV ${tomo}`;
    } else {
        return;
    }

    //NOTIFY TO GROUPS
    registeredGrps.forEach((grpId) => {
        bot.sendMessage(grpId, response);                    
    });

});

bot.on('/register', msg => {
    DATA.registerGroup(msg.chat.id);
    registeredGrps.push(msg.chat.id);
    bot.sendMessage(msg.chat.id, `El grupo ha sido registrado para notificación por ${msg.from.first_name}`);
})

bot.on('/aprobador', msg => {
    DATA.registerAprovers(msg.from.id);
    aprovers.push(msg.from.id);
    bot.sendMessage(msg.from.id, `Se ha registrado a ${msg.from.first_name} como aprobador`); 
})

bot.on('/lista', msg => {
    console.log("show lista");
    DATA.getMVs((err, data) => {
        if(err) {
            return bot.sendMessage(msg.from.id, `Ups ocurrio un error`); 
        } else {
            var t = "";
            data.forEach((tomo) => {
                t = t + tomo.code + "\t" + tomo.time + "\n";
            })
            return bot.sendMessage(msg.chat.id, t); 
        }
    })
})

bot.on('/p_cero', msg => {
    DATA.pCero();
    registeredGrps = [];
    aprovers = [];
    bot.sendMessage(msg.from.id, `Puesta cero finalizada`); 
})

//LOAD REGISTERED GROUPS
DATA.getGroups((err, data) => {
    data.forEach((val) => {
        registeredGrps.push(val.id);
    })
});

DATA.getAprovers((err, data) => {
    data.forEach((val) => {
        aprovers.push(val.id);
    })
})

var current = () => {
    var h = new Date();
    return `${h.getDate()}/${h.getMonth()}/${h.getFullYear()} ${h.getHours()}:${h.getMinutes()}`
}


bot.start();

