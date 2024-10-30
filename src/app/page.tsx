"use client"

import { useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Droplet, Thermometer, Sprout, Power } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import Image from 'next/image'

interface SensorData {
  humedadSuelo: number | "Apagado" | "no conectado"
  humedad: number | "Apagado" | "no conectado"
  temperatura: number | "Apagado" | "no conectado"
  nivelAgua: "Sin agua" | "Con agua"
  modoBomba: "auto" | "manual"
  Bomba: "apagado" | "encendido"
}

async function toggleSensor(topic: string, state: 'on' | 'off') {
  try {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/sensors/control`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        topic: `control/${topic}`,
        state: state
      })
    })
  } catch (error) {
    console.error('Error al cambiar el estado del sensor:', error)
  }
}

// async function togglePumpMode(mode: 'auto' | 'manual') {
//   try {
//     await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/sensors/water-pump`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify({ mode })
//     })
//   } catch (error) {
//     console.error('Error al cambiar el modo de la bomba:', error)
//   }
// }

const SensorTopics = {
  SoilMoisture: 'humidity-soil',
  HumidityTemperature: 'humidity-temperature',
  Pump: 'water-pump'
} as const

export default function Component() {
  const [sensorData, setSensorData] = useState<SensorData | null>(null)

  useEffect(() => {
    const socket = io(`${process.env.NEXT_PUBLIC_API_URL}`)

    socket.on('sensorData', (data: SensorData) => {
      console.log('Datos recibidos del backend:', data)
      setSensorData(data)
    })

    return () => {
      socket.disconnect()
    }
  }, [])

  if (!sensorData) {
    return <div className="flex justify-center items-center h-screen">Cargando datos de sensores...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto p-4 flex items-center gap-2">
          <Image
            src="/agroSmartLogo.png"
            alt="AgroSmart Logo"
            width={150}
            height={50}
            className="h-12 w-auto"
          />
        </div>
      </header>
      <main className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6 text-green-800">Panel de Control</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <SoilMoistureCard soilMoisture={sensorData.humedadSuelo} />
          <HumidityTemperatureCard 
            humidity={sensorData.humedad} 
            temperature={sensorData.temperatura}
          />
          <WaterLevelCard waterLevel={sensorData.nivelAgua} />
          <PumpControlCard 
            pumpMode={sensorData.modoBomba} 
            pumpStatus={sensorData.Bomba} 
            waterLevel={sensorData.nivelAgua} 
          />
        </div>
      </main>
    </div>
  )
}

function SoilMoistureCard({ soilMoisture }: { soilMoisture: number | "Apagado" | "no conectado" }) {
  const isConnected = typeof soilMoisture === 'number'
  let content: React.ReactNode

  if (soilMoisture === "Apagado" || soilMoisture === "no conectado") {
    content = <div className="text-2xl font-bold text-red-500">{soilMoisture}</div>
  } else {
    const moisturePercentage = 100 - (soilMoisture / 1024 * 100)
    content = (
      <>
        <div className="text-2xl font-bold text-green-800">{soilMoisture} (Raw)</div>
        <div className="text-sm text-green-600 mb-2">
          {moisturePercentage.toFixed(1)}% de humedad
        </div>
        <Progress 
          value={moisturePercentage} 
          className="mt-2 bg-green-100" 
          // indicatorClassName="bg-green-600" 
        />
      </>
    )
  }

  return (
    <Card className="border-green-100 shadow-lg hover:shadow-xl transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b border-green-100">
        <CardTitle className="text-sm font-medium text-green-800">Humedad del Suelo</CardTitle>
        <Sprout className="h-4 w-4 text-green-600" />
      </CardHeader>
      <CardContent className="pt-4">
        {content}
        <div className="flex gap-2 mt-4">
          <Button
            size="sm"
            variant="outline"
            className="border-green-200 hover:bg-green-100 hover:text-green-800"
            onClick={() => toggleSensor(SensorTopics.SoilMoisture, 'on')}
            disabled={isConnected}
          >
            Encender
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="border-red-200 hover:bg-red-100 hover:text-red-800"
            onClick={() => toggleSensor(SensorTopics.SoilMoisture, 'off')}
            disabled={!isConnected}
          >
            Apagar
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function HumidityTemperatureCard({
  humidity,
  temperature
}: {
  humidity: number | "Apagado" | "no conectado",
  temperature: number | "Apagado" | "no conectado"
}) {
  const isConnected = typeof humidity === 'number' && typeof temperature === 'number'

  return (
    <Card className="border-green-100 shadow-lg hover:shadow-xl transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b border-green-100">
        <CardTitle className="text-sm font-medium text-green-800">Sensor DHT11</CardTitle>
        <div className="flex items-center gap-2">
          <Droplet className="h-4 w-4 text-green-600" />
          <Thermometer className="h-4 w-4 text-green-600" />
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-4">
          {/* Sección de Humedad */}
          <div>
            <h3 className="text-sm font-medium text-green-800 mb-2">Humedad del Aire</h3>
            {typeof humidity === 'number' ? (
              <>
                <div className="text-2xl font-bold text-green-800">{humidity}%</div>
                <Progress 
                  value={humidity} 
                  className="mt-2 bg-green-100" 
                  // indicatorClassName="bg-green-600" 
                />
              </>
            ) : (
              <div className="text-xl font-bold text-red-500">{humidity}</div>
            )}
          </div>

          <Separator className="my-4" />

          {/* Sección de Temperatura */}
          <div>
            <h3 className="text-sm font-medium text-green-800 mb-2">Temperatura</h3>
            {typeof temperature === 'number' ? (
              <>
                <div className="text-2xl font-bold text-green-800">{temperature}°C</div>
                <Progress 
                  value={temperature} 
                  max={50} 
                  className="mt-2 bg-green-100" 
                  // indicatorClassName="bg-green-600" 
                />
              </>
            ) : (
              <div className="text-xl font-bold text-red-500">{temperature}</div>
            )}
          </div>

          {/* Controles del Sensor */}
          <div className="flex gap-2 mt-4">
            <Button
              size="sm"
              variant="outline"
              className="border-green-200 hover:bg-green-100 hover:text-green-800"
              onClick={() => toggleSensor(SensorTopics.HumidityTemperature, 'on')}
              disabled={isConnected}
            >
              Encender DHT11
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="border-red-200 hover:bg-red-100 hover:text-red-800"
              onClick={() => toggleSensor(SensorTopics.HumidityTemperature, 'off')}
              disabled={!isConnected}
            >
              Apagar DHT11
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function WaterLevelCard({ waterLevel }: { waterLevel: "Sin agua" | "Con agua" }) {
  const hasWater = waterLevel === "Con agua"

  return (
    <Card className="border-green-100 shadow-lg hover:shadow-xl transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b border-green-100">
        <CardTitle className="text-sm font-medium text-green-800">Nivel de Agua</CardTitle>
        <Droplet className="h-4 w-4 text-green-600" />
      </CardHeader>
      <CardContent className="pt-4">
        <div className={`text-2xl font-bold ${hasWater ? 'text-green-600' : 'text-red-500'}`}>
          {waterLevel}
        </div>
        <div className={`w-full h-6 mt-2 rounded-full ${hasWater ? 'bg-green-100' : 'bg-red-100'}`}>
          <div
            className={`h-full rounded-full transition-all duration-500 ${hasWater ? 'bg-green-600' : 'bg-red-500'}`}
            style={{ width: hasWater ? '100%' : '20%' }}
          ></div>
        </div>
      </CardContent>
    </Card>
  )
}

function PumpControlCard({ pumpMode, pumpStatus, waterLevel }: { 
  pumpMode: "auto" | "manual", 
  pumpStatus: "apagado" | "encendido", 
  waterLevel: "Sin agua" | "Con agua" 
}) {
  const [isManual, setIsManual] = useState(pumpMode === "manual")
  const [isPumpOn, setIsPumpOn] = useState(pumpStatus === "encendido")

  const canTurnOnPump = isManual && waterLevel === "Con agua"

  const handleModeChange = (checked: boolean) => {
    setIsManual(checked)
    // Aquí deberías enviar el cambio de modo al backend
  }

  const handlePumpToggle = (checked: boolean) => {
    if (canTurnOnPump) {
      setIsPumpOn(checked)
      // Aquí deberías enviar el cambio de estado de la bomba al backend
    }
  }

  return (
    <Card className="border-green-100 shadow-lg hover:shadow-xl transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b border-green-100">
        <CardTitle className="text-sm font-medium text-green-800">Control de Bomba</CardTitle>
        <Power className="h-4 w-4 text-green-600" />
      </CardHeader>
      <CardContent className="pt-4">
        <div className="flex items-center justify-between mb-4">
          <span className="text-green-800">Modo Manual</span>
          <Switch 
            checked={isManual} 
            onCheckedChange={handleModeChange}
            className="data-[state=checked]:bg-green-600"
          />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-green-800">Bomba</span>
          <Switch 
            checked={isPumpOn} 
            onCheckedChange={handlePumpToggle}
            disabled={!canTurnOnPump}
            className="data-[state=checked]:bg-green-600"
          />
        </div>
        {!canTurnOnPump && (
          <p className="text-sm text-red-500 mt-2">
            {!isManual ? "Cambie a modo manual para controlar la bomba" : "No hay agua disponible"}
          </p>
        )}
      </CardContent>
    </Card>
  )
}