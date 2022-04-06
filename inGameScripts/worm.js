const visited = new Set()
const hackable = new Array()


/** @param {NS} ns */
function isHackingWorthwhile(ns, host) {
	return ns.getServerMaxMoney(host) > 0 && ns.getServerRequiredHackingLevel(host) <= ns.getPlayer().hacking
}

/** @param {NS} ns */
function sortByValue(ns, hosts) {
	hosts.sort((a, b) => ns.getServerMoneyAvailable(a) - ns.getServerMoneyAvailable(b))
}

/** @param {NS} ns */
function exploit(ns, target) {
	let exploitCount = 0

	// All ns port opening functions are listed explicitly
	// or else the script will fail due to circumventing
	// static RAM calculation
	if (ns.fileExists("BruteSSH.exe", "home")) {
		ns.brutessh(target);
		exploitCount++
	}
	if (ns.fileExists("FTPCrack.exe", "home")) {
		ns.ftpcrack(target);
		exploitCount++
	}
	if (ns.fileExists("relaySMTP.exe", "home")) {
		ns.relaysmtp(target);
		exploitCount++
	}
	if (ns.fileExists("HTTPWorm.exe", "home")) {
		ns.httpworm(target);
		exploitCount++
	}
	if (ns.fileExists("SQLInject.exe", "home")) {
		ns.sqlinject(target);
		exploitCount++
	}
	
	const ports = ns.getServerNumPortsRequired(target)
	if (ports > exploitCount) {
		ns.tprint("could not get ROOT ", target, ". must have at least ", ports, " exploits")
		return false
	}
	return true

}

/** @param {NS} ns */
async function hack(ns, host) {
	if (ns.hasRootAccess(host)) {
		ns.tprint("mine: ", host)
		if (isHackingWorthwhile(ns, host)) {
			hackable.push(host)
		}
		return true
	}

	if (!exploit(ns, host)) {
		return
	}

	await ns.sleep(10)
	ns.nuke(host)
	ns.tprint("hacking ", host, " max money: ", ns.getServerMaxMoney(host))
	if (isHackingWorthwhile(ns, host)) {
		hackable.push(host)
	}
	return ns.hasRootAccess(host)
}

/** @param {NS} ns */
async function hackAdjacent(ns, host, maxDepth) {
	if (maxDepth <= 0 || visited.has(host)) {
		return
	}

	const hosts = await ns.scan(host)
	visited.add(host)

	for (const host of hosts) {
		if (!visited.has(host) && await hack(ns, host)) {
			await hackAdjacent(ns, host, maxDepth - 1)
		}
	}
}

function help(ns) {
	ns.tprint("USAGE: $0 DEPTH")
}

/** @param {NS} ns */
export async function main(ns) {
	if (ns.args.length < 1) {
		help(ns)
		return
	}
	if (!Number.isSafeInteger(Number(ns.args[0]))) {
		help(ns)
		ns.tprint("depth must be an integer")
		return
	}
	const depth = Number(ns.args[0])

	visited.clear()
	while (hackable.length > 0) {
		hackable.pop()
	}

	//ns.brutessh
	await hackAdjacent(ns, "home", depth)

	sortByValue(ns, hackable)
	ns.tprint("found ", hackable.length," worthwhile targets")
	ns.tprint(hackable.join(" "))
}
