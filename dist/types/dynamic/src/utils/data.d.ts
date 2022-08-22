export declare function createData<T>(value?: T, shouldUpdate?: string[], shouldExport?: ((node?: Node) => void)[]): data<T>;
export declare function addExport<T>(dataInstance: data<T>, func: exportFunc): shouldExportA;
export declare function removeExport<T>(dataInstance: data<T>, func: string | exportFunc): shouldExportA;
export declare function isComputedProperty<T>(data: data<T>): boolean;
export declare function pushCache(): void;
//# sourceMappingURL=data.d.ts.map