#!/bin/bash -e
for i in $(seq 1 $#); do
  npm run ${!i} &
  PIDS[$i]=$!
done

echo $PIDS

trap "kill ${PIDS[*]}" SIGINT

wait
