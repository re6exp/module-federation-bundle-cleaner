class ModuleFederationBundleCleaner {
    static defaultOptions = {
        listAssetsToClear: ['main.js', 'main.js.map', 'main.js.LICENSE.txt'],
        clearEntryPoints: ['main'],
        remoteEntryName: 'remoteEntry',
    };

    constructor(options = {}) {
        const listAssetsToClear = new Set(
            options.listAssetsToClear
                ? [
                    ...ModuleFederationBundleCleaner.defaultOptions.listAssetsToClear,
                    ...options.listAssetsToClear,
                ]
                : [...ModuleFederationBundleCleaner.defaultOptions.listAssetsToClear]
        );

        const clearEntryPoints = new Set(
            options.clearEntryPoints
                ? [
                    ...ModuleFederationBundleCleaner.defaultOptions.clearEntryPoints,
                    ...options.clearEntryPoints,
                ]
                : [...ModuleFederationBundleCleaner.defaultOptions.clearEntryPoints]
        );

        const remoteEntryName = new Set(
            options.remoteEntryName
                ? options.remoteEntryName
                : ModuleFederationBundleCleaner.defaultOptions.remoteEntryName
        );

        this.options = {
            listAssetsToClear: Array.from(listAssetsToClear),
            clearEntryPoints: Array.from(clearEntryPoints),
            remoteEntryName: Array.from(remoteEntryName),
        };
    }

    apply(compiler) {
        const pluginName = ModuleFederationBundleCleaner.name;
        const {
            webpack: { Compilation },
        } = compiler;
        const logger = compiler.getInfrastructureLogger(pluginName);
        const { listAssetsToClear, clearEntryPoints, remoteEntryName } = this.options;

        compiler.hooks.thisCompilation.tap(pluginName, (compilation) => {
            compilation.hooks.processAssets.tap(
                {
                    name: pluginName,
                    stage: Compilation.PROCESS_ASSETS_STAGE_SUMMARIZE,
                },
                (assets) => {
                    clearEntryPoints.forEach((entryPoint) => {
                        compilation.entrypoints.get(entryPoint).chunks.forEach((chunk) => {
                            chunk.groupsIterable.forEach((group) => {
                                group.getChildren().forEach((child) => {
                                    child.chunks.forEach((childChunk) => {
                                        if (
                                            clearEntryPoints.find(
                                                (entryPointName) => entryPointName == childChunk.runtime
                                            )
                                        ) {
                                            /*
                                            If childChunk.runtime is not an array of chunks but contains only the chunk to be removed,
                                            remove it
                                            */
                                            listAssetsToClear.push(`${childChunk.id}.js`);
                                            listAssetsToClear.push(`${childChunk.id}.js.map`);
                                        }
                                    });
                                });
                            });
                        });
                    });

                    listAssetsToClear.forEach((asset) => {
                        delete compilation.assets[asset];
                    });

                    logger.log(`Assets cleaned up:\n${JSON.stringify(listAssetsToClear, null, 2)}`);
                }
            );
        });
    }
}

module.exports = {
    ModuleFederationBundleCleaner,
};
