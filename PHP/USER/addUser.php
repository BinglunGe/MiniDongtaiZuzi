<?php
include "../sql.php";
/*添加用户名，网址是*/
/*PHP/USER/addUser.php?
		用户名	=葛炳仑&
		密码	=md5(用户名+密码)&
		新密码	=md5(用户名+新密码)&
		手机	=008613154293565&
		邮箱	=2041461362@qq.com
		[更改=更改]*/
if($_GET["更改"]=="更改"){
    $sql = 
    "UPDATE user ".
    "SET tel='".mysql_real_escape_string($_GET["手机"])."', ".
    "email='".mysql_real_escape_string($_GET["邮箱"])."', ".
    "password='".mysql_real_escape_string($_GET["新密码"])."' ".
    "WHERE ".
    "username='".mysql_real_escape_string($_GET["用户名"])."'".
    "AND password='".mysql_real_escape_string($_GET["密码"])."';";
}else{
    $sql = 
"INSERT INTO user (username, password, email, tel) ".
"VALUES ('".mysql_real_escape_string($_GET["用户名"])."','".
mysql_real_escape_string($_GET["密码"])."','".
mysql_real_escape_string($_GET["手机"])."','".
mysql_real_escape_string($_GET["邮箱"])."')";
}
/*UPDATE user SET tel='a@b.cd',email='100000000000000',password='598ba7ee5d97db2d706a50cf8eabec34'WHERE username='guest'AND password='598ba7ee5d97db2d706a50cf8eabec34'; 
echo $sql;
echo "<br>";*/
if ($conn->query($sql) === TRUE) {
    echo "成功";
} else {
    echo "失败";
    echo "Error: " . $sql . "<br>" . $conn->error;
}
?>