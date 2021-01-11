<?php
include "../sql.php";
/*获取设置，网址是*/
/*PHP/SETTING/getSetting.php?
		用户名	=葛炳仑&
		设置名	=仿宋
*/

$username=mysql_real_escape_string($_GET["用户名"]);
$settingname=mysql_real_escape_string($_GET["设置名"]);
$sql="SELECT json FROM usersetting WHERE username='{$username}' AND settingname='{$settingname}'";

$res=$conn->query($sql);
if ($res) {
	echo $res->fetch_assoc()["json"];
} else {
	echo "失败<br>";
	echo "Error: " . $sql . "<br>" . $conn->error;
}

?>