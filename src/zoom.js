export const getShiftedTransform = (
    originalTransform,
    labelsWidth,
    labelsPadding,
    d3
) => {
    const fullLabelWidth = labelsWidth + labelsPadding;

    const { x, y, k } = originalTransform;

    return d3.zoomIdentity
        .translate(-fullLabelWidth, 0) // move origin as if there were no labels
        .translate(x, y) // apply zoom transformation panning
        .scale(k) // apply zoom transformation scaling
        .translate(labelsWidth + labelsPadding, 0); // put origin at its original position
};

export default (d3, svg, config, xScale, draw, getEvent) => {
    const {
        label: {
            width: labelsWidth,
            padding: labelsPadding,
        },
    } = config;

    const zoom = d3.zoom();

    svg.attr('transform-origin', 'translate(-200)');

    zoom.on('zoom', () => {
        const transform = getShiftedTransform(
            getEvent().transform,
            labelsWidth,
            labelsPadding,
            d3
        );
        const newScale = transform.rescaleX(xScale);
        svg.call(draw(d3, config, newScale));
    });

    return zoom;
};
