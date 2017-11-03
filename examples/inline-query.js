const TeleBot = require('../');
const bot = new TeleBot('474605425:AAFZbjuJ9wIs3WgAlU6c1vILcW7ss2GyOBw');

var DATA = require('../model/geo');

// On inline query
bot.on('inlineQuery', msg => {

    let query = msg.query;
    console.log(`inline query: ${ query }`);

    // Create a new answer list object
    const answers = bot.answerList(msg.id, {cacheTime: 60});



    getGeo(query).then(values => {
        let ret = "";
        let msg = "";
        //let mesas = "";
        //let electores = "";
        let title;
        let vl = values.length;
        if(vl >= 1) {
            title = new Registers(values[0].mesas, values[0].electores);
            ret = values[0].nombre;
            msg = ret;
        }
        if(vl >= 2) {
            title = new Registers(values[1].mesas, values[1].electores);
            ret = ret + ` > ${values[1].nombre}`
            msg = msg + "\n" + values[1].nombre;
        }
        if(vl >= 3) {
            title = new Registers(values[2].mesas, values[2].electores);
            ret = ret + ` > ${values[2].nombre}`
            msg = msg + "\n" + values[2].nombre;
        }
        if(vl >= 4) {
            console.log("level 4", values);
            title = new Registers(values[3].mesas, values[3].electores);
            ret = ret + "\n" + `${values[3].nombre}`
            msg = msg + "\n" +  query.substr(0,9) +" " + values[3].nombre;
        }

        console.log("getGeo ret", ret);

        answers.addArticle({
            id: 'query',
            title: "Geográfico",
            description: ret,
            message_text: msg
        });

        answers.addArticle({
            id: 'registry',
            title: "Registro",
            description: title.toString(),
            message_text: msg
        });

        return bot.answerQuery(answers);
    });




    // Photo
    /*answers.addPhoto({
        id: 'photo',
        caption: 'Telegram logo.',
        photo_url: 'https://telegram.org/img/t_logo.png',
        thumb_url: 'https://telegram.org/img/t_logo.png'
    });

    // Gif
    answers.addGif({
        id: 'gif',
        gif_url: 'https://telegram.org/img/tl_card_wecandoit.gif',
        thumb_url: 'https://telegram.org/img/tl_card_wecandoit.gif'
    }); */

    // Send answers
    //console.log('inline answers', answers);
    //return bot.answerQuery(answers);

});

function Registers (mesas, electores) {
    this.mesas = mesas;
    this.electores = electores;
    this.toString = function() { 
        let fMesa = Number(this.mesas).toLocaleString("es-VE");
        let fElec = Number(this.electores).toLocaleString("es-VE");

        return `Mesas: ${fMesa} Elect: ${fElec}`;
    }
}

let getGeo = (tomo) => {
    let queries = [];
    let tomoLen = tomo.length;
    if(tomoLen >= 2) {
        queries.push(GEO.getState(tomo));
    }
    if(tomoLen >= 4) {
        queries.push(GEO.getMunicipality(tomo));
    }
    if(tomoLen >= 6) {
        queries.push(GEO.getParish(tomo));
    }
    if(tomoLen >= 9) {
        queries.push(GEO.getPollingPlace(tomo));
    }

    return Promise.all(queries);
};



bot.start();
