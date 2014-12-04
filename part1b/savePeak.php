<?php

if(!empty($_POST['data'])){
	$data = $_POST['data'];
	$refNo = $_POST['refNo'];
	$graphNo = $_POST['graphNo'];
	$fname = $refNo . ".txt";//generates random name

	$file = fopen("part1-".$graphNo ."/" .$fname, 'w');//creates new file
	fwrite($file, $data);
	fclose($file);
}

?>