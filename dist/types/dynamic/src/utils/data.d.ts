export declare function createData(value?: any, shouldUpdate?: string[], shouldExport?: ((node?: Node) => void)[]): data;
export declare function addExport(dataInstance: data, func: exportFunc): shouldExportA;
export declare function removeExport(dataInstance: data, func: string | exportFunc): shouldExportA;
export declare function isComputedProperty(data: data): boolean;
export declare function pushCache(): void;
//# sourceMappingURL=data.d.ts.map