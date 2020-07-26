export const bindMethods = (obj: any, ...methods: any[]) => {
  methods.forEach(method => {
    if (!method || !method.bind || !method.name) return;

    obj[method.name] = method.bind(obj);
  });
};
