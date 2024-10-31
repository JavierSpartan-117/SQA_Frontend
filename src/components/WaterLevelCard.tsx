import { Droplet } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"


export default function WaterLevelCard({ waterLevel }: { waterLevel: "Sin agua" | "Con agua" }) {
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
                            className={`h-full rounded-full transition-all duration-1000 ${hasWater ? 'bg-green-500' : 'bg-red-500'
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