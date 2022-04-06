const visited = new Set()
let maxDepth = 0

function status(rootAccess, couldHack, worthWhileHack, broke) {
	if (worthWhileHack) {
		if (broke) {
			return "broke"
		}
		return "HACKd"
	} else if (rootAccess) {
		return "ROOT"
	} else if (couldHack) {
		return "NEXT"
	}
	return ""
}

/** @param {NS} ns */
function isHackingWorthwhile(ns, host) {
	return ns.getServerMaxMoney(host) > 0 && ns.getServerRequiredHackingLevel(host) <= ns.getPlayer().hacking
}

/** @param {NS} ns */
function findCCTFiles(ns, host) {
	return ns.ls(host, "cct").join(", ")
}

/** @param {NS} ns */
export async function deepScan(ns, host, depth) {
	const depthIndicator = (new Array(depth + 1)).fill("").join("-")
	const hostStatus = status(
		ns.hasRootAccess(host),
		ns.getHackingLevel() >= ns.getServerRequiredHackingLevel(host),
		isHackingWorthwhile(ns, host),
		ns.getServerMoneyAvailable(host) < 1000
	)
	ns.tprintf(
		"%s %-" + (25 + maxDepth - depth) + "s %4sGB %5s %4f %-4s %4s $%-18.2f   %5.1f %7.2f%% %5.2f%% %s",
		depthIndicator,
		host,
		ns.getServerMaxRam(host),
		hostStatus,
		ns.getServerRequiredHackingLevel(host),
		(n => n > 0 ? 'Δ' + n : '')(Math.max(ns.getServerRequiredHackingLevel(host) - ns.getPlayer().hacking, 0)),
		ns.getServerNumPortsRequired(host),
		ns.getServerMoneyAvailable(host),
		ns.getServerSecurityLevel(host),
		100 * ns.getServerSecurityLevel(host) / ns.getServerMinSecurityLevel(host),
		ns.getServerUsedRam(host) / ns.getServerMaxRam(host) * 100,
		findCCTFiles(ns, host)
	)

	visited.add(host)

	if (depth >= maxDepth) {
		return
	}

	const hosts = await ns.scan(host)
	for (const host of hosts) {
		if (!visited.has(host)) {
			await deepScan(ns, host, depth + 1)
		}
	}
}

/** @param {NS} ns */
export async function main(ns) {
	if (!(ns.args.length == 2 || ns.args.length == 1)) {
		ns.tprint("USAGE: $0 DEPTH [START_HOST]")
		return
	}
	maxDepth = ns.args[0]
	const startHost = ns.args[1] || "home"

	visited.clear()
	await deepScan(ns, startHost, 0)
}

