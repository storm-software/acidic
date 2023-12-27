import Dagre from "@dagrejs/dagre";

const g = new Dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));

export const getLayout = (nodes, edges) => {
  g.setGraph({ rankdir: "TB" });

  edges.forEach(edge => g.setEdge(edge.source, edge.target));
  nodes.forEach(node => g.setNode(node.id, node));

  Dagre.layout(g);

  return {
    nodes: nodes.map(node => {
      const { x, y } = g.node(node.id);

      return { ...node, position: { x, y } };
    }),
    edges
  };
};
