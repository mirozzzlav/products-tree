import React, { useCallback, useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

import { useDeepCompareCallback, useDeepCompareEffect } from 'use-deep-compare';
import style from 'src/components/Hierarchy/style';

const NODE_SIZE = [200, 800];
const LABEL_X = 10;
const LABEL_Y = -40;
const LABEL_WIDTH = 170;
const LABEL_HEIGHT = 40;
const PADDING = 50;

function useZoom(svgRef) {
  const svgD3Ref = useRef(null);
  const zoomD3Ref = useRef(null);

  useEffect(() => {
    if (!svgRef.current) {
      return;
    }
    svgD3Ref.current = d3.select(svgRef.current);
    const g = svgD3Ref.current.select(':scope > g');

    zoomD3Ref.current = d3
      .zoom()
      .scaleExtent([0.05, 10])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svgD3Ref.current.call(zoomD3Ref.current);
  }, []);

  return useCallback((minX, maxX, minY, maxY) => {
    if (!svgD3Ref.current) {
      return;
    }

    const contentWidth = maxX - minX;
    const contentHeight = maxY - minY;

    const { width: svgW, height: svgH } = svgD3Ref.current
      .node()
      .getBoundingClientRect();

    const scale = Math.min(svgW / contentWidth, svgH / contentHeight);
    const xOffset = -minX * scale; // Offset to align leftmost node
    const yOffset = -minY * scale; // Offset to align topmost node

    svgD3Ref.current.call(
      zoomD3Ref.current.transform,
      d3.zoomIdentity
        .translate(
          xOffset + (svgW - contentWidth * scale) / 2,
          yOffset + (svgH - contentHeight * scale) / 2,
        )
        .scale(scale),
    );
  }, []);
}

function toggle(subtree, equalityFunc) {
  if (equalityFunc(subtree)) {
    const { children, _children } = subtree;
    if (children || _children) {
      return {
        ...subtree,
        ...{ _children: children || null },
        ...{ children: _children || null },
      };
    }
  }

  const children =
    subtree?.children &&
    subtree.children.map((child) => toggle(child, equalityFunc));

  return {
    ...subtree,
    ...(children && { children }),
  };
}

export default function Hierarchy({ data: initialData }) {
  const svgRef = useRef();
  const [data, setData] = useState(initialData);
  const fitContent = useZoom(svgRef);

  const render = useDeepCompareCallback(() => {
    const tree = d3.tree();
    const root = d3.hierarchy(data);
    const svg = d3.select(svgRef.current);
    const g = !svg.select(':scope > g').empty()
      ? svg.select(':scope > g')
      : svg.append('g');

    tree.nodeSize(NODE_SIZE);
    tree(root);

    const [minX, maxX] = d3.extent(root.descendants(), ({ x }) => x);
    const [minY, maxY] = d3.extent(root.descendants(), ({ y }) => y);

    fitContent(
      minX + (LABEL_X < 0 ? LABEL_X - PADDING : -PADDING),
      maxX + LABEL_WIDTH + PADDING,
      minY + (LABEL_Y < 0 ? LABEL_Y - PADDING : -PADDING),
      maxY + LABEL_HEIGHT + PADDING,
    );

    const gees = g.selectAll('g').data(root.descendants(), (d) => d.data.name);

    const linksUpdate = () => {
      const links = g
        .selectAll('path')
        .data(
          root.links(),
          (d) => `path-${d.source.data.name}-${d.target.data.name}`,
        );

      links
        .enter()
        .append('path')
        .attr('fill', 'none')
        .attr('stroke', 'rgba(0,0,0,0.2)')
        .attr('stroke-width', 1)
        .attr('stroke-dasharray', '10,10')
        .attr(
          'd',
          d3
            .linkVertical()
            .x((d) => d.x)
            .y((d) => d.y),
        );
      links.attr(
        'd',
        d3
          .linkVertical()
          .x((d) => d.x)
          .y((d) => d.y),
      );
      links.exit().remove();
    };

    const geesEnter = gees
      .enter()
      .append('g')
      .each(function (d) {
        const gNode = d3.select(this);
        // Add text label to the node
        gNode
          .on('click', () => {
            setData((prevData) => {
              if (!d.data.children?.length) {
                return prevData;
              }
              return toggle(prevData, (node) => node.name === d.data.name);
            });
          })
          .append('foreignObject')
          .attr('x', LABEL_X)
          .attr('y', LABEL_Y)
          .attr('width', LABEL_WIDTH)
          .attr('height', LABEL_HEIGHT)
          .append('xhtml:div') // Use XHTML namespace
          .attr('class', style.node)
          .append('xhtml:span')
          .html(d.data.name);

        gNode.append('circle').attr('r', 10).attr('fill', 'steelblue');
      });

    gees.merge(geesEnter).attr('transform', (d) => `translate(${d.x},${d.y})`);

    gees
      .exit()
      .attr('transform', (d) =>
        d.parent
          ? `translate(${d.parent.x},${d.parent.y})`
          : `translate(${d.x},${d.y})`,
      )
      .remove();
    linksUpdate();
  }, [data]);

  useDeepCompareEffect(render, [data]);
  useDeepCompareEffect(() => {
    window.addEventListener('resize', render);
    return () => {
      window.removeEventListener('resize', render);
    };
  }, [data]);

  return (
    <div className={style.wrapper}>
      <svg ref={svgRef} className={style.svg} />
    </div>
  );
}
