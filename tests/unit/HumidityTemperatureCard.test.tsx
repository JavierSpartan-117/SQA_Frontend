import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import HumidityTemperatureCard from '../../src/components/HumidityTemperatureCard';
import useControlSensor from '../../src/hooks/useControlSensor';

// Mock del hook personalizado
jest.mock('../../src/hooks/useControlSensor');

describe('HumidityTemperatureCard', () => {
    const mockControlSensor = jest.fn();

    beforeEach(() => {
        // Configura el mock para cada prueba
        (useControlSensor as jest.Mock).mockReturnValue({
            controlSensor: mockControlSensor,
            loading: false,
            error: null,
        });
        mockControlSensor.mockClear(); // Limpia las llamadas previas al mock
    });

    it('debe mostrar los valores de humedad y temperatura cuando el sensor está conectado', () => {
        render(<HumidityTemperatureCard humidity={60} temperature={25} />);

        // Verifica el valor de humedad y su unidad
        const humidityValue = screen.getByText(/60%/i);
        expect(humidityValue).toBeInTheDocument();
        expect(screen.getByText(/Humedad relativa/i)).toBeInTheDocument();

        // Verifica el valor de temperatura y su unidad
        const temperatureValue = screen.getByText(/25°C/i);
        expect(temperatureValue).toBeInTheDocument();
        expect(screen.getByText(/Celsius/i)).toBeInTheDocument();
    });

    it('debe activar el sensor cuando se presiona el botón de encender', () => {
        render(<HumidityTemperatureCard humidity="apagado" temperature="apagado" />);

        const powerOnButton = screen.getByRole('button', { name: /Encender DHT11/i });
        fireEvent.click(powerOnButton);

        // Verifica que controlSensor fue llamado con los argumentos correctos
        expect(mockControlSensor).toHaveBeenCalledWith('humidity-temperature', 'on');
    });

    it('debe desactivar el sensor cuando se presiona el botón de apagar', () => {
        render(<HumidityTemperatureCard humidity={60} temperature={25} />);

        const powerOffButton = screen.getByRole('button', { name: /Apagar DHT11/i });
        fireEvent.click(powerOffButton);

        // Verifica que controlSensor fue llamado con los argumentos correctos
        expect(mockControlSensor).toHaveBeenCalledWith('humidity-temperature', 'off');
    });

    it('debe deshabilitar los botones cuando loading es true', () => {
        // Mock para simular el estado de carga
        (useControlSensor as jest.Mock).mockReturnValue({
            controlSensor: mockControlSensor,
            loading: true,
            error: null,
        });

        render(<HumidityTemperatureCard humidity="apagado" temperature="apagado" />);

        const powerOnButton = screen.getByRole('button', { name: /Encender DHT11/i });
        const powerOffButton = screen.getByRole('button', { name: /Apagar DHT11/i });

        // Verifica que ambos botones están deshabilitados
        expect(powerOnButton).toBeDisabled();
        expect(powerOffButton).toBeDisabled();
    });

    it('debe mostrar un mensaje de error si ocurre un error', () => {
        // Mock para simular un error
        (useControlSensor as jest.Mock).mockReturnValue({
            controlSensor: mockControlSensor,
            loading: false,
            error: { message: 'Error al cambiar el estado del sensor' },
        });

        render(<HumidityTemperatureCard humidity="apagado" temperature="apagado" />);

        // Verifica que el mensaje de error esté en el documento
        const errorMessage = screen.getByText(/Error: Error al cambiar el estado del sensor/i);
        expect(errorMessage).toBeInTheDocument();
    });
});
