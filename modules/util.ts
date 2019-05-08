import { Children } from "react";
export const isEmptyChildren = <C> (children: C) => Children.count(children) === 0;
