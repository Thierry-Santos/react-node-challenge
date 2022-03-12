import React, { useState, useEffect } from "react";
import { Node as NodeType } from "../types/Node";
import Node from "../components/Node";
import { Typography, Box } from "@mui/material";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../store/configureStore";
import { checkNodesStatus, selectNodes } from "../reducers/nodes";
import { fetchBlocks, selectBlocks } from '../reducers/blocks';

export const Nodes: React.FC = () => {
  const [expandedNodeURL, setExpandedNodeURL] = useState<null | string>(null);
  const dispatch = useDispatch();
  const nodes = useAppSelector(selectNodes);
  const blocks = useAppSelector(selectBlocks);

  useEffect(() => {
    dispatch(checkNodesStatus(nodes));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function toggleNodeExpanded(node: NodeType) {
    dispatch(fetchBlocks(node));
    setExpandedNodeURL(node.url === expandedNodeURL ? null : node.url);
  }

  return (
    <Box paddingTop={7}>
      <Typography variant="h4" component="h1">
        <strong style={{ color: "#000" }}>Nodes</strong>
      </Typography>
      {nodes.map((node) => (
        <Node
          node={node}
          blocks={blocks}
          key={node.url}
          expanded={node.url === expandedNodeURL}
          toggleNodeExpanded={toggleNodeExpanded}
        />
      ))}
    </Box>
  );
};

export default Nodes;
