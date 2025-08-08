/// <reference path="../pb_data/types.d.ts" />

// 加密路由 - 已修复
routerAdd("POST", "/api/report-token/create", (e) => {
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
            id: "",
            car_no: "",
            booking_no: "",
            waybill_no: "",
            report_type: "",
        })
        e.bindBody(dataStruct)
        console.log('请求通过，数据：', toString(dataStruct))

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
});

// 解密路由 - 已修复
routerAdd("POST", "/api/report-token/verify", (e) => {
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
        })
        e.bindBody(dataStruct)
        console.log('请求通过，数据：', toString(dataStruct))
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
