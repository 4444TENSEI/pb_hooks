/// <reference path="../pb_data/types.d.ts" />

// 路由-AES加密
routerAdd(
  "POST",
  "/api/encrypt/reportWorkerQr",
  (e) => {
    const SECRET_KEY = "SECRET_PB_CRYPTO";
    // 从环境变量获取密钥，长度必须是32字节
    const cryptoSecret =
      $os.getenv(SECRET_KEY)?.trim() || "44444444444444444444444444444444";
    if (cryptoSecret.length !== 32) {
      throw new Error(`AES密钥必须是32字节，当前长度${cryptoSecret.length}`);
    }
    try {
      // 一般JSON请求体
      // const data = e.requestInfo().body;
      // 类型安全的请求体
      const dataStruct = new DynamicModel({
        car_no: "",
        waybill_id: "",
        waybill_no: "",
        booking_no: "",
        report_type: "",
      });
      e.bindBody(dataStruct);
      console.log("请求通过，数据：", toString(dataStruct));

      // 加密数据
      const ciphertext = $security.encrypt(toString(dataStruct), cryptoSecret);
      return e.json(200, {
        code: 200,
        message: "加密成功",
        data: { token: ciphertext },
      });
    } catch (err) {
      return e.json(500, {
        code: 500,
        message: `服务器错误: ${err.message}`,
      });
    }
  },
  // 需要在请求头携带users表token才允许访问
  $apis.requireAuth("users")
);

// 路由-AES解密
routerAdd("POST", "/api/decrypt/reportWorkerQr", (e) => {
  const SECRET_KEY = "SECRET_PB_CRYPTO";
  // 从环境变量获取密钥，长度必须是32字节
  const cryptoSecret =
    $os.getenv(SECRET_KEY)?.trim() || "44444444444444444444444444444444";
  if (cryptoSecret.length !== 32) {
    throw new Error(`AES密钥必须是32字节，当前长度${cryptoSecret.length}`);
  }
  try {
    // 一般JSON请求体
    // const data = e.requestInfo().body;
    // 类型安全的请求体
    const dataStruct = new DynamicModel({
      token: "",
    });
    e.bindBody(dataStruct);
    console.log("请求通过，数据：", toString(dataStruct));
    // 确保结果是字符串
    const payloadStr = $security.decrypt(dataStruct.token, cryptoSecret);
    // 解析为对象
    const payloadObj = JSON.parse(payloadStr);
    return e.json(200, {
      code: 200,
      message: "解密成功",
      data: payloadObj,
    });
  } catch (err) {
    return e.json(500, {
      code: 500,
      message: `服务器错误: ${err.message}`,
    });
  }
});
