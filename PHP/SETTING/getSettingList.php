[
<?php
include "../sql.php";
/*获取设置列表，网址是*/
/*PHP/SETTING/getSettingList.php
*/

$sql="SELECT username, settingname FROM usersetting";

$res=$conn->query($sql);
if ($res) {
    while($r = $res->fetch_assoc()) {
        echo ("[\"".$r["username"]."\", \"".$r["settingname"]."\"], \n");
    }
} else {
	echo "失败<br>";
	echo "Error: " . $sql . "<br>" . $conn->error;
}

?>
[]
]