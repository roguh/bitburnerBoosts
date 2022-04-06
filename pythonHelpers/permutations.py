#!/usr/bin/env python3

import argparse
import itertools
import logging
import math
import sys
import random
from typing import List

logger = logging.getLogger(__name__)

handler = logging.StreamHandler(sys.stderr)
handler.setLevel(logging.DEBUG)
formatter = logging.Formatter("%(asctime)s [%(levelname)s] %(message)s")
handler.setFormatter(formatter)
logger.addHandler(handler)
logger.setLevel(logging.DEBUG)


def random_permutations(iterable, permutation_count: int, max_tries: int = 5):
    elements = list(iterable)

    permutations = []
    for _ in range(permutation_count):
        tries = 0
        while tries < max_tries:
            tries += 1
            random.shuffle(elements)
            permutation = tuple(elements)
            if permutation in permutations:
                logger.warning("found duplicate shuffle %s", permutation)
            else:
                permutations.append(permutation)
                break

    return permutations


def get_command(
    hosts: List[str],
    script_name: str,
    ram_limit: float,
    script_ram_usage: float,
) -> str:
    execution_count = math.floor(ram_limit / script_ram_usage)

    if len(hosts) < 5:
        perms = list(itertools.permutations(hosts))
    else:
        perms = random_permutations(hosts, execution_count)

    random.shuffle(perms)

    logger.info(
        "Will execute at most %s commands to plook %s servers. RAM: %f, script usage: %f",
        execution_count,
        len(hosts),
        ram_limit,
        script_ram_usage,
    )

    commands: List[str] = []
    for c in perms[:execution_count]:
        commands.append("run " + script_name + " " + " ".join(c))

    return " ; ".join(commands)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--script-name", type=str, required=True)
    parser.add_argument("--ram-limit", type=float, default=32)
    parser.add_argument("--script-ram-usage", type=float, default=2)
    parser.add_argument("hosts", nargs="+")
    parser.add_argument(
        "--quiet",
        "-d",
        help="Disable logging except for errors and warnings.",
        action="store_true",
    )

    args = parser.parse_args()

    if args.quiet:
        logger.setLevel(logging.WARNING)

    command = get_command(
        hosts=args.hosts,
        script_name=args.script_name,
        ram_limit=args.ram_limit,
        script_ram_usage=args.script_ram_usage,
    )
    print(command)


if __name__ == "__main__":
    main()
