declare type Reference = number;
interface ISubscriptionProps {
    url: string;
    inProgress: boolean;
    run: () => void;
    cancel: () => void;
}
declare type Subscription = {
    ref: Reference;
} & ISubscriptionProps;
declare type Subscriptions = Subscription[];
declare class FetchManager {
    private refCounter;
    private subscriptions;
    subscribe(subscriptionProps: ISubscriptionProps): Reference;
    update(ref: Reference, newSubscriptionProps: ISubscriptionProps): boolean;
    unsubscribe(ref: Reference): boolean;
    get: (ref: number) => Subscription | null;
    getAll(): Subscriptions;
}
declare const _default: FetchManager;
export default _default;
//# sourceMappingURL=FetchManager.d.ts.map