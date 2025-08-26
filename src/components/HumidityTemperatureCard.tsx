import { Droplet, Power, Thermometer } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Progress } from "./ui/progress"
import { Separator } from "./ui/separator"
import { Button } from "./ui/button"
import { useState } from "react"

export default function HumidityTemperatureCard({
    humidity,
    temperature,
    onSensorControl,
    sensorStatus
}: {
    humidity: number | "apagado" | "sensor no conectado",
    temperature: number | "apagado" | "sensor no conectado",
    onSensorControl: (action: 'on' | 'off') => void,
    sensorStatus: "encendido" | "apagado"
}) {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<Error | null>(null)
    
    const isConnected = (typeof humidity === 'number' && typeof temperature === 'number') && sensorStatus === "encendido"

    // Función simulada para controlar el sensor
    const handleSensorControl = async (action: 'on' | 'off') => {
        setLoading(true)
        setError(null)
        try {
            // Simular delay de red
            await new Promise(resolve => setTimeout(resolve, 500))
            onSensorControl(action)
        } catch (err) {
            setError(err as Error)
        } finally {
            setLoading(false)
        }
    }

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
                        {(typeof humidity === 'number' && sensorStatus === "encendido") ? (
                            <div className="space-y-2">
                                <div className="flex items-baseline gap-2">
                                    <div className="text-3xl font-bold text-green-800">{humidity}%</div>
                                    <div className="text-sm text-green-600">Humedad relativa</div>
                                </div>
                                <Progress
                                    value={humidity}
                                    className="h-3 bg-green-100"
                                />
                            </div>
                        ) : (
                            <div className="text-xl font-bold text-red-500">
                                {sensorStatus === "apagado" ? "apagado" : humidity}
                            </div>
                        )}
                    </div>

                    <Separator className="bg-green-100" />

                    {/* Sección de Temperatura */}
                    <div className="space-y-2">
                        <h3 className="text-sm font-medium text-green-800">Temperatura</h3>
                        {(typeof temperature === 'number' && sensorStatus === "encendido") ? (
                            <div className="space-y-2">
                                <div className="flex items-baseline gap-2">
                                    <div className="text-3xl font-bold text-green-800">{temperature}°C</div>
                                    <div className="text-sm text-green-600">Celsius</div>
                                </div>
                                <Progress
                                    value={temperature}
                                    max={50}
                                    className="h-3 bg-green-100"
                                />
                            </div>
                        ) : (
                            <div className="text-xl font-bold text-red-500">
                                {sensorStatus === "apagado" ? "apagado" : temperature}
                            </div>
                        )}
                    </div>

                    {/* Controles del Sensor */}
                    <div className="flex gap-2 pt-2">
                        <Button
                            size="sm"
                            variant="outline"
                            className="border-green-200 hover:bg-green-100 hover:text-green-800 transition-colors duration-300"
                            onClick={() => handleSensorControl('on')}
                            disabled={sensorStatus === "encendido" || loading}
                        >
                            <Power className="h-4 w-4 mr-2" />
                            Encender DHT11
                        </Button>
                        <Button
                            size="sm"
                            variant="outline"
                            className="border-red-200 hover:bg-red-100 hover:text-red-800 transition-colors duration-300"
                            onClick={() => handleSensorControl('off')}
                            disabled={sensorStatus === "apagado" || loading}
                        >
                            <Power className="h-4 w-4 mr-2" />
                            Apagar DHT11
                        </Button>
                        {error && <p className="text-red-500 mt-2">Error: {error.message}</p>}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}