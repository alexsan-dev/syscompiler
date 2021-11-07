import React, { useEffect } from "react";

interface GraphProps {
  dot: string;
}

const Graph: React.FC<GraphProps> = ({ dot }) => {
  useEffect(() => {
    // @ts-ignore
    d3.select("#graph-body").graphviz().renderDot(dot);
  }, [dot]);

  return <div id="graph-body"></div>;
};

export default Graph;
