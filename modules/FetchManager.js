/* @flow */
/* eslint react/no-this-in-sfc: 0 */

type Reference = number

type SubscriptionProps = {
  url: string,
  inProgress: boolean,
  run: Function,
  cancel: Function,
}

type Subscription = { ref: Reference } & SubscriptionProps

type Subscriptions = Array<?Subscription>

class FetchManager {
  refCounter: Reference = 0

  subscriptions: Subscriptions = []

  subscribe = (subscriptionProps: SubscriptionProps): Reference => {
    const subscription: Subscription = {
      ref: this.refCounter,
      ...subscriptionProps,
    }
    this.refCounter += 1
    this.subscriptions = [...this.subscriptions, subscription]
    return subscription.ref
  }

  update = (
    ref: Reference,
    newSubscriptionProps: SubscriptionProps
  ): boolean => {
    const index = this.subscriptions.findIndex(
      subscription => subscription?.ref === ref
    )
    if (index > -1) {
      this.subscriptions = [
        ...this.subscriptions.slice(0, index),
        { ref, ...newSubscriptionProps },
        ...this.subscriptions.slice(index + 1),
      ]
      return true
    }
    return false
  }

  unsubscribe = (ref: Reference): boolean => {
    const index = this.subscriptions.findIndex(
      subscription => subscription?.ref === ref
    )
    if (index > -1) {
      this.subscriptions = [
        ...this.subscriptions.slice(0, index),
        ...this.subscriptions.slice(index + 1),
      ]
      return true
    }
    return false
  }

  get = (ref: Reference): ?Subscription => {
    const index = this.subscriptions.findIndex(
      subscription => subscription?.ref === ref
    )
    if (index > -1) return this.subscriptions[index]
    return null
  }

  getAll = (): Subscriptions => this.subscriptions
}

export default new FetchManager()
