<?php

if(!empty($_POST['data'])){
	$data = $_POST['data'];
	$refNo = $_POST['refNo'];
	$fname = $refNo . ".txt";//generates random name

	$file = fopen("upload/" .$fname, 'w');//creates new file
	fwrite($file, $data);
	fclose($file);
}

?>