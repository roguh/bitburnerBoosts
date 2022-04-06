#!/bin/bash
RAM=${RAM:-2048}
SPARERAM=${SPARERAM:-16}
HACKPROPORTION=${HACKPROPORTION:-75}

HACKRAM=$((RAM * HACKPROPORTION / 100 - SPARERAM))
WGRAM=$((RAM * (100 - HACKPROPORTION) / 100))

# HACKRAM=$RAM
# WGRAM=0
# 
# HACKRAM=$((RAM / 4))
# WGRAM=$((RAM / 2 + RAM / 4))
# 
# HACKRAM=0
# WGRAM=$RAM

STEP="$@"

# ./permutations.py --script-ram 1.7 --ram $RAM --script-name weakenAndGrow.js $STEP | clipboard
# exit 0

set -x
./permutations.py --script-ram 1.8 --ram $HACKRAM --script-name dumbHack.js $STEP | clipboard
echo PRESS ENTER FOR NEXT
read
./permutations.py --script-ram 1.9 --ram $WGRAM --script-name weakenAndGrow.js $STEP | clipboard
