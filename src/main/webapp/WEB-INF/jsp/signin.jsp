<%@page contentType="text/html; UTF-8" pageEncoding="UTF-8" isELIgnored="false" %>
<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>
<body>
<form action="${pageContext.request.contextPath}/user/signin" method="post">

    邮箱：<input type="text" name="email"><br>

    密码：<input type="password" name="password"><br>

    交易密钥：<input type="password" name="pin"><br>

    <input type="submit" value="登录"><br>
    <a href="${pageContext.request.contextPath}/signup">注册</a><br>

</form>
</body>
</html>