<?php
    header("Content-Type:text/plain;charset=utf-8"); 
    $pg=array_merge($_POST, $_GET);
    $fileurl=$pg["PATH"];
    $filename=explode(".", $fileurl);
    if(strtoupper($filename[sizeof($filename)-1])=="PHP"){
        echo "Illegal Request!!";
    }else{
        $handle = fopen('../'.$fileurl, 'r');
        fseek($handle, 0);//将指针定位到1024字节处
        fpassthru($handle);
    }
?>