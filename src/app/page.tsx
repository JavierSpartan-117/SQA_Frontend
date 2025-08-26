"use client"

import { useEffect, useState } from 'react'
import { Activity } from "lucide-react"
import Image from 'next/image'
import SoilMoistureCard from '@/components/SoilMoistureCard'
import HumidityTemperatureCard from '@/components/HumidityTemperatureCard'
import WaterLevelCard from '@/components/WaterLevelCard'
import PumpControlCard from '@/components/PumpControlCard'
import PumpStatusCard from '@/components/PumpStatusCard'

interface SensorData {
  humedadSuelo: number | "apagado" | "no conectado"
  humedad: number | "apagado" | "sensor no conectado"
  temperatura: number | "apagado" | "sensor no conectado"
  nivelAgua: "Sin agua" | "Con agua"
  modoBomba: "automatico" | "manual"
  Bomba: "apagado" | "encendido"
  // Estados de los sensores
  sensorHumedadSuelo: "encendido" | "apagado"
  sensorDHT11: "encendido" | "apagado"
}

// Función para generar datos simulados
const generateSimulatedData = (): SensorData => {
  return {
    humedadSuelo: Math.floor(Math.random() * 30) + 35, // Entre 35% y 65% (más realista)
    humedad: Math.floor(Math.random() * 25) + 40, // Entre 40% y 65% (más realista)
    temperatura: Math.floor(Math.random() * 15) + 20, // Entre 20°C y 35°C (más realista)
    nivelAgua: Math.random() > 0.2 ? "Con agua" : "Sin agua", // 80% probabilidad de tener agua
    modoBomba: Math.random() > 0.6 ? "automatico" : "manual", // 40% probabilidad de automático
    Bomba: Math.random() > 0.7 ? "encendido" : "apagado", // 30% probabilidad de estar encendida
    sensorHumedadSuelo: "encendido",
    sensorDHT11: "encendido"
  }
}

export default function Component() {
  const [sensorData, setSensorData] = useState<SensorData | null>(null)

  // Función para actualizar datos simulados
  const updateSimulatedData = () => {
    setSensorData(prev => {
      if (!prev) return generateSimulatedData()
      
      // Solo actualizar datos si los sensores están encendidos
      let newHumedadSuelo = prev.humedadSuelo
      let newHumedad = prev.humedad
      let newTemperatura = prev.temperatura
      
      if (prev.sensorHumedadSuelo === "encendido") {
        const variation = 0.1 // 10% de variación máxima
        const humedadSuelo = Math.max(0, Math.min(100, 
          (prev.humedadSuelo as number) + (Math.random() - 0.5) * variation * (prev.humedadSuelo as number)
        ))
        newHumedadSuelo = Math.round(humedadSuelo)
      }
      
      if (prev.sensorDHT11 === "encendido") {
        const variation = 0.1 // 10% de variación máxima
        const humedad = Math.max(0, Math.min(100, 
          (prev.humedad as number) + (Math.random() - 0.5) * variation * (prev.humedad as number)
        ))
        const temperatura = Math.max(10, Math.min(50, 
          (prev.temperatura as number) + (Math.random() - 0.5) * variation * (prev.temperatura as number)
        ))
        newHumedad = Math.round(humedad)
        newTemperatura = Math.round(temperatura * 10) / 10 // Redondear a 1 decimal
      }

      return {
        humedadSuelo: newHumedadSuelo,
        humedad: newHumedad,
        temperatura: newTemperatura,
        nivelAgua: prev.nivelAgua, // El nivel de agua no cambia tan frecuentemente
        modoBomba: prev.modoBomba, // El modo no cambia automáticamente
        Bomba: prev.Bomba, // El estado de la bomba no cambia automáticamente
        sensorHumedadSuelo: prev.sensorHumedadSuelo,
        sensorDHT11: prev.sensorDHT11
      }
    })
  }

  // Función para controlar la bomba de forma simulada
  const controlPump = (action: 'on' | 'off') => {
    if (sensorData) {
      setSensorData(prev => prev ? {
        ...prev,
        Bomba: action === 'on' ? 'encendido' : 'apagado'
      } : null)
    }
  }

  // Función para cambiar el modo de la bomba de forma simulada
  const changePumpMode = (mode: 'auto' | 'manual') => {
    if (sensorData) {
      setSensorData(prev => prev ? {
        ...prev,
        modoBomba: mode === 'auto' ? 'automatico' : 'manual'
      } : null)
    }
  }

  // Función para controlar el sensor de humedad del suelo de forma simulada
  const controlSoilMoistureSensor = (action: 'on' | 'off') => {
    if (sensorData) {
      setSensorData(prev => prev ? {
        ...prev,
        sensorHumedadSuelo: action === 'on' ? 'encendido' : 'apagado',
        humedadSuelo: action === 'on' ? (Math.floor(Math.random() * 30) + 35) : 'apagado'
      } : null)
    }
  }

  // Función para controlar el sensor DHT11 de forma simulada
  const controlDHT11Sensor = (action: 'on' | 'off') => {
    if (sensorData) {
      setSensorData(prev => prev ? {
        ...prev,
        sensorDHT11: action === 'on' ? 'encendido' : 'apagado',
        humedad: action === 'on' ? (Math.floor(Math.random() * 25) + 40) : 'apagado',
        temperatura: action === 'on' ? (Math.floor(Math.random() * 15) + 20) : 'apagado'
      } : null)
    }
  }

  useEffect(() => {
    // Simular conexión de sensores después de 3 segundos
    const connectionTimer = setTimeout(() => {
      setSensorData(generateSimulatedData())
    }, 3000)

    // Actualizar datos cada 5 segundos después de la conexión inicial
    const updateTimer = setTimeout(() => {
      const interval = setInterval(updateSimulatedData, 5000)
      return () => clearInterval(interval)
    }, 3000)

    return () => {
      clearTimeout(connectionTimer)
      clearTimeout(updateTimer)
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
              <SoilMoistureCard 
                soilMoisture={sensorData.humedadSuelo}
                onSensorControl={controlSoilMoistureSensor}
                sensorStatus={sensorData.sensorHumedadSuelo}
              />
            </div>
            <div className="animate-in slide-in-from-left duration-500 delay-150">
              <HumidityTemperatureCard 
                humidity={sensorData.humedad} 
                temperature={sensorData.temperatura}
                onSensorControl={controlDHT11Sensor}
                sensorStatus={sensorData.sensorDHT11}
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
                onPumpControl={controlPump}
                onModeChange={changePumpMode}
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
