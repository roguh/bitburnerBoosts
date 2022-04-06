const visited = new Set()

function help(ns) {
	ns.tprint("USAGE: $0 DEPTH [FILES]...")
}

/** @param {NS} ns */
async function scp(ns, host, files) {
	await ns.scp(files, host)
	ns.tprint("copying files to host ", host)
}

/** @param {NS} ns */
async function scan(ns, host, files, depth) {
	const hosts = await ns.scan(host)
	visited.add(host)

	if (depth <= 0) {
		return
	}

	for (const nextHost of hosts) {
		if (visited.has(nextHost)) {
			continue
		}
		await scp(ns, nextHost, files)
		await scan(ns, nextHost, files, depth - 1)
	}
}

/** @param {NS} ns */
export async function main(ns) {
	if (ns.args.length === 0) {
		help(ns)
		return
	}
	if (!Number.isSafeInteger(Number(ns.args[0]))) {
		help(ns)
		ns.tprint("depth must be an integer")
		return
	}
	const depth = Number(ns.args[0])
	const files = ns.args.length > 1 ? ns.args.slice(1) : ["deepScan.js", "grow.js", "weaken.js", "dumbHack.js", "weakenAndGrow.js"]
	visited.clear()

	await scan(ns, "home", files, depth)
}
