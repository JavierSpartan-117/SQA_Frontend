import { Power, Sprout } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Progress } from "./ui/progress"
import { Button } from "./ui/button"
import useControlSensor from "@/hooks/useControlSensor"

export default function SoilMoistureCard({ soilMoisture }: { soilMoisture: number | "apagado" | "no conectado" }) {
    const { controlSensor, loading, error } = useControlSensor()
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
                        onClick={() => controlSensor('humidity-soil', 'on')}
                        disabled={isConnected || loading}
                    >
                        <Power className="h-4 w-4 mr-2" />
                        Encender
                    </Button>
                    <Button
                        size="sm"
                        variant="outline"
                        className="border-red-200 hover:bg-red-100 hover:text-red-800 transition-colors duration-300"
                        onClick={() => controlSensor('humidity-soil', 'off')}
                        disabled={!isConnected || loading}
                    >
                        <Power className="h-4 w-4 mr-2" />
                        Apagar
                    </Button>
                    {error && <p className="text-red-500 mt-2">Error: {error.message}</p>}
                </div>
            </CardContent>
        </Card>
    )
}