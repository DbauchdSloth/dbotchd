modules.export.DirectedGraph = (function() {
  function DirectedGraph(name) {
    var res = jsgraph.directed.create();
    if (res.error) return console.error(res.error);
    var graph = res.result;
    graph.name = name;
    return graph;
  }
  return DirectedGraph;
})();
