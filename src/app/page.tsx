"use client"

import { useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import { Activity } from "lucide-react"
import Image from 'next/image'
import SoilMoistureCard from '@/components/SoilMoistureCard'
import HumidityTemperatureCard from '@/components/HumidityTemperatureCard'
import WaterLevelCard from '@/components/WaterLevelCard'
import PumpControlCard from '@/components/PumpControlCard'
import PumpStatusCard from '@/components/PumpStatusCard'

interface SensorData {
  humedadSuelo: number | "apagado" | "no conectado"
  humedad: number | "Apagado" | "no conectado"
  temperatura: number | "Apagado" | "no conectado"
  nivelAgua: "Sin agua" | "Con agua"
  modoBomba: "automatico" | "manual"
  Bomba: "apagado" | "encendido"
}

export default function Component() {
  const [sensorData, setSensorData] = useState<SensorData | null>(null)

  useEffect(() => {
    const socket = io(`${process.env.NEXT_PUBLIC_API_URL}`)

    socket.on('sensorData', (data: SensorData) => {
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
