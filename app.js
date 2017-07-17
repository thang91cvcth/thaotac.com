"use strict";

const http = require('http');
const url = require('url');
const config = require('config');
const request = require('request');
var fbbot = require('./fbbot.js').fbbot;
var bot = new fbbot();

http.createServer(
  (req, res) => {
    let urlObj = url.parse(req.url, true);

    if (urlObj.pathname === '/webhook/') {
      //GET
      if (req.method === 'GET') {
        //Verfy
        if (urlObj.query['hub.verify_token'] == config.validationToken) {
          res.end(urlObj.query['hub.challenge']);
        } else {
          res.statusCode = 403;
        }
      }
      //END-GET


      if (req.method === 'POST') {
        let body = [];

        req.on('data', (chunk) => {

          body.push(chunk);

        }).on('end', () => {

          body = Buffer.concat(body).toString();
          body = JSON.parse(body);

          // Xử lý req từ đây.
          if (body.object === 'page') {

            body.entry.forEach(pageEntry => {

              let pageId = pageEntry.id; //nếu bạn có nhiều page xài chung 1 app. Tự thêm xử lý bằng cách bắt pageId này nhé.
              let timeOfEvent = pageEntry.time;

              pageEntry.messaging.forEach(message => {

                /*
                * message chính là (chỉ chỉ xuống dưới 2 dòng), trong đây chúng ta sẽ phân loại và xử lý.
                *
                  messaging: [{
                    sender: { id: '1143639809025650' },
                    recipient: { id: 'PAGE_ID' },
                    timestamp: 1469039706825,

                    abc

                  }]
                * message == messaging
                */

                // Ở đây mình dùng 1 function nhé

                kipalog(message);

              });

            });
          }
        });

      }

    } else {
      res.statusCode = 404;
    }

    res.end();
  }
).listen('1335');
console.log('Ứng dụng đang chạy tại: http://localhost:1335');

function kipalog(message) {

  var senderId = message.sender.id;
  

  var defaultRes = {
    text: 'Chào mừng bạn đến với trang FanPage',
    quick_replies: [{
      "content_type": "text",
      "title": "Text",
      "payload": "QR_PICK_TEXT"
    }, {
      "content_type": "text",
      "title": "Generic",
      "payload": "QR_PICK_GENERIC"
    }, {
      "content_type": "text",
      "title": "Button",
      "payload": "QR_PICK_BTN"
    }, {
      "content_type": "text",
      "title": "ALTP",
      "payload": "QR_PICK_QUICKREPLY"
    }]
  }

  var defaultText = {
    text: "Đây là 1 đoạn tin nhắn"
  }
  var hi = {
    text: "hi, cười gì"
  }
  var defaultGeneric = {
    attachment: {
      type: "template",
      payload: {
        template_type: "generic",
        elements: [{
          title: "Kipalog",
          image_url: "http://railsgirls.com/images/kipalog.png",
          subtitle: "Hello mọi người",
          buttons: [{
            type: "web_url",
            url: "http://kipalog.com/",
            title: "Kipalog site"
          }, {
            type: "postback",
            title: "Bắt đầu lại",
            payload: "HELP"
          }]
        }]
      }
    }
  }
  var defaultBtn = {
    attachment: {
      type: "template",
      payload: {
        template_type: "button",
        text: "Đây chỉ là dòng chữ và button phía dưới",
        buttons: [{
          type: "web_url",
          url: "http://kipalog.com/",
          title: "Kipalog site"
        }, {
          type: "postback",
          title: "Bắt đầu lại",
          payload: "HELP"
        }]
      }
    }
  }
  
  
  //CHON DAP AN ..........CHON DAP AN ..........CHON DAP AN ..........CHON DAP AN ..........CHON DAP AN ..........CHON DAP AN ..........CHON DAP AN ..........CHON DAP AN ..........CHON DAP AN ..........CHON DAP AN ..........CHON DAP AN ..........CHON DAP AN ..........
  
  var ChonDapAn = {
	  text : 'Câu hỏi của chúng ta như sau: loài nào...\n A.. \nB.... \nC... \nD...',
       quick_replies: [
	   {
      content_type: "text",
      title: "A",
      payload: "QR_PICK_A"
    }, 
	
	{
      content_type: "text",
      title: "B",
      payload: "QR_PICK_B"
    },
	{
      content_type: "text",
      title: "C",
      payload: "QR_PICK_C"
    },
	{
      content_type: "text",
      title: "D",
      payload: "QR_PICK_D"
    }
	
	]}
  
  
  


  if (message.optin) {

    var ref = message.optin.ref;
    if (ref) {
      switch (ref) {
        case 'FB_MAIN_WEB_BTN':
          bot.sendmessage(senderId, defaultRes);
          break;
        default:
          bot.sendmessage(senderId, defaultRes);
      }
    }

  } else if (message.message) {
    var messageText = message.message.text;
    if (typeof messageText === 'string') messageText = messageText.trim().toLowerCase();
    if (message.message.hasOwnProperty('is_echo')) return;

    //Xử lý Quick Reply
    if (message.message.quick_reply) {
      if (message.message.quick_reply.hasOwnProperty('payload')) {
        var payload = message.message.quick_reply.payload;
        var reg = /QR_PICK_(.*)/i;

        var regex = null;
        if (regex = reg.exec(payload)) {
          switch (regex[1]) {
            case 'A':
              bot.sendmessage(senderId, {
                text: "Bạn đã chọn A"
              });
              setTimeout(() => {
                bot.sendmessage(senderId, ChonAcauso159)
              }, 700);
              break;
            case 'B':
              bot.sendmessage(senderId, {
                text: "Bạn đã chọn B"
              });
              setTimeout(() => {
                bot.sendmessage(senderId, ChonBcauso159)
              }, 700);
              break;
            case 'TEXT':
              bot.sendmessage(senderId, defaultText);
              break;
            case 'BTN':
              bot.sendmessage(senderId, defaultBtn);
              break;
            case 'GENERIC':
              bot.sendmessage(senderId, defaultGeneric);
              break;
            case 'ALTP':
              bot.sendmessage(senderId, ChonDapAn);
              break;
            default:
              setTimeout(() => {
                bot.sendmessage(senderId, ChonDapAn)
              }, 700);
          }
        }

      }
      return;
    }
    //Xử lý text   ___________Xử lý text   ___________Xử lý text   ___________Xử lý text   ___________Xử lý text   ___________Xử lý text   ___________Xử lý text   ___________Xử lý text   ___________Xử lý text   ___________
    switch (messageText) {
		case 'hi':
        bot.sendmessage(senderId, hi);
        break;
      case 'text':
        bot.sendmessage(senderId, defaultText);
        break;
      case 'generic':
        bot.sendmessage(senderId, defaultGeneric);
        break;
      case 'button':
        bot.sendmessage(senderId, defaultBtn);
        break;
      case 'ALTP':
        bot.sendmessage(senderId, ChonDapAn);
        break;
           default:
        bot.sendmessage(senderId, defaultRes);
    }

    return;

  } else if (message.delivery) {

    console.log('Đã Nhận');

  }
  // Xử lý payload
  else if (message.postback) {
    var messagePayload = message.postback.payload;

    switch (messagePayload) {
      case 'GET_STARTED_BUTTON':
        bot.sendmessage(senderId, defaultRes);
        break;
      case 'HELP':
        bot.sendmessage(senderId, defaultRes);
        break;
      default:
        bot.sendmessage(senderId, defaultRes);
    }


  } else if (message.read) {

    console.log('Đã xem');

  } else {
    console.log("Webhook received unknown messagingEvent: ", message);
  }

}
