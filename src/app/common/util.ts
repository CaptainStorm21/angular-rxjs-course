import {Observable} from 'rxjs';


export function createHttpObservable(url:string) {
    return new Observable <any>(observer => {

        const controller = new AbortController();
        const signal = controller.signal;

        fetch(url, {signal})
            .then(response => {

                if (response.ok) {
                    return response.json();
                }
                else {
                    observer.error('Request failed with status code: ' + response.status);
                }
            })
            .then(body => {

                observer.next(body);

                observer.complete();

            })
            .catch(err => {

                observer.error(err);

            });

      return () => controller.abort();


    });
}

/**
 * First, we are going to fix here a small mistake.
 * Noticed that these you are variable is kept and used.
 * This is actually the Warrell that we want to hit with our fetch request

So now that we have fixed this, let's see how can this request be cancelled?

Well, the Fetch APA has support for cancellation so we can trigger the cancellation of this request

by using what is called and the board controller.

Let's create here a controller and see how it's used.

We are going to instantiate here a new board controller.

So this is part of the Fed KPA.

The word controller is then going to provide this what is known as a signal.

This is available via the property controller.signal.

This is an abort signal that if it emits a value of truth, then the Fed's request is going to be canceled

by the browser.

So we can take this signal and we can pass it here in a configuration object, which is the second argument

of the fetch calls.

Will we provide here a property called Signal and we link it here to the abort signal of the abort controller.

Now we have here our controller link to the fetch request via the signal.

So if by some reason we would like to cancel this request, we simply have to do controller dot abort

and this will effectively cancel the ETP request.

But we don't want to do this here in the body of the definition of this observable.

What we want to do is we want to call abort only if we unsubscribe.

So how is this link made?

Notice that here, when we pass a function to object that create we are not returning any value, we

do have here the option of returning a value out of this function.

These value returns should be a function.

And this is the cancellation function.

This function is going to be executed by our application via the unsubscribed method.

So unsubscribed is going to trigger these function that we return here as the result of creating our

observable.

And here is where we want to call controller DOT Abort.

Let's now test the implementation of these HTP observable to see if this is indeed working as expected.

Let's define here a new HTP observable and we are going to call here, for example, the URL slash AP

courses.

We are now going to subscribe to this observable and this should trigger MEP requests.

So if the request would return a value, we would log it here to the council.

Now, what we're going to do is immediately after calling subscribe, but in another JavaScript virtual

machine turn, we are going to call unsubscribe on it.

So for deferring this to the next term, we are going to use set timeout.

We are going to create here a function.

And inside this function, this is where we are going to call and subscribe.

We're going to need here a reference to the subscription.

And we did.

We can cancel the request.

We are going to run this time out with a delay of zero.

So this way, the browser will have an opportunity to trigger the Ajax request, but the Ajax request

is going to be cancelled straight away.

We are not going to give time for the response to come back from the server.

The result is that we should see in the network tab of the dev tools a cancelled HTP request.

Let's see if that is indeed the case.

We are going to switch here to our little window.

We're going to refresh the application.

And as we can see here on the network tab, we can see that we have a canceled HTP request as expected

as we can see our implementation of an EDP observer.

Now implement cancellation.



Let's now give a practical example where this functionality would be useful.

 */
