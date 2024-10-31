import { useState } from "react";

export default function useControlSensor() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<Error | null>(null)

    async function controlSensor(topic: string, state: "on" | "off") {
        setLoading(true);
        setError(null);
        try {
            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/sensors/control`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    topic: `control/${topic}`,
                    state: state,
                }),
            });
        } catch (err) {
            setError(err as Error);
        } finally {
            setLoading(false);
        }
    }

    async function waterPumpMode(mode: 'auto' | 'manual') {
        setLoading(true);
        setError(null);
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
            setError(error as Error);
        } finally {
            setLoading(false)
        }
    }

    return { controlSensor, waterPumpMode, loading, error };
}