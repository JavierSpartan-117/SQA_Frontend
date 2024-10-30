"use client"

import { useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Droplet, Thermometer, Sprout, Power, Activity } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import Image from 'next/image'

interface SensorData {
  humedadSuelo: number | "apagado" | "no conectado"
  humedad: number | "Apagado" | "no conectado"
  temperatura: number | "Apagado" | "no conectado"
  nivelAgua: "Sin agua" | "Con agua"
  modoBomba: "automatico" | "manual"
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

async function togglePumpMode(mode: 'auto' | 'manual') {
  try {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/sensors/water-pump`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ mode })
    })
  } catch (error) {
    console.error('Error al cambiar el modo de la bomba:', error)
  }
}

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
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-b from-green-50 to-white">
        <div className="flex flex-col items-center gap-4">
          <Activity className="w-12 h-12 text-green-600 animate-pulse" />
          <p className="text-green-800 font-medium">Conectando con los sensores...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <header className="bg-black/80 backdrop-blur-sm sticky top-0 z-50 border-b border-green-800">
        <div className="container mx-auto p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image
              src="/agroSmartLogo.png"
              alt="AgroSmart Logo"
              width={150}
              height={50}
              className="h-12 w-auto"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-2 text-sm text-green-600">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
              Conectado
            </span>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 pt-8">
        <div className="flex flex-col gap-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-green-800">Panel de Control</h1>
            <p className="text-green-600">Monitoreo y control de sensores en tiempo real</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Cards con animación de entrada */}
            <div className="animate-in slide-in-from-left duration-500">
              <SoilMoistureCard soilMoisture={sensorData.humedadSuelo} />
            </div>
            <div className="animate-in slide-in-from-left duration-500 delay-150">
              <HumidityTemperatureCard 
                humidity={sensorData.humedad} 
                temperature={sensorData.temperatura}
              />
            </div>
            <div className="animate-in slide-in-from-left duration-500 delay-300">
              <WaterLevelCard waterLevel={sensorData.nivelAgua} />
            </div>
            <div className="animate-in slide-in-from-left duration-500 delay-450">
              <PumpControlCard 
                pumpMode={sensorData.modoBomba} 
                waterLevel={sensorData.nivelAgua}
                pumpStatus={sensorData.Bomba}
              />
            </div>
            <div className="animate-in slide-in-from-left duration-500 delay-600">
              <PumpStatusCard 
                pumpStatus={sensorData.Bomba}
                pumpMode={sensorData.modoBomba}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

function SoilMoistureCard({ soilMoisture }: { soilMoisture: number | "apagado" | "no conectado" }) {
  const isConnected = typeof soilMoisture === 'number'
  let content: React.ReactNode

  if (soilMoisture === "apagado" || soilMoisture === "no conectado") {
    content = (
      <div className="space-y-2">
        <div className="text-2xl font-bold text-red-500">{soilMoisture}</div>
        <div className="text-sm text-red-400">Sensor no disponible</div>
      </div>
    )
  } else {
    const moisturePercentage = 100 - (soilMoisture / 1024 * 100)
    content = (
      <>
        <div className="flex items-baseline gap-2">
          <div className="text-3xl font-bold text-green-800">{soilMoisture}</div>
          <div className="text-sm text-green-600">(Raw)</div>
        </div>
        <div className="text-sm text-green-600 mb-4">
          {moisturePercentage.toFixed(1)}% de humedad
        </div>
        <Progress 
          value={moisturePercentage} 
          className="h-3 mt-2 bg-green-100" 
          // indicatorClassName="bg-green-600 transition-all duration-500" 
        />
      </>
    )
  }

  return (
    <Card className="border-green-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:translate-y-[-2px]">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b border-green-100">
        <div className="space-y-1">
          <CardTitle className="text-base font-medium text-green-800">Humedad del Suelo</CardTitle>
          <p className="text-sm text-green-600">Sensor de humedad terrestre</p>
        </div>
        <div className="relative">
          <Sprout className={`h-5 w-5 ${isConnected ? 'text-green-600' : 'text-red-400'}`} />
          {isConnected && (
            <span className="absolute -top-1 -right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        {content}
        <div className="flex gap-2 mt-6">
          <Button
            size="sm"
            variant="outline"
            className="border-green-200 hover:bg-green-100 hover:text-green-800 transition-colors duration-300"
            onClick={() => toggleSensor(SensorTopics.SoilMoisture, 'on')}
            disabled={isConnected}
          >
            <Power className="h-4 w-4 mr-2" />
            Encender
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="border-red-200 hover:bg-red-100 hover:text-red-800 transition-colors duration-300"
            onClick={() => toggleSensor(SensorTopics.SoilMoisture, 'off')}
            disabled={!isConnected}
          >
            <Power className="h-4 w-4 mr-2" />
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
    <Card className="border-green-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:translate-y-[-2px]">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b border-green-100">
        <div className="space-y-1">
          <CardTitle className="text-base font-medium text-green-800">Sensor DHT11</CardTitle>
          <p className="text-sm text-green-600">Temperatura y humedad ambiental</p>
        </div>
        <div className="relative flex items-center gap-2">
          <Droplet className={`h-5 w-5 ${isConnected ? 'text-green-600' : 'text-red-400'}`} />
          <Thermometer className={`h-5 w-5 ${isConnected ? 'text-green-600' : 'text-red-400'}`} />
          {isConnected && (
            <span className="absolute -top-1 -right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-6">
          {/* Sección de Humedad */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-green-800">Humedad del Aire</h3>
            {typeof humidity === 'number' ? (
              <div className="space-y-2">
                <div className="flex items-baseline gap-2">
                  <div className="text-3xl font-bold text-green-800">{humidity}%</div>
                  <div className="text-sm text-green-600">Humedad relativa</div>
                </div>
                <Progress 
                  value={humidity} 
                  className="h-3 bg-green-100" 
                  // indicatorClassName="bg-green-600 transition-all duration-500" 
                />
              </div>
            ) : (
              <div className="text-xl font-bold text-red-500">{humidity}</div>
            )}
          </div>

          <Separator className="bg-green-100" />

          {/* Sección de Temperatura */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-green-800">Temperatura</h3>
            {typeof temperature === 'number' ? (
              <div className="space-y-2">
                <div className="flex items-baseline gap-2">
                  <div className="text-3xl font-bold text-green-800">{temperature}°C</div>
                  <div className="text-sm text-green-600">Celsius</div>
                </div>
                <Progress 
                  value={temperature} 
                  max={50} 
                  className="h-3 bg-green-100" 
                  // indicatorClassName="bg-green-600 transition-all duration-500" 
                />
              </div>
            ) : (
              <div className="text-xl font-bold text-red-500">{temperature}</div>
            )}
          </div>

          {/* Controles del Sensor */}
          <div className="flex gap-2 pt-2">
            <Button
              size="sm"
              variant="outline"
              className="border-green-200 hover:bg-green-100 hover:text-green-800 transition-colors duration-300"
              onClick={() => toggleSensor(SensorTopics.HumidityTemperature, 'on')}
              disabled={isConnected}
            >
              <Power className="h-4 w-4 mr-2" />
              Encender DHT11
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="border-red-200 hover:bg-red-100 hover:text-red-800 transition-colors duration-300"
              onClick={() => toggleSensor(SensorTopics.HumidityTemperature, 'off')}
              disabled={!isConnected}
            >
              <Power className="h-4 w-4 mr-2" />
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
    <Card className="border-green-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:translate-y-[-2px]">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b border-green-100">
        <div className="space-y-1">
          <CardTitle className="text-base font-medium text-green-800">Nivel de Agua</CardTitle>
          <p className="text-sm text-green-600">Sensor de nivel</p>
        </div>
        <Droplet className={`h-5 w-5 ${hasWater ? 'text-green-600' : 'text-red-400'}`} />
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className={`h-4 w-4 rounded-full ${hasWater ? 'bg-green-500' : 'bg-red-500'} 
              animate-pulse transition-colors duration-500`} />
            <div className={`text-3xl font-bold ${hasWater ? 'text-green-600' : 'text-red-500'}`}>
              {waterLevel}
            </div>
          </div>
          <div className={`w-full h-8  mt-2 rounded-full ${hasWater ? 'bg-green-100' : 'bg-red-100'}`}>
            <div
              className={`h-full rounded-full transition-all duration-1000 ${
                hasWater ? 'bg-green-500' : 'bg-red-500'
              }`}
              style={{ 
                width: hasWater ? '100%' : '20%',
                boxShadow: hasWater ? '0 0 10px rgba(34, 197, 94, 0.5)' : 'none'
              }}
            />
          </div>
          <div className="text-sm text-center mt-2">
            {hasWater ? (
              <span className="text-green-600">Nivel de agua adecuado para operación</span>
            ) : (
              <span className="text-red-500">Se requiere rellenar el tanque de agua</span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function PumpControlCard({ 
  pumpMode, 
  waterLevel,
  pumpStatus 
}: { 
  pumpMode: "automatico" | "manual"
  waterLevel: "Sin agua" | "Con agua"
  pumpStatus: "apagado" | "encendido"
}) {
  const isManual = pumpMode === "manual"
  const canControlPump = isManual && waterLevel === "Con agua"
  const isPumpOn = pumpStatus === "encendido"

  return (
    <Card className="border-green-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:translate-y-[-2px]">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b border-green-100">
        <div className="space-y-1">
          <CardTitle className="text-base font-medium text-green-800">Control de Bomba</CardTitle>
          <p className="text-sm text-green-600">Panel de control manual</p>
        </div>
        <Power className={`h-5 w-5 ${canControlPump ? 'text-green-600' : 'text-red-400'}`} />
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-6">
          {/* Control de Modo */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-green-800">Modo de Operación</h3>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={pumpMode === "automatico" ? "default" : "outline"}
                className={pumpMode === "automatico" 
                  ? "bg-green-600 hover:bg-green-700 transition-colors duration-300" 
                  : "border-green-200 hover:bg-green-100 hover:text-green-800 transition-colors duration-300"}
                onClick={() => togglePumpMode('auto')}
              >
                <Activity className="h-4 w-4 mr-2" />
                Automático
              </Button>
              <Button
                size="sm"
                variant={pumpMode === "manual" ? "default" : "outline"}
                className={pumpMode === "manual" 
                  ? "bg-green-600 hover:bg-green-700 transition-colors duration-300" 
                  : "border-green-200 hover:bg-green-100 hover:text-green-800 transition-colors duration-300"}
                onClick={() => togglePumpMode('manual')}
              >
                <Power className="h-4 w-4 mr-2" />
                Manual
              </Button>
            </div>
          </div>

          {/* Control de Bomba */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-green-800">Control Manual</h3>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                className="border-green-200 hover:bg-green-100 hover:text-green-800 transition-colors duration-300 flex-1"
                onClick={() => toggleSensor(SensorTopics.Pump, 'on')}
                disabled={!canControlPump || isPumpOn}
              >
                <Power className="h-4 w-4 mr-2" />
                Encender Bomba
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="border-red-200 hover:bg-red-100 hover:text-red-800 transition-colors duration-300 flex-1"
                onClick={() => toggleSensor(SensorTopics.Pump, 'off')}
                disabled={!canControlPump || !isPumpOn}
              >
                <Power className="h-4 w-4 mr-2" />
                Apagar Bomba
              </Button>
            </div>
          </div>

          {/* Mensajes de Estado */}
          {!canControlPump && (
            <div className="text-sm text-red-500 bg-red-50 p-3 rounded-md">
              {!isManual 
                ? "Cambie a modo manual para controlar la bomba" 
                : "No hay agua disponible para operar la bomba"}
            </div>
          )}
          {canControlPump && (
            <div className="text-sm text-green-600 bg-green-50 p-3 rounded-md">
              La bomba está {isPumpOn ? "encendida" : "apagada"}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function PumpStatusCard({ 
  pumpStatus, 
  pumpMode 
}: { 
  pumpStatus: "apagado" | "encendido"
  pumpMode: "automatico" | "manual"
}) {
  const isOn = pumpStatus === "encendido"

  return (
    <Card className="border-green-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:translate-y-[-2px]">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b border-green-100">
        <div className="space-y-1">
          <CardTitle className="text-base font-medium text-green-800">Estado de la Bomba</CardTitle>
          <p className="text-sm text-green-600">Monitoreo en tiempo real</p>
        </div>
        <Power className={`h-5 w-5 ${isOn ? 'text-green-600' : 'text-red-400'}`} />
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-6">
          {/* Estado Actual */}
          <div className="flex items-center gap-3">
            <div className={`h-4 w-4 rounded-full ${isOn ? 'bg-green-500' : 'bg-red-500'} 
              animate-pulse transition-colors duration-500`} />
            <span className={`text-3xl font-bold ${isOn ? 'text-green-600' : 'text-red-500'}`}>
              {isOn ? 'Encendida' : 'Apagada'}
            </span>
          </div>

          {/* Modo Actual */}
          <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-md">
            <Activity className="h-4 w-4 text-green-600" />
            <span className="text-sm text-green-800">
              Operando en modo{' '}
              <span className="font-medium">
                {pumpMode === "automatico" ? "automático" : "manual"}
              </span>
            </span>
          </div>

          {/* Indicador Visual */}
          <div className={`w-full h-8 rounded-full ${isOn ? 'bg-green-100' : 'bg-red-100'}`}>
            <div
              className={`h-full rounded-full transition-all duration-1000 ${
                isOn ? 'bg-green-500' : 'bg-red-500'
              }`}
              style={{ 
                width: isOn ? '100%' : '20%',
                boxShadow: isOn ? '0 0 10px rgba(34, 197, 94, 0.5)' : 'none'
              }}
            />
          </div>

          {/* Mensaje Informativo */}
          {pumpMode === "automatico" && isOn && (
            <div className="text-sm text-green-600 bg-green-50 p-3 rounded-md border border-green-100">
              <Activity className="h-4 w-4 inline mr-2" />
              La bomba se ha activado automáticamente según las condiciones programadas
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}