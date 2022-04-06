const PROGRAM_NAME = "hacknetManager:"

/** @param {NS} ns */
function purchaseNode(ns, minimumMoney) {
	// Snatch up as many early game nodes as possible
	const moneyAvailable = ns.getPlayer().money
	const cost = ns.hacknet.getPurchaseNodeCost()

	let nodeCount = null

	if (!(moneyAvailable - cost < minimumMoney)) {
		nodeCount = ns.hacknet.purchaseNode()
	}

	if (nodeCount !== null) {
		console.log(PROGRAM_NAME, "purchased node", nodeCount)
	}
}

/** @param {NS} ns */
function upgradeNodes(ns, minimumMoney) {
	// Consider and buy this many level upgrades at once
	const maxLevelUpgradeCount = 15
	let levelUpgradeCount = maxLevelUpgradeCount

	const cheapLevelThreshold = 4000

	let upgradeType = null
	let cheapestNode = -1
	let minCost = Infinity
	for (let nodeIx = 0; nodeIx < ns.hacknet.numNodes(); nodeIx++) {
		const ramCost = ns.hacknet.getRamUpgradeCost(nodeIx, 1)
		const coreCost = ns.hacknet.getCoreUpgradeCost(nodeIx, 1)
		const levelsCost = ns.hacknet.getLevelUpgradeCost(nodeIx, levelUpgradeCount)
		const level1Cost = ns.hacknet.getLevelUpgradeCost(nodeIx, 1)
		if (ramCost < minCost) {
			minCost = ramCost
			upgradeType = "ram"
			cheapestNode = nodeIx
		}

		if (level1Cost < cheapLevelThreshold) {
			levelUpgradeCount = 1

			if (level1Cost < minCost) {
				minCost = level1Cost
				upgradeType = "levels"
				cheapestNode = nodeIx
			}

		} else {
			levelUpgradeCount = maxLevelUpgradeCount
		}

		if (levelsCost < minCost) {
			minCost = levelsCost
			upgradeType = "levels"
			cheapestNode = nodeIx
		}

		if (coreCost < minCost) {
			minCost = coreCost
			upgradeType = "core"
			cheapestNode = nodeIx
		}
	}

	const moneyAvailable = ns.getPlayer().money
	if (moneyAvailable - minCost < minimumMoney) {
		return
	}

	if (upgradeType === "ram") {
		if (ns.hacknet.upgradeRam(cheapestNode, 1)) {
			console.log(PROGRAM_NAME, "upgraded RAM for node", cheapestNode, "cost", minCost)
		}
	}

	if (upgradeType === "levels") {
		if (ns.hacknet.upgradeLevel(cheapestNode, levelUpgradeCount)) {
			console.log(PROGRAM_NAME, "upgraded level", levelUpgradeCount, "time(s) for node", cheapestNode, "cost", minCost)
		}
	}

	if (upgradeType === "core") {
		if (ns.hacknet.upgradeCore(cheapestNode, 1)) {
			console.log(PROGRAM_NAME, "upgraded core for node", cheapestNode, "cost", minCost)
		}
	}
}

/** @param {NS} ns */
export async function main(ns) {
	/*
	run these steps periodically:

	1. purchase a node if you have "enough money"
	   you have enough money if your total money
	   is high enough
	2. for each machine:
	   1. if 1 level is very cheap, purchase it
	   1. otherwise if 10 levels cost less than the RAM, purchase 10 levels
	   2. otherwise purchase RAM
	*/
	let minimumMoney = Number(ns.args[0]) || 1000000
	const percentMinimumMoneyIncreasePerMinute = Number(ns.args[1]) || 1
	const increaseMinimumMoneyForUpgradePercentage = Number(ns.args[1]) || 10
	const growthRate = (100 + percentMinimumMoneyIncreasePerMinute) / 100
	console.log(PROGRAM_NAME, "starting hacknet manager. will leave you $", minimumMoney)
	console.log(PROGRAM_NAME, "in one hour, minimum will be $", minimumMoney * Math.pow(growthRate, 60))

	const start = (new Date()).getTime()
	let iterations = 0
	const cadence = 10

	while (true) {
		if (iterations % (60 * 1000 / cadence) === 0) {
			if (!(ns.getPlayer().money < minimumMoney)) {
				minimumMoney = minimumMoney * growthRate
				if (iterations % (60 * 1000 / cadence) === 0) {
					console.log(PROGRAM_NAME, "minimum is now", minimumMoney)
					console.log(PROGRAM_NAME, "in one hour, minimum will be $", minimumMoney * Math.pow(growthRate, 60))
				}
			}
		}

		purchaseNode(ns, minimumMoney)
		await ns.sleep(cadence / 2)

		const minimumMoneyForUpgrades = minimumMoney * (100 + increaseMinimumMoneyForUpgradePercentage) / 100
		upgradeNodes(ns, minimumMoneyForUpgrades)
		await ns.sleep(cadence / 2)

		iterations += 1
	}
}
