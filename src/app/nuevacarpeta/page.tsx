"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Droplet, Thermometer, Sprout } from 'lucide-react'

// Simulamos datos de los sensores
const generateData = () => {
  return {
    soilMoisture: Math.random() * 100,
    airHumidity: Math.random() * 100,
    temperature: Math.random() * 40
  }
}

export default function Page() {
  const [data, setData] = useState<{ time: string; soilMoisture: number; airHumidity: number; temperature: number; }[]>([])
  const [currentValues, setCurrentValues] = useState(generateData())

  useEffect(() => {
    const interval = setInterval(() => {
      const newData = generateData()
      setCurrentValues(newData)
      setData(prevData => [...prevData, { ...newData, time: new Date().toLocaleTimeString() }].slice(-20))
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Monitor de Sensores</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Humedad del Suelo</CardTitle>
            <Sprout className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentValues.soilMoisture.toFixed(1)}%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Humedad del Aire</CardTitle>
            <Droplet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentValues.airHumidity.toFixed(1)}%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Temperatura</CardTitle>
            <Thermometer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentValues.temperature.toFixed(1)}°C</div>
          </CardContent>
        </Card>
      </div>
      <Card className="w-full h-[400px]">
        <CardHeader>
          <CardTitle>Historial de Sensores</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="soilMoisture" stroke="#8884d8" name="Humedad del Suelo" />
              <Line type="monotone" dataKey="airHumidity" stroke="#82ca9d" name="Humedad del Aire" />
              <Line type="monotone" dataKey="temperature" stroke="#ffc658" name="Temperatura" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
