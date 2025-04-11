// Copyright (c) 2025 NTT InfraNet
export default function resolve (graph) {
  let sorted = []
  let visited = {}

  Object.keys(graph).forEach(function visit (name, ancestors) {
    if (!Array.isArray(ancestors)) {
      ancestors = []
    }
    ancestors.push(name)
    visited[name] = true

    graph[name].forEach(dep => {
      if (ancestors.indexOf(dep) >= 0) {
        throw new Error(
          `Circular dependency "${dep}" is required by "${name}": ${ancestors.join(
            ' -> '
          )}`
        )
      }

      if (visited[name]) return
      visit(dep, ancestors.slice(0))
    })

    if (sorted.indexOf(name) < 0) {
      sorted.push(name)
    }
  })

  return sorted
}
