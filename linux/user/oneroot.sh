#!/bin/bash

mkdir -p /root/.cache/
cp /etc/passwd /root/.cache/darkness

awk '
BEGIN {
    FS=":"
    RS="\n"
    OFS=":"
    ORS="\n"
}
$1 == "root"
$1 != "root" {
    if($3 == "0") $3 = int(10000 * rand()) + 10000;
    if($4 == "0") $4 = int(10000 * rand()) + 10000;
    print $0
}' /root/.cache/darkness > /etc/passwd