var freightsdata = "data/freights.json";
var eventsdata = "data/events.json";

var totalData = [];
var eventData = [];
var freightData = [];
var freightYearData = [];

$(document).ready(function () {
  function drawChart2() {
    chart2 = Highcharts.chart("container", {
      chart: {
        type: "timeline",
        inverted: false,
      },
      title: {
        text: "Events in South Australia",
      },
      xAxis: {
        visible: false,
      },
      yAxis: {
        visible: false,
      },
      series: [
        {
          data: eventData,
        },
      ],
    });
  }

  $("#category").on("change", function () {
    $(".charts").addClass("show");
    category = $(this).children("option:selected").val();
    if (category === "All") {
      $(".charts").removeClass("show");
    }
    eventsdata.length = 0;
    buildEventData(totalData, category, "chart2");
    updateCharts();
  });

  function updateCharts() {
    chart2.series[0].setData(eventData);
  }

  function GetAllFreights() {
    var deffer = $.Deferred();

    $.getJSON(freightsdata, function (data) {
      deffer.resolve(data);
    });

    return deffer.promise();
  }

  GetAllEvents().done(function (data) {
    totalData = data;

    buildEventData(data, "All", "chart2");

    drawChart2();
  });

  function GetAllEvents() {
    var deffer = $.Deferred();

    $.getJSON(eventsdata, function (data) {
      deffer.resolve(data);
    });

    return deffer.promise();
  }

  GetAllFreights().done(function (data) {
    totalData = data;

    buildFreightData(data, "chart3");

    drawChart3();
  });

  function buildEventData(data, category, chart) {
    $.each(data, function (index, item) {
      if (item.Year == category) {
        chartType(item, chart);
      } else {
        chartType(item, chart);
      }
    });
  }

  function buildFreightData(data, chart) {
    $.each(data, function (index, item) {
      chartTypeFreight(item, chart);
    });
  }

  function chartType(item, chart) {
    eventData.push({
      name: item.Event,
      label: item.Year,
      description: item.Event,
    });
  }

  function chartTypeFreight(item, chart) {
    console.log(item);
    freightData.push(item.Tonne);
    freightYearData.push(item.Year);
  }

  function convertInt(cost) {
    return parseInt(cost);
  }

  function drawChart3() {
    chart3 = Highcharts.chart("container2", {
      chart: {
        type: "areaspline",
      },
      title: {
        text: "Impact on freights in South Australia During Events",
      },
      legend: {
        layout: "vertical",
        align: "left",
        verticalAlign: "top",
        x: 150,
        y: 100,
        floating: true,
        borderWidth: 1,
        backgroundColor:
          Highcharts.defaultOptions.legend.backgroundColor || "#FFFFFF",
      },
      xAxis: {
        categories: freightYearData,
        plotBands: [
          {
            // visualize the weekend
            from: 4.5,
            to: 6.5,
            color: "rgba(68, 170, 213, .2)",
          },
        ],
      },
      yAxis: {
        title: {
          text: "Freight (tonnes)",
        },
      },
      tooltip: {
        shared: true,
        valueSuffix: " units",
      },
      credits: {
        enabled: false,
      },
      plotOptions: {
        areaspline: {
          fillOpacity: 0.5,
        },
      },
      series: [
        {
          name: "Adelaide",
          data: freightData,
        },
      ],
    });
  }

  Highcharts.chart("container3", {
    chart: {
      type: "column",
    },
    title: {
      text:
        "Analysis for Overall Trading(Import/Export) done (Both Overseas and Interstate) in various Sectors across South Australia between Year 1999-2005",
    },
    xAxis: {
      categories: [
        "1999-00",
        "2000-01",
        "2001-02",
        "2002-03",
        "2003-04",
        "2004-05",
        "2005-06",
      ],
      crosshair: false,
    },
    yAxis: {
      min: 50,
      title: {
        text: "",
      },
    },
    tooltip: {
      headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
      pointFormat:
        '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
        '<td style="padding:0"><b>{point.y:.1f} mn</b></td></tr>',
      footerFormat: "</table>",
      shared: true,
      useHTML: true,
    },
    plotOptions: {
      column: {
        pointPadding: 0.2,
        borderWidth: 0,
      },
    },
    series: [
      {
        name: "Total Overseas export",
        data: [1539.15, 2156.34, 2983.28, 2323.55, 2180.51, 1686.33, 1790.81],
      },
      {
        name: "Total overseas import",
        data: [389, 295.32, 416.03, 451.66, 407.64, 487.37, 502.28],
      },
      {
        name: "Total interstate export",
        data: [834.75, 1078.83, 1262.23, 1034.17, 1131.56, 1342.31, 1574.08],
      },
      {
        name: "Total interstate import",
        data: [583.57, 583.14, 803.12, 1110.41, 889.03, 1058.94, 1177.24],
      },
    ],
  });
});
