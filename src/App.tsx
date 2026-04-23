import { useEffect, useState } from 'react';
import './App.css'
import { Chart, Title, XAxis, YAxis } from "@highcharts/react";
import { LineSeries } from "@highcharts/react/series/Line";

interface ChartData {
  labels: string[]
  values: number[]
}

function App() {
  const [chartData, setChartData] = useState<ChartData | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedRegion, setSelectedRegion] = useState("TOTAL")

  useEffect(() => {
    setLoading(true)

    fetch(`https://data.ssb.no/api/pxwebapi/v2/tables/07221/data?lang=en&valueCodes[Region]=${selectedRegion}&valueCodes[Boligtype]=00&valueCodes[ContentsCode]=Boligindeks&valueCodes[Tid]=*&outputformat=json-stat2`)
      .then(res => res.json())
      .then(data => {
        const labels = Object.keys(data.dimension.Tid.category.label)
        const values = data.value.map((v: number) => v === 0 ? null : v)
        setChartData({ labels, values })
        setLoading(false)
      })
  }, [selectedRegion])

return (
  <>
    {loading ? <p>Loading...</p> : (
      <>
      <Chart>
        <Title>Norwegian House Price Index</Title>
        <XAxis categories={chartData?.labels ?? []} />
        <YAxis title={{ text: 'Index (2015=100)' }} />
        <LineSeries data={chartData?.values ?? [null]} />
      </Chart>
      <select value={selectedRegion} onChange={e => setSelectedRegion(e.target.value)}>
        <option value="TOTAL">The whole country</option>
        <option value="001">Oslo including Bærum</option>
        <option value="003">Bergen</option>
      </select>
      </>
    )}
  </>
)
}

export default App
