import { useEffect, useState } from 'react';
import './App.css'
import { Chart, Title, XAxis } from "@highcharts/react";
import { LineSeries } from "@highcharts/react/series/Line";

interface ChartData {
  labels: string[]
  values: number[]
}

function App() {
  const [chartData, setChartData] = useState<ChartData | null>(null)

  useEffect(() => {
    fetch('https://data.ssb.no/api/pxwebapi/v2/tables/07221/data?lang=en&valueCodes[Region]=TOTAL&valueCodes[Boligtype]=00&valueCodes[ContentsCode]=Boligindeks&valueCodes[Tid]=*&outputformat=json-stat2')
      .then(res => res.json())
      .then(data => {
        const labels = Object.keys(data.dimension.Tid.category.label)
        const values = data.value
        setChartData({ labels, values })
      })
  }, [])
  return (
    <Chart>
      <Title>Norwegian House Price Index</Title>
      <XAxis categories={chartData ? chartData.labels : []} />
      <LineSeries data={chartData ? chartData.values : [null]} />
    </Chart>
  )
}

export default App
