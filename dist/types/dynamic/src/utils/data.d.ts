export declare function createData<T>(value?: T, shouldUpdate?: shouldUpdateA, shouldExport?: shouldExportA): data<T>;
export declare function addExport<T>(proxy: anyObject, dataInstance: data<T>, func: exportFunc, target?: Node): shouldExportA;
export declare function checkArrowFunction(func: Function): void;
export declare function removeExport<T>(dataInstance: data<T>, func: string | exportFunc): shouldExportA;
export declare function isComputedProperty<T>(data: data<T>): boolean;
export declare function detectShouldUpdate(string: string): shouldUpdateA;
//# sourceMappingURL=data.d.ts.map