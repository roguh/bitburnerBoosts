#!/bin/bash
RAM=${RAM:-2048}
SPARERAM=15

echo STEP 1
FIRSTTWO="n00dles foodnstuff"
set -x
./permutations.py --script-ram 1.8 --ram $((RAM - SPARERAM)) --script-name dumbHack.js $FIRSTTWO $FIRSTTWO $FIRSTTWO $FIRSTTWO | clipboard

exit 69
