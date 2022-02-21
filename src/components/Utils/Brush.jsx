/* eslint-disable */
import React, { PureComponent } from 'react';
import { scalePoint } from 'd3-scale';
import _ from 'lodash';
import { getValueByDataKey } from 'recharts/lib/util/ChartUtils';

const generatePrefixStyle = (name, value) => {
  if (!name) {
    return null;
  }

  const camelName = name.replace(/(\w)/, v => v.toUpperCase());
  const result = ['Webkit', 'Moz', 'O', 'ms'].reduce(
    (res, entry) => ({
      ...res,
      [entry + camelName]: value,
    }),
    {}
  );

  result[name] = value;

  return result;
};

const createScale = ({ data, startIndex, endIndex, x, width, travellerWidth }) => {
  if (!data || !data.length) {
    return {};
  }

  const len = data.length;
  const scale = scalePoint()
    .domain(_.range(0, len))
    .range([x, x + width - travellerWidth]);
  const scaleValues = scale.domain().map(entry => scale(entry));

  return {
    isTextActive: false,
    isSlideMoving: false,
    isTravellerMoving: false,
    startX: scale(startIndex),
    endX: scale(endIndex),
    scale,
    scaleValues,
  };
};

const isTouch = e => e.changedTouches && !!e.changedTouches.length;
const isNumber = value => _.isNumber(value) && !_.isNaN(value);

class Brush extends PureComponent {
  static displayName = 'Brush';

  static defaultProps = {
    height: 40,
    travellerWidth: 5,
    gap: 1,
    fill: '#fff',
    stroke: '#666',
    padding: { top: 1, right: 1, bottom: 1, left: 1 },
    leaveTimeOut: 1000,
    alwaysShowText: false,
  };

  constructor(props) {
    super(props);

    this.travellerDragStartHandlers = {
      startX: this.handleTravellerDragStart.bind(this, 'startX'),
      endX: this.handleTravellerDragStart.bind(this, 'endX'),
    };

    this.state = {};
  }

  leaveTimer;

  static renderDefaultTraveller(props) {
    const { x, y, height, travellerStroke } = props;

    return (
      <rect
        x={x}
        y={y}
        rx={100}
        width={height}
        height={height}
        fill={travellerStroke}
        stroke="none"
      />
    );
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { data, width, x, travellerWidth, updateId, startIndex, endIndex } = nextProps;

    if (data !== prevState.prevData || updateId !== prevState.prevUpdateId) {
      return {
        prevData: data,
        prevTravellerWidth: travellerWidth,
        prevUpdateId: updateId,
        prevX: x,
        prevWidth: width,
        ...(data && data.length
          ? createScale({ data, width, x, travellerWidth, startIndex, endIndex })
          : { scale: null, scaleValues: null }),
      };
    }
    if (
      prevState.scale &&
      (width !== prevState.prevWidth ||
        x !== prevState.prevX ||
        travellerWidth !== prevState.prevTravellerWidth)
    ) {
      prevState.scale.range([x, x + width - travellerWidth]);

      const scaleValues = prevState.scale.domain().map(entry => prevState.scale(entry));

      return {
        prevData: data,
        prevTravellerWidth: travellerWidth,
        prevUpdateId: updateId,
        prevX: x,
        prevWidth: width,
        startX: prevState.scale(nextProps.startIndex),
        endX: prevState.scale(nextProps.endIndex),
        scaleValues,
      };
    }

    return null;
  }

  componentWillUnmount() {
    if (this.leaveTimer) {
      clearTimeout(this.leaveTimer);
      this.leaveTimer = null;
    }

    this.detachDragEndListener();
  }

  static getIndexInRange(range, x) {
    const len = range.length;
    let start = 0;
    let end = len - 1;

    while (end - start > 1) {
      const middle = Math.floor((start + end) / 2);

      if (range[middle] > x) {
        end = middle;
      } else {
        start = middle;
      }
    }

    return x >= range[end] ? end : start;
  }

  getIndex({ startX, endX }) {
    const { scaleValues } = this.state;
    const { gap, data } = this.props;
    const lastIndex = data.length - 1;
    const min = Math.min(startX, endX);
    const max = Math.max(startX, endX);
    const minIndex = Brush.getIndexInRange(scaleValues, min);
    const maxIndex = Brush.getIndexInRange(scaleValues, max);
    return {
      startIndex: minIndex - (minIndex % gap),
      endIndex: maxIndex === lastIndex ? lastIndex : maxIndex - (maxIndex % gap),
    };
  }

  getTextOfTick(index) {
    const { data, tickFormatter, dataKey } = this.props;
    const text = getValueByDataKey(data[index], dataKey, index);

    return _.isFunction(tickFormatter) ? tickFormatter(text, index) : text;
  }

  handleDrag = e => {
    if (this.leaveTimer) {
      clearTimeout(this.leaveTimer);
      this.leaveTimer = null;
    }

    if (this.state.isTravellerMoving) {
      this.handleTravellerMove(e);
    } else if (this.state.isSlideMoving) {
      this.handleSlideDrag(e);
    }
  };

  handleTouchMove = e => {
    if (e.changedTouches != null && e.changedTouches.length > 0) {
      this.handleDrag(e.changedTouches[0]);
    }
  };

  attachDragEndListener() {
    window.addEventListener('mouseup', this.handleDragEnd, true);
    window.addEventListener('touchend', this.handleDragEnd, true);
  }

  detachDragEndListener() {
    window.removeEventListener('mouseup', this.handleDragEnd, true);
    window.removeEventListener('touchend', this.handleDragEnd, true);
  }

  handleDragEnd = () => {
    this.setState({
      isTravellerMoving: false,
      isSlideMoving: false,
    });
    this.detachDragEndListener();
  };

  handleLeaveWrapper = () => {
    if (this.state.isTravellerMoving || this.state.isSlideMoving) {
      this.leaveTimer = window.setTimeout(this.handleDragEnd, this.props.leaveTimeOut);
    }
  };

  handleEnterSlideOrTraveller = () => {
    this.setState({
      isTextActive: true,
    });
  };

  handleLeaveSlideOrTraveller = () => {
    this.setState({
      isTextActive: false,
    });
  };

  handleSlideDragStart = e => {
    const event = isTouch(e) ? e.changedTouches[0] : e;

    this.setState({
      isTravellerMoving: false,
      isSlideMoving: true,
      slideMoveStartX: event.pageX,
    });

    this.attachDragEndListener();
  };

  handleSlideDrag(e) {
    const { slideMoveStartX, startX, endX } = this.state;
    const { x, width, travellerWidth, startIndex, endIndex, onChange } = this.props;
    let delta = e.pageX - slideMoveStartX;

    if (delta > 0) {
      delta = Math.min(
        delta,
        x + width - travellerWidth - endX,
        x + width - travellerWidth - startX
      );
    } else if (delta < 0) {
      delta = Math.max(delta, x - startX, x - endX);
    }
    const newIndex = this.getIndex({
      startX: startX + delta,
      endX: endX + delta,
    });

    if ((newIndex.startIndex !== startIndex || newIndex.endIndex !== endIndex) && onChange) {
      onChange(newIndex);
    }

    this.setState({
      startX: startX + delta,
      endX: endX + delta,
      slideMoveStartX: e.pageX,
    });
  }

  handleTravellerDragStart(id, e) {
    const event = isTouch(e) ? e.changedTouches[0] : e;

    this.setState({
      isSlideMoving: false,
      isTravellerMoving: true,
      movingTravellerId: id,
      brushMoveStartX: event.pageX,
    });

    this.attachDragEndListener();
  }

  handleTravellerMove(e) {
    const { brushMoveStartX, movingTravellerId, endX, startX } = this.state;
    const prevValue = this.state[movingTravellerId];

    const { x, width, travellerWidth, onChange, gap, data } = this.props;
    const params = { startX: this.state.startX, endX: this.state.endX };

    let delta = e.pageX - brushMoveStartX;
    if (delta > 0) {
      delta = Math.min(delta, x + width - travellerWidth - prevValue);
    } else if (delta < 0) {
      delta = Math.max(delta, x - prevValue);
    }

    params[movingTravellerId] = prevValue + delta;

    const newIndex = this.getIndex(params);
    const { startIndex, endIndex } = newIndex;
    const isFullGap = () => {
      const lastIndex = data.length - 1;
      if (
        (movingTravellerId === 'startX' &&
          (endX > startX ? startIndex % gap === 0 : endIndex % gap === 0)) ||
        (endX < startX && endIndex === lastIndex) ||
        (movingTravellerId === 'endX' &&
          (endX > startX ? endIndex % gap === 0 : startIndex % gap === 0)) ||
        (endX > startX && endIndex === lastIndex)
      ) {
        return true;
      }
      return false;
    };

    this.setState(
      {
        [movingTravellerId]: prevValue + delta,
        brushMoveStartX: e.pageX,
      },
      () => {
        if (onChange) {
          if (isFullGap()) {
            onChange(newIndex);
          }
        }
      }
    );
  }

  renderBackground() {
    const { x, y, width, height, stroke } = this.props;

    return <rect stroke={stroke} fill={stroke} x={x} y={y + 9} width={width} height={2} />;
  }

  renderTravellerLayer(travellerX, id) {
    const { y, travellerWidth, height } = this.props;
    const x = Math.max(travellerX, this.props.x);
    const travellerProps = {
      ...this.props,
      x,
      y,
      width: travellerWidth,
      height,
    };

    return (
      <g
        className="recharts-brush-traveller"
        onMouseEnter={this.handleEnterSlideOrTraveller}
        onMouseLeave={this.handleLeaveSlideOrTraveller}
        onMouseDown={this.travellerDragStartHandlers[id]}
        onTouchStart={this.travellerDragStartHandlers[id]}
        style={{ cursor: 'col-resize' }}
      >
        {Brush.renderDefaultTraveller(travellerProps)}
      </g>
    );
  }

  renderSlide(startX, endX) {
    const { y, height, fill, travellerWidth } = this.props;
    const x = Math.min(startX, endX) + travellerWidth;
    const width = Math.max(Math.abs(endX - startX) - travellerWidth, 0);

    return (
      <rect
        className="recharts-brush-slide"
        onMouseEnter={this.handleEnterSlideOrTraveller}
        onMouseLeave={this.handleLeaveSlideOrTraveller}
        onMouseDown={this.handleSlideDragStart}
        onTouchStart={this.handleSlideDragStart}
        style={{ cursor: 'move' }}
        stroke="none"
        fill={fill}
        x={x}
        y={y}
        width={width}
        height={height}
      />
    );
  }

  render() {
    const { data, x, y, width, height } = this.props;
    const { startX, endX } = this.state;

    if (
      !data ||
      !data.length ||
      !isNumber(x) ||
      !isNumber(y) ||
      !isNumber(width) ||
      !isNumber(height) ||
      width <= 0 ||
      height <= 0
    ) {
      return null;
    }

    const style = generatePrefixStyle('userSelect', 'none');

    return (
      <g
        className="recharts-brush"
        onMouseMove={this.handleDrag}
        onMouseLeave={this.handleLeaveWrapper}
        onTouchMove={this.handleTouchMove}
        style={style}
      >
        {this.renderBackground()}
        {this.renderSlide(startX, endX)}
        {this.renderTravellerLayer(startX, 'startX')}
        {this.renderTravellerLayer(endX - 15, 'endX')}
      </g>
    );
  }
}

export default Brush;
