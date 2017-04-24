<?php
/**
 * Created by PhpStorm.
 * User: olivier
 * Date: 23/04/17
 * Time: 19:24
 */

require 'vendor/autoload.php';

$xml = simplexml_load_string(file_get_contents('news.xml'));

$json = json_encode($xml);
$array = json_decode($json,TRUE);

foreach($array['row'] as $i => $row) {
    echo "$i\n";
    to_md($i, $row['field']);
}

function to_md($i, $row) {
    $encoding=mb_detect_encoding($row[4]);
    $filename = preg_replace('/\s.+/', "", $row[6]) . "-{$i}.md";
    $converter = new \League\HTMLToMarkdown\HtmlConverter();
    $intro = str_replace(["\n", '"'], ["", "'"], $converter->convert($row[3]));
    $title = ($converter->convert($row[2]));
    $content = ($converter->convert($row[3]) . "\n" .   ($converter->convert($row[4])));
    $file = <<<EOT
---
layout: post
encoding: $encoding
title: "$title"
date: {$row[6]}
categories: "$row[1]"
excerpt: "$intro"
---
$content;
EOT;
    file_put_contents("_posts/$filename", $file);
}

