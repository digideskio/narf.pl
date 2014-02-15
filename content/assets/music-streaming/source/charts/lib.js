// Generated by CoffeeScript 1.8.0
(function() {
  var ascenderHeight, capHeight, countLevels, descenderHeight, isoDateToTimeStamp, lineHeight, sumValues, sumValuesBelowLevel, valuesToFloat;

  lineHeight = 28;

  capHeight = lineHeight / 1.4;

  ascenderHeight = lineHeight / 20;

  descenderHeight = lineHeight - capHeight;

  valuesToFloat = function(d) {
    var key, level, _i, _ref;
    for (level = _i = 1, _ref = countLevels(d); 1 <= _ref ? _i <= _ref : _i >= _ref; level = 1 <= _ref ? ++_i : --_i) {
      key = "v" + level;
      d[key] = parseFloat(d[key], 10);
    }
    return d;
  };

  countLevels = function(d) {
    var key, level, nextLevel;
    level = 1;
    while (true) {
      nextLevel = level + 1;
      key = "v" + nextLevel;
      if (!(key in d)) {
        break;
      }
      level = nextLevel;
    }
    return level;
  };

  sumValues = function(d) {
    var key, level, sum, _i, _ref;
    sum = 0;
    for (level = _i = 1, _ref = countLevels(d); 1 <= _ref ? _i <= _ref : _i >= _ref; level = 1 <= _ref ? ++_i : --_i) {
      key = "v" + level;
      sum += d[key];
    }
    return sum;
  };

  sumValuesBelowLevel = function(d, maxLevel) {
    var key, level, sum, _i;
    sum = 0;
    for (level = _i = 1; 1 <= maxLevel ? _i < maxLevel : _i > maxLevel; level = 1 <= maxLevel ? ++_i : --_i) {
      key = "v" + level;
      sum += d[key];
    }
    return sum;
  };

  isoDateToTimeStamp = function(isoDate) {
    return new Date(isoDate).getTime();
  };

  window.addChart = function(_arg) {
    var barWidth, chart, chartHeight, chartWidth, csv, height, leftMargin, legend, margins, numberOfBars, numberOfLegendLines, subtitle, title, width;
    csv = _arg.csv, title = _arg.title, subtitle = _arg.subtitle, legend = _arg.legend;
    if (legend) {
      numberOfLegendLines = 1 + Math.ceil(legend.length / 2);
    } else {
      numberOfLegendLines = 0;
    }
    chartWidth = 1024;
    chartHeight = (14 + numberOfLegendLines) * lineHeight;
    numberOfBars = 50;
    barWidth = 18;
    leftMargin = 50;
    margins = {
      top: 3 * lineHeight,
      right: chartWidth - leftMargin - numberOfBars * barWidth,
      left: leftMargin,
      bottom: (1 + numberOfLegendLines) * lineHeight
    };
    width = chartWidth - margins.left - margins.right;
    height = chartHeight - margins.top - margins.bottom - descenderHeight;
    chart = d3.select('.entry-content').append('svg').attr('class', 'chart').attr('width', chartWidth).attr('height', chartHeight).append('g').attr('transform', "translate(" + margins.left + ", " + margins.top + ")");
    return d3.csv("../data/chart-csv/" + csv + ".csv", valuesToFloat, function(data) {
      var bar, color, colors, dx, dy, firstTimeStamp, i, key, lastTimeStamp, legendEntry, legendG, legendRectSize, level, rightBorderTimeStamp, secondLastTimeStamp, spotifyTimeStamp, spotifyX, text, titleY, xAxis, xScale, xTimeScale, yAxis, yScale, _i, _j, _ref, _ref1, _results;
      titleY = -margins.top + capHeight + ascenderHeight;
      if (title) {
        chart.append('text').attr('class', 'title').attr('x', width / 2).attr('y', titleY).text(title);
      }
      if (subtitle) {
        chart.append('text').attr('class', 'subtitle').attr('x', width / 2).attr('y', titleY + lineHeight).text(subtitle);
      }
      xScale = d3.scale.ordinal().rangeRoundBands([0, width]).domain(data.map(function(d) {
        return d.date;
      }));
      firstTimeStamp = isoDateToTimeStamp(data[0].date);
      lastTimeStamp = isoDateToTimeStamp(data[data.length - 1].date);
      secondLastTimeStamp = isoDateToTimeStamp(data[data.length - 2].date);
      rightBorderTimeStamp = lastTimeStamp + lastTimeStamp - secondLastTimeStamp;
      xTimeScale = d3.time.scale().range([0, width]).domain([firstTimeStamp, rightBorderTimeStamp]);
      xAxis = d3.svg.axis().scale(xTimeScale).orient('bottom').innerTickSize(8).outerTickSize(0);
      yScale = d3.scale.linear().range([height, 0]).domain([0, d3.max(data, sumValues)]);
      yAxis = d3.svg.axis().scale(yScale).orient('left').ticks(5).tickFormat(function(x) {
        return x;
      }).outerTickSize(0);
      colors = colorbrewer['GnBu'][9].slice().reverse();
      colors[1] = colors[3];
      bar = chart.selectAll('.bar').data(data).enter().append('g').attr('class', 'bar').attr('transform', function(d) {
        return "translate(" + (xScale(d.date)) + ", 0)";
      });
      for (level = _i = 1, _ref = countLevels(data[0]); 1 <= _ref ? _i <= _ref : _i >= _ref; level = 1 <= _ref ? ++_i : --_i) {
        key = "v" + level;
        dx = 1;
        dy = level === 2 ? dx : 0;
        bar.append('rect').attr('width', xScale.rangeBand() - dx).attr('height', function(d) {
          return height - yScale(d[key]) - dy;
        }).attr('y', function(d) {
          return yScale(d[key] + sumValuesBelowLevel(d, level));
        }).attr('fill', colors[level - 1]);
      }
      spotifyTimeStamp = isoDateToTimeStamp('2013-02-12');
      spotifyX = Math.floor(xTimeScale(spotifyTimeStamp));
      chart.append('rect').attr('class', 'spotify').attr('x', spotifyX).attr('y', height).attr('width', xTimeScale(rightBorderTimeStamp) - spotifyX).attr('height', 8);
      chart.append('text').attr('class', 'spotify').attr('x', width + 5).attr('y', height + 8).text('Spotify');
      chart.append('g').attr('class', 'x axis').attr('transform', "translate(0, " + height + ")").call(xAxis).selectAll('text').attr('y', ascenderHeight + lineHeight).attr('dy', 0).attr('class', function(date) {
        if (date.getMonth() === 0 && date.getDate() === 1) {
          return 'year';
        }
      });
      chart.append('g').attr('class', 'y axis').call(yAxis);
      if (legend) {
        legendRectSize = {
          width: capHeight * 2,
          height: capHeight
        };
        legendG = chart.append('g').attr('class', 'legend').attr('transform', "translate( " + (-margins.left + (1024 - 640) / 2) + ", " + (height + Math.round(ascenderHeight + descenderHeight) + 2 * lineHeight) + ")");
        _results = [];
        for (i = _j = 0, _ref1 = legend != null ? legend.length : void 0; 0 <= _ref1 ? _j < _ref1 : _j > _ref1; i = 0 <= _ref1 ? ++_j : --_j) {
          text = legend[i];
          color = colors[i];
          legendEntry = legendG.append('g').attr('transform', "translate( " + ((i % 2) * 640 / 2) + ", " + (Math.floor(i / 2) * lineHeight) + ")");
          legendEntry.append('rect').attr('width', legendRectSize.width).attr('height', legendRectSize.height).attr('y', descenderHeight / 2).attr('fill', color);
          _results.push(legendEntry.append('text').attr('x', legendRectSize.width + 8).attr('y', capHeight).text(text));
        }
        return _results;
      }
    });
  };

}).call(this);
