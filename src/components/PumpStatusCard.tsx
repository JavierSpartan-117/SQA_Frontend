import { Activity, Power } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"


export default function PumpStatusCard({
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
                            className={`h-full rounded-full transition-all duration-1000 ${isOn ? 'bg-green-500' : 'bg-red-500'
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