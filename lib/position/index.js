"use strict";

let util = require("../util");
let positionX = require("./bk").positionX;

module.exports = position;

function position(g) {
  g = util.asNonCompoundGraph(g);

  positionY(g);
  Object.entries(positionX(g)).forEach(([v, x]) => (g.node(v).x = x));

  g.nodes().forEach((v) => {
    const node = g.node(v);
    if (!node) {
      g.setNode(v, { rank: Number.MIN_VALUE, width: 0, height: 0 });
    }

    if (node && (isNaN(node.x) || isNaN(node.y))) {
      node.x =  0;
      node.y =  0;
    }
  });
}

function positionY(g) {
  let layering = util.buildLayerMatrix(g);
  let rankSep = g.graph().ranksep;
  let prevY = 0;
  layering.forEach((layer) => {
    const maxHeight = layer.reduce((acc, v) => {
      const height = g.node(v).height;
      if (acc > height) {
        return acc;
      } else {
        return height;
      }
    }, 0);
    layer.forEach((v) => (g.node(v).y = prevY + maxHeight / 2));
    prevY += maxHeight + rankSep;
  });
}
