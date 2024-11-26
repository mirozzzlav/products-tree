import React, { useRef, useState } from 'react';
import * as d3 from 'd3';

import { useDeepCompareCallback, useDeepCompareEffect } from 'use-deep-compare';
import style from 'src/components/Hierarchy/style';
import initialData from 'src/components/Hierarchy/data';

const MOVE_Y = 50;

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

export default function Hierarchy() {
  const svgRef = useRef();
  const [data, setData] = useState(initialData);
  const dataRef = useRef(initialData);

  const render = useDeepCompareCallback(() => {
    const tree = d3.tree();
    const { width, height } = svgRef.current.getBoundingClientRect();
    const root = d3.hierarchy(data);
    const svg = d3.select(svgRef.current);

    tree.size([width - 100, height - 100]);
    tree(root);

    const gees = svg
      .selectAll('g')
      .data(root.descendants(), (d) => d.data.name);

    const linksUpdate = () => {
      const links = svg
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
            .y((d) => d.y + MOVE_Y),
        );
      links.attr(
        'd',
        d3
          .linkVertical()
          .x((d) => d.x)
          .y((d) => d.y + MOVE_Y),
      );
      links.exit().remove();
    };

    const getGeesWithTransition = () =>
      gees
        .transition()
        .duration(500)
        .attr('transform', (d) => `translate(${d.x},${d.y + MOVE_Y})`);

    const geesEnter = gees
      .enter()
      .append('g')
      .attr('opacity', 0)
      .each(function (d) {
        const gNode = d3.select(this);
        // Add text label to the node
        gNode
          .on('click', () => {
            setData((prevData) =>
              toggle(prevData, (node) => node.name === d.data.name),
            );
          })
          .append('foreignObject')
          .attr('x', 10)
          .attr(
            'y',
            !d.parent || d.parent.children.indexOf(d) % 2 === 0 ? -40 : 10,
          )
          .attr('width', 170)
          .attr('height', 40)
          .append('xhtml:div') // Use XHTML namespace
          .attr('class', style.node)
          .append('xhtml:span')
          .html(d.data.name);

        gNode.append('circle').attr('r', 10).attr('fill', 'steelblue');
      });

    linksUpdate();
    if (dataRef.current) {
      geesEnter
        .attr('transform', (d) => `translate(${d.x},${d.y + MOVE_Y})`)
        .attr('opacity', 1);
      gees
        .exit()
        .attr('transform', (d) =>
          d.parent
            ? `translate(${d.parent.x},${d.parent.y + MOVE_Y})`
            : `translate(${d.x},${d.y + MOVE_Y})`,
        )
        .remove();

      if (Object.keys(data).length === 0) {
        setData(dataRef.current);
      } else {
        dataRef.current = null;
      }
      return;
    }

    // expanding -  new nodes came
    if (geesEnter.size() > 0) {
      getGeesWithTransition().on('end', () => {
        geesEnter
          .attr(
            'transform',
            (d) => `translate(${d.parent.x},${d.parent.y + MOVE_Y})`,
          )
          .attr('opacity', 1)
          .transition()
          .duration(500)
          .attr('transform', (d) => `translate(${d.x},${d.y + MOVE_Y})`);
      });
    }

    // collapsing - exit nodes present
    gees
      .exit()
      .transition()
      .duration(500)
      .attr('transform', (d) =>
        d.parent
          ? `translate(${d.parent.x},${d.parent.y + MOVE_Y})`
          : `translate(${d.x},${d.y + MOVE_Y})`,
      )
      .on('end', () => {
        getGeesWithTransition();
      })
      .remove();
  }, [data]);

  useDeepCompareEffect(render, [data]);

  useDeepCompareEffect(() => {
    const resetAndRender = () => {
      setData((prevData) => {
        dataRef.current = prevData;
        return {};
      });
    };
    window.addEventListener('resize', resetAndRender);

    return () => {
      window.removeEventListener('resize', resetAndRender);
    };
  }, []);

  return (
    <div className={style.wrapper}>
      <svg ref={svgRef} className={style.svg} />
    </div>
  );
}
