import React, { Component } from "react";
import { IDataFetcher, IProps } from "./types";
declare class Fetch extends Component<Partial<IProps>> implements IDataFetcher {
    private data?;
    private didCallOnLoad;
    private isLoaded;
    private isUnmounted;
    componentDidMount(): void;
    componentDidUpdate(prevProps: Partial<IProps>): void;
    componentWillUnmount(): void;
    shouldComponentUpdate(nextProps: Partial<IProps>): boolean;
    render(): any;
    fetchData(): Promise<void>;
    private handleData;
    private printError;
    private renderLoader;
    private returnData;
    private validateProps;
}
declare const _default: React.FunctionComponent<Partial<IProps>>;
export default _default;
export { Fetch };
//# sourceMappingURL=Fetch.d.ts.map