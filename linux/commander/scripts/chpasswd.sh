#!/bin/sh

#@desc Just runs chpasswd with the passwords given.
#@desc `USERPASS` must be a newline-seperated list of USERNAME:PASSWORD records
#@desc The default script interface will only allow one of these records at a time.

# TODO: This should have better validation
#@param USERPASS .+

chpasswd <<EOF
$USERPASS
EOF