// complete the js code
class CustomPromise {
  // write your code here
	constructor() {
		this.status = 'pending';
	    this.value = undefined;
	    this.reason = undefined;
	    this.onFulfilledCallbacks = [];
	    this.onRejectedCallbacks = [];
	    this.onFinallyCallback = undefined;
	};
	resolve(value) {
		if (this.status === 'pending') {
			this.status = 'fulfilled';
		    this.value = value;
		    this.executeHandlers(this.onFulfilledCallbacks, value);
		    this.executeFinallyHandler();
		};
	};
	reject(reason) {
		if (this.status === 'pending') {
			this.status = 'rejected';
		    this.reason = reason;
		    this.executeHandlers(this.onRejectedCallbacks, reason);
		    this.executeFinallyHandler();
		};
	};
	then(onFulfilled, onRejected) {
		const newPromise = new CustomPromise();
		const onFulfilledWrapper = (value) => {
			try {
				const result = onFulfilled ? onFulfilled(value) : value;
				this.handleNextPromise(newPromise, result);
			}
			catch (error) {
				newPromise.reject(error);
      }
    };

    const onRejectedWrapper = (reason) => {
      try {
        const result = onRejected ? onRejected(reason) : reason;
        this.handleNextPromise(newPromise, result);
      } catch (error) {
		  newPromise.reject(error);
	  };
	};
		if (this.status === 'fulfilled') {
			setTimeout(() => {
				onFulfilledWrapper(this.value);
			}, 0);
		} else if (this.status === 'rejected') {
			setTimeout(() => {
				onRejectedWrapper(this.reason);
			}, 0);
		} else {
			this.onFulfilledCallbacks.push(onFulfilledWrapper);
			this.onRejectedCallbacks.push(onRejectedWrapper);
		};
		return newPromise;
	};

  catch(onRejected) {
    return this.then(null, onRejected);
  }

  finally(onFinally) {
    this.onFinallyCallback = onFinally;
    this.executeFinallyHandler();
  }

  executeHandlers(handlers, value) {
    handlers.forEach(handler => {
      setTimeout(() => {
        handler(value);
      }, 0);
    });
  }

  executeFinallyHandler() {
    if (this.onFinallyCallback) {
      setTimeout(() => {
        this.onFinallyCallback();
      }, 0);
    }
  }

  handleNextPromise(nextPromise, result) {
    if (result instanceof CustomPromise) {
      result.then(
        value => nextPromise.resolve(value),
        reason => nextPromise.reject(reason)
      );
    } else {
      nextPromise.resolve(result);
    }
  }
}

window.CustomPromise = CustomPromise;

