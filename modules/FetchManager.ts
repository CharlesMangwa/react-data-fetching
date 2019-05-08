type Reference = number;

interface ISubscriptionProps {
  url: string;
  inProgress: boolean;
  run: () => void;
  cancel: () => void;
}

type Subscription = { ref: Reference } & ISubscriptionProps;

type Subscriptions = Subscription[];

class FetchManager {
  private refCounter: Reference = 0;
  private subscriptions: Subscriptions = [];

  public subscribe(subscriptionProps: ISubscriptionProps): Reference {
    const subscription: Subscription = {
      ref: this.refCounter,
      ...subscriptionProps,
    };
    this.refCounter += 1;
    this.subscriptions = [...this.subscriptions, subscription];
    return subscription.ref;
  }

  public update(
    ref: Reference,
    newSubscriptionProps: ISubscriptionProps,
  ): boolean {
    const index = this.subscriptions.findIndex(
      (subscription) => subscription ? subscription.ref === ref : false,
    );
    if (index > -1) {
      this.subscriptions = [
        ...this.subscriptions.slice(0, index),
        { ref, ...newSubscriptionProps },
        ...this.subscriptions.slice(index + 1),
      ];
      return true;
    }
    return false;
  }

  public unsubscribe(ref: Reference): boolean {
    const index = this.subscriptions.findIndex(
      (subscription) => subscription ? subscription.ref === ref : false,
    );
    if (index > -1) {
      this.subscriptions = [
        ...this.subscriptions.slice(0, index),
        ...this.subscriptions.slice(index + 1),
      ];
      return true;
    }
    return false;
  }

  public get = (ref: Reference): Subscription | null => {
    const index = this.subscriptions.findIndex(
      (subscription) => subscription ? subscription.ref === ref : false,
    );
    if (index > -1) {
      return this.subscriptions[index];
    }
    return null;
  }

  public getAll(): Subscriptions {
    return this.subscriptions;
  }
}

export default new FetchManager();
