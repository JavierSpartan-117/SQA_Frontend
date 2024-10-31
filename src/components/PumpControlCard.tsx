import { Activity, Power } from "lucide-react"
import { Button } from "./ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import useControlSensor from "@/hooks/useControlSensor"


export default function PumpControlCard({
    pumpMode,
    waterLevel,
    pumpStatus
}: {
    pumpMode: "automatico" | "manual"
    waterLevel: "Sin agua" | "Con agua"
    pumpStatus: "apagado" | "encendido"
}) {
    const { waterPumpMode, controlSensor, loading, error } = useControlSensor()
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
                                onClick={() => waterPumpMode('auto')}
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
                                onClick={() => waterPumpMode('manual')}
                            >
                                <Power className="h-4 w-4 mr-2" />
                                Manual
                            </Button>
                            {error && <p className="text-red-500 mt-2">Error: {error.message}</p>}
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
                                onClick={() => controlSensor('water-pump', 'on')}
                                disabled={!canControlPump || isPumpOn || loading}
                            >
                                <Power className="h-4 w-4 mr-2" />
                                Encender Bomba
                            </Button>
                            <Button
                                size="sm"
                                variant="outline"
                                className="border-red-200 hover:bg-red-100 hover:text-red-800 transition-colors duration-300 flex-1"
                                onClick={() => controlSensor('water-pump', 'off')}
                                disabled={!canControlPump || !isPumpOn || loading}
                            >
                                <Power className="h-4 w-4 mr-2" />
                                Apagar Bomba
                            </Button>
                            {error && <p className="text-red-500 mt-2">Error: {error.message}</p>}
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