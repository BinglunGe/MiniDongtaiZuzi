<?php
include "../sql.php";
/*获取用户，网址是*/
/*/PHP/USER/getUser.php?
		用户名=葛炳仑&
        密码=md5(用户名+密码)*/
if (isLogin($_GET)) {
    echo "有";
} else {
    echo "无";
}
/*$sql = "SELECT username, password, email FROM user WHERE username = '".mysql_real_escape_string($_GET["用户名"])."' AND password = '".mysql_real_escape_string($_GET["密码"])."'";
$result = $conn->query($sql);
/*echo $sql;
echo "<br><hr/>";
if ($result->num_rows > 0) {
    echo "有";
} else {
    echo "无";
}*/
?>
