<?php

header("content-type:text/html; charset=utf-8");
$servername = "localhost";
$username = "root";
$password = "usbw";
$dbname = "lgwdb";
$conn = new mysqli($servername, $username, $password, $dbname);

function isLogin($GET){
    $sql = "SELECT username, password, email FROM user WHERE username = '".mysql_real_escape_string($GET["用户名"])."' AND password = '".mysql_real_escape_string($GET["密码"])."'";
    global $conn;
    $result = $conn->query($sql);
    if ($result->num_rows > 0) {
        return 1;
    } else {
        return 0;
    }
}
?>