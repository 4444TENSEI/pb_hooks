/// <reference path="../pb_data/types.d.ts" />

routerAdd(
  "GET",
  "/api/role-token",
  (e) => {
    // let name = e.request?.pathValue("name");

    // 环境变量-角色JWT密钥(❗需先在本机环境变量记录值)，这里用trim避免ubuntu下额外的换行符
    const JWT_SIGNING_KEY = $os.getenv("SECRET_PB_ROLE_JWT").trim();

    // 如果前端在请求头Authorization传递token，则此处会返回用户完整数据
    let userInfo = e.auth;
    // 初始化日期对象
    const date = new Date();
    // 当前服务器时间（时间戳格式）
    const curTimestamp = date.getTime();
    // 当前服务器时间（ISO8601格式）
    const curTime = date.toISOString();

    // 设置JWT有效期（单位：秒）
    const JWT_SEC_DURATION = 604800;
    // 计算出JWT过期时间（ISO8601格式）
    const jwtExpireTime = new Date(
      curTimestamp + JWT_SEC_DURATION * 1000
    ).toISOString();
    // jwt自定义载荷
    const JWT_PAYLOAD = {
      id: userInfo?.get("id"),
      role: userInfo?.get("role"),
    };
    // jwt密钥
    if (!JWT_SIGNING_KEY) {
      return e.json(500, {
        code: 500,
        message: "未配置JWT密钥",
      });
    }
    // 生成自定义JWT
    const roleJwt = $security.createJWT(
      JWT_PAYLOAD,
      JWT_SIGNING_KEY,
      JWT_SEC_DURATION
    );

    return e.json(200, {
      code: 200,
      message: "获取权限JWT成功",
      data: {
        //   userInfo,
        token: roleJwt,
        expireTime: jwtExpireTime,
      },
      curTime: curTime,
    });
  },
  // 需要在请求头携带users表token才允许访问
  $apis.requireAuth("users")
);
