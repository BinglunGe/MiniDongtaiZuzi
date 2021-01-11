<?php
include "../sql.php";
/*添加设置，网址是*/
/*PHP/SETTING/addSetting.php?
		用户名	=葛炳仑&
		密码	=md5(用户名+密码)&
		设置名	=仿宋&
		内容	={json}
*/
if (isLogin($_GET)) {
	/*INSERT INTO tablename(field1,field2, field3, ...) VALUES(value1, value2, value3, ...) ON DUPLICATE KEY UPDATE field1=value1,field2=value2, field3=value3, ...; */
	$username=mysql_real_escape_string($_GET["用户名"]);
	$settingname=mysql_real_escape_string($_GET["设置名"]);
	$json=mysql_real_escape_string($_GET["内容"]);
	$sql="INSERT INTO usersetting(username, settingname, json)
		VALUES('{$username}', '{$settingname}', '{$json}')
		ON DUPLICATE KEY UPDATE
		username='{$username}', settingname='{$settingname}', json='{$json}'";
	if ($conn->query($sql) === TRUE) {
		echo "成功";
	} else {
		echo "失败<br>";
		echo "Error: " . $sql . "<br>" . $conn->error;
	}
} else {
	echo "密码错误！";
}

?>