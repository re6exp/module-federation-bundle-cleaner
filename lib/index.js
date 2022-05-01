class ModuleFederationBundleCleaner {

    static defaultOptions = {
        listAssetsToClear: ['main.js', 'main.js.map', 'main.js.LICENSE.txt'],
        clearEntryPoints: ['main']
    };

    constructor(options = {}) {
        const listAssetsToClear = options.listAssetsToClear
            ? [...ModuleFederationBundleCleaner.defaultOptions.listAssetsToClear, ...options.listAssetsToClear]
            : [...ModuleFederationBundleCleaner.defaultOptions.listAssetsToClear];

        const clearEntryPoints = options.clearEntryPoints ? [...ModuleFederationBundleCleaner.defaultOptions.clearEntryPoints, ...options.clearEntryPoints]
            : [...ModuleFederationBundleCleaner.defaultOptions.clearEntryPoints];

        this.options = {listAssetsToClear, clearEntryPoints};
    }

    apply(compiler) {
        const pluginName = ModuleFederationBundleCleaner.name;
        const {webpack: {Compilation}} = compiler;
        const logger = compiler.getInfrastructureLogger(pluginName);
        const {listAssetsToClear, clearEntryPoints} = this.options;

        compiler.hooks.thisCompilation.tap(pluginName, (compilation) => {
            compilation.hooks.processAssets.tap(
                {
                    name: pluginName,
                    stage: Compilation.PROCESS_ASSETS_STAGE_SUMMARIZE,
                },
                (assets) => {
                    clearEntryPoints.forEach(entryPoint => {
                        compilation.entrypoints.get(entryPoint).chunks.forEach((chunk) => {
                            chunk.groupsIterable.forEach(group => {
                                group.getChildren().forEach(child => {
                                    child.chunks.forEach(childChunk => {
                                        listAssetsToClear.push(`${childChunk.id}.js`);
                                        listAssetsToClear.push(`${childChunk.id}.js.map`);
                                    });
                                })
                            })
                        });
                    });
                    listAssetsToClear.forEach(asset => {
                        delete compilation.assets[asset];
                    });

                    logger.log(`Assets cleaned up:\n${JSON.stringify(listAssetsToClear, null, 2)}`);
                }
            );
        });
    }
}

module.exports = {
    ModuleFederationBundleCleaner
};
