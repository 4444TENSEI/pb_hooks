/// <reference path="../pb_data/types.d.ts" />

routerAdd(
  "GET",
  "/api/mail",
  (e) => {
    // console.log("test", $app.settings());

    if (!$app.settings().smtp.enabled) {
      return e.json(400, {
        code: 400,
        message: "未开启邮件功能",
      });
    }

    /** 从查询参数读取收件人邮箱列表 */
    const recipients = e.request?.url?.query().get("recipients");

    if (!recipients) {
      return e.json(400, {
        code: 400,
        message: "未填写邮箱列表",
      });
    }

    const mailConfig = new MailerMessage({
      from: {
        address: e.app.settings().meta.senderAddress,
        name: e.app.settings().meta.senderName,
      },
      to: [{ address: recipients }],
      subject: "YOUR_SUBJECT...",
      html: "YOUR_HTML_BODY...",
      // bcc, cc and custom headers are also supported...
    });

    e.app.newMailClient().send(mailConfig);

    return e.json(200, {
      code: 200,
      message: "发送邮件成功",
    });
  },
  // 需要在请求头携带users表token才允许访问
  $apis.requireAuth("users")
);
