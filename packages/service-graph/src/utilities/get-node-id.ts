export const getNodeId = (name: string, serviceName: string = "root") => {
  return `${serviceName}_${name}`;
};
