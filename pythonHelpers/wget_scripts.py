print(
    " ; ".join(
        [
            "wget https://raw.githubusercontent.com/roguh/bitburnerBoosts/main/inGameScripts/"
            + file
            + " "
            + file
            for file in [
                "deepScan.js",
                "dumbHack.js",
                "grow.js",
                "hacknetManager.js",
                "scpPropagate.js",
                "weakenAndGrow.js",
                "weaken.js",
                "worm.js",
                "estimateAugmentationCosts.js",
            ]
        ]
    )
)
