export function buildDependencyGraph(parsedData) {
    const graph = {};
    parsedData.forEach(({ file, imports }) => {
      graph[file] = imports.map(i => i.from);
    });
    return graph;
  }
  