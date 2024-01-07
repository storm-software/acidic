export const getNodeId = (name: string, serviceName: string = "root") => {
  return `${serviceName}_${name}`;
};

export const getServiceName = (nodeId: string) => {
  return nodeId.includes("_")
    ? nodeId.substring(0, nodeId.indexOf("_"))
    : nodeId;
};
