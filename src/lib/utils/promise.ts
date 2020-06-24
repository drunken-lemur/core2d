export const fetchInformation = () => {
  const parseRow = (rawText: string) => {
    /* Some function for row parsing which works very slow  */
  };

  let xhrAbort: any;
  let isCancelled = false;

  const xhrPromise = new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", ".../some.csv"); // API endpoint URL with some big CSV database
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(String(xhr.response));
      } else {
        reject(new Error(xhr.status as any));
      }
    };
    xhr.onerror = () => {
      reject(new Error(xhr.status as any));
    };
    xhr.send();

    xhrAbort = xhr.abort.bind(xhr);
  });

  // @ts-ignore
  const delayImpl = window.setImmediate ? setImmediate : requestAnimationFrame;
  const delay = () =>
    new Promise((resolve, reject) =>
      delayImpl(() =>
        !isCancelled ? resolve() : reject(new Error("Cancelled"))
      )
    );

  const parsePromise = (response: any) =>
    new Promise((resolve, reject) => {
      let flowPromise: Promise<any> = Promise.resolve();
      let lastDemileterIdx = 0;
      let result = [];

      while (lastDemileterIdx >= 0) {
        const newIdx = response.indexOf("\n", lastDemileterIdx);

        const row = response.substring(
          lastDemileterIdx,

          newIdx > -1 ? newIdx - lastDemileterIdx : Infinity
        );

        flowPromise = flowPromise.then(() => {
          result.push(parseRow(row));

          return delay();
        });

        lastDemileterIdx = newIdx;
      }

      flowPromise.then(resolve, reject);
    });

  const promise = xhrPromise.then(parsePromise);

  // @ts-ignore
  promise.cancel = () => {
    try {
      xhrAbort();
    } catch (err) {}

    isCancelled = true;
  };

  return promise;

  // return xhrPromise.then(parsePromise);
};
